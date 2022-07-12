const { Configuration, OpenAIApi } = require("openai");

const generate_chat_template = async(name) => {

    return new Promise( async(resolve, reject) => {
        try {
            const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
            const openai = new OpenAIApi(configuration);

            let starter = `Name: jeff_bezos <br> Starter Template: Following is a conversation with Jeff Bezos. He is an American entrepreneur, media proprietor, investor, computer engineer, and commercial astronaut. He is the founder, executive chairman and former president and CEO of Amazon. <br>`
            starter += `Name: elon_musk <br> Starter Template: Following is a conversation with Elon Musk, He is the founder, CEO, and Chief Engineer at SpaceX. He is also ceo of Tesla, boring company and Open Ai. <br>`
            starter += `Name: luke_skywalker <br> Starter Template: Following is a conversation with Luke Skywalker. He was a Tatooine farmboy who rose from humble beginnings to become one of the greatest Jedi the Star wars galaxy has ever known.<br>`
            starter += `Name: james_bond <br> Starter Template: Following is a conversation with James Bond. He is a British Secret Service agent, and the most famous and most wanted agent in the world. <br>`
            starter += `Name: ${name} <br> Starter Template: `;

            const response = await openai.createCompletion("text-davinci-002", {
                prompt: starter,
                temperature: 0.9,
                max_tokens: 150,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0.6,
                stop: ["You :", `Starter Template :`],
            });

            // console.log(response.data.choices[0].text);
            resolve(response.data.choices[0].text);

        } catch (err) {
            reject(err);
        }
    });
}

module.exports = { generate_chat_template };