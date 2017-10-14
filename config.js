const express = require('express');
const app = express();
const morgan = require('morgan');   
const bodyParser = require('body-parser');

const port = process.env.PORT || 8080;           

app.listen(port, () => {
    console.log(`listening on ${port}`)
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});