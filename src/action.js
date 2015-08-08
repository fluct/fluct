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
   * @return {Function}
   */
  getHandler() {
    const handlerScriptPath = `${process.cwd()}/actions/${this.name}/index.js`;
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
        fs.readFileSync(`./actions/${this.name}/package.json`)
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
