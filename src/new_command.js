import fs from 'fs'
import mkdirp from 'mkdirp'

/**
 * @class
 */
export default class NewCommand {
  /**
   * @param {String} name Passed function name
   * @param {Command} command A command object of commander.js
   */
  constructor({ command, name }) {
    this.command = command;
    this.name = name;
  }

  /**
   * @param {String} source
   * @param {String} destination
   */
  copyFile(source, destination) {
    fs.createReadStream(source).pipe(fs.createWriteStream(destination));
    this.logEntryCreatedEvent(destination);
  }

  createApplicationDirectory() {
    this.createDirectory(`./${this.name}`);
  }

  createFunctionsDirectory() {
    this.createDirectory(`./${this.name}/functions`);
  }

  /**
   * @param {String} path
   */
  createDirectory(path) {
    mkdirp.sync(path);
    this.logEntryCreatedEvent(path);
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
   * @param {String} path
   */
  logEntryCreatedEvent(path) {
    console.log(`  Created ${path}`);
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
