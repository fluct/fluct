import Action from './action'
import express from 'express'
import fs from 'fs'

/**
 * @class
 */
export default class Application {
  /**
   * @return {Application}
   */
  buildExpressApplication() {
    const expressApplication = express();
    this.getActions().forEach((action) => {
      expressApplication[action.getHttpMethod().toLowerCase()](
        action.getPath(),
        (request, response) => {
          action.run(request, response);
        }
      );
    });
    return expressApplication;
  }

  /**
   * @return {Array.<Action>}
   */
  getActions() {
    return this.getActionNames().map((actionName) => {
      return new Action({ name: actionName });
    });
  }

  /**
   * @return {Array.<String>}
   */
  getActionNames() {
    return fs.readdirSync('actions').filter((pathPart) => {
      return fs.statSync(`actions/${pathPart}`).isDirectory();
    });
  }

  /**
   * @return {Application}
   */
  getExpressApplication() {
    if (!this.expressApplication) {
      this.expressApplication = this.buildExpressApplication();
    }
    return this.expressApplication;
  }

  /**
   * @return {Object}
   */
  getMetadata() {
    return JSON.parse(
      fs.readFileSync('./package.json')
    );
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
    return JSON.parse(
      fs.readFileSync(`./package.json`)
    );
  }

  /**
   * @todo
   * @return {String}
   */
  getRegion() {
    return 'us-east-1';
  }

  /**
   * @return {String}
   */
  getRestapiId() {
    return this.getPackage().fluct.restapiId;
  }

  /**
   * @return {String}
   */
  getRoleArn() {
    return this.getMetadata().fluct.roleArn;
  }

  /**
   * @param {Integer} port
   * @param {Function=} callback
   */
  listen(port, callback) {
    return this.getExpressApplication().listen(port, callback);
  }

  /**
   * @param {String} restapiId
   */
  writeRestapiId(restapiId) {
    const metadata = this.getMetadata();
    metadata.fluct.restapiId = restapiId;
    fs.writeSync(
      fs.openSync('./package.json', 'w'),
      JSON.stringify(metadata, null, 2)
    );
  }
}
