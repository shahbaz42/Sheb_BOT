const express = require("express")
const router = express.Router()
const { Configuration, OpenAIApi } = require("openai");
const { authorization } = require("../routes/auth_routes");
const Conversation = require("../model/conversation");
const {init_conversation} = require("../controllers/conversation_controller");

router.get("/", authorization, (req, res) => {
    Conversation.find({}, (err, conversations) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error" });
        } else {
            res.render("index", { conversations });
        }
    });
})

router.get("/chat/:chat_name", authorization, init_conversation, (req, res) => {
    const message = req.user.conversation[req.conversation_index].message;
    const chat_name = req.user.conversation[req.conversation_index].chat_name;
    const name = req.user.conversation[req.conversation_index].name;
    res.render("chat", { message, name, chat_name });
});

router.post("/chat/:chat_name", authorization, init_conversation, async (req, res) => {
    try {
        const name = req.user.conversation[req.conversation_index].name;
        const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
        const openai = new OpenAIApi(configuration);

        let reply = req.body.reply;
        req.user.conversation[req.conversation_index].message += "<br>You: " + reply + `<br>${name} : `;

        const response = await openai.createCompletion("text-davinci-002", {
            prompt: req.user.conversation[req.conversation_index].message,
            temperature: 0.9,
            max_tokens: 150,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
            stop: ["You :", `${name} :`],
        });

        req.user.conversation[req.conversation_index].message += response.data.choices[0].text + "<br>";
        await req.user.save();
        res.json({ message: req.user.conversation[req.conversation_index].message });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error." });
    }
});


router.post("/add_conversation", (req, res) => {
    const { chat_name, name, message } = req.body;

    const conversation = new Conversation({ chat_name, name, message });

    conversation.save((err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

module.exports = router