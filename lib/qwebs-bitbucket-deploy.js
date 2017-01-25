/*!
 * remit
 * Copyright(c) 2017 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const DataError = require("qwebs").DataError;
const execSync = require('child_process').execSync;

class BitbucketService {
  constructor($qwebs, $config) {
      if (!$config.bitbucket) throw new DataError({ message: "Bitbucket section is not defined in qwebs config." });
      if (!$config.bitbucket.deployment) throw new DataError({ message: "Bitbucket deployment is not defined in qwebs config." });
      
      this.$qwebs = $qwebs;
      this.$config = $config;
  };
  
  webhook(request, response) {

    if (request.headers['x-event-key'] !== "repo:push")
      return response.send({ request: request, content: { message: "not a push event."} });

    console.log(request.body.push);

    var branch = request.body.push.new.branch;
    var config = this.$config.bitbucket.deployment[branch] || {};
    
    //list all commit messages
    let map = request.body.push.changes.map(change => {
      return change.commits.map(commit => {
        return commit.message;
      });
    });

    let messages = [].concat.apply([], map);
    let deploy = true;

    if (config.regex) { //try to find the pattern
      deploy = messages.reduce((previous, current) => {
        return previous || config.regex.test(current);
      }, false);
    }

    if (!deploy)
      return response.send({ request: request, content: { message: "deployement not needed."} });

    let content = {
        message: "deploy"
    };

    return response.send({ request: request, content: { message: "deployement." }}).then(() => {
      var lines = execSync("git pull").toString('utf8').split("\n");
      lines.pop();
      let line = lines.pop();
      if (line === "Already up-to-date.") return; //else restart is not needed

      this.restart();
    });
  };

  //need to be overriden
  restart() {
  }
};

exports = module.exports = BitbucketService;


