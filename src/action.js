import fs from 'fs'

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
   * @return {String}
   */
  getDirectoryPath() {
    return `${process.cwd()}/actions/${this.name}`;
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
  getHttpMethod() {
    return this.getPackage().fluct.httpMethod;
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
