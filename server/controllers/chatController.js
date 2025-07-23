const Chat = require("../models/Chat");
const User = require("../models/User");

module.exports = {
  // Start a new chat
  startChat: async (req, res) => {
    try {
      const { studentId, subject, initialMessage } = req.body;

      // Verify participants
      const student = await User.findById(studentId);
      if (!student || student.role !== "student") {
        return res.status(400).json({ error: "Invalid student participant" });
      }

      const chat = new Chat({
        participants: [req.user._id, studentId],
        initiatedBy: req.user._id,
        subject,
        messages: [
          {
            sender: req.user._id,
            content: initialMessage,
          },
        ],
      });

      await chat.save();
      res.status(201).json(chat);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Send a message
  sendMessage: async (req, res) => {
    try {
      const { chatId, content, attachments } = req.body;

      const chat = await Chat.findById(chatId);
      if (!chat.participants.includes(req.user._id)) {
        return res
          .status(403)
          .json({ error: "Not a participant in this chat" });
      }

      const newMessage = {
        sender: req.user._id,
        content,
        attachments: attachments || [],
      };

      chat.messages.push(newMessage);
      chat.lastMessage = Date.now();
      await chat.save();

      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all chats for a user
  getUserChats: async (req, res) => {
    try {
      const chats = await Chat.find({
        participants: req.user._id,
        status: { $ne: "archived" },
      })
        .populate("participants", "name role profileImage")
        .sort("-lastMessage");

      res.json(chats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Mark messages as read
  markAsRead: async (req, res) => {
    try {
      const { chatId } = req.params;

      const chat = await Chat.findOneAndUpdate(
        {
          _id: chatId,
          participants: req.user._id,
          "messages.readBy": { $ne: req.user._id },
        },
        {
          $addToSet: { "messages.$[].readBy": req.user._id },
        },
        { new: true }
      );

      if (!chat) {
        return res
          .status(404)
          .json({ error: "Chat not found or already read" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update chat status
  updateChatStatus: async (req, res) => {
    try {
      const { chatId } = req.params;
      const { status } = req.body;

      const validStatuses = ["active", "resolved", "archived"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const chat = await Chat.findOneAndUpdate(
        {
          _id: chatId,
          participants: req.user._id,
          initiatedBy: req.user._id, // Only chat initiator can change status
        },
        { status },
        { new: true }
      );

      if (!chat) {
        return res
          .status(404)
          .json({ error: "Chat not found or unauthorized" });
      }

      res.json(chat);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
