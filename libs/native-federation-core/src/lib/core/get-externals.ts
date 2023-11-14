import { NormalizedFederationConfig } from '../config/federation-config.js';
// import { isInSkipList, PREPARED_DEFAULT_SKIP_LIST } from './default-skip-list.js';

export function getExternals(config: NormalizedFederationConfig) {
  const shared = Object.keys(config.shared);
  const sharedMappings = config.sharedMappings.map((m) => m.key);

  const externals = [...shared, ...sharedMappings];

  return externals;
  // return externals.filter((p) => !isInSkipList(p, PREPARED_DEFAULT_SKIP_LIST));
}
