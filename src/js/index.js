import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import passport from 'passport';
import LocalStrategy from 'passport-local';

import { USERS } from './users';

const app = express();

app.set('port', process.env.EXPRESS_PORT || 3000);
app.set('views', `${__dirname}/../views`);
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'session-secret',
  resave: true,
  saveUninitialized: true
}));

app.get('/', (req, res) => {
  console.log(USERS.ids['1'].email);
  res.render('index', {
    message: 'world'
  })
});

app.listen(
  app.get('port'),
  () => {
    console.log(`ReadMe customer server listening on port ${app.get('port')}`);
  }
);
