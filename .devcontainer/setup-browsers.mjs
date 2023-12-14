import { execSync } from 'child_process';

function addBrowserToPath(browserName) {
  const seleniumOutput = execSync(
    'node_modules/selenium-webdriver/bin/linux/selenium-manager --browser ' +
      browserName,
  ).toString();

  let browserCommand = seleniumOutput.split('Browser path: ')[1];
  browserCommand = browserCommand.slice(0, -1); // cut off the newline

  execSync('sudo ln -sf ' + browserCommand + ' /usr/local/bin/' + browserName);
}

addBrowserToPath('chrome');
addBrowserToPath('firefox');
