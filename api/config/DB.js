const mongoose = require("mongoose");

const DB_URI = process.env.DB_URI;

exports.connect = () => {
    mongoose.connect(DB_URI, { useNewUrlParser: true}, (err) => {
        if(err) {
            console.log(err);
        } else {
            console.log("Connected to MongoDB");
        }
    });
}
