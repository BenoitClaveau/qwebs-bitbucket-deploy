/*!
 * remit
 * Copyright(c) 2017 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const DataError = require("qwebs").DataError;
const process = require("process");
const execSync = require('child_process').execSync;

class BitbucketService {
  constructor($qwebs, $config) {
      this.$qwebs = $qwebs;
      this.$config = $config;
  };
  
  webhook(request, response) {

    if (request.headers['x-event-key'] !== "repo:push")
      return response.send({ request: request, content: { message: "not a push event."} });

    //list all commit messages
    let map = request.body.push.changes.map(change => {
      return change.commits.map(commit => {
        return commit.message;
      });
    });

    let messages = [].concat.apply([], map);

    //try to find the pattern prod version x.x.x
    let deploy = messages.reduce((previous, current) => {
      return previous || /prod version \d+.\d+.\d+/g.test(current);
    }, false);

    if (!deploy)
      return response.send({ request: request, content: { message: "deployement not needed."} });

    let content = {
        message: "deploy"
    };

    return response.send({ request: request, content: content }).then(() => {
      var lines = execSync("git pull").toString('utf8').split("\n");
      lines.pop();
      let line = lines.pop();
      if (line === "Already up-to-date.") return; //else restart is not needed

      
      process.exit(1); //pm2 will restart the process
    });
  };
};

exports = module.exports = BitbucketService;


