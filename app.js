const express = require('express');
const app = express();
const { NotFoundError } = require('./expressError');
const authRoute = require('./routes/auth');
const chatRoute = require('./routes/chat');
const usersRoute = require('./routes/user');
const friendsRoute = require('./routes/friends');
const statementsRoute = require('./routes/statements');
const responsesRoute = require('./routes/responses');
const cors = require("cors");
const { authenticateJWT } = require("./middleware/auth");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(authenticateJWT);

//Routes
app.use('/auth', authRoute);
app.use("/users", usersRoute);
app.use('/friends', friendsRoute);
app.use("/statements", statementsRoute);
app.use("/responses", responsesRoute);
app.use("/chat", chatRoute);



//404 Handler
app.use(function (req, res, next) {
  return next(new NotFoundError());
});


//Error Handler
app.use(function (err, req, res, next) {
    let status = err.status || 500;
    let message = err.message;

    return res.status(status).json({
        error: { message, status }
    })
});

module.exports = app;

