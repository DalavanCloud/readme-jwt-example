# Authenticating into ReadMe Developer Hub with JWTs

This document describes how to generate a link to your ReadMe developer hub that will automatically log a user in 
who is logged in on your site using [JWTs](https://jwt.io/)


## Steps
  1. Obtain the shared JWT secret between you and ReadMe from the project settings tab of the ReadMe admin dashboard
  1. Determine how you will generate a JWT. There are open-source libraries for most languages listed at [https://jwt.io/#libraries-io](https://jwt.io/#libraries-io)
  1. For your logged in user, generate a JWT payload with two properties, `email` & `name`
    
    Example:
    ```
    var payload = {
        email: jwt-jedi@gmail.com,
        name; JWT Jedi
    };
    ```
  1. Generate a unique JWT ID (jti). This is used by ReadMe to prevent token replay attacks
  1. Create a JWT with user payload, JTI, and [aud](https://self-issued.info/docs/draft-ietf-oauth-json-web-token.html#rfc.section.4.1.3) (audience) set to `readme.io`
  1. Render a link to your ReadMe developer hub with a query param called `auth_token` where the value is your JWT
    
    Example: `myproject.readme.io?auth_token=<my_jwt>`
     
  1. When your logged in user clicks that link, the same user will be automatically logged in to your ReadMe developer hub
   
  