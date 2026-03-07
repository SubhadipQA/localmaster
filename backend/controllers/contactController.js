import Contact from "../models/Contact.js";

// @route POST /api/contact
// @access Public
export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const contact = await Contact.create({
      name, email, phone, subject, message,
    });

    res.status(201).json({
      message: "Message sent successfully! We'll get back to you soon ✅",
      contact,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/contact
// @access Private (Admin only)
export const getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ count: messages.length, messages });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route PUT /api/contact/:id/read
// @access Private (Admin only)
export const markAsRead = async (req, res) => {
  try {
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.status(200).json({ message: "Marked as read ✅", contact: message });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};