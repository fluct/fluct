import BaseCommand from './base_command'

/**
 * @class
 */
export default class NewCommand extends BaseCommand {
  /**
   * @param {String} name Passed function name
   */
  constructor({ name }) {
    super();
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
      destination: `./${this.name}/fluct.json`,
      parameters: {
        applicationName: this.name
      },
      source: `${__dirname}/../templates/application-fluct.json`
    });
  }

  createReadmeFile() {
    this.createFileFromTemplate({
      destination: `./${this.name}/README.md`,
      parameters: {
        applicationName: this.name
      },
      source: `${__dirname}/../templates/README.md`
    });
  }

  run() {
    this.createApplicationDirectory();
    this.createReadmeFile();
    this.createGitIgnoreFile();
    this.createActionsDirectory();
    this.createActionsKeepFile();
    this.createPackageJsonFile();
  }
}
