import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import { sign } from 'jsonwebtoken';
import uuid from 'node-uuid';

import { USERS } from './users';

const app = express();

app.set('port', process.env.PORT || 8080);
app.set('views', `${__dirname}/../views`);
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'session-secret',
  resave: true,
  saveUninitialized: true
}));

passport.serializeUser(
  (user, done) => {
    done(null, user.id);
  }
);

passport.deserializeUser(
  (id, done) => {
    if (id in USERS.ids) {
      done(null, USERS.ids[id]);
    } else {
      done(`No user with id ${id}`);
    }
  }
);


passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    (username, password, done) => {
      const userID = USERS.emails[username];
      if (userID !== undefined) {
        const user = USERS.ids[userID];
        if (user.password === password) {
          console.log('correct password, logged in');
          return done(null, user);
        } else {
          return done(null, false, { message: 'incorrect password'});
        }
      } else {
        return done(null, false, { message: 'incorrect username'});
      }
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.render('index', {
    user: req.user,
    message: 'world'
  })
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

app.get('/docs', isAuthenticated, (req, res) => {
  const jwtPayload = {
    email: req.user.email,
    name: req.user.name
  };
  const jwtOptions = {
    jwtid: uuid.v4()
  };

  const jwt = sign(jwtPayload, process.env.README_JWT_SECRET, jwtOptions);
  console.log(`ReadMe docs JWT: ${jwt}`);

  // Populate readme URL w/ auth_token
  res.render('docs', {
    readmeURL: `${process.env.README_PROJECT_URL}?auth_token=${jwt}`
  });
});

app.listen(
  app.get('port'),
  () => {
    console.log(`ReadMe customer server listening on port ${app.get('port')}`);
  }
);

function isAuthenticated (req, res, next) {
  if (req.user) {
    return next();
  } else {
    res.redirect('/');
  }
}
