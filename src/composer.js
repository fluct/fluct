import { Client } from 'amazon-api-gateway-client'
import fs from 'fs'
import glob from 'glob'
import path from 'path'
import yazl from 'yazl'

/**
 * @class
 */
export default class Composer {
  /**
   * @param {String} accessKeyId
   * @param {Application} application
   * @param {Client=} client
   * @param {String} region
   * @param {String} secretAccessKey
   */
  constructor({ accessKeyId, application, client, region, secretAccessKey }) {
    this.accessKeyId = accessKeyId;
    this.application = application;
    this.client = client;
    this.region = region;
    this.secretAccessKey = secretAccessKey;
  }

  /**
   * @param {String} httpMethod
   * @param {String} path
   * @param {Stirng} resourceId
   * @param {Stirng} restapiId
   * @return {Promise}
   */
  createMethodSet({ httpMethod, path, resourceId, restapiId }) {
    return this.getClient().putMethod({
      httpMethod: httpMethod,
      resourceId: resourceId,
      restapiId: restapiId
    }).then((resource) => {
      return this.getClient().putIntegration({
        httpMethod: httpMethod,
        integrationHttpMethod: 'GET',
        resourceId: resourceId,
        restapiId: restapiId,
        type: 'HTTP',
        uri: 'http://example.com',
      });
    }).then(() => {
      return this.getClient().putMethodResponse({
        httpMethod: httpMethod,
        resourceId: resourceId,
        restapiId: restapiId,
        statusCode: 200
      });
    }).then(() => {
      return this.getClient().putIntegrationResponse({
        httpMethod: httpMethod,
        resourceId: resourceId,
        restapiId: restapiId,
        statusCode: 200
      });
    });
  }

  /**
   * @param {String} restapiId
   * @return {Promise}
   */
  createResourceSets({ restapiId }) {
    return this.getClient().createResources({
      paths: this.getPaths(),
      restapiId: restapiId
    }).then(() => {
      return Promise.all(
        this.application.getActions().map((action) => {
          return this.getClient().findResourceByPath({
            path: action.getPath(),
            restapiId: restapiId
          }).then((resource) => {
            return this.createMethodSet({
              httpMethod: action.getHttpMethod(),
              path: action.getPath(),
              resourceId: resource.source.id,
              restapiId: restapiId
            });
          });
        })
      );
    });
  }

  /**
   * @return {Promise}
   */
  createRestapi() {
    return this.getClient().createRestapi({
      name: this.application.getName()
    });
  }

  /**
   * @param {String} restapiId
   * @return {Promise}
   */
  deleteDefaultModels({ restapiId }) {
    return Promise.all(
      [
        'Empty',
        'Error'
      ].map((modelName) => {
        return this.getClient().deleteModel({
          modelName: modelName,
          restapiId: restapiId
        });
      })
    );
  }

  /**
   * Set up Amazon Lambda functions and API Gateway endpoints.
   * @return {Promise}
   */
  deploy() {
    return Promise.all(
      this.application.getActions().map((action) => {
        return new Promise((resolve, reject) => {
          const zipfile = new yazl.ZipFile();
          glob.sync(`${action.getDirectoryPath()}/dest/**/*.js`).forEach((path) => {
            zipfile.addFile(
              path,
              path.substr(action.getDirectoryPath().length + 1)
            );
          });
          zipfile.outputStream.pipe(
            fs.createWriteStream(`${action.getDirectoryPath()}/dest.zip`)
          ).on('close', () => {
            resolve();
          });
          zipfile.end();
        });
      })
    ).then(() => {
      return this.createRestapi().then((restapi) => {
        return this.deleteDefaultModels({
          restapiId: restapi.source.id
        }).then(() => {
          return restapi;
        });
      }).then((restapi) => {
        return this.createResourceSets({
          restapiId: restapi.source.id
        });
      });
    });
  }

  /**
   * @return {Client}
   */
  getClient() {
    if (!this.client) {
      this.client = new Client({
        accessKeyId: this.accessKeyId,
        region: this.region,
        secretAccessKey: this.secretAccessKey
      });
    }
    return this.client;
  }

  /**
   * @return {Array.<String>}
   */
  getPaths() {
    return this.application.getActions().map((action) => {
      return action.getPath();
    });
  }

  /**
   * @param {Function} middleware
   * @param {Object=} options
   * @return {Composer}
   */
  use(middleware, options) {
    return new this.constructor({
      accessKeyId: this.accessKeyId,
      application: this.application,
      client: this.getClient().use(middleware, options),
      region: this.region,
      secretAccessKey: this.secretAccessKey
    });
  }
}
