# qwebs-auth-jwt
Qwebs webhook service to deploy from bitbucket.
  
## Features

  * [Qwebs](https://www.npmjs.com/package/qwebs)

### Override default behaviour

```services/bitbucket.js
const BitbucketService = require("qwebs-bitbucket-deploy");
const process = require("process");

class MyBitbucketService extends BitbucketService {
  constructor() {
    super();
  };

  /* return boolean */
  startDeployement(comments) {
    return comments.reduce((previous, current) => {
      //find a comment like 'prod version 1.0.3'
      return previous || /prod version \d+.\d+.\d+/g.test(current);
    }, false);
  }

  restart() {
      //just stop the process
      //if we use pm2, the process will be automatically restarted
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
  * startDeployement(Array comments) : boolean
  * restart()

## Installation

```bash
$ npm install qwebs-bitbucket-deploy
```
