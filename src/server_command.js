import Action from './action'
import BaseCommand from './base_command'
import express from 'express'
import fs from 'fs'
import http from 'http'

const DEFAULT_PORT = 3000;

/**
 * @class
 */
export default class ServerCommand extends BaseCommand {
  /**
   * @param {Command} command A command object of commander.js
   */
  constructor({ command }) {
    super();
    this.command = command;
  }

  /**
   * @return {Application}
   */
  buildApplication() {
    const application = express();
    this.getActions().forEach((action) => {
      application[action.getHttpMethod().toLowerCase()](
        action.getPath(),
        (request, response) => {
          action.run(request, response);
        }
      );
    });
    return application;
  }

  /**
   * @return {Array.<Action>}
   */
  getActions() {
    return this.getActionNames().map((actionName) => {
      return new Action({ name: actionName });
    });
  }

  /**
   * @return {Array.<String>}
   */
  getActionNames() {
    return fs.readdirSync('actions').filter((pathPart) => {
      return fs.statSync(`actions/${pathPart}`).isDirectory();
    });
  }

  /**
   * @return {Application}
   */
  getApplication() {
    if (!this.application) {
      this.application = this.buildApplication();
    }
    return this.application;
  }

  /**
   * @return {Integer}
   */
  getPort() {
    if (this.command.port) {
      return parseInt(this.command.port, 10);
    } else {
      return DEFAULT_PORT;
    }
  }

  /**
   * Call this method to run this command.
   */
  run() {
    const port = this.getPort();
    this.getApplication().listen(port, () => {
      console.log(`Server starting on http://127.0.0.1:${port}`);
    });
  }
}
