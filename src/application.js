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
   * @return {String}
   */
  getAccountId() {
    return this.getMetadata().accountId;
  }

  /**
   * @return {Array.<Action>}
   */
  getActions() {
    return this.getActionNames().map((actionName) => {
      return new Action({ application: this, name: actionName });
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
      fs.readFileSync('./fluct.json')
    );
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
  getPackage() {
    return JSON.parse(
      fs.readFileSync(`./package.json`)
    );
  }

  /**
   * @return {Arrray.<String>}
   */
  getProductionPackageNames() {
    return Object.keys(this.getPackage().dependencies || {});
  }

  /**
   * @return {String}
   */
  getRegion() {
    return this.getMetadata().region || 'us-east-1';
  }

  /**
   * @return {String}
   */
  getRestApiId() {
    return this.getMetadata().restApiId;
  }

  /**
   * @return {String}
   */
  getRoleArn() {
    return `arn:aws:iam::${this.getAccountId()}:role/${this.getRoleName()}`;
  }

  /**
   * @return {String}
   */
  getRoleName() {
    return this.getMetadata().roleName;
  }

  /**
   * @param {Integer} port
   * @param {Function=} callback
   */
  listen(port, callback) {
    return this.getExpressApplication().listen(port, callback);
  }

  /**
   * @param {String} restApiId
   */
  writeRestApiId(restApiId) {
    const metadata = this.getMetadata();
    metadata.restApiId = restApiId;
    fs.writeSync(
      fs.openSync('./fluct.json', 'w'),
      JSON.stringify(metadata, null, 2)
    );
  }
}
