import ejs from 'ejs'
import fs from 'fs'
import mkdirp from 'mkdirp'

/**
 * @class
 */
export default class BaseCommand {
  /**
   * @param {String} source
   * @param {String} destination
   */
  copyFile(source, destination) {
    fs.createReadStream(source).pipe(fs.createWriteStream(destination));
    this.logEntryCreatedEvent(destination);
  }

  /**
   * @param {String} path
   */
  createDirectory(path) {
    mkdirp.sync(path);
    this.logEntryCreatedEvent(path);
  }

  /**
   * @param {String} path
   */
  createEmptyFile(path) {
    fs.closeSync(fs.openSync(path, 'w'));
    this.logEntryCreatedEvent(path);
  }

  /**
   * @param {String} data
   * @param {String} path
   */
  createFile(path, data) {
    fs.writeFileSync(path, data);
    this.logEntryCreatedEvent(path);
  }

  /**
   * @param {String} destination
   * @param {Object=} parameters
   * @param {String} source
   */
  createFileFromTemplate({ destination, parameters, source }) {
    this.createFile(
      destination,
      ejs.render(
        fs.readFileSync(
          source,
          {
            encoding: 'utf8'
          }
        ),
        parameters || {}
      )
    );
  }

  /**
   * @param {String} path
   */
  logEntryCreatedEvent(path) {
    console.log(`Created ${path}`);
  }
}
