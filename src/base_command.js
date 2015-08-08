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

  createEmptyFile(path) {
    fs.closeSync(fs.openSync(path, 'w'));
    this.logEntryCreatedEvent(path);
  }

  /**
   * @param {String} path
   */
  logEntryCreatedEvent(path) {
    console.log(`  Created ${path}`);
  }
}
