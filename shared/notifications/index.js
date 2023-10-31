// Messages and descriptions for these locale keys are in app/_locales/en/messages.json

/**
 * I'm trying something new here, where notifications get names that are translated
 * into numbers in only one place. This should make merge conflicts easier.
 */
export const NOTIFICATION_LEDGER_CONNECTION_IMPROVEMENT = 8;
export const NOTIFICATION_LEDGER_FIREFOX_CONNECTION_ISSUES = 20;
export const NOTIFICATION_ENABLE_SECURITY_ALERTS = 23;
export const NOTIFICATION_ADVANCED_GAS_BY_NETWORK = 24;
export const NOTIFICATION_DROP_LEDGER_FIREFOX = 25;
export const NOTIFICATION_OPEN_BETA_SNAPS = 26;
export const NOTIFICATION_BUY_SELL_BUTTON = 27;

export const UI_NOTIFICATIONS = {
  [NOTIFICATION_LEDGER_CONNECTION_IMPROVEMENT]: {
    id: Number(NOTIFICATION_LEDGER_CONNECTION_IMPROVEMENT),
    date: '2021-11-01',
  },
  [NOTIFICATION_LEDGER_FIREFOX_CONNECTION_ISSUES]: {
    id: Number(NOTIFICATION_LEDGER_FIREFOX_CONNECTION_ISSUES),
    date: null,
  },
  ///: BEGIN:ONLY_INCLUDE_IN(blockaid)
  [NOTIFICATION_ENABLE_SECURITY_ALERTS]: {
    id: Number(NOTIFICATION_ENABLE_SECURITY_ALERTS),
    date: null,
    image: {
      src: 'images/blockaid-security-provider.svg',
      width: '100%',
    },
  },
  ///: END:ONLY_INCLUDE_IN
  [NOTIFICATION_ADVANCED_GAS_BY_NETWORK]: {
    id: Number(NOTIFICATION_ADVANCED_GAS_BY_NETWORK),
    date: null,
  },
  // This syntax is unusual, but very helpful here.  It's equivalent to `UI_NOTIFICATIONS[NOTIFICATION_DROP_LEDGER_FIREFOX] =`
  [NOTIFICATION_DROP_LEDGER_FIREFOX]: {
    id: Number(NOTIFICATION_DROP_LEDGER_FIREFOX),
    date: null,
  },
  [NOTIFICATION_OPEN_BETA_SNAPS]: {
    id: Number(NOTIFICATION_OPEN_BETA_SNAPS),
    date: null,
    image: {
      src: 'images/introducing-snaps.svg',
      width: '100%',
    },
  },
  [NOTIFICATION_BUY_SELL_BUTTON]: {
    id: Number(NOTIFICATION_BUY_SELL_BUTTON),
    date: null,
    image: {
      src: 'images/sell_button_whatsnew.png',
      width: '100%',
    },
  },
};

export const getTranslatedUINotifications = (t, locale) => {
  const formattedLocale = locale?.replace('_', '-');
  return {
    [NOTIFICATION_LEDGER_CONNECTION_IMPROVEMENT]: {
      ...UI_NOTIFICATIONS[NOTIFICATION_LEDGER_CONNECTION_IMPROVEMENT],
      title: t('notifications8Title'),
      description: [
        t('notifications8DescriptionOne'),
        t('notifications8DescriptionTwo'),
      ],
      date: new Intl.DateTimeFormat(formattedLocale).format(
        new Date(
          UI_NOTIFICATIONS[NOTIFICATION_LEDGER_CONNECTION_IMPROVEMENT].date,
        ),
      ),
      actionText: t('notifications8ActionText'),
    },
    [NOTIFICATION_LEDGER_FIREFOX_CONNECTION_ISSUES]: {
      ...UI_NOTIFICATIONS[NOTIFICATION_LEDGER_FIREFOX_CONNECTION_ISSUES],
      title: t('notifications20Title'),
      description: [t('notifications20Description')],
      actionText: t('notifications20ActionText'),
      date: UI_NOTIFICATIONS[NOTIFICATION_LEDGER_FIREFOX_CONNECTION_ISSUES].date
        ? new Intl.DateTimeFormat(formattedLocale).format(
            new Date(
              UI_NOTIFICATIONS[
                NOTIFICATION_LEDGER_FIREFOX_CONNECTION_ISSUES
              ].date,
            ),
          )
        : '',
    },
    ///: BEGIN:ONLY_INCLUDE_IN(blockaid)
    [NOTIFICATION_ENABLE_SECURITY_ALERTS]: {
      ...UI_NOTIFICATIONS[NOTIFICATION_ENABLE_SECURITY_ALERTS],
      title: t('notifications23Title'),
      description: [
        t('notifications23DescriptionOne'),
        t('notifications23DescriptionTwo'),
      ],
      actionText: t('notifications23ActionText'),
      date: UI_NOTIFICATIONS[NOTIFICATION_ENABLE_SECURITY_ALERTS].date
        ? new Intl.DateTimeFormat(formattedLocale).format(
            new Date(
              UI_NOTIFICATIONS[NOTIFICATION_ENABLE_SECURITY_ALERTS].date,
            ),
          )
        : '',
    },
    ///: END:ONLY_INCLUDE_IN
    [NOTIFICATION_ADVANCED_GAS_BY_NETWORK]: {
      ...UI_NOTIFICATIONS[NOTIFICATION_ADVANCED_GAS_BY_NETWORK],
      title: t('notifications24Title'),
      description: t('notifications24Description'),
      actionText: t('notifications24ActionText'),
      date: UI_NOTIFICATIONS[NOTIFICATION_ADVANCED_GAS_BY_NETWORK].date
        ? new Intl.DateTimeFormat(formattedLocale).format(
            new Date(
              UI_NOTIFICATIONS[NOTIFICATION_ADVANCED_GAS_BY_NETWORK].date,
            ),
          )
        : '',
    },
    // This syntax is unusual, but very helpful here.  It's equivalent to `unnamedObject[NOTIFICATION_DROP_LEDGER_FIREFOX] =`
    [NOTIFICATION_DROP_LEDGER_FIREFOX]: {
      ...UI_NOTIFICATIONS[NOTIFICATION_DROP_LEDGER_FIREFOX],
      title: t('notificationsDropLedgerFirefoxTitle'),
      description: [t('notificationsDropLedgerFirefoxDescription')],
      date: UI_NOTIFICATIONS[NOTIFICATION_DROP_LEDGER_FIREFOX].date
        ? new Intl.DateTimeFormat(formattedLocale).format(
            new Date(UI_NOTIFICATIONS[NOTIFICATION_DROP_LEDGER_FIREFOX].date),
          )
        : '',
    },
    [NOTIFICATION_OPEN_BETA_SNAPS]: {
      ...UI_NOTIFICATIONS[NOTIFICATION_OPEN_BETA_SNAPS],
      title: t('notificationsOpenBetaSnapsTitle'),
      description: [
        t('notificationsOpenBetaSnapsDescriptionOne'),
        t('notificationsOpenBetaSnapsDescriptionTwo'),
        t('notificationsOpenBetaSnapsDescriptionThree'),
      ],
      actionText: t('notificationsOpenBetaSnapsActionText'),
      date: UI_NOTIFICATIONS[NOTIFICATION_OPEN_BETA_SNAPS].date
        ? new Intl.DateTimeFormat(formattedLocale).format(
            new Date(UI_NOTIFICATIONS[NOTIFICATION_OPEN_BETA_SNAPS].date),
          )
        : '',
    },
    [NOTIFICATION_BUY_SELL_BUTTON]: {
      ...UI_NOTIFICATIONS[NOTIFICATION_BUY_SELL_BUTTON],
      title: t('notificationsBuySellTitle'),
      description: t('notificationsBuySellDescription'),
      actionText: t('notificationsBuySellActionText'),
      date: UI_NOTIFICATIONS[NOTIFICATION_BUY_SELL_BUTTON].date
        ? new Intl.DateTimeFormat(formattedLocale).format(
            new Date(UI_NOTIFICATIONS[NOTIFICATION_BUY_SELL_BUTTON].date),
          )
        : '',
    },
  };
};
