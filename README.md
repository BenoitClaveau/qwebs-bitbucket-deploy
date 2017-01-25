# qwebs-auth-jwt
Qwebs webhook service to deploy from bitbucket.
  
## Features

  * [Qwebs](https://www.npmjs.com/package/qwebs)

### Override default behaviour

```services/bitbucket.js
const BitbucketService = require("qwebs-bitbucket-deploy");
const process = require("process");

class MyBitbucketService extends BitbucketService {
  constructor($qwebs, $config) {
    super($qwebs, $config);
  };

  restart() {
      process.exit(1);
  }
};

exports = module.exports = MyBitbucketService;
```

### Declare and inject $auth

```route.json
{
    "services": [
        { "name": "$bitbucket", "location": "./services/bitbucket" }
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
