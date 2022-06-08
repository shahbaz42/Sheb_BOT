const jwt = require("jsonwebtoken");
const User = require("../model/user");

exports.authorization = (req, res, next) => {
    const token = req.cookies.token;
    // if token is not found than create a new user in the database and send token
    if (!token) {
        const user = new User();
        user.save((err, user) => {
            if (err) {
                // if can't create user then return error
                res.status(500).json({ message: "Internal server error." });
            } else {
                // if user is created then send token
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
                res.cookie("token", token, {
                    maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
                    httpOnly: true
                });
                req.user = { id: user._id };
                next();
            }
        });
    } else {
        // if token is found then verify the token and send user data
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                // if token is not verified then return error
                res.clearCookie("token").redirect("/");
            } else {
                // if token is verified then check if user exists in the database
                User.findById(decoded.id, (err, user) => {
                    if (user === null || err) {
                        // if user is not found in DB then clear cookie and redirect to home page
                        res.clearCookie("token").redirect("/");
                    } else {
                        // if user is found then bind user data to req.user and send user data
                        req.user = decoded;
                        next();
                    }
                });
            }
        });
    }
}



