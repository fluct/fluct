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

  createActionsDirectory() {
    this.createDirectory(`./${this.name}/actions`);
  }

  createActionsKeepFile() {
    this.createEmptyFile(`./${this.name}/actions/.keep`);
  }

  createGitIgnoreFile() {
    this.copyFile(
      `${__dirname}/../templates/gitignore`,
      `./${this.name}/.gitignore`
    );
  }

  createPackageJsonFile() {
    this.createFileFromTemplate({
      destination: `./${this.name}/package.json`,
      parameters: {
        applicationName: this.name
      },
      source: `${__dirname}/../templates/application-package.json`
    });
  }

  run() {
    this.createApplicationDirectory();
    this.createGitIgnoreFile();
    this.createActionsDirectory();
    this.createActionsKeepFile();
    this.createPackageJsonFile();
  }
}
