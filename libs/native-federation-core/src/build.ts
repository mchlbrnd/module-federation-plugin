export { NormalizedFederationConfig } from './lib/config/federation-config.js'
export { FederationOptions } from './lib/core/federation-options.js'
export { setBuildAdapter } from './lib/core/build-adapter.js'
export { writeImportMap } from './lib/core/write-import-map.js'
export { writeFederationInfo } from './lib/core/write-federation-info.js'
export { getExternals } from './lib/core/get-externals.js'
export { loadFederationConfig } from './lib/core/load-federation-config.js'
export { MappedPath } from './lib/utils/mapped-paths.js'
export {
  BuildAdapter,
  BuildAdapterOptions,
  BuildResult,
  BuildKind,
} from './lib/core/build-adapter.js';
export { withNativeFederation } from './lib/config/with-native-federation.js'
export { buildForFederation } from './lib/core/build-for-federation.js'
export {
  share,
  shareAll,
  findRootTsConfigJson,
} from './lib/config/share-utils.js';
export {
  federationBuilder,
  BuildHelperParams,
} from './lib/core/federation-builder.js';
export { logger, setLogLevel } from './lib/utils/logger.js'
export { hashFile } from './lib/utils/hash-file.js'
export * from './lib/utils/build-result-map.js'
