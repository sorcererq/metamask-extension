import { execSync } from 'child_process';

function addBrowserToPath(browserName) {
  const seleniumOutput = execSync(
    'node_modules/selenium-webdriver/bin/linux/selenium-manager --browser ' +
      browserName,
  ).toString();

  const browserCommand = seleniumOutput.split('Browser path: ')[1];

  const browserFolder = browserCommand.slice(0, -browserName.length - 1);

  execSync('echo \'export PATH="/' + browserFolder + ':$PATH"\' >> ~/.bashrc');
}

addBrowserToPath('chrome');
addBrowserToPath('firefox');