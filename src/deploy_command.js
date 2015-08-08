import BaseCommand from './base_command'

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
    console.log('Not implemented yet');
  }
}
