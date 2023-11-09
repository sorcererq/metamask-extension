const { strict: assert } = require('assert');
const {
  switchToNotificationWindow,
  connectToDapp,
  withFixtures,
  unlockWallet,
  getEventPayloads,
  openDapp,
  WINDOW_TITLES,
  waitForAccountRendered,
} = require('../../helpers');
const FixtureBuilder = require('../../fixture-builder');
const {
  MetaMetricsEventName,
} = require('../../../../shared/constants/metametrics');

async function mockedDappViewedEndpoint(mockServer) {
  return await mockServer
    .forPost('https://api.segment.io/v1/batch')
    .withJsonBodyIncluding({
      batch: [{ type: 'track', event: MetaMetricsEventName.DappViewed }],
    })
    .thenCallback(() => {
      return {
        statusCode: 200,
      };
    });
}

async function mockPermissionApprovedEndpoint(mockServer) {
  return await mockServer
    .forPost('https://api.segment.io/v1/batch')
    .withJsonBodyIncluding({
      batch: [{ type: 'track', event: 'Permissions Approved' }],
    })
    .thenCallback(() => {
      return {
        statusCode: 200,
      };
    });
}

async function createTwoAccounts(driver) {
  await driver.clickElement('[data-testid="account-menu-icon"]');
  await driver.clickElement(
    '[data-testid="multichain-account-menu-popover-action-button"]',
  );
  await driver.clickElement(
    '[data-testid="multichain-account-menu-popover-add-account"]',
  );
  await driver.fill('[placeholder="Account 2"]', '2nd account');
  await driver.clickElement({ text: 'Create', tag: 'button' });
  await driver.findElement({
    css: '[data-testid="account-menu-icon"]',
    text: '2nd account',
  });
}
describe('Dapp viewed Event @no-mmi', function () {
  it('is sent when navigating to dapp with no account connected', async function () {
    async function mockSegment(mockServer) {
      return [await mockedDappViewedEndpoint(mockServer)];
    }

    await withFixtures(
      {
        dapp: true,
        fixtures: new FixtureBuilder()
          .withMetaMetricsController({
            metaMetricsId: 'fake-metrics-id',
            participateInMetaMetrics: true,
          })
          .build(),
        title: this.test.fullTitle(),
        testSpecificMock: mockSegment,
      },
      async ({ driver, mockedEndpoint: mockedEndpoints }) => {
        await driver.navigate();
        await unlockWallet(driver);
        await createTwoAccounts(driver);
        await connectToDapp(driver);
        const events = await getEventPayloads(driver, mockedEndpoints);
        const dappViewedEventProperties = events[0].properties;
        assert.equal(dappViewedEventProperties.is_first_visit, true);
        assert.equal(dappViewedEventProperties.number_of_accounts, 2);
        assert.equal(dappViewedEventProperties.number_of_accounts_connected, 1);
      },
    );
  });

  it('is sent when opening the dapp in a new tab with one account connected', async function () {
    async function mockSegment(mockServer) {
      return [
        await mockedDappViewedEndpoint(mockServer),
        await mockedDappViewedEndpoint(mockServer),
        await mockPermissionApprovedEndpoint(mockServer),
      ];
    }

    await withFixtures(
      {
        dapp: true,
        fixtures: new FixtureBuilder()
          .withMetaMetricsController({
            metaMetricsId: 'fake-metrics-id',
            participateInMetaMetrics: true,
          })
          .build(),
        title: this.test.fullTitle(),
        testSpecificMock: mockSegment,
      },
      async ({ driver, mockedEndpoint: mockedEndpoints }) => {
        await driver.navigate();
        await unlockWallet(driver);
        await waitForAccountRendered(driver);
        await connectToDapp(driver);
        let events = await getEventPayloads(driver, mockedEndpoints);

        // dapp viewed and permission approved
        assert.equal(await events.length, 2);

        // open dapp in a new page
        await openDapp(driver);
        events = await getEventPayloads(driver, mockedEndpoints);
        // events are original dapp viewed, new dapp viewed when refresh, and permission approved
        assert.equal(await events.length, 3);
        const dappViewedEventProperties = events[1].properties;
        assert.equal(dappViewedEventProperties.is_first_visit, false);
        assert.equal(dappViewedEventProperties.number_of_accounts, 1);
        assert.equal(dappViewedEventProperties.number_of_accounts_connected, 1);
      },
    );
  });

  it('is sent when refreshing dapp with one account connected', async function () {
    async function mockSegment(mockServer) {
      return [
        await mockedDappViewedEndpoint(mockServer),
        await mockedDappViewedEndpoint(mockServer),
        await mockPermissionApprovedEndpoint(mockServer),
      ];
    }

    await withFixtures(
      {
        dapp: true,
        fixtures: new FixtureBuilder()
          .withMetaMetricsController({
            metaMetricsId: 'fake-metrics-id',
            participateInMetaMetrics: true,
          })
          .build(),
        title: this.test.fullTitle(),
        testSpecificMock: mockSegment,
      },
      async ({ driver, mockedEndpoint: mockedEndpoints }) => {
        await driver.navigate();
        await unlockWallet(driver);
        await waitForAccountRendered(driver);
        await connectToDapp(driver);
        let events = await getEventPayloads(driver, mockedEndpoints);

        // dapp viewed and permission approved
        assert.equal(await events.length, 2);

        // refresh dapp
        await driver.switchToWindowWithTitle(WINDOW_TITLES.TestDApp);
        await driver.refresh();

        events = await getEventPayloads(driver, mockedEndpoints);

        // events are original dapp viewed, new dapp viewed when refresh, and permission approved
        assert.equal(await events.length, 3);
        const dappViewedEventProperties = events[1].properties;
        assert.equal(dappViewedEventProperties.is_first_visit, false);
        assert.equal(dappViewedEventProperties.number_of_accounts, 1);
        assert.equal(dappViewedEventProperties.number_of_accounts_connected, 1);
      },
    );
  });

  it('is sent when navigating to a connected dapp', async function () {
    async function mockSegment(mockServer) {
      return [
        await mockedDappViewedEndpoint(mockServer),
        await mockedDappViewedEndpoint(mockServer),
        await mockedDappViewedEndpoint(mockServer),
        await mockedDappViewedEndpoint(mockServer),
        await mockPermissionApprovedEndpoint(mockServer),
      ];
    }

    await withFixtures(
      {
        dapp: true,
        fixtures: new FixtureBuilder()
          .withMetaMetricsController({
            metaMetricsId: 'fake-metrics-id',
            participateInMetaMetrics: true,
          })
          .build(),
        title: this.test.fullTitle(),
        testSpecificMock: mockSegment,
      },
      async ({ driver, mockedEndpoint: mockedEndpoints }) => {
        await driver.navigate();
        await unlockWallet(driver);
        await waitForAccountRendered(driver);
        await connectToDapp(driver);
        let events = await getEventPayloads(driver, mockedEndpoints);

        // dapp viewed and permission approved
        assert.equal(await events.length, 2);

        // open dapp in a new page
        await openDapp(driver);
        events = await getEventPayloads(driver, mockedEndpoints);
        // events are original dapp viewed, new dapp viewed when refresh, and permission approved
        assert.equal(await events.length, 3);
        const windowHandles = await driver.getAllWindowHandles();
        // switch to second connected dapp
        await driver.switchToWindow(windowHandles[1]);
        await driver.switchToWindow(windowHandles[2]);
        events = await getEventPayloads(driver, mockedEndpoints);
        // events are original dapp viewed, new dapp viewed when refresh, new dapp viewed when navigate and permission approved
        assert.equal(await events.length, 4);
        const dappViewedEventProperties = events[2].properties;
        assert.equal(dappViewedEventProperties.is_first_visit, false);
        assert.equal(dappViewedEventProperties.number_of_accounts, 1);
        assert.equal(dappViewedEventProperties.number_of_accounts_connected, 1);
      },
    );
  });

  it('is sent when connecting dapp with two accounts', async function () {
    async function mockSegment(mockServer) {
      return [await mockedDappViewedEndpoint(mockServer)];
    }
    await withFixtures(
      {
        dapp: true,
        fixtures: new FixtureBuilder()
          .withMetaMetricsController({
            metaMetricsId: 'fake-metrics-id',
            participateInMetaMetrics: true,
          })
          .build(),
        title: this.test.fullTitle(),
        testSpecificMock: mockSegment,
      },
      async ({ driver, mockedEndpoint: mockedEndpoints }) => {
        await unlockWallet(driver);
        // create 2nd account
        await createTwoAccounts(driver);
        // Connect to dapp with two accounts
        await openDapp(driver);
        await driver.clickElement({
          text: 'Connect',
          tag: 'button',
        });
        await switchToNotificationWindow(driver);
        await driver.clickElement(
          '[data-testid="choose-account-list-operate-all-check-box"]',
        );

        await driver.clickElement({
          text: 'Next',
          tag: 'button',
        });
        await driver.clickElement({
          text: 'Connect',
          tag: 'button',
        });

        const events = await getEventPayloads(driver, mockedEndpoints);
        const dappViewedEventProperties = events[0].properties;
        assert.equal(dappViewedEventProperties.is_first_visit, true);
        assert.equal(dappViewedEventProperties.number_of_accounts, 2);
        assert.equal(dappViewedEventProperties.number_of_accounts_connected, 2);
      },
    );
  });
});
