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
   * Call this method to run this command.
   */
  run() {
    const port = 3000;
    console.log(`Server starting on http://localhost:${port}`);
    http.createServer((request, response) => {
      response.writeHead(200, { 'Content-Type': 'text/plain' });
      response.end('OK');
    }).listen(port);
  }
}
