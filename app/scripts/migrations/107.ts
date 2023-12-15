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

  const {cachedBalances} = state.CachedBalancesController;

  Object.entries(cachedBalances).forEach(([chainId, chainCachedBalances]) => {
    if (
      !hasProperty(
        state.AccountTracker.accountsByChainId,
        chainId,
      ) ||
      !isObject(
        state.AccountTracker.accountsByChainId[chainId],
      )
    ) {
      state.AccountTracker.accountsByChainId[chainId] = {};
    }

    Object.entries(chainCachedBalances).forEach(([address, balance]) => {
      state.AccountTrackerController.accountsByChainId[chainId][
        address
      ] = {
        balance,
      };
    });
  }

}
