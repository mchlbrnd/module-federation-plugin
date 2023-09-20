export declare type ManifestFile<T extends RemoteConfig = RemoteConfig> = {
    [key: string]: string | T;
};
export declare type Manifest<T extends RemoteConfig = RemoteConfig> = {
    [key: string]: T;
};
export declare type RemoteConfig = {
    type: 'module' | 'script';
    remoteEntry: string;
    [key: string]: unknown;
};
export declare type LoadRemoteEntryOptions = LoadRemoteEntryScriptOptions | LoadRemoteEntryEsmOptions;
export declare type LoadRemoteEntryScriptOptions = {
    type?: 'script';
    remoteEntry: string;
    remoteName: string;
};
export declare type LoadRemoteEntryEsmOptions = {
    type: 'module';
    remoteEntry: string;
};
export declare function loadRemoteEntry(remoteEntry: string, remoteName: string): Promise<void>;
export declare function loadRemoteEntry(options: LoadRemoteEntryOptions): Promise<void>;
export declare type LoadRemoteModuleOptions = LoadRemoteModuleScriptOptions | LoadRemoteModuleEsmOptions | LoadRemoteModuleManifestOptions;
export declare type LoadRemoteModuleScriptOptions = {
    type?: 'script';
    remoteEntry?: string;
    remoteName: string;
    exposedModule: string;
};
export declare type LoadRemoteModuleEsmOptions = {
    type: 'module';
    remoteEntry: string;
    exposedModule: string;
};
export declare type LoadRemoteModuleManifestOptions = {
    type: 'manifest';
    remoteName: string;
    exposedModule: string;
};
export declare function loadRemoteModule<T = any>(remoteName: string, exposedModule: string): Promise<T>;
export declare function loadRemoteModule<T = any>(options: LoadRemoteModuleOptions): Promise<T>;
export declare function setManifest(manifest: ManifestFile, skipRemoteEntries?: boolean): Promise<void>;
export declare function getManifest<T extends Manifest>(): T;
export declare function initFederation(manifest: string | ManifestFile, skipRemoteEntries?: boolean): Promise<void>;
export declare function loadManifest(configFile: string, skipRemoteEntries?: boolean): Promise<void>;
