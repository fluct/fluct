import AWS from 'aws-sdk'
import Application from './application'
import BaseCommand from './base_command'
import Composer from './composer'
import { Client } from 'amazon-api-gateway-client'

/**
 * @class
 */
export default class DeployCommand extends BaseCommand {
  /**
   * @param {Command} command A command object of commander.js
   */
  constructor({ command }) {
    super();
    this.command = command;
  }

  /**
   * Call this method to run this command.
   */
  run() {
    const LoggerMiddleware = (application) => {
      this.application = application;
    };
    LoggerMiddleware.prototype.call = (environment) => {
      console.log((environment.method + '     ').substr(0, 7) + environment.url);
      return this.application.call(environment);
    };
    new Composer({
      accessKeyId: AWS.config.credentials.accessKeyId,
      application: new Application(),
      region: 'us-east-1',
      secretAccessKey: AWS.config.credentials.secretAccessKey
    }).use(LoggerMiddleware).deploy().catch((error) => {
      console.log(error.stack);
    });
  }
}
