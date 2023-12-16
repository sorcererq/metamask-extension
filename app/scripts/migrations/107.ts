import { cloneDeep } from 'lodash';
import { hasProperty, isObject } from '@metamask/utils';

export const version = 107;
/**
 * TODO
 *
 * @param originalVersionedData - Versioned MetaMask extension state, exactly what we persist to dist.
 * @param originalVersionedData.meta - State metadata.
 * @param originalVersionedData.meta.version - The current state version.
 * @param originalVersionedData.data - The persisted MetaMask state, keyed by controller.
 * @returns Updated versioned MetaMask extension state.
 */
export async function migrate(originalVersionedData: {
  meta: { version: number };
  data: Record<string, unknown>;
}) {
  const versionedData = cloneDeep(originalVersionedData);
  versionedData.meta.version = version;
  versionedData.data = transformState(versionedData.data);
  return versionedData;
}

function transformState(state: Record<string, unknown>) {
  if (
    !hasProperty(state, 'CachedBalancesController') ||
    !isObject(state.CachedBalancesController) ||
    !hasProperty(state.CachedBalancesController, 'cachedBalances') ||
    !isObject(state.CachedBalancesController.cachedBalances) ||
    !hasProperty(state, 'AccountTracker')
  ) {
    return state;
  }

  const accountTrackerControllerState = state.AccountTracker || {};

  if (
    !hasProperty(accountTrackerControllerState, 'accountsByChainId') ||
    !isObject(accountTrackerControllerState.accountsByChainId)
  ) {
    state.accountTrackerController = {
      ...accountTrackerControllerState,
      accountsByChainId: {},
    };
  }

  const { cachedBalances } = state.CachedBalancesController;

  // transform cachedBalances to accountsByChainId here making sure not to
  // overwrite existing accountsByChainId values if present
  for (const chainId in cachedBalances) {
    if (hasProperty(cachedBalances, chainId)) {
      if (
        hasProperty(accountTrackerControllerState, 'accountsByChainId') &&
        !accountTrackerControllerState.accountsByChainId[chainId]
      ) {
        accountTrackerControllerState.accountsByChainId[chainId] = {};
      }

      for (const accountAddress in cachedBalances[chainId]) {
        if (cachedBalances[chainId].hasOwnProperty(accountAddress)) {
          const balance = cachedBalances[chainId][accountAddress];
          if (balance !== '0x0') {
            accountTrackerControllerState.accountsByChainId[chainId][
              accountAddress
            ] = {
              address: accountAddress,
              balance: balance,
            };
          }
        }
      }
    }
  }
  // delete cachedBalancesController
}
