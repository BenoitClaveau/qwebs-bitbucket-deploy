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
      this.$qwebs = $qwebs;
      this.$config = $config;
  };
  
  webhook(request, response) {
    if (request.headers['x-event-key'] !== "repo:push")
      return response.send({ request: request, content: { message: "not a push event." }});

    //list all commit messages
    let messages = request.body.push.changes.map(change => {
      return change.commits.map(commit => {
        return commit.message;
      });
    });


    let comments = [].concat.apply([], messages);
    let deploy = this.startDeployement(comments);

    if (!deploy)
      return response.send({ request: request, content: { message: "deployement not needed." } });

    return response.send({ request: request, content: { message: "deployement." }}).then(() => {
      if(this.pull()) {
        this.restart();
      }
    });
  };

  //need to be overriden
  startDeployement(comments) {
    // exemple
    // return messages.reduce((previous, current) => {
    //   return previous || /prod version \d+.\d+.\d+/g.test(current);
    // }, false);
    return true;
  }

  pull() {
    var lines = execSync("git pull").toString('utf8').split("\n");
    lines.pop();
    let line = lines.pop();
    if (line === "Already up-to-date.") return false;

    return true;
  }

  //need to be overriden
  restart() {
  }
};



exports = module.exports = BitbucketService;


