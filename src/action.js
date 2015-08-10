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
      glob.sync(`${this.getDirectoryPath()}/dist/**/*.js`).forEach((path) => {
        zipfile.addFile(
          path,
          path.substr(`${this.getDirectoryPath()}/dist/`.length)
        );
      });
      zipfile.outputStream.pipe(
        fs.createWriteStream(`${this.getDirectoryPath()}/dist.zip`)
      ).on('close', () => {
        console.log(`Created ${this.getDirectoryPath()}/dist.zip`);
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
   * @todo This returns dummy value for now
   * @return {String}
   */
  getRoleArn() {
    return 'arn:aws:iam::549958975024:role/myFirstRole';
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
