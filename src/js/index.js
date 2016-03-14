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
  // Populate readme URL w/ auth_token
  res.render('docs', {
    readmeURL: '/sup'
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
