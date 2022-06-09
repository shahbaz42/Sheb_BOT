const Conversation = require("../model/conversation");

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
                res.json({ message: "conversation template has not been found" });
            }
        } catch (error) {
            // error in fetching conversation template
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}