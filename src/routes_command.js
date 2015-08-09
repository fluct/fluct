import Application from './application'
import BaseCommand from './base_command'

/**
 * @class
 */
export default class RoutesCommand extends BaseCommand {
  run() {
    console.log(
      new Application().getActions().sort((a, b) => {
        if (a.getPath() < b.getPath()) {
          return -1;
        } else if (a.getPath() > b.getPath()) {
          return 1;
        } else if (a.getHttpMethod() < b.getHttpMethod()) {
          return -1;
        } else if (a.getHttpMethod() > b.getHttpMethod()) {
          return 1;
        } else if (a.getName() < b.getName()) {
          return 1;
        } else if (a.getName() > b.getName()) {
          return -1;
        } else {
          return 0;
        }
      }).map((action) => {
        return `${(action.getHttpMethod() + '   ').substr(0, 6)} ${action.getPath()} (${action.getName()})`;
      }).join('\n')
    );
  }
}
