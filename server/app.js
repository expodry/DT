const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  '/',
  express.static('./dist', {
    index: 'index.html',
  }),
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
