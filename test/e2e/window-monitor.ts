import _ from 'lodash';
import { ThenableWebDriver } from 'selenium-webdriver';

let windowHandles: string[];
let windowTitlesByHandle: { [key: string]: string };
let windowHandleNumbersOverTime: number[];
const NUMBERS_LENGTH = 10;

let driver: ThenableWebDriver;
let wmInterval: NodeJS.Timeout;
let isRunning = false;
let isSearchingForNewTab = false;

export async function startWindowMonitor(_driver: ThenableWebDriver) {
  driver = _driver;
  windowHandles = await driver.getAllWindowHandles();
  windowHandleNumbersOverTime = Array(NUMBERS_LENGTH).fill(
    windowHandles.length,
  );
  windowTitlesByHandle = {};

  isRunning = true;
  wmInterval = setInterval(refreshWindowHandles, 1000);
}

export async function stopWindowMonitor() {
  console.log('STOPPING WINDOW MONITOR');
  isRunning = false;
  clearInterval(wmInterval);
}

async function refreshWindowHandles() {
  if (!isRunning) {
    return;
  }

  // console.log('refreshing window handles');
  windowHandles = await driver.getAllWindowHandles();

  // move the queue forward
  windowHandleNumbersOverTime.push(windowHandles.length);
  windowHandleNumbersOverTime.shift();

  const activeWindowHandle = await driver.getWindowHandle();
  const activeWindowTitle = await driver.getTitle();

  windowTitlesByHandle[activeWindowHandle] = activeWindowTitle;

  // console.log('windowTitlesByHandle', windowTitlesByHandle);

  // Get the title of each windowHandle that doesn't already have a title stored
  if (isSearchingForNewTab && didNewWindowOpen()) {
    console.log('searching for new tab');
    windowHandles.forEach(async (handle) => {
      if (!windowTitlesByHandle[handle]) {
        await switchTo(handle);
        // windowTitlesByHandle[handle] = await driver.getTitle();
        console.log('found new tab', windowTitlesByHandle[handle]);
      }
    });
  }

  // Filter windowTitlesByHandle to only include open windows (windowHandles)
  windowTitlesByHandle = Object.fromEntries(
    Object.entries(windowTitlesByHandle).filter(([key]) =>
      windowHandles.includes(key),
    ),
  );

  // console.log('filtered', windowTitlesByHandle);
}

function didNewWindowOpen() {
  return (
    // Compare now to 1 second ago
    windowHandleNumbersOverTime[NUMBERS_LENGTH - 1] >
      windowHandleNumbersOverTime[NUMBERS_LENGTH - 2] ||
    // Compare now to 2 seconds ago
    windowHandleNumbersOverTime[NUMBERS_LENGTH - 1] >
      windowHandleNumbersOverTime[NUMBERS_LENGTH - 3] ||
    // Is there a missing entry in windowTitlesByHandle?
    windowHandles.length > Object.keys(windowTitlesByHandle).length
  );
}

async function switchTo(handle: string) {
  try {
    await driver.switchTo().window(handle);
    windowTitlesByHandle[handle] = await driver.getTitle();
    console.log('switched to window', windowTitlesByHandle[handle]);
    return true;
  } catch (e) {
    console.log('error switching to window', e);
    return false;
  }
}

export async function getWindowMonitorHandles() {
  // await refreshWindowHandles();
  return windowHandles;
}

export async function getWindowHandlesRaw() {
  return await driver.getAllWindowHandles();
}

/**
 * Sometimes it's not very stable to switch to a window by title,
 * and it's much better to switch by number
 *
 * @param num
 */
export async function switchToWindowHandleNumber(num: number) {
  let handles = await getWindowHandlesRaw();

  // delay and loop if there are too few handles right now
  for (let i = 0; i < 10 && handles.length <= num; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    handles = await getWindowHandlesRaw();
  }

  if (handles.length > num) {
    await driver.switchTo().window(handles[num]);
  }
}

export async function getWindowHandlesForce() {
  isSearchingForNewTab = true;
  await refreshWindowHandles();
  isSearchingForNewTab = false;

  return windowHandles;
}

export async function switchToWindowWithTitle(
  title: string,
  delayStep = 1000,
  timeout = 10000,
) {
  console.log('first trying to switch to', title);

  // await refreshWindowHandles();

  let timeElapsed = 0;
  while (timeElapsed <= timeout) {
    console.log('trying to switch to', title);

    const handle = _.findKey(windowTitlesByHandle, (t) => t === title);

    if (handle && (await switchTo(handle))) {
      return; // successfully switched windows, so we can stop the loop
    }

    isSearchingForNewTab = true;

    await new Promise((resolve) => setTimeout(resolve, delayStep));
    timeElapsed += delayStep;
  }

  throw new Error(`No window with title: ${title}`);
}
