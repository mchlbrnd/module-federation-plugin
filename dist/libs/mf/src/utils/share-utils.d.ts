import { SharedConfig } from './webpack.types';
export declare const DEFAULT_SKIP_LIST: string[];
export declare const DEFAULT_SECONARIES_SKIP_LIST: string[];
declare type IncludeSecondariesOptions = {
    skip: string | string[];
} | boolean;
declare type CustomSharedConfig = SharedConfig & {
    includeSecondaries?: IncludeSecondariesOptions;
};
declare type ConfigObject = Record<string, CustomSharedConfig>;
declare type Config = (string | ConfigObject)[] | ConfigObject;
export declare function findRootTsConfigJson(): string;
export declare function shareAll(config?: CustomSharedConfig, skip?: string[], packageJsonPath?: string): Config;
export declare function setInferVersion(infer: boolean): void;
export declare function share(shareObjects: Config, packageJsonPath?: string, skip?: string[]): Config;
export {};
