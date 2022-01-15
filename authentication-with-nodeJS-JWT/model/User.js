const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2
    },
    surname: {
        type: String,
        required: true,
        max: 255,
        min: 2
    },
    userName: {
        type: String,
        required: true,
        max: 255,
        min: 2
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    }
})

module.exports = mongoose.model('User',userSchema)
//Imagine that Node.js module exports are shipping containers, 
//with module.exports and exports as port personnel whom we would tell which "ship" (that is, values) that we want to get to a "foreign port" (another module in the project).

/*Reference*/
//https://www.freecodecamp.org/news/node-module-exports-explained-with-javascript-export-function-examples/
