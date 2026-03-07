import Provider from "../models/Provider.js";

// @route   GET /api/providers/my
// @access  Private (Provider only)
export const getMyProfile = async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user._id })
      .populate("user", "name email phone city")
      .populate("category", "name description");

    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    res.status(200).json({ provider });

  } catch (error) {
    console.error("Get my profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   PUT /api/providers/profile
// @access  Private (Provider only)
export const updateMyProfile = async (req, res) => {
  try {
    const {
      bio,
      experience,
      price,
      city,
      area,
      category,
      profileImage,
    } = req.body;

    // Find provider by user id
    const provider = await Provider.findOneAndUpdate(
      { user: req.user._id },
      {
        bio,
        experience,
        price,
        city,
        area,
        category,
        profileImage,
      },
      { new: true }
    )
      .populate("user", "name email phone city")
      .populate("category", "name description");

    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      provider,
    });

  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   PUT /api/providers/toggle
// @access  Private (Provider only)
export const toggleAvailability = async (req, res) => {
  try {
    // Find current provider
    const provider = await Provider.findOne({ user: req.user._id });

    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    // Flip availability
    provider.isAvailable = !provider.isAvailable;
    await provider.save();

    res.status(200).json({
      message: `You are now ${provider.isAvailable ? "Available ✅" : "Unavailable ❌"}`,
      isAvailable: provider.isAvailable,
    });

  } catch (error) {
    console.error("Toggle availability error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   GET /api/providers
// @access  Public
export const getAllProviders = async (req, res) => {
  try {
    // Get filters from query params
    // Example: /api/providers?city=Mumbai&category=categoryId
    const { city, area, category } = req.query;

    // Build filter object
    const filter = {
      isApproved: true,
      isAvailable: true,
    };

    if (city) {
      // case insensitive search
      filter.city = { $regex: city, $options: "i" };
    }

    if (area) {
      filter.area = { $regex: area, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    const providers = await Provider.find(filter)
      .populate("user", "name email phone")
      .populate("category", "name")
      .sort({ rating: -1 }); // highest rated first

    res.status(200).json({
      count: providers.length,
      providers,
    });

  } catch (error) {
    console.error("Get all providers error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   GET /api/providers/:id
// @access  Public
export const getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id)
      .populate("user", "name email phone city")
      .populate("category", "name description");

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // Only show approved providers to public
    if (!provider.isApproved) {
      return res.status(403).json({ message: "Provider not approved yet" });
    }

    res.status(200).json({ provider });

  } catch (error) {
    console.error("Get provider error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/providers/admin/all
// @access Private (Admin only)
export const getAllProvidersAdmin = async (req, res) => {
  try {
    const providers = await Provider.find()
      .populate("user", "name email phone")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: providers.length,
      providers,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   PUT /api/providers/:id/approve
// @access  Private (Admin only)
export const approveProvider = async (req, res) => {
  try {
    const provider = await Provider.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).populate("user", "name email");

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.status(200).json({
      message: "Provider approved successfully ✅",
      provider,
    });

  } catch (error) {
    console.error("Approve provider error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// **One important thing — `.populate()` explained:**
// ```
// Normal MongoDB result:
// {
//   user: "69a952..."  ← just an ID, not useful
//   category: "69a95d..." ← just an ID
// }

// After .populate():
// {
//   user: {
//     name: "Ramesh Kumar",  ← actual data! ✅
//     email: "ramesh@gmail.com"
//   },
//   category: {
//     name: "Plumbing"  ← actual data! ✅
//   }
// }