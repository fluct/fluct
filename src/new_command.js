import BaseCommand from './base_command'

/**
 * @class
 */
export default class NewCommand extends BaseCommand {
  /**
   * @param {String} name Passed function name
   * @param {Command} command A command object of commander.js
   */
  constructor({ command, name }) {
    super();
    this.command = command;
    this.name = name;
  }

  createApplicationDirectory() {
    this.createDirectory(`./${this.name}`);
  }

  createFunctionsDirectory() {
    this.createDirectory(`./${this.name}/functions`);
  }

  createPackageJson() {
    this.copyFile(
      this.getPackageJsonTemplatePath(),
      `./${this.name}/package.json`
    );
  }

  /**
   * @return {String}
   */
  getPackageJsonTemplatePath() {
    return `${__dirname}/../templates/package.json`;
  }

  /**
   * Call this method to run this command.
   */
  run() {
    this.createApplicationDirectory();
    this.createFunctionsDirectory();
    this.createPackageJson();
  }
}
