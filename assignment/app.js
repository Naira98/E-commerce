const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const formRouter = require('./routes/form');
const userRouter = require('./routes/users');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(userRouter.routes);
app.use(formRouter.routes);

app.listen(3000);