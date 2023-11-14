import { SkipList } from '../core/default-skip-list.js';
import { MappedPath } from '../utils/mapped-paths.js';

export interface SharedConfig {
  singleton?: boolean;
  strictVersion?: boolean;
  requiredVersion?: string;
  version?: string;
  includeSecondaries?: boolean;
}

export interface FederationConfig {
  name?: string;
  exposes?: Record<string, string>;
  shared?: Record<string, SharedConfig>;
  sharedMappings?: Array<string>;
  skip?: SkipList;
}

export interface NormalizedSharedConfig {
  singleton: boolean;
  strictVersion: boolean;
  requiredVersion: string;
  version?: string;
  includeSecondaries?: boolean;
}

export interface NormalizedFederationConfig {
  name: string;
  exposes: Record<string, string>;
  shared: Record<string, NormalizedSharedConfig>;
  sharedMappings: Array<MappedPath>;
}
