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
    return `./actions/${this.name}`;
  }

  /**
   * @return {Function}
   */
  getHandler() {
    const handlerScriptPath = `${process.cwd()}/${this.getDirectoryPath()}`;
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
    return this.getMetadata().fluct.httpMethod;
  }

  /**
   * @return {String}
   */
  getName() {
    return this.getMetadata().name;
  }

  /**
   * @return {Object}
   */
  getMetadata() {
    return JSON.parse(
      fs.readFileSync(`${this.getDirectoryPath()}/package.json`)
    );
  }

  /**
   * @return {String}
   */
  getPath() {
    return this.getMetadata().fluct.path;
  }

  /**
   * @return {String}
   */
  getRegion() {
    return 'us-east-1';
  }

  /**
   * @return {Object}
   */
  getResponseModels() {
    if (this.getMetadata().fluct.contentType == 'application/json') {
      return {}
    } else {
      return { 'text/html': 'Empty' }
    }
  }

  /**
   * @return {Object}
   */
  getResponseTemplates() {
    if (this.getMetadata().fluct.contentType == 'application/json') {
      return {}
    } else {
      return { 'text/html': "$input.path('$')" }
    }
  }

  /**
   * @return {Integer}
   */
  getTimeout() {
    return 60;
  }

  /**
   * @return {String}
   */
  getUri() {
    return `arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/${this.getMetadata().fluct.arn}/invocations`;
  }

  /**
   * @return {String}
   */
  getZipPath() {
    return `${this.getDirectoryPath()}/lambda.zip`;
  }

  /**
   * @param {http.IncomingMessage} request
   * @param {http.ServerResponse} response
   */
  run(request, response) {
    this.getHandler()(
      {},
      {
        succeed: (value) => {
          response.send(value);
        }
      }
    );
  }

  /**
   * @param {String} arn
   */
  writeArn(arn) {
    const metadata = this.getMetadata();
    metadata.fluct.arn = arn;
    fs.writeSync(
      fs.openSync(`${this.getDirectoryPath()}/package.json`, 'w'),
      JSON.stringify(metadata, null, 2)
    );
  }
}
