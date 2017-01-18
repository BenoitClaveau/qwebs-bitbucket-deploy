# qwebs-auth-jwt
Qwebs webhook service to deploy from bitbucket.
  
## Features

  * [Qwebs](https://www.npmjs.com/package/qwebs)
  
### Add the bitbucket section in config.json

```json
{
  "bitbucket": {
    "deployment": {
      "master": {
        "comment": regex to start deployement,
        "pm2": {
          "application": "myapp"
        }
      }
    }
  },
}
```

### Declare and inject $auth

```route.json
{
    "services": [
        { "name": "$bitbucket", "location": "qwebs-bitbucket-deploy" }
    ],
    "locators": [
        { "post": "/api/bitbucket", "service": "$bitbucket", "method": "webhook" }
    ]
}
```

## API

  * webhook(request, response)

## Installation

```bash
$ npm install qwebs-bitbucket-deploy
```
