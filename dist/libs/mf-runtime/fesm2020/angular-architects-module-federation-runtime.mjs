let config = {};
const containerMap = {};
const remoteMap = {};
let isDefaultScopeInitialized = false;
async function lookupExposedModule(key, exposedModule) {
    const container = containerMap[key];
    const factory = await container.get(exposedModule);
    const Module = factory();
    return Module;
}
async function initRemote(container, key) {
    // const container = window[key] as Container;
    // Do we still need to initialize the remote?
    if (remoteMap[key]) {
        return container;
    }
    // Do we still need to initialize the share scope?
    if (!isDefaultScopeInitialized) {
        await __webpack_init_sharing__('default');
        isDefaultScopeInitialized = true;
    }
    await container.init(__webpack_share_scopes__.default);
    remoteMap[key] = true;
    return container;
}
async function loadRemoteEntry(remoteEntryOrOptions, remoteName) {
    if (typeof remoteEntryOrOptions === 'string') {
        const remoteEntry = remoteEntryOrOptions;
        return await loadRemoteScriptEntry(remoteEntry, remoteName);
    }
    else if (remoteEntryOrOptions.type === 'script') {
        const options = remoteEntryOrOptions;
        return await loadRemoteScriptEntry(options.remoteEntry, options.remoteName);
    }
    else if (remoteEntryOrOptions.type === 'module') {
        const options = remoteEntryOrOptions;
        await loadRemoteModuleEntry(options.remoteEntry);
    }
}
async function loadRemoteModuleEntry(remoteEntry) {
    if (containerMap[remoteEntry]) {
        return Promise.resolve();
    }
    return await import(/* webpackIgnore:true */ remoteEntry).then((container) => {
        initRemote(container, remoteEntry);
        containerMap[remoteEntry] = container;
    });
}
async function loadRemoteScriptEntry(remoteEntry, remoteName) {
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
}
async function loadRemoteModule(optionsOrRemoteName, exposedModule) {
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
        await loadRemoteEntry(loadRemoteEntryOptions);
    }
    return await lookupExposedModule(key, options.exposedModule);
}
async function setManifest(manifest, skipRemoteEntries = false) {
    config = parseConfig(manifest);
    if (!skipRemoteEntries) {
        await loadRemoteEntries();
    }
}
function getManifest() {
    return config;
}
async function initFederation(manifest, skipRemoteEntries = false) {
    if (typeof manifest === 'string') {
        return loadManifest(manifest, skipRemoteEntries);
    }
    else {
        return setManifest(manifest, skipRemoteEntries);
    }
}
async function loadManifest(configFile, skipRemoteEntries = false) {
    const result = await fetch(configFile);
    if (!result.ok) {
        throw Error('could not load configFile: ' + configFile);
    }
    config = parseConfig(await result.json());
    if (!skipRemoteEntries) {
        await loadRemoteEntries();
    }
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
            entry = {
                ...value,
                type: value.type || 'module',
            };
        }
        result[key] = entry;
    }
    return result;
}
async function loadRemoteEntries() {
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
    await Promise.all(promises);
}

/**
 * Generated bundle index. Do not edit.
 */

export { getManifest, initFederation, loadManifest, loadRemoteEntry, loadRemoteModule, setManifest };
//# sourceMappingURL=angular-architects-module-federation-runtime.mjs.map
