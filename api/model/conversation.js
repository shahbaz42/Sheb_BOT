const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
    chat_name: {
        type: String,
    },
    name: {
        type: String,
    },
    message: {
        type: String,
    }
});

const conversation = mongoose.model("Conversation", conversationSchema);

module.exports = conversation;
