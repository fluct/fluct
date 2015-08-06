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

  createActionDirectory() {
    mkdirp.sync(this.getActionPath());
  }

  createIndexJs() {
    const indexJsPath = `${this.getActionPath()}/index.js`;
    fs.createReadStream(this.getIndexJsTemplatePath()).pipe(fs.createWriteStream(indexJsPath));
    this.logEntryCreatedEvent(indexJsPath);
  }

  createPackageJson() {
    const packageJsonPath = `${this.getActionPath()}/package.json`;
    fs.createReadStream(this.getPackageJsonTemplatePath()).pipe(fs.createWriteStream(packageJsonPath));
    this.logEntryCreatedEvent(packageJsonPath);
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
