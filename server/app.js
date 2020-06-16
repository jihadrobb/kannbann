require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const routes = require('./routes');
const errHandler = require('./middlewares/errHandler');

app.use(express.urlencoded({ extended:true }));
app.use('/', routes);
app.use(errHandler);

app.listen(PORT, () => {
    console.log(`App working on ${PORT}`);
})