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
export async function loadRemoteEntry(remoteEntryOrOptions, remoteName) {
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
export async function loadRemoteModule(optionsOrRemoteName, exposedModule) {
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
export async function setManifest(manifest, skipRemoteEntries = false) {
    config = parseConfig(manifest);
    if (!skipRemoteEntries) {
        await loadRemoteEntries();
    }
}
export function getManifest() {
    return config;
}
export async function initFederation(manifest, skipRemoteEntries = false) {
    if (typeof manifest === 'string') {
        return loadManifest(manifest, skipRemoteEntries);
    }
    else {
        return setManifest(manifest, skipRemoteEntries);
    }
}
export async function loadManifest(configFile, skipRemoteEntries = false) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pYy1mZWRlcmF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbGlicy9tZi1ydW50aW1lL3NyYy9saWIvbG9hZGVyL2R5bmFtaWMtZmVkZXJhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFTQSxJQUFJLE1BQU0sR0FBYSxFQUFFLENBQUM7QUFxQjFCLE1BQU0sWUFBWSxHQUFpQixFQUFFLENBQUM7QUFDdEMsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBRXJCLElBQUkseUJBQXlCLEdBQUcsS0FBSyxDQUFDO0FBRXRDLEtBQUssVUFBVSxtQkFBbUIsQ0FDaEMsR0FBVyxFQUNYLGFBQXFCO0lBRXJCLE1BQU0sU0FBUyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNwQyxNQUFNLE9BQU8sR0FBRyxNQUFNLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDbkQsTUFBTSxNQUFNLEdBQUcsT0FBTyxFQUFFLENBQUM7SUFDekIsT0FBTyxNQUFXLENBQUM7QUFDckIsQ0FBQztBQUVELEtBQUssVUFBVSxVQUFVLENBQUMsU0FBb0IsRUFBRSxHQUFXO0lBQ3pELDhDQUE4QztJQUU5Qyw2Q0FBNkM7SUFDN0MsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDbEIsT0FBTyxTQUFTLENBQUM7S0FDbEI7SUFFRCxrREFBa0Q7SUFDbEQsSUFBSSxDQUFDLHlCQUF5QixFQUFFO1FBQzlCLE1BQU0sd0JBQXdCLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDMUMseUJBQXlCLEdBQUcsSUFBSSxDQUFDO0tBQ2xDO0lBRUQsTUFBTSxTQUFTLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZELFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDdEIsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQXdCRCxNQUFNLENBQUMsS0FBSyxVQUFVLGVBQWUsQ0FDbkMsb0JBQXFELEVBQ3JELFVBQW1CO0lBRW5CLElBQUksT0FBTyxvQkFBb0IsS0FBSyxRQUFRLEVBQUU7UUFDNUMsTUFBTSxXQUFXLEdBQUcsb0JBQW9CLENBQUM7UUFDekMsT0FBTyxNQUFNLHFCQUFxQixDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQztLQUM3RDtTQUFNLElBQUksb0JBQW9CLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtRQUNqRCxNQUFNLE9BQU8sR0FBRyxvQkFBb0IsQ0FBQztRQUNyQyxPQUFPLE1BQU0scUJBQXFCLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDN0U7U0FBTSxJQUFJLG9CQUFvQixDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7UUFDakQsTUFBTSxPQUFPLEdBQUcsb0JBQW9CLENBQUM7UUFDckMsTUFBTSxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDbEQ7QUFDSCxDQUFDO0FBRUQsS0FBSyxVQUFVLHFCQUFxQixDQUFDLFdBQW1CO0lBQ3RELElBQUksWUFBWSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1FBQzdCLE9BQU8sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQzFCO0lBQ0QsT0FBTyxNQUFNLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQzVELENBQUMsU0FBUyxFQUFFLEVBQUU7UUFDWixVQUFVLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ25DLFlBQVksQ0FBQyxXQUFXLENBQUMsR0FBRyxTQUFTLENBQUM7SUFDeEMsQ0FBQyxDQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsS0FBSyxVQUFVLHFCQUFxQixDQUNsQyxXQUFtQixFQUNuQixVQUFrQjtJQUVsQixPQUFPLElBQUksT0FBTyxDQUFPLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQzNDLGlDQUFpQztRQUNqQyxJQUFJLFlBQVksQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUM1QixPQUFPLEVBQUUsQ0FBQztZQUNWLE9BQU87U0FDUjtRQUVELE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEQsTUFBTSxDQUFDLEdBQUcsR0FBRyxXQUFXLENBQUM7UUFFekIsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFFeEIsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUU7WUFDbkIsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBYyxDQUFDO1lBQ2xELFVBQVUsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDbEMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxHQUFHLFNBQVMsQ0FBQztZQUNyQyxPQUFPLEVBQUUsQ0FBQztRQUNaLENBQUMsQ0FBQztRQUVGLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQTZCRCxNQUFNLENBQUMsS0FBSyxVQUFVLGdCQUFnQixDQUNwQyxtQkFBcUQsRUFDckQsYUFBc0I7SUFFdEIsSUFBSSxzQkFBOEMsQ0FBQztJQUNuRCxJQUFJLEdBQVcsQ0FBQztJQUNoQixJQUFJLFdBQW1CLENBQUM7SUFDeEIsSUFBSSxPQUFnQyxDQUFDO0lBRXJDLElBQUksT0FBTyxtQkFBbUIsS0FBSyxRQUFRLEVBQUU7UUFDM0MsT0FBTyxHQUFHO1lBQ1IsSUFBSSxFQUFFLFVBQVU7WUFDaEIsVUFBVSxFQUFFLG1CQUFtQjtZQUMvQixhQUFhLEVBQUUsYUFBYTtTQUM3QixDQUFBO0tBQ0Y7U0FDSTtRQUNILE9BQU8sR0FBRyxtQkFBbUIsQ0FBQztLQUMvQjtJQUVELGtDQUFrQztJQUNsQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRTtRQUNqQixNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDbkQsT0FBTyxDQUFDLElBQUksR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO0tBQ3BEO0lBRUQsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLFVBQVUsRUFBRTtRQUMvQixNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDbEIsTUFBTSxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDcEU7UUFDRCxPQUFPLEdBQUc7WUFDUixJQUFJLEVBQUUsYUFBYSxDQUFDLElBQUk7WUFDeEIsYUFBYSxFQUFFLE9BQU8sQ0FBQyxhQUFhO1lBQ3BDLFdBQVcsRUFBRSxhQUFhLENBQUMsV0FBVztZQUN0QyxVQUFVLEVBQ1IsYUFBYSxDQUFDLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVM7U0FDbkUsQ0FBQztRQUNGLFdBQVcsR0FBRyxhQUFhLENBQUMsV0FBVyxDQUFDO0tBQ3pDO1NBQU07UUFDTCxXQUFXLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQztLQUNuQztJQUVELElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7UUFDN0Isc0JBQXNCLEdBQUc7WUFDdkIsSUFBSSxFQUFFLFFBQVE7WUFDZCxXQUFXLEVBQUUsT0FBTyxDQUFDLFdBQVc7WUFDaEMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxVQUFVO1NBQy9CLENBQUM7UUFDRixHQUFHLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQztLQUMxQjtTQUFNLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7UUFDcEMsc0JBQXNCLEdBQUc7WUFDdkIsSUFBSSxFQUFFLFFBQVE7WUFDZCxXQUFXLEVBQUUsT0FBTyxDQUFDLFdBQVc7U0FDakMsQ0FBQztRQUNGLEdBQUcsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO0tBQzNCO0lBRUQsSUFBSSxXQUFXLEVBQUU7UUFDZixNQUFNLGVBQWUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0tBQy9DO0lBRUQsT0FBTyxNQUFNLG1CQUFtQixDQUFJLEdBQUcsRUFBRSxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDbEUsQ0FBQztBQUVELE1BQU0sQ0FBQyxLQUFLLFVBQVUsV0FBVyxDQUMvQixRQUFzQixFQUN0QixpQkFBaUIsR0FBRyxLQUFLO0lBRXpCLE1BQU0sR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFL0IsSUFBSSxDQUFDLGlCQUFpQixFQUFFO1FBQ3RCLE1BQU0saUJBQWlCLEVBQUUsQ0FBQztLQUMzQjtBQUNILENBQUM7QUFFRCxNQUFNLFVBQVUsV0FBVztJQUN6QixPQUFPLE1BQVcsQ0FBQztBQUNyQixDQUFDO0FBRUQsTUFBTSxDQUFDLEtBQUssVUFBVSxjQUFjLENBQUMsUUFBK0IsRUFBRSxpQkFBaUIsR0FBRyxLQUFLO0lBQzdGLElBQUksT0FBTyxRQUFRLEtBQUssUUFBUSxFQUFFO1FBQ2hDLE9BQU8sWUFBWSxDQUFDLFFBQVEsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0tBQ2xEO1NBQ0k7UUFDSCxPQUFPLFdBQVcsQ0FBQyxRQUFRLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztLQUNqRDtBQUNILENBQUM7QUFFRCxNQUFNLENBQUMsS0FBSyxVQUFVLFlBQVksQ0FDaEMsVUFBa0IsRUFDbEIsaUJBQWlCLEdBQUcsS0FBSztJQUV6QixNQUFNLE1BQU0sR0FBRyxNQUFNLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUV2QyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRTtRQUNkLE1BQU0sS0FBSyxDQUFDLDZCQUE2QixHQUFHLFVBQVUsQ0FBQyxDQUFDO0tBQ3pEO0lBRUQsTUFBTSxHQUFHLFdBQVcsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBRTFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtRQUN0QixNQUFNLGlCQUFpQixFQUFFLENBQUM7S0FDM0I7QUFDSCxDQUFDO0FBRUQsU0FBUyxXQUFXLENBQUMsTUFBb0I7SUFDdkMsTUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO0lBQzVCLEtBQUssTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFO1FBQ3hCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUUxQixJQUFJLEtBQW1CLENBQUM7UUFDeEIsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDN0IsS0FBSyxHQUFHO2dCQUNOLFdBQVcsRUFBRSxLQUFLO2dCQUNsQixJQUFJLEVBQUUsUUFBUTthQUNmLENBQUM7U0FDSDthQUFNO1lBQ0wsS0FBSyxHQUFHO2dCQUNOLEdBQUcsS0FBSztnQkFDUixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksSUFBSSxRQUFRO2FBQzdCLENBQUM7U0FDSDtRQUVELE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7S0FDckI7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQsS0FBSyxVQUFVLGlCQUFpQjtJQUM5QixNQUFNLFFBQVEsR0FBb0IsRUFBRSxDQUFDO0lBRXJDLEtBQUssTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFO1FBQ3hCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUUxQixJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFO1lBQzNCLFFBQVEsQ0FBQyxJQUFJLENBQ1gsZUFBZSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQ3BFLENBQUM7U0FDSDthQUFNO1lBQ0wsUUFBUSxDQUFDLElBQUksQ0FDWCxlQUFlLENBQUM7Z0JBQ2QsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO2dCQUM5QixVQUFVLEVBQUUsR0FBRzthQUNoQixDQUFDLENBQ0gsQ0FBQztTQUNIO0tBQ0Y7SUFFRCxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDOUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbInR5cGUgU2NvcGUgPSB1bmtub3duO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbnR5cGUgRmFjdG9yeSA9ICgpID0+IGFueTtcblxudHlwZSBDb250YWluZXIgPSB7XG4gIGluaXQoc2hhcmVTY29wZTogU2NvcGUpOiB2b2lkO1xuICBnZXQobW9kdWxlOiBzdHJpbmcpOiBGYWN0b3J5O1xufTtcblxubGV0IGNvbmZpZzogTWFuaWZlc3QgPSB7fTtcblxuZXhwb3J0IHR5cGUgTWFuaWZlc3RGaWxlPFQgZXh0ZW5kcyBSZW1vdGVDb25maWcgPSBSZW1vdGVDb25maWc+ID0ge1xuICBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBUO1xufTtcblxuZXhwb3J0IHR5cGUgTWFuaWZlc3Q8VCBleHRlbmRzIFJlbW90ZUNvbmZpZyA9IFJlbW90ZUNvbmZpZz4gPSB7XG4gIFtrZXk6IHN0cmluZ106IFQ7XG59O1xuXG5leHBvcnQgdHlwZSBSZW1vdGVDb25maWcgPSB7XG4gIHR5cGU6ICdtb2R1bGUnIHwgJ3NjcmlwdCc7XG4gIHJlbW90ZUVudHJ5OiBzdHJpbmc7XG4gIFtrZXk6IHN0cmluZ106IHVua25vd247XG59O1xuXG5kZWNsYXJlIGNvbnN0IF9fd2VicGFja19pbml0X3NoYXJpbmdfXzogKHNoYXJlU2NvcGU6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcbmRlY2xhcmUgY29uc3QgX193ZWJwYWNrX3NoYXJlX3Njb3Blc19fOiB7IGRlZmF1bHQ6IFNjb3BlIH07XG5cbnR5cGUgQ29udGFpbmVyTWFwID0geyBba2V5OiBzdHJpbmddOiBDb250YWluZXIgfTtcblxuY29uc3QgY29udGFpbmVyTWFwOiBDb250YWluZXJNYXAgPSB7fTtcbmNvbnN0IHJlbW90ZU1hcCA9IHt9O1xuXG5sZXQgaXNEZWZhdWx0U2NvcGVJbml0aWFsaXplZCA9IGZhbHNlO1xuXG5hc3luYyBmdW5jdGlvbiBsb29rdXBFeHBvc2VkTW9kdWxlPFQ+KFxuICBrZXk6IHN0cmluZyxcbiAgZXhwb3NlZE1vZHVsZTogc3RyaW5nXG4pOiBQcm9taXNlPFQ+IHtcbiAgY29uc3QgY29udGFpbmVyID0gY29udGFpbmVyTWFwW2tleV07XG4gIGNvbnN0IGZhY3RvcnkgPSBhd2FpdCBjb250YWluZXIuZ2V0KGV4cG9zZWRNb2R1bGUpO1xuICBjb25zdCBNb2R1bGUgPSBmYWN0b3J5KCk7XG4gIHJldHVybiBNb2R1bGUgYXMgVDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gaW5pdFJlbW90ZShjb250YWluZXI6IENvbnRhaW5lciwga2V5OiBzdHJpbmcpIHtcbiAgLy8gY29uc3QgY29udGFpbmVyID0gd2luZG93W2tleV0gYXMgQ29udGFpbmVyO1xuXG4gIC8vIERvIHdlIHN0aWxsIG5lZWQgdG8gaW5pdGlhbGl6ZSB0aGUgcmVtb3RlP1xuICBpZiAocmVtb3RlTWFwW2tleV0pIHtcbiAgICByZXR1cm4gY29udGFpbmVyO1xuICB9XG5cbiAgLy8gRG8gd2Ugc3RpbGwgbmVlZCB0byBpbml0aWFsaXplIHRoZSBzaGFyZSBzY29wZT9cbiAgaWYgKCFpc0RlZmF1bHRTY29wZUluaXRpYWxpemVkKSB7XG4gICAgYXdhaXQgX193ZWJwYWNrX2luaXRfc2hhcmluZ19fKCdkZWZhdWx0Jyk7XG4gICAgaXNEZWZhdWx0U2NvcGVJbml0aWFsaXplZCA9IHRydWU7XG4gIH1cblxuICBhd2FpdCBjb250YWluZXIuaW5pdChfX3dlYnBhY2tfc2hhcmVfc2NvcGVzX18uZGVmYXVsdCk7XG4gIHJlbW90ZU1hcFtrZXldID0gdHJ1ZTtcbiAgcmV0dXJuIGNvbnRhaW5lcjtcbn1cblxuZXhwb3J0IHR5cGUgTG9hZFJlbW90ZUVudHJ5T3B0aW9ucyA9XG4gIHwgTG9hZFJlbW90ZUVudHJ5U2NyaXB0T3B0aW9uc1xuICB8IExvYWRSZW1vdGVFbnRyeUVzbU9wdGlvbnM7XG5cbmV4cG9ydCB0eXBlIExvYWRSZW1vdGVFbnRyeVNjcmlwdE9wdGlvbnMgPSB7XG4gIHR5cGU/OiAnc2NyaXB0JztcbiAgcmVtb3RlRW50cnk6IHN0cmluZztcbiAgcmVtb3RlTmFtZTogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgTG9hZFJlbW90ZUVudHJ5RXNtT3B0aW9ucyA9IHtcbiAgdHlwZTogJ21vZHVsZSc7XG4gIHJlbW90ZUVudHJ5OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9hZFJlbW90ZUVudHJ5KFxuICByZW1vdGVFbnRyeTogc3RyaW5nLFxuICByZW1vdGVOYW1lOiBzdHJpbmdcbik6IFByb21pc2U8dm9pZD47XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9hZFJlbW90ZUVudHJ5KFxuICBvcHRpb25zOiBMb2FkUmVtb3RlRW50cnlPcHRpb25zXG4pOiBQcm9taXNlPHZvaWQ+O1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvYWRSZW1vdGVFbnRyeShcbiAgcmVtb3RlRW50cnlPck9wdGlvbnM6IHN0cmluZyB8IExvYWRSZW1vdGVFbnRyeU9wdGlvbnMsXG4gIHJlbW90ZU5hbWU/OiBzdHJpbmdcbik6IFByb21pc2U8dm9pZD4ge1xuICBpZiAodHlwZW9mIHJlbW90ZUVudHJ5T3JPcHRpb25zID09PSAnc3RyaW5nJykge1xuICAgIGNvbnN0IHJlbW90ZUVudHJ5ID0gcmVtb3RlRW50cnlPck9wdGlvbnM7XG4gICAgcmV0dXJuIGF3YWl0IGxvYWRSZW1vdGVTY3JpcHRFbnRyeShyZW1vdGVFbnRyeSwgcmVtb3RlTmFtZSk7XG4gIH0gZWxzZSBpZiAocmVtb3RlRW50cnlPck9wdGlvbnMudHlwZSA9PT0gJ3NjcmlwdCcpIHtcbiAgICBjb25zdCBvcHRpb25zID0gcmVtb3RlRW50cnlPck9wdGlvbnM7XG4gICAgcmV0dXJuIGF3YWl0IGxvYWRSZW1vdGVTY3JpcHRFbnRyeShvcHRpb25zLnJlbW90ZUVudHJ5LCBvcHRpb25zLnJlbW90ZU5hbWUpO1xuICB9IGVsc2UgaWYgKHJlbW90ZUVudHJ5T3JPcHRpb25zLnR5cGUgPT09ICdtb2R1bGUnKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHJlbW90ZUVudHJ5T3JPcHRpb25zO1xuICAgIGF3YWl0IGxvYWRSZW1vdGVNb2R1bGVFbnRyeShvcHRpb25zLnJlbW90ZUVudHJ5KTtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBsb2FkUmVtb3RlTW9kdWxlRW50cnkocmVtb3RlRW50cnk6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBpZiAoY29udGFpbmVyTWFwW3JlbW90ZUVudHJ5XSkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuICByZXR1cm4gYXdhaXQgaW1wb3J0KC8qIHdlYnBhY2tJZ25vcmU6dHJ1ZSAqLyByZW1vdGVFbnRyeSkudGhlbihcbiAgICAoY29udGFpbmVyKSA9PiB7XG4gICAgICBpbml0UmVtb3RlKGNvbnRhaW5lciwgcmVtb3RlRW50cnkpO1xuICAgICAgY29udGFpbmVyTWFwW3JlbW90ZUVudHJ5XSA9IGNvbnRhaW5lcjtcbiAgICB9XG4gICk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGxvYWRSZW1vdGVTY3JpcHRFbnRyeShcbiAgcmVtb3RlRW50cnk6IHN0cmluZyxcbiAgcmVtb3RlTmFtZTogc3RyaW5nXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAvLyBJcyByZW1vdGVFbnRyeSBhbHJlYWR5IGxvYWRlZD9cbiAgICBpZiAoY29udGFpbmVyTWFwW3JlbW90ZU5hbWVdKSB7XG4gICAgICByZXNvbHZlKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgc2NyaXB0LnNyYyA9IHJlbW90ZUVudHJ5O1xuXG4gICAgc2NyaXB0Lm9uZXJyb3IgPSByZWplY3Q7XG5cbiAgICBzY3JpcHQub25sb2FkID0gKCkgPT4ge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gd2luZG93W3JlbW90ZU5hbWVdIGFzIENvbnRhaW5lcjtcbiAgICAgIGluaXRSZW1vdGUoY29udGFpbmVyLCByZW1vdGVOYW1lKTtcbiAgICAgIGNvbnRhaW5lck1hcFtyZW1vdGVOYW1lXSA9IGNvbnRhaW5lcjtcbiAgICAgIHJlc29sdmUoKTtcbiAgICB9O1xuXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICB9KTtcbn1cblxuZXhwb3J0IHR5cGUgTG9hZFJlbW90ZU1vZHVsZU9wdGlvbnMgPVxuICB8IExvYWRSZW1vdGVNb2R1bGVTY3JpcHRPcHRpb25zXG4gIHwgTG9hZFJlbW90ZU1vZHVsZUVzbU9wdGlvbnNcbiAgfCBMb2FkUmVtb3RlTW9kdWxlTWFuaWZlc3RPcHRpb25zO1xuXG5leHBvcnQgdHlwZSBMb2FkUmVtb3RlTW9kdWxlU2NyaXB0T3B0aW9ucyA9IHtcbiAgdHlwZT86ICdzY3JpcHQnO1xuICByZW1vdGVFbnRyeT86IHN0cmluZztcbiAgcmVtb3RlTmFtZTogc3RyaW5nO1xuICBleHBvc2VkTW9kdWxlOiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBMb2FkUmVtb3RlTW9kdWxlRXNtT3B0aW9ucyA9IHtcbiAgdHlwZTogJ21vZHVsZSc7XG4gIHJlbW90ZUVudHJ5OiBzdHJpbmc7XG4gIGV4cG9zZWRNb2R1bGU6IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIExvYWRSZW1vdGVNb2R1bGVNYW5pZmVzdE9wdGlvbnMgPSB7XG4gIHR5cGU6ICdtYW5pZmVzdCc7XG4gIHJlbW90ZU5hbWU6IHN0cmluZztcbiAgZXhwb3NlZE1vZHVsZTogc3RyaW5nO1xufTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2FkUmVtb3RlTW9kdWxlPFQgPSBhbnk+KHJlbW90ZU5hbWU6IHN0cmluZywgZXhwb3NlZE1vZHVsZTogc3RyaW5nKTogUHJvbWlzZTxUPjtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2FkUmVtb3RlTW9kdWxlPFQgPSBhbnk+KG9wdGlvbnM6IExvYWRSZW1vdGVNb2R1bGVPcHRpb25zKTogUHJvbWlzZTxUPlxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvYWRSZW1vdGVNb2R1bGU8VCA9IGFueT4oXG4gIG9wdGlvbnNPclJlbW90ZU5hbWU6IExvYWRSZW1vdGVNb2R1bGVPcHRpb25zIHwgc3RyaW5nLFxuICBleHBvc2VkTW9kdWxlPzogc3RyaW5nXG4pOiBQcm9taXNlPFQ+IHtcbiAgbGV0IGxvYWRSZW1vdGVFbnRyeU9wdGlvbnM6IExvYWRSZW1vdGVFbnRyeU9wdGlvbnM7XG4gIGxldCBrZXk6IHN0cmluZztcbiAgbGV0IHJlbW90ZUVudHJ5OiBzdHJpbmc7XG4gIGxldCBvcHRpb25zOiBMb2FkUmVtb3RlTW9kdWxlT3B0aW9ucztcblxuICBpZiAodHlwZW9mIG9wdGlvbnNPclJlbW90ZU5hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgb3B0aW9ucyA9IHtcbiAgICAgIHR5cGU6ICdtYW5pZmVzdCcsXG4gICAgICByZW1vdGVOYW1lOiBvcHRpb25zT3JSZW1vdGVOYW1lLFxuICAgICAgZXhwb3NlZE1vZHVsZTogZXhwb3NlZE1vZHVsZVxuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICBvcHRpb25zID0gb3B0aW9uc09yUmVtb3RlTmFtZTtcbiAgfVxuXG4gIC8vIFRvIHN1cHBvcnQgbGVnYWN5IEFQSSAoPCBuZyAxMylcbiAgaWYgKCFvcHRpb25zLnR5cGUpIHtcbiAgICBjb25zdCBoYXNNYW5pZmVzdCA9IE9iamVjdC5rZXlzKGNvbmZpZykubGVuZ3RoID4gMDtcbiAgICBvcHRpb25zLnR5cGUgPSBoYXNNYW5pZmVzdCA/ICdtYW5pZmVzdCcgOiAnc2NyaXB0JztcbiAgfVxuXG4gIGlmIChvcHRpb25zLnR5cGUgPT09ICdtYW5pZmVzdCcpIHtcbiAgICBjb25zdCBtYW5pZmVzdEVudHJ5ID0gY29uZmlnW29wdGlvbnMucmVtb3RlTmFtZV07XG4gICAgaWYgKCFtYW5pZmVzdEVudHJ5KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01hbmlmZXN0IGRvZXMgbm90IGNvbnRhaW4gJyArIG9wdGlvbnMucmVtb3RlTmFtZSk7XG4gICAgfVxuICAgIG9wdGlvbnMgPSB7XG4gICAgICB0eXBlOiBtYW5pZmVzdEVudHJ5LnR5cGUsXG4gICAgICBleHBvc2VkTW9kdWxlOiBvcHRpb25zLmV4cG9zZWRNb2R1bGUsXG4gICAgICByZW1vdGVFbnRyeTogbWFuaWZlc3RFbnRyeS5yZW1vdGVFbnRyeSxcbiAgICAgIHJlbW90ZU5hbWU6XG4gICAgICAgIG1hbmlmZXN0RW50cnkudHlwZSA9PT0gJ3NjcmlwdCcgPyBvcHRpb25zLnJlbW90ZU5hbWUgOiB1bmRlZmluZWQsXG4gICAgfTtcbiAgICByZW1vdGVFbnRyeSA9IG1hbmlmZXN0RW50cnkucmVtb3RlRW50cnk7XG4gIH0gZWxzZSB7XG4gICAgcmVtb3RlRW50cnkgPSBvcHRpb25zLnJlbW90ZUVudHJ5O1xuICB9XG5cbiAgaWYgKG9wdGlvbnMudHlwZSA9PT0gJ3NjcmlwdCcpIHtcbiAgICBsb2FkUmVtb3RlRW50cnlPcHRpb25zID0ge1xuICAgICAgdHlwZTogJ3NjcmlwdCcsXG4gICAgICByZW1vdGVFbnRyeTogb3B0aW9ucy5yZW1vdGVFbnRyeSxcbiAgICAgIHJlbW90ZU5hbWU6IG9wdGlvbnMucmVtb3RlTmFtZSxcbiAgICB9O1xuICAgIGtleSA9IG9wdGlvbnMucmVtb3RlTmFtZTtcbiAgfSBlbHNlIGlmIChvcHRpb25zLnR5cGUgPT09ICdtb2R1bGUnKSB7XG4gICAgbG9hZFJlbW90ZUVudHJ5T3B0aW9ucyA9IHtcbiAgICAgIHR5cGU6ICdtb2R1bGUnLFxuICAgICAgcmVtb3RlRW50cnk6IG9wdGlvbnMucmVtb3RlRW50cnksXG4gICAgfTtcbiAgICBrZXkgPSBvcHRpb25zLnJlbW90ZUVudHJ5O1xuICB9XG5cbiAgaWYgKHJlbW90ZUVudHJ5KSB7XG4gICAgYXdhaXQgbG9hZFJlbW90ZUVudHJ5KGxvYWRSZW1vdGVFbnRyeU9wdGlvbnMpO1xuICB9XG5cbiAgcmV0dXJuIGF3YWl0IGxvb2t1cEV4cG9zZWRNb2R1bGU8VD4oa2V5LCBvcHRpb25zLmV4cG9zZWRNb2R1bGUpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2V0TWFuaWZlc3QoXG4gIG1hbmlmZXN0OiBNYW5pZmVzdEZpbGUsXG4gIHNraXBSZW1vdGVFbnRyaWVzID0gZmFsc2Vcbikge1xuICBjb25maWcgPSBwYXJzZUNvbmZpZyhtYW5pZmVzdCk7XG5cbiAgaWYgKCFza2lwUmVtb3RlRW50cmllcykge1xuICAgIGF3YWl0IGxvYWRSZW1vdGVFbnRyaWVzKCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1hbmlmZXN0PFQgZXh0ZW5kcyBNYW5pZmVzdD4oKTogVCB7XG4gIHJldHVybiBjb25maWcgYXMgVDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGluaXRGZWRlcmF0aW9uKG1hbmlmZXN0OiBzdHJpbmcgfCBNYW5pZmVzdEZpbGUsIHNraXBSZW1vdGVFbnRyaWVzID0gZmFsc2UpOiBQcm9taXNlPHZvaWQ+IHtcbiAgaWYgKHR5cGVvZiBtYW5pZmVzdCA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gbG9hZE1hbmlmZXN0KG1hbmlmZXN0LCBza2lwUmVtb3RlRW50cmllcyk7XG4gIH1cbiAgZWxzZSB7XG4gICAgcmV0dXJuIHNldE1hbmlmZXN0KG1hbmlmZXN0LCBza2lwUmVtb3RlRW50cmllcyk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvYWRNYW5pZmVzdChcbiAgY29uZmlnRmlsZTogc3RyaW5nLFxuICBza2lwUmVtb3RlRW50cmllcyA9IGZhbHNlXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZmV0Y2goY29uZmlnRmlsZSk7XG5cbiAgaWYgKCFyZXN1bHQub2spIHtcbiAgICB0aHJvdyBFcnJvcignY291bGQgbm90IGxvYWQgY29uZmlnRmlsZTogJyArIGNvbmZpZ0ZpbGUpO1xuICB9XG5cbiAgY29uZmlnID0gcGFyc2VDb25maWcoYXdhaXQgcmVzdWx0Lmpzb24oKSk7XG5cbiAgaWYgKCFza2lwUmVtb3RlRW50cmllcykge1xuICAgIGF3YWl0IGxvYWRSZW1vdGVFbnRyaWVzKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VDb25maWcoY29uZmlnOiBNYW5pZmVzdEZpbGUpOiBNYW5pZmVzdCB7XG4gIGNvbnN0IHJlc3VsdDogTWFuaWZlc3QgPSB7fTtcbiAgZm9yIChjb25zdCBrZXkgaW4gY29uZmlnKSB7XG4gICAgY29uc3QgdmFsdWUgPSBjb25maWdba2V5XTtcblxuICAgIGxldCBlbnRyeTogUmVtb3RlQ29uZmlnO1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbnRyeSA9IHtcbiAgICAgICAgcmVtb3RlRW50cnk6IHZhbHVlLFxuICAgICAgICB0eXBlOiAnbW9kdWxlJyxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGVudHJ5ID0ge1xuICAgICAgICAuLi52YWx1ZSxcbiAgICAgICAgdHlwZTogdmFsdWUudHlwZSB8fCAnbW9kdWxlJyxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmVzdWx0W2tleV0gPSBlbnRyeTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5hc3luYyBmdW5jdGlvbiBsb2FkUmVtb3RlRW50cmllcygpIHtcbiAgY29uc3QgcHJvbWlzZXM6IFByb21pc2U8dm9pZD5bXSA9IFtdO1xuXG4gIGZvciAoY29uc3Qga2V5IGluIGNvbmZpZykge1xuICAgIGNvbnN0IGVudHJ5ID0gY29uZmlnW2tleV07XG5cbiAgICBpZiAoZW50cnkudHlwZSA9PT0gJ21vZHVsZScpIHtcbiAgICAgIHByb21pc2VzLnB1c2goXG4gICAgICAgIGxvYWRSZW1vdGVFbnRyeSh7IHR5cGU6ICdtb2R1bGUnLCByZW1vdGVFbnRyeTogZW50cnkucmVtb3RlRW50cnkgfSlcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb21pc2VzLnB1c2goXG4gICAgICAgIGxvYWRSZW1vdGVFbnRyeSh7XG4gICAgICAgICAgdHlwZTogJ3NjcmlwdCcsXG4gICAgICAgICAgcmVtb3RlRW50cnk6IGVudHJ5LnJlbW90ZUVudHJ5LFxuICAgICAgICAgIHJlbW90ZU5hbWU6IGtleSxcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufVxuIl19