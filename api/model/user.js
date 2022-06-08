const mongoose = require("mongoose");
const dotenv = require("dotenv");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    conversation: [
        {
            name: {
                type: String,
            },
            message: {
                type: String,
            }
        }
    ]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
