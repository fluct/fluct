import Application from './application'
import BaseCommand from './base_command'

const DEFAULT_PORT = 3000;

/**
 * @class
 */
export default class ServerCommand extends BaseCommand {
  /**
   * @param {String} port
   */
  constructor({ port }) {
    super();
    this.port = port;
  }

  /**
   * @return {Integer}
   */
  getPort() {
    if (this.port) {
      return parseInt(this.port, 10);
    } else {
      return DEFAULT_PORT;
    }
  }

  run() {
    const port = this.getPort();
    new Application().listen(port, () => {
      console.log(`Server starting on http://127.0.0.1:${port}`);
    });
  }
}
