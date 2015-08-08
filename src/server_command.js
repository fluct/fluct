import Application from './application'
import BaseCommand from './base_command'

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
    new Application().listen(port, () => {
      console.log(`Server starting on http://127.0.0.1:${port}`);
    });
  }
}
