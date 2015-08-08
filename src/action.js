import fs from 'fs'
import glob from 'glob'
import yazl from 'yazl'

/**
 * @class
 */
export default class Action {
  /**
   * @param {String} name
   */
  constructor({ name }) {
    this.name = name;
  }

  /**
   * @return {Promise}
   */
  createZipFile() {
    return new Promise((resolve, reject) => {
      const zipfile = new yazl.ZipFile();
      glob.sync(`${this.getDirectoryPath()}/dest/**/*.js`).forEach((path) => {
        zipfile.addFile(
          path,
          path.substr(this.getDirectoryPath().length + 1)
        );
      });
      zipfile.outputStream.pipe(
        fs.createWriteStream(`${this.getDirectoryPath()}/dest.zip`)
      ).on('close', () => {
        console.log(`Created ${this.getDirectoryPath()}/dest.zip`);
        resolve();
      });
      zipfile.end();
    });
  }

  /**
   * @return {String}
   */
  getDirectoryPath() {
    return `./actions/${this.name}`;
  }

  /**
   * @return {Function}
   */
  getHandler() {
    const handlerScriptPath = `${this.getDirectoryPath()}/index.js`;
    delete(require.cache[handlerScriptPath]);
    return require(handlerScriptPath).handler;
  }

  /**
   * @return {String}
   */
  getHandlerId() {
    return 'index.handler';
  }

  /**
   * @return {String}
   */
  getHttpMethod() {
    return this.getPackage().fluct.httpMethod;
  }

  /**
   * @return {String}
   */
  getName() {
    return this.getPackage().name;
  }

  /**
   * @return {Object}
   */
  getPackage() {
    if (!this.package) {
      this.package = JSON.parse(
        fs.readFileSync(`${this.getDirectoryPath()}/package.json`)
      );
    }
    return this.package;
  }

  /**
   * @return {String}
   */
  getPath() {
    return this.getPackage().fluct.path;
  }

  /**
   * @return {String}
   */
  getRegion() {
    return 'us-east-1';
  }

  /**
   * @todo This returns dummy value for now
   * @return {String}
   */
  getRole() {
    return 'arn:aws:iam::549958975024:role/myFirstRole';
  }

  /**
   * @return {Integer}
   */
  getTimeout() {
    return 60;
  }

  /**
   * @param {http.IncomingMessage} request
   * @param {http.ServerResponse} response
   */
  run(request, response) {
    this.getHandler()(
      {},
      {
        done: (value) => {
          response.send(value);
        }
      }
    );
  }
}
