const Conversation = require("../model/conversation");
const { Configuration, OpenAIApi } = require("openai");
const { generate_chat_template } = require("../utils/chat_template_generator");

////////////////testing controller for req.user
//// remove in production
exports.get_req_user = (req, res) => {
    res.send(req.user);
};
//////////////////////////

exports.index_page_controller = async (req, res) => {
    Conversation.find({}, (err, conversations) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error" });
        } else {
            res.render("index", { conversations });
        }
    });
}

exports.render_chat_page = (req, res) => {
    const message = req.user.conversation[req.conversation_index].message;
    const chat_name = req.user.conversation[req.conversation_index].chat_name;
    const name = req.user.conversation[req.conversation_index].name;
    res.render("chat", { message, name, chat_name });
}

exports.handle_reply = async (req, res) => {
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
}

exports.add_conversation = (req, res) => {
    const { chat_name, name, message } = req.body;

    const conversation = new Conversation({ chat_name, name, message });

    conversation.save((err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
}


// Middlewares
exports.init_conversation = async (req, res, next) => {
    // This middleware checks if the chat is already present
    // If not, it creates a new chat from the template
    // If yes, it attaches conversation_index to the request

    const { chat_name } = req.params;
    const { conversation } = req.user;

    let conversation_found = false;

    conversation.forEach(async (element, id) => {
        if (element.chat_name != undefined && element.chat_name == chat_name) {
            // conversation has been found
            conversation_found = true;
            req.conversation_index = id;
            next();
        }
    });

    if (conversation_found == false) {
        // conversation has not been found then search for template conversation
        try {
            const conversation_template = await Conversation.findOne({ chat_name: chat_name });
            if (conversation_template != null) {
                // conversation template has been found
                conversation.push(conversation_template);
                req.conversation_index = conversation.length - 1;
                await req.user.save();
                next();
            } else {
                // conversation template has not been found
                // to do: create a new conversation default template

                const generated_template = await generate_chat_template(chat_name);

                const new_conversation = {
                    chat_name : chat_name,
                    name: chat_name,
                    message: generated_template
                }

                conversation.push(new_conversation);
                req.conversation_index = conversation.length - 1;
                await req.user.save();
                next();

                // res.json({ message: "conversation template has not been found" });
            }
        } catch (error) {
            // error in fetching conversation template
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}