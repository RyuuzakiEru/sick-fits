// let's go!
const cookieparser = require('cookie-parser');
require('dotenv').config({
    path: 'variables.env',
});


const createServer = require('./createServer');
const db = require('./db')

const server = createServer();

//TODO user express middleware to handle cookies (JWT)
server.express.use(cookieparser());
//TODO Use express middleware to populate current user


server.start({
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL,
    },

}, deets => {
    console.log(`Server running on http://localhost:${deets.port}`)
});
