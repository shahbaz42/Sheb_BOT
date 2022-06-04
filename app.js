const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

let message = "You are talking to Shah_BOT 🤖. This bot replies on the behalf of Shahbaz. The bot is helpful, creative, clever, and very friendly.<br><br>You: Hello, who are you?<br>Shah_BOT 🤖 : I am Shah_BOT 🤖 , I speak on behalf of Shahbaz. How can I help you today?<br>";

app.get("/", (req, res) => {
    res.render("index", { message });
});

app.post("/", async (req, res) => {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    let reply = req.body.reply;
    message += "<br>You: " + reply + "<br>Shah_BOT 🤖 : ";

    const response = await openai.createCompletion("text-davinci-002", {
        prompt: message,
        temperature: 0.9,
        max_tokens: 150,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
        stop: [" You :", " Shah_BOT 🤖 :"],
    });

    message += response.data.choices[0].text + "<br>";
    res.render("index", { message });
});


app.listen(8000, () => {
    console.log("Server is running on port 8000");
});