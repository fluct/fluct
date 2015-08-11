import BaseCommand from './base_command'

/**
 * @class
 */
export default class GenerateCommand extends BaseCommand {
  /**
   * @param {String} name
   */
  constructor({ name }) {
    super();
    this.name = name;
  }

  createActionDirectory() {
    this.createDirectory(this.getActionPath());
  }

  createIndexJs() {
    this.copyFile(
      `${__dirname}/../templates/index.js`,
      `${this.getActionPath()}/index.js`
    );
  }

  createPackageJson() {
    this.createFileFromTemplate({
      destination: `${this.getActionPath()}/package.json`,
      parameters: {
        actionName: this.name
      },
      source: `${__dirname}/../templates/action-package.json`
    });
  }

  /**
   * @return {String}
   */
  getActionPath() {
    return `./actions/${this.name}`;
  }

  run() {
    this.createActionDirectory();
    this.createIndexJs();
    this.createPackageJson();
  }
}
