const express = require("express")
const router = express.Router()
const { authorization } = require("../routes/auth_routes");
const { init_conversation } = require("../controllers/conversation_controller");
const { index_page_controller, get_req_user, render_chat_page, handle_reply, add_conversation } = require("../controllers/conversation_controller");

///////////////////////
// testing route for getting req. user
// remove in production

router.get("/test/req_user",
    authorization,
    get_req_user
);

router.get("/", 
    authorization, 
    index_page_controller
);

router.get("/chat/:chat_name", 
    authorization, 
    init_conversation, 
    render_chat_page
);

router.post("/chat/:chat_name", 
    authorization, 
    init_conversation, 
    handle_reply
);

router.post("/add_conversation", 
    add_conversation
);

module.exports = router