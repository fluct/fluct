import BaseCommand from './base_command'
import http from 'http'

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
      return 3000;
    }
  }

  /**
   * Call this method to run this command.
   */
  run() {
    const port = this.getPort();
    console.log(`Server starting on http://localhost:${port}`);
    http.createServer((request, response) => {
      response.writeHead(200, { 'Content-Type': 'text/plain' });
      response.end('OK');
    }).listen(port);
  }
}
