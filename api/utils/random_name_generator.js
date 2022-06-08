const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

exports.random_animal_name = () => {
    return uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
        length: 3,
        separator: '_'
    });
}

