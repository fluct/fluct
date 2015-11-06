import AWS from 'aws-sdk-promise'
import awsLambda from 'node-aws-lambda'
import crypto from 'crypto'
import fs from 'fs'
import glob from 'glob'
import yazl from 'yazl'
import { EventEmitter } from 'events'

const DEFAULT_STAGE_NAME = 'production';

/**
 * @class
 */
export default class Composer extends EventEmitter {
  /**
   * @param {String} accessKeyId
   * @param {Application} application
   * @param {Client=} client
   * @param {String} region
   * @param {String} secretAccessKey
   */
  constructor({ accessKeyId, application, client, secretAccessKey }) {
    super();
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
    this.application = application;
    this.client = client;
  }

  /**
   * @param {Stirng} restApiId
   * @return {Promise}
   */
  createDeployment({ restApiId }) {
    return this.getClient().createDeployment({
      restApiId: restApiId,
      stageName: DEFAULT_STAGE_NAME
    }).promise().then((value) => {
      this.emit(
        'deploymentCreated',
        {
          restApiId: restApiId,
          region: this.application.getRegion(),
          stageName: DEFAULT_STAGE_NAME
        }
      );
      return value.data;
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
            return this.updateMethodSet({
              region: this.application.getRegion(),
              functionName: action.getName(),
              httpMethod: action.getHttpMethod(),
              path: action.getPath(),
              requestTemplates: action.getRequestTemplates(),
              resourceId: resource.source.id,
              responseModels: action.getResponseModels(),
              responseTemplates: action.getResponseTemplates(),
              restapiId: restapiId,
              statusCode: action.getStatusCode(),
              uri: action.getUri()
            });
          });
        })
      );
    });
  }

  /**
   * @return {Promise}
   */
  createRestApi() {
    return this.getClient().createRestApi({
      name: this.application.getName()
    }).promise().then((restApi) => {
      this.application.writeRestApiId(restApi.data.id);
      return restApi;
    }).then((restApi) => {
      this.emit('restApiCreated', { restApiId: restApi.data.id });
      return restApi;
    });
  }

  /**
   * @param {Action} action
   * @return {Promise}
   */
  createZipFile({ action }) {
    return new Promise((resolve, reject) => {
      const actionPath = action.getDirectoryPath();
      const zipFile = new yazl.ZipFile();
      const zipPath = action.getZipPath();
      if (fs.existsSync(zipPath)) {
        fs.unlinkSync(zipPath);
      }
      glob.sync(`${actionPath}/**/*`).forEach((path) => {
        if (!fs.lstatSync(path).isDirectory()) {
          zipFile.addFile(
            path,
            path.substr(`${actionPath}/`.length)
          );
        }
      });
      glob.sync(`./node_modules/{${this.application.getProductionPackageNames().join(',')}}/**/*`).forEach((path) => {
        if (!fs.lstatSync(path).isDirectory()) {
          zipFile.addFile(path, path);
        }
      });
      glob.sync(`./config/*`).forEach((path) => {
        if (!fs.lstatSync(path).isDirectory()) {
          zipFile.addFile(path, path);
        }
      });
      zipFile.outputStream.pipe(
        fs.createWriteStream(zipPath)
      ).on('close', () => {
        resolve();
      });
      zipFile.end();
    }).then((value) => {
      this.emit('zipFileCreated', { zipPath: action.getZipPath() });
      return value;
    });
  }

  /**
   * @return {Promise}
   */
  createZipFiles() {
    return Promise.all(
      this.application.getActions().map((action) => {
        return this.createZipFile({ action: action });
      })
    );
  }

  /**
   * Set up Amazon Lambda functions and API Gateway endpoints.
   * @return {Promise}
   */
  deploy() {
    return this.createZipFiles().then(() => {
      return this.uploadActions();
    }).then(() => {
      return this.findOrCreateRestApi();
    }).then((restApi) => {
      return this.createResourceSets({
        restApiId: restApi.data.id
      }).then(() => {
        return restApi.data;
      });
    }).then((restApi) => {
      this.createDeployment({
        restApiId: restApi.data.params.restApiId
      });
    });
  }

  /**
   * @return {Promise}
   */
  findOrCreateRestApi() {
    const restApiId = this.application.getRestApiId();
    if (restApiId) {
      return this.getClient().getRestApi({ restApiId: restApiId }).promise();
    } else {
      return this.createRestApi();
    }
  }

  /**
   * @return {Client}
   */
  getClient() {
    if (!this.client) {
      this.client = new AWS.APIGateway({
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
        region: this.application.getRegion()
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
   * @param {String} functionName
   * @param {String} httpMethod
   * @param {String} path
   * @param {Object} requestTemplates
   * @param {Stirng} resourceId
   * @param {Object} responseModels
   * @param {Object} responseTemplates
   * @param {Stirng} restApiId
   * @param {Integer} statusCode
   * @param {String} uri
   * @return {Promise}
   */
  updateMethodSet({ functionName, httpMethod, path, requestTemplates, resourceId, responseModels, responseTemplates, restApiId, region, statusCode, uri }) {
    return this.getClient().putMethod({
      authorizationType: 'NONE',
      httpMethod: httpMethod,
      resourceId: resourceId,
      restApiId: restApiId
    }).promise().then((resource) => {
      return this.getClient().putIntegration({
        httpMethod: httpMethod,
        integrationHttpMethod: 'POST',
        requestTemplates: requestTemplates,
        resourceId: resourceId,
        restApiId: restApiId,
        type: 'AWS',
        uri: uri
      }).promise();
    }).then((integration) => {
      return this.getClient().putMethodResponse({
        httpMethod: httpMethod,
        resourceId: resourceId,
        responseModels: responseModels,
        restApiId: restApiId,
        statusCode: statusCode
      }).promise();
    }).then(() => {
      return this.getClient().putIntegrationResponse({
        httpMethod: httpMethod,
        resourceId: resourceId,
        responseTemplates: responseTemplates,
        restApiId: restApiId,
        statusCode: statusCode
      }).promise();
    }).then(() => {
      return new Promise((resolve, reject) => {
        new AWS.Lambda({
          region: region
        }).addPermission(
          {
            Action: 'lambda:InvokeFunction',
            FunctionName: functionName,
            Principal: 'apigateway.amazonaws.com',
            StatementId: crypto.randomBytes(20).toString('hex')
          },
          (error, data) => {
            resolve();
          }
        );
      })
    }).then((value) => {
      this.emit(
        'methodSetUpdated',
        {
          httpMethod: httpMethod,
          path: path
        }
      );
      return value.data;
    });
  }

  /**
   * @param {String} functionName
   * @param {String} handlerId
   * @param {String} region
   * @param {String} roleArn
   * @param {Integer} timeout
   * @param {Integer} memorySize
   * @param {String} zipPath
   * @return {Promise}
   */
  uploadAction({ functionName, handlerId, region, roleArn, timeout, memorySize, zipPath, }) {
    return new Promise((resolve, reject) => {
      awsLambda.deploy(
        zipPath,
        {
          functionName: functionName,
          handler: handlerId,
          region: region,
          role: roleArn,
          timeout: timeout,
          memorySize: memorySize
        },
        (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        }
      );
    }).then((value) => {
      this.emit('functionUploaded', { functionName: functionName });
      return value;
    });
  }

  /**
   * @return {Promise}
   */
  uploadActions() {
    return Promise.all(
      this.application.getActions().map((action) => {
        return this.uploadAction({
          zipPath: `${action.getDirectoryPath()}/lambda.zip`,
          region: this.application.getRegion(),
          roleArn: this.application.getRoleArn(),
          functionName: action.getName(),
          handlerId: action.getHandlerId(),
          timeout: action.getTimeout(),
          memorySize: action.getMemorySize()
        });
      })
    );
  }

  /**
   * @param {Function} middleware
   * @param {Object=} options
   * @return {Composer}
   */
  use(middleware, options) {
    return new this.constructor({
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
      application: this.application,
      client: this.getClient().use(middleware, options)
    });
  }
}
