import { __awaiter } from 'tslib';

let config = {};
const containerMap = {};
const remoteMap = {};
let isDefaultScopeInitialized = false;
function lookupExposedModule(key, exposedModule) {
    return __awaiter(this, void 0, void 0, function* () {
        const container = containerMap[key];
        const factory = yield container.get(exposedModule);
        const Module = factory();
        return Module;
    });
}
function initRemote(container, key) {
    return __awaiter(this, void 0, void 0, function* () {
        // const container = window[key] as Container;
        // Do we still need to initialize the remote?
        if (remoteMap[key]) {
            return container;
        }
        // Do we still need to initialize the share scope?
        if (!isDefaultScopeInitialized) {
            yield __webpack_init_sharing__('default');
            isDefaultScopeInitialized = true;
        }
        yield container.init(__webpack_share_scopes__.default);
        remoteMap[key] = true;
        return container;
    });
}
function loadRemoteEntry(remoteEntryOrOptions, remoteName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof remoteEntryOrOptions === 'string') {
            const remoteEntry = remoteEntryOrOptions;
            return yield loadRemoteScriptEntry(remoteEntry, remoteName);
        }
        else if (remoteEntryOrOptions.type === 'script') {
            const options = remoteEntryOrOptions;
            return yield loadRemoteScriptEntry(options.remoteEntry, options.remoteName);
        }
        else if (remoteEntryOrOptions.type === 'module') {
            const options = remoteEntryOrOptions;
            yield loadRemoteModuleEntry(options.remoteEntry);
        }
    });
}
function loadRemoteModuleEntry(remoteEntry) {
    return __awaiter(this, void 0, void 0, function* () {
        if (containerMap[remoteEntry]) {
            return Promise.resolve();
        }
        return yield import(/* webpackIgnore:true */ remoteEntry).then((container) => {
            initRemote(container, remoteEntry);
            containerMap[remoteEntry] = container;
        });
    });
}
function loadRemoteScriptEntry(remoteEntry, remoteName) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            // Is remoteEntry already loaded?
            if (containerMap[remoteName]) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = remoteEntry;
            script.onerror = reject;
            script.onload = () => {
                const container = window[remoteName];
                initRemote(container, remoteName);
                containerMap[remoteName] = container;
                resolve();
            };
            document.body.appendChild(script);
        });
    });
}
function loadRemoteModule(optionsOrRemoteName, exposedModule) {
    return __awaiter(this, void 0, void 0, function* () {
        let loadRemoteEntryOptions;
        let key;
        let remoteEntry;
        let options;
        if (typeof optionsOrRemoteName === 'string') {
            options = {
                type: 'manifest',
                remoteName: optionsOrRemoteName,
                exposedModule: exposedModule
            };
        }
        else {
            options = optionsOrRemoteName;
        }
        // To support legacy API (< ng 13)
        if (!options.type) {
            const hasManifest = Object.keys(config).length > 0;
            options.type = hasManifest ? 'manifest' : 'script';
        }
        if (options.type === 'manifest') {
            const manifestEntry = config[options.remoteName];
            if (!manifestEntry) {
                throw new Error('Manifest does not contain ' + options.remoteName);
            }
            options = {
                type: manifestEntry.type,
                exposedModule: options.exposedModule,
                remoteEntry: manifestEntry.remoteEntry,
                remoteName: manifestEntry.type === 'script' ? options.remoteName : undefined,
            };
            remoteEntry = manifestEntry.remoteEntry;
        }
        else {
            remoteEntry = options.remoteEntry;
        }
        if (options.type === 'script') {
            loadRemoteEntryOptions = {
                type: 'script',
                remoteEntry: options.remoteEntry,
                remoteName: options.remoteName,
            };
            key = options.remoteName;
        }
        else if (options.type === 'module') {
            loadRemoteEntryOptions = {
                type: 'module',
                remoteEntry: options.remoteEntry,
            };
            key = options.remoteEntry;
        }
        if (remoteEntry) {
            yield loadRemoteEntry(loadRemoteEntryOptions);
        }
        return yield lookupExposedModule(key, options.exposedModule);
    });
}
function setManifest(manifest, skipRemoteEntries = false) {
    return __awaiter(this, void 0, void 0, function* () {
        config = parseConfig(manifest);
        if (!skipRemoteEntries) {
            yield loadRemoteEntries();
        }
    });
}
function getManifest() {
    return config;
}
function initFederation(manifest, skipRemoteEntries = false) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof manifest === 'string') {
            return loadManifest(manifest, skipRemoteEntries);
        }
        else {
            return setManifest(manifest, skipRemoteEntries);
        }
    });
}
function loadManifest(configFile, skipRemoteEntries = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield fetch(configFile);
        if (!result.ok) {
            throw Error('could not load configFile: ' + configFile);
        }
        config = parseConfig(yield result.json());
        if (!skipRemoteEntries) {
            yield loadRemoteEntries();
        }
    });
}
function parseConfig(config) {
    const result = {};
    for (const key in config) {
        const value = config[key];
        let entry;
        if (typeof value === 'string') {
            entry = {
                remoteEntry: value,
                type: 'module',
            };
        }
        else {
            entry = Object.assign(Object.assign({}, value), { type: value.type || 'module' });
        }
        result[key] = entry;
    }
    return result;
}
function loadRemoteEntries() {
    return __awaiter(this, void 0, void 0, function* () {
        const promises = [];
        for (const key in config) {
            const entry = config[key];
            if (entry.type === 'module') {
                promises.push(loadRemoteEntry({ type: 'module', remoteEntry: entry.remoteEntry }));
            }
            else {
                promises.push(loadRemoteEntry({
                    type: 'script',
                    remoteEntry: entry.remoteEntry,
                    remoteName: key,
                }));
            }
        }
        yield Promise.all(promises);
    });
}

/**
 * Generated bundle index. Do not edit.
 */

export { getManifest, initFederation, loadManifest, loadRemoteEntry, loadRemoteModule, setManifest };
//# sourceMappingURL=angular-architects-module-federation-runtime.mjs.map
