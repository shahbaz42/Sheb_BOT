const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const morgan = require("morgan");

require("dotenv").config();
require("./api/config/DB").connect();

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

let message = "Following is a conversation with Elon Musk, He is the founder, CEO, and Chief Engineer at SpaceX. He is also ceo of Tesla, boring company and Open Ai. <br><br>You: Hey Elon Musk! <br>Elon Musk : Hey Whatsup ?<br>";

app.get("/", (req, res) => {
    res.render("index", { message });
});

app.post("/", async (req, res) => {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
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
    res.render("index", { message });
});


app.listen(8000, () => {
    console.log("Server is running on port 8000");
});