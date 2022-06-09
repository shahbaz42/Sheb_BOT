const express = require("express")
const router = express.Router()
const { Configuration, OpenAIApi } = require("openai");
const { authorization } = require("../routes/auth_routes");
const Conversation = require("../model/conversation");
const {init_conversation} = require("../controllers/conversation_controller");

let message = "Following is a conversation with Elon Musk, He is the founder, CEO, and Chief Engineer at SpaceX. He is also ceo of Tesla, boring company and Open Ai. <br><br>You: Hey Elon Musk! <br>Elon Musk : Hey Whatsup ?<br>";

router.get("/", authorization, (req, res) => {
    res.render("index");
})

router.get("/:chat_name", authorization, init_conversation, (req, res) => {
    const message = req.user.conversation[req.conversation_index].message;
    const name = req.user.conversation[req.conversation_index].name;
    res.render("chat", { message, name });
});

router.post("/", authorization, async (req, res) => {
    try {
        const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
        const openai = new OpenAIApi(configuration);

        let reply = req.body.reply;
        message += "<br>You: " + reply + "<br>Elon Musk : ";

        const response = await openai.createCompletion("text-davinci-002", {
            prompt: message,
            temperature: 0.9,
            max_tokens: 150,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
            stop: ["You :", "Elon Musk :"],
        });

        message += response.data.choices[0].text + "<br>";

        res.json({ message: message });

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