require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const routes = require('./routes');
const errHandler = require('./middlewares/errHandler');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use('/', routes);
app.use(errHandler);

app.listen(PORT, () => {
    console.log(`App working on ${PORT}`);
})