const mongoose = require("mongoose");
const dotenv = require("dotenv");
const {random_animal_name} = require("../utils/random_name_generator");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: random_animal_name
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
