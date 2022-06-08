const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    message: {
        type: String,
    }
});

const conversation = mongoose.model("Conversation", chatSchema);

module.exports = conversation;
