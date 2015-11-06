import Application from './application'
import BaseCommand from './base_command'
import open from 'open'

/**
 * @class
 */
export default class OpenCommand extends BaseCommand {
  run() {
    const application = new Application();
    const url = `https://${application.getRestApiId()}.execute-api.${application.getRegion()}.amazonaws.com/production/`;
    console.log(url);
    open(url);
  }
}
