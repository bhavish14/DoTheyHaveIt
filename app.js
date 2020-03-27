const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressValidator = require('express-validator');
const helmet = require('helmet');
const http = require('http');
const mapRoutes = require('express-routes-mapper');

// const path = require('path');
// const responseTime = require('response-time');
const session = require('express-session');

const routesFile = require('./routes.js');

require('dotenv').config();

// environment: development, staging, testing, production
// const environment = process.env.NODE_ENV;

// express application
const app = express();
app.use(compression());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());

const server = http.Server(app);
const mappedRoutes = mapRoutes(routesFile, './controllers/');

// allow cross origin requests
// configure to only allow requests from certain origins
app.use(cors());

// secure express app
app.use(
  helmet({
    dnsPrefetchControl: false,
    frameguard: false,
    ieNoOpen: false,
  }),
);

// parsing the request bodys
app.use(cookieParser());

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: true,
    saveUninitialized: true,
  }),
);

app.use('/api', mappedRoutes);

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running in http://localhost:${process.env.PORT}`);
});
