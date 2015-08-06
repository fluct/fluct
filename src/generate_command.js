import fs from 'fs'
import mkdirp from 'mkdirp'

/**
 * @class
 */
export default class GenerateCommand {
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

  createActionDirectory() {
    this.createDirectory(this.getActionPath());
  }

  /**
   * @param {String} path
   */
  createDirectory(path) {
    mkdirp.sync(path);
    this.logEntryCreatedEvent(path);
  }

  createIndexJs() {
    this.copyFile(this.getIndexJsTemplatePath(), `${this.getActionPath()}/index.js`);
  }

  createPackageJson() {
    this.copyFile(this.getPackageJsonTemplatePath(), `${this.getActionPath()}/package.json`);
  }

  /**
   * @return {String}
   */
  getActionPath() {
    return `./functions/${this.name}`;
  }

  /**
   * @return {String}
   */
  getIndexJsTemplatePath() {
    return `${__dirname}/../templates/index.js`;
  }

  /**
   * @return {String}
   */
  getPackageJsonTemplatePath() {
    return `${__dirname}/../templates/package.json`;
  }

  /**
   * @return {String, undefined}
   */
  getName() {
    return this.command;
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
    this.createActionDirectory();
    this.createIndexJs();
    this.createPackageJson();
  }
}
