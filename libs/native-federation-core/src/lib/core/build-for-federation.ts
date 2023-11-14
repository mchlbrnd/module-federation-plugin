import { NormalizedFederationConfig } from '../config/federation-config.js';
import { FederationInfo } from '@softarc/native-federation-runtime';
import { FederationOptions } from './federation-options.js';
import { writeImportMap } from './write-import-map.js';
import { writeFederationInfo } from './write-federation-info.js';
import { bundleShared } from './bundle-shared.js';
import {
  ArtefactInfo,
  bundleExposedAndMappings,
  describeExposed,
  describeSharedMappings,
} from './bundle-exposed-and-mappings.js';

export interface BuildParams {
  skipMappingsAndExposed: boolean;
}

export const defaultBuildParams: BuildParams = {
  skipMappingsAndExposed: false,
};

export async function buildForFederation(
  config: NormalizedFederationConfig,
  fedOptions: FederationOptions,
  externals: string[],
  buildParams = defaultBuildParams
) {
  let artefactInfo: ArtefactInfo | undefined;
  if (!buildParams.skipMappingsAndExposed) {
    artefactInfo = await bundleExposedAndMappings(
      config,
      fedOptions,
      externals
    );
  }

  const exposedInfo = !artefactInfo
    ? describeExposed(config, fedOptions)
    : artefactInfo.exposes;

  const sharedPackageInfo = await bundleShared(config, fedOptions, externals);

  const sharedMappingInfo = !artefactInfo
    ? describeSharedMappings(config, fedOptions)
    : artefactInfo.mappings;

  const sharedInfo = [...sharedPackageInfo, ...sharedMappingInfo];

  const federationInfo: FederationInfo = {
    name: config.name,
    shared: sharedInfo,
    exposes: exposedInfo,
  };

  writeFederationInfo(federationInfo, fedOptions);
  writeImportMap(sharedInfo, fedOptions);

  return federationInfo;
}
