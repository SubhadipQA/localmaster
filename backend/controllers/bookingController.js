import Booking from "../models/Booking.js";
import Provider from "../models/Provider.js";

// @route   POST /api/bookings
// @access  Private (Customer only)
export const createBooking = async (req, res) => {
  try {
    const { providerId, address, scheduledDate, notes } = req.body;

    // 1. Check required fields
    if (!providerId || !address || !scheduledDate) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // 2. Find provider
    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // 3. Check provider is approved and available
    if (!provider.isApproved) {
      return res.status(400).json({ message: "Provider is not approved yet" });
    }
    if (!provider.isAvailable) {
      return res.status(400).json({ message: "Provider is not available" });
    }

    // 4. Create booking with provider's current price
    const booking = await Booking.create({
      customer: req.user._id,
      provider: providerId,
      category: provider.category,
      address,
      scheduledDate,
      notes,
      price: provider.price,
      status: "requested",
    });

    // 5. Populate and return
    const populatedBooking = await Booking.findById(booking._id)
      .populate("customer", "name email phone")
      .populate("category", "name")
      .populate({
        path: "provider",
        populate: { path: "user", select: "name email phone" },
      });

    res.status(201).json({
      message: "Booking created successfully",
      booking: populatedBooking,
    });

  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   GET /api/bookings/my
// @access  Private (Customer only)
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate("category", "name")
      .populate({
        path: "provider",
        populate: { path: "user", select: "name email phone" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: bookings.length,
      bookings,
    });

  } catch (error) {
    console.error("Get my bookings error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// @route   GET /api/bookings/provider
// @access  Private (Provider only)
export const getProviderBookings = async (req, res) => {
  try {
    // First find provider profile
    const provider = await Provider.findOne({ user: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    const bookings = await Booking.find({ provider: provider._id })
      .populate("customer", "name email phone city")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: bookings.length,
      bookings,
    });

  } catch (error) {
    console.error("Get provider bookings error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   GET /api/bookings/:id
// @access  Private (Customer or Provider)
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("customer", "name email phone city")
      .populate("category", "name")
      .populate({
        path: "provider",
        populate: { path: "user", select: "name email phone" },
      });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only customer or provider of this booking can see it
    const provider = await Provider.findOne({ user: req.user._id });
    const isCustomer = booking.customer._id.toString() === req.user._id.toString();
    const isProvider = provider && booking.provider._id.toString() === provider._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isCustomer && !isProvider && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to view this booking" });
    }

    res.status(200).json({ booking });

  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// @route   PUT /api/bookings/:id/accept
// @access  Private (Provider only)
export const acceptBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check booking is in requested state
    if (booking.status !== "requested") {
      return res.status(400).json({ message: "Booking cannot be accepted at this stage" });
    }

    // Check this provider owns this booking
    const provider = await Provider.findOne({ user: req.user._id });
    if (booking.provider.toString() !== provider._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = "confirmed";
    await booking.save();

    res.status(200).json({
      message: "Booking accepted ✅",
      booking,
    });

  } catch (error) {
    console.error("Accept booking error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   PUT /api/bookings/:id/reject
// @access  Private (Provider only)
export const rejectBooking = async (req, res) => {
  try {
    const { rejectedReason } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check booking is in requested state
    if (booking.status !== "requested") {
      return res.status(400).json({ message: "Booking cannot be rejected at this stage" });
    }

    // Check this provider owns this booking
    const provider = await Provider.findOne({ user: req.user._id });
    if (booking.provider.toString() !== provider._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = "rejected";
    booking.rejectedReason = rejectedReason || "Provider unavailable";
    await booking.save();

    res.status(200).json({
      message: "Booking rejected ❌",
      booking,
    });

  } catch (error) {
    console.error("Reject booking error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   PUT /api/bookings/:id/status
// @access  Private (Provider only)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status, workNotes } = req.body;

    // Only these status transitions allowed for provider
    const allowedStatuses = ["in-progress", "completed"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check this provider owns this booking
    const provider = await Provider.findOne({ user: req.user._id });
    if (booking.provider.toString() !== provider._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Status flow validation
    if (status === "in-progress" && booking.status !== "confirmed") {
      return res.status(400).json({ message: "Booking must be confirmed first" });
    }
    if (status === "completed" && booking.status !== "in-progress") {
      return res.status(400).json({ message: "Booking must be in-progress first" });
    }

    booking.status = status;
    if (workNotes) booking.workNotes = workNotes;
    await booking.save();

    res.status(200).json({
      message: `Booking status updated to ${status} ✅`,
      booking,
    });

  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   PUT /api/bookings/:id/cancel
// @access  Private (Customer only)
export const cancelBooking = async (req, res) => {
  try {
    const { cancelReason } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only customer can cancel
    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Can only cancel at requested stage
    if (booking.status !== "requested") {
      return res.status(400).json({
        message: "Booking can only be cancelled at requested stage",
      });
    }

    booking.status = "cancelled";
    booking.cancelReason = cancelReason || "Cancelled by customer";
    await booking.save();

    res.status(200).json({
      message: "Booking cancelled ✅",
      booking,
    });

  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// **Status flow protection — very important:**
// ```
// createBooking    → status: "requested"
// acceptBooking    → requested → confirmed
// rejectBooking    → requested → rejected
// updateStatus     → confirmed → in-progress → completed
// cancelBooking    → requested → cancelled (customer only)
// ```

// **You cannot skip steps:**
// ```
// ❌ requested → completed (not allowed)
// ❌ confirmed → cancelled (not allowed)
// ✅ confirmed → in-progress → completed (correct flow)