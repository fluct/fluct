import Application from './application'
import BaseCommand from './base_command'
import open from 'open'

/**
 * @class
 */
export default class OpenCommand extends BaseCommand {
  run() {
    const application = new Application();
    open(`https://${application.getRestapiId()}.execute-api.${application.getRegion()}.amazonaws.com/production/`);
  }
}
