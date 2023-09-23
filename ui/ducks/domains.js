import { createSlice } from '@reduxjs/toolkit';
import log from 'loglevel';
import networkMap from 'ethereum-ens-network-map';
import { isConfusing } from 'unicode-confusables';
import { isHexString } from 'ethereumjs-util';
import { Web3Provider } from '@ethersproject/providers';

import {
  getCurrentChainId,
  getNameLookupSnapsIds,
  getPermissionSubjects,
} from '../selectors';
import { handleSnapRequest } from '../store/actions';
import {
  CHAIN_IDS,
  CHAIN_ID_TO_NETWORK_ID_MAP,
  NETWORK_IDS,
  NETWORK_ID_TO_ETHERS_NETWORK_NAME_MAP,
} from '../../shared/constants/network';
import {
  CONFUSING_ENS_ERROR,
  ENS_ILLEGAL_CHARACTER,
  ENS_NOT_FOUND_ON_NETWORK,
  DOMAIN_NOT_SUPPORTED_ON_NETWORK,
  ENS_NO_ADDRESS_FOR_NAME,
  ENS_REGISTRATION_ERROR,
  ENS_UNKNOWN_ERROR,
} from '../pages/send/send.constants';
import { getSnapName, isValidDomainName } from '../helpers/utils/util';
import { CHAIN_CHANGED } from '../store/actionConstants';
import {
  BURN_ADDRESS,
  isBurnAddress,
  isValidHexAddress,
} from '../../shared/modules/hexstring-utils';

// Local Constants
const ZERO_X_ERROR_ADDRESS = '0x';
const ENS = 'ENS';

const initialState = {
  stage: 'UNINITIALIZED',
  resolution: null,
  error: null,
  warning: null,
  network: null,
  domainType: null,
  domainName: null,
  // TODO: This should be resolvingSnaps in the future when we allow for conflict resolution
  resolvingSnap: null,
};

export const domainInitialState = initialState;

const name = 'DNS';

let web3Provider = null;

const slice = createSlice({
  name,
  initialState,
  reducers: {
    domainLookup: (state, action) => {
      // first clear out the previous state
      state.resolution = null;
      state.error = null;
      state.warning = null;
      state.domainType = null;
      state.domainName = null;
      ///: BEGIN:ONLY_INCLUDE_IN(build-flask)
      state.resolvingSnap = null;
      ///: END:ONLY_INCLUDE_IN
      const { address, error, network, domainType, domainName, resolvingSnap } =
        action.payload;
      console.log(domainType);
      state.domainType = domainType;
      if (state.domainType === ENS) {
        if (error) {
          if (
            isValidDomainName(domainName) &&
            error.message === 'ENS name not defined.'
          ) {
            state.error =
              network === NETWORK_IDS.MAINNET
                ? ENS_NO_ADDRESS_FOR_NAME
                : ENS_NOT_FOUND_ON_NETWORK;
          } else if (error.message === 'Illegal character for ENS.') {
            state.error = ENS_ILLEGAL_CHARACTER;
          } else {
            log.error(error);
            state.error = ENS_UNKNOWN_ERROR;
          }
        } else if (address) {
          if (address === BURN_ADDRESS) {
            state.error = ENS_NO_ADDRESS_FOR_NAME;
          } else if (address === ZERO_X_ERROR_ADDRESS) {
            state.error = ENS_REGISTRATION_ERROR;
          } else {
            state.resolution = address;
          }
          if (isValidDomainName(address) && isConfusing(address)) {
            state.warning = CONFUSING_ENS_ERROR;
          }
        } else {
          state.error = ENS_NO_ADDRESS_FOR_NAME;
        }
      } else {
        if (!address) {
          state.error = 'No resolution for domain provided.';
        }
        if (address) {
          state.resolution = address;
          state.resolvingSnap = resolvingSnap;
        }
      }
    },
    enableDomainLookup: (state, action) => {
      state.stage = 'INITIALIZED';
      state.error = null;
      state.resolution = null;
      state.warning = null;
      state.network = action.payload;
    },
    disableDomainLookup: (state) => {
      state.stage = 'NO_NETWORK_SUPPORT';
      state.error = null;
      state.warning = null;
      state.resolution = null;
      state.network = null;
    },
    domainNotSupported: (state) => {
      state.resolution = null;
      state.warning = null;
      state.error = DOMAIN_NOT_SUPPORTED_ON_NETWORK;
    },
    resetDomainResolution: (state) => {
      state.resolution = null;
      state.warning = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(CHAIN_CHANGED, (state, action) => {
      if (action.payload !== state.currentChainId) {
        state.stage = 'UNINITIALIZED';
        web3Provider = null;
      }
    });
  },
});

const { reducer, actions } = slice;
export default reducer;

const {
  disableDomainLookup,
  domainLookup,
  enableDomainLookup,
  domainNotSupported,
  resetDomainResolution,
} = actions;
export { resetDomainResolution };

export function initializeDomainSlice() {
  return (dispatch, getState) => {
    const state = getState();
    const chainId = getCurrentChainId(state);
    const network = CHAIN_ID_TO_NETWORK_ID_MAP[chainId];
    const networkName = NETWORK_ID_TO_ETHERS_NETWORK_NAME_MAP[network];
    const ensAddress = networkMap[network];
    const isSupportedButNotEns = Object.values(CHAIN_IDS).includes(chainId);
    const networkIsSupported = Boolean(ensAddress);
    if (networkIsSupported) {
      web3Provider = new Web3Provider(global.ethereumProvider, {
        chainId: parseInt(network, 10),
        name: networkName,
        ensAddress,
      });
      dispatch(enableDomainLookup(network));
    } else {
      web3Provider = null;
      if (isSupportedButNotEns) {
        dispatch(enableDomainLookup(parseInt(chainId, 10)));
      } else {
        dispatch(disableDomainLookup());
      }
    }
  };
}

export async function fetchResolutions({ domain, address, chainId, state }) {
  const NAME_LOOKUP_PERMISSION = 'endowment:name-lookup';
  const subjects = getPermissionSubjects(state);
  const nameLookupSnaps = getNameLookupSnapsIds(state);
  console.log('nameLookupSnaps:', nameLookupSnaps);

  const filteredNameLookupSnapsIds = nameLookupSnaps.filter((snapId) => {
    const permission = subjects[snapId]?.permissions[NAME_LOOKUP_PERMISSION];
    console.log('subjects: ', subjects);
    console.log('subject:', subjects[snapId]);
    console.log('subject permissions:', subjects[snapId]?.permissions);
    console.log('namelookup permission:', permission);
    // TODO: add a caveat getter to the snaps monorepo for name lookup similar to the other caveat getters
    const nameLookupCaveat = permission.caveats[0].value;
    return nameLookupCaveat.includes(chainId);
  });
  console.log('filteredNameLookupSnapsIds:', filteredNameLookupSnapsIds);

  const snapRequestArgs = domain
    ? {
        domain,
        chainId,
      }
    : { address, chainId };

  const results = await Promise.allSettled(
    filteredNameLookupSnapsIds.map((snapId) => {
      return handleSnapRequest({
        snapId,
        origin: '',
        handler: 'onNameLookup',
        request: {
          jsonrpc: '2.0',
          method: ' ',
          params: { ...snapRequestArgs },
        },
      });
    }),
  );

  console.log('results:', results);

  const filteredResults = results.reduce(
    (successfulResolutions, result, idx) => {
      if (result.status !== 'rejected' && result.value !== null) {
        successfulResolutions.push({
          ...result.value,
          snapId: filteredNameLookupSnapsIds[idx],
        });
      }
      return successfulResolutions;
    },
    [],
  );

  console.log('filtered results:', filteredResults);

  return filteredResults;
}

export function lookupDomainName(domainName) {
  return async (dispatch, getState) => {
    const trimmedDomainName = domainName.trim();
    let state = getState();
    if (state[name].stage === 'UNINITIALIZED') {
      await dispatch(initializeDomainSlice());
    }
    state = getState();
    if (
      state[name].stage === 'NO_NETWORK_SUPPORT' &&
      !(
        isBurnAddress(trimmedDomainName) === false &&
        isValidHexAddress(trimmedDomainName, { mixedCaseUseChecksum: true })
      ) &&
      !isHexString(trimmedDomainName)
    ) {
      await dispatch(domainNotSupported());
    } else {
      log.info(`Resolvers attempting to resolve name: ${trimmedDomainName}`);
      let address;
      let fetchedResolutions;
      let hasSnapResolution = false;
      let error;
      try {
        address = await web3Provider.resolveName(trimmedDomainName);
      } catch (err) {
        error = err;
      }
      const chainId = getCurrentChainId(state);
      const network = CHAIN_ID_TO_NETWORK_ID_MAP[chainId];
      if (!address) {
        // TODO: allow for conflict resolution in future iterations, we don't have designs
        // for this currently, so just displaying the first result.
        fetchedResolutions = await fetchResolutions({
          domain: trimmedDomainName,
          chainId: `eip155:${parseInt(chainId, 16)}`,
          state,
        });
        console.log('Snap resolution:', fetchedResolutions);
        const resolvedAddress = fetchedResolutions[0]?.resolvedAddress;
        hasSnapResolution = Boolean(resolvedAddress);
        if (hasSnapResolution) {
          address = resolvedAddress;
        }
      }

      await dispatch(
        domainLookup({
          address,
          error,
          chainId,
          network: hasSnapResolution ? parseInt(chainId, 16) : network,
          domainType: hasSnapResolution ? 'Other' : ENS,
          domainName: trimmedDomainName,
          ...(hasSnapResolution
            ? { resolvingSnap: getSnapName(fetchedResolutions[0].snapId) }
            : {}),
        }),
      );
    }
  };
}

export function getDomainResolution(state) {
  return state[name].resolution;
}

export function getResolvingSnap(state) {
  return state[name].resolvingSnap;
}

export function getDomainError(state) {
  return state[name].error;
}

export function getDomainWarning(state) {
  return state[name].warning;
}

export function getDomainType(state) {
  return state[name].domainType;
}
