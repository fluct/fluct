import Application from './application'
import BaseCommand from './base_command'

const DEFAULT_PORT = 3000;

/**
 * @class
 */
export default class ServerCommand extends BaseCommand {
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

  run() {
    const port = this.getPort();
    new Application().listen(port, () => {
      console.log(`Server starting on http://127.0.0.1:${port}`);
    });
  }
}
