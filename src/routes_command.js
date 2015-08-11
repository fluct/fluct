import Application from './application'
import BaseCommand from './base_command'

/**
 * @class
 */
export default class RoutesCommand extends BaseCommand {
  /**
   * @return {Integer}
   */
  getMaxPathLength() {
    return Math.max.apply(null, new Application().getActions().map(action => action.getPath().length));
  }

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
        const httpMethod = (action.getHttpMethod() + '   ').substr(0, 6);
        const path = (action.getPath() + Array(this.getMaxPathLength()).join(' ')).substr(0, this.getMaxPathLength());
        const name = action.getName()
        return `${httpMethod} ${path} #${name}`;
      }).join('\n')
    );
  }
}
