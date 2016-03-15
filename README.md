# ReadMe JWT 3rd-Party Auth
Sample implementation of 3rd-party server authenticating ReadMe Developer Hub with JWTs

## Installation
```
$ ./build_me.sh
```

This installs npm dependencies, transpiles JS, & copies over *.jade templates to from `src/` to `/dist`.

## Prerequisites
  1. Start ReadMe's server w/ `npm start`
  1. Create a project, activate it (by making it 'Open Source'), and set the project's *JWT Secret* in the *Project Settings* tab
  1. Update this repo's `.env`:
     - With your ReadMe project's project URL, e.g.(`README_PROJECT_URL=http://test-project.readme.local:3000`)
     - With your ReadMe project's *JWT Secret*, e.g (`README_JWT_SECRET=owlcohol`)
     
## Usage
  1. Start `readme-jwt-auth`'s server with
    ```
    $ ./run_me.sh
    ```
    
    This starts the node express server on port 8080
  1. Start ReadMe project (`npm start`), 
  1. Go to http://localhost:8080
  1. Click Login button & login with credentials:
   - email: `jwt-jedi@gmail.com`
   - password: `fn2187`
  1. Click `/docs` link and click `Go to ReadMe Docs` button
  1. You are redirected to your ReadMe project's developer hub & logged in using user from this repo via JWT!

## How it works
  1. This repo implements a `passport` local auth strategy with users / passwords defined in `src/js/users.js`
  1. Once logged in, the home page renders a link to `/docs`
  1. When rendering `/docs`:
    - The server generates a JWT with a unique JWT id (jwtid) using [node-uuid](https://github.com/broofa/node-uuid), the currently logged in user's `email` and `name`, and the ReadMe project's JWT secret defined by the `README_JWT_SECRET` environment variable
    - The link to the ReadMe project is derived from the `README_PROJECT_URL` environment variable + a query param with `auth_token` set to the JWT (e.g. `http://test-project.readme.local:3000?auth_token=<jwt>`)
  1. The ReadMe server finds or creates a ReadMe `Hub2User` based on the ReadMe project & `email` specified in the JWT payload and authenticates the user
  