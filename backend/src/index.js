// let's go!
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");

require("dotenv").config({
  path: "variables.env"
});

const createServer = require("./createServer");
const db = require("./db");

const server = createServer();

//TODO user express middleware to handle cookies (JWT)
server.express.use(cookieparser());
//Decode JWT so we can get UserID
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // put userId to the request for frther request
    req.userId = userId;
  }
  next();
});
//mi8ddleware popuolating user on request
server.express.use(async (req, res, next) => {
  if (!req.userId) return next();

  const user = await db.query.user(
    { where: { id: req.userId } },
    "{id, permissions, email, name}"
  );

  console.log(user);
  req.user = user;
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  deets => {
    console.log(`Server running on http://localhost:${deets.port}`);
  }
);
