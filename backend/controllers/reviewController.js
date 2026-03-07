import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import Provider from "../models/Provider.js";

// @route   POST /api/reviews/:bookingId
// @access  Private (Customer only)
export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { bookingId } = req.params;

    // 1. Check required fields
    if (!rating) {
      return res.status(400).json({ message: "Rating is required" });
    }

    // 2. Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 3. Only customer of this booking can review
    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 4. Booking must be completed
    if (booking.status !== "completed") {
      return res.status(400).json({
        message: "You can only review completed bookings",
      });
    }

    // 5. Check if already reviewed
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this booking",
      });
    }

    // 6. Create review
    const review = await Review.create({
      booking: bookingId,
      customer: req.user._id,
      provider: booking.provider,
      rating,
      comment,
    });

    // 7. Update provider's average rating
    const allReviews = await Review.find({
      provider: booking.provider,
      isVisible: true,
    });

    // Calculate new average
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / allReviews.length;

    await Provider.findByIdAndUpdate(booking.provider, {
      rating: avgRating.toFixed(1),
      totalReviews: allReviews.length,
    });

    res.status(201).json({
      message: "Review submitted successfully ✅",
      review,
    });

  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   GET /api/reviews/provider/:providerId
// @access  Public
export const getProviderReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      provider: req.params.providerId,
      isVisible: true,
    })
      .populate("customer", "name city")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: reviews.length,
      reviews,
    });

  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   GET /api/reviews
// @access  Private (Admin only)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("customer", "name email")
      .populate({
        path: "provider",
        populate: { path: "user", select: "name email" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: reviews.length,
      reviews,
    });

  } catch (error) {
    console.error("Get all reviews error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   PUT /api/reviews/:id/toggle
// @access  Private (Admin only)
export const toggleReviewVisibility = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Flip visibility
    review.isVisible = !review.isVisible;
    await review.save();

    // ← Recalculate provider rating after toggle
    const visibleReviews = await Review.find({
      provider: review.provider,
      isVisible: true, // only visible reviews count!
    });

    // If no visible reviews — reset to 0
    if (visibleReviews.length === 0) {
      await Provider.findByIdAndUpdate(review.provider, {
        rating: 0,
        totalReviews: 0,
      });
    } else {
      // Recalculate average
      const totalRating = visibleReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = totalRating / visibleReviews.length;

      await Provider.findByIdAndUpdate(review.provider, {
        rating: avgRating.toFixed(1),
        totalReviews: visibleReviews.length,
      });
    }

    res.status(200).json({
      message: `Review ${review.isVisible ? "visible ✅" : "hidden ❌"}`,
      review,
    });

  } catch (error) {
    console.error("Toggle review error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// createReview
//    ├── Booking must be completed ✅
//    ├── Only that customer can review ✅
//    ├── One review per booking only ✅
//    └── Auto updates provider rating ✅
//          (recalculates average after every review)

// getProviderReviews
//    └── Only shows visible reviews (isVisible: true)

// getAllReviews
//    └── Admin sees all reviews including hidden

// toggleReviewVisibility
//    └── Admin can hide/show any review