/**
 * @class
 */
export default class GenerateCommand {
  /**
   * @param {Command} command A command object of commander.js
   */
  constructor({ command }) {
    this.command = command;
  }

  /**
   * Call this method to run this command.
   */
  run() {
    console.log(this.command);
  }
}
