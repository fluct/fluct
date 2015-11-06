import AWS from 'aws-sdk'
import Application from './application'
import BaseCommand from './base_command'
import moment from 'moment'

/**
 * @class
 */
export default class RoutesCommand extends BaseCommand {
  run() {
    const application = new Application();
    new AWS.APIGateway({
      accessKeyId: AWS.config.credentials.accessKeyId,
      secretAccessKey: AWS.config.credentials.secretAccessKey,
      region: application.getRegion()
    }).listDeployments({ restApiId: application.getRestApiId() }).then((deployments) => {
      console.log(
        deployments.map((deployment) => {
          return `${deployment.source.id}  ${moment.unix(deployment.source.createdDate).format('YYYY-MM-DD HH:mm Z')}`;
        }).join('\n')
      );
    });
  }
}
