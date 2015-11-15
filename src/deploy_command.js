import AWS from 'aws-sdk'
import Application from './application'
import BaseCommand from './base_command'
import Composer from './composer'

/**
 * @class
 */
export default class DeployCommand extends BaseCommand {
  run() {
    new Composer({
      accessKeyId: AWS.config.credentials.accessKeyId,
      secretAccessKey: AWS.config.credentials.secretAccessKey,
      application: new Application()
    })
      .on('deploymentCreated', ({ restApiId, region, stageName }) => {
        console.log(`Deployed: https://${restApiId}.execute-api.${region}.amazonaws.com/${stageName}`);
      })
      .on('functionUploaded', ({ functionName }) => {
        console.log(`Uploaded function: ${functionName}`);
      })
      .on('methodSetUpdated', ({ httpMethod, path }) => {
        console.log(`Updated endpoint: ${httpMethod} ${path}`);
      })
      .on('restApiCreated', ({ restApiId }) => {
        console.log(`Created restApi: ${restApiId}`);
      })
      .on('zipFileCreated', ({ zipPath }) => {
        console.log(`Created zip: ${zipPath}`);
      })
      .deploy()
      .catch((error) => {
        console.log(error.stack);
      });
  }
}
