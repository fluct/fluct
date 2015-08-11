import BaseCommand from './base_command'

/**
 * @class
 */
export default class GenerateCommand extends BaseCommand {
  /**
   * @param {String} generator Only "action" is supported
   * @param {String} name
   */
  constructor({ generator, name }) {
    super();
    this.generator = generator;
    this.name = name;
  }

  createActionDirectory() {
    this.createDirectory(this.getActionPath());
  }

  createDestDirectory() {
    this.createDirectory(`${this.getActionPath()}/dist`);
  }

  createIndexJs() {
    this.copyFile(
      `${__dirname}/../templates/index.js`,
      `${this.getActionPath()}/dist/index.js`
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
    this.createDestDirectory();
    this.createIndexJs();
    this.createPackageJson();
  }
}
