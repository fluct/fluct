import Application from './application'
import BaseCommand from './base_command'
import childProcess from 'child_process';

/**
 * @class
 */
export default class InstallCommand extends BaseCommand {
  run() {
    new Application().getActions().forEach((action) => {
      const cwd = action.getDirectoryPath();
      console.log(`Running \`npm install\` in ${cwd}`);
      childProcess.spawn(
        'npm',
        ['install'],
        {
          cwd: cwd,
          stdio: 'inherit'
        }
      );
    });
  }
}
