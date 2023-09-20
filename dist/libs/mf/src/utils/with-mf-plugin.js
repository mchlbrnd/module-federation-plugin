"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withModuleFederationPlugin = void 0;
const share_utils_1 = require("./share-utils");
const shared_mappings_1 = require("./shared-mappings");
const modify_entry_plugin_1 = require("./modify-entry-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
function withModuleFederationPlugin(config) {
    var _a;
    const sharedMappings = config['sharedMappings'];
    delete config['sharedMappings'];
    const skip = [
        ...share_utils_1.DEFAULT_SKIP_LIST,
        ...share_utils_1.DEFAULT_SECONARIES_SKIP_LIST,
        ...(config['skip'] || [])
    ];
    delete config['skip'];
    if (sharedMappings) {
        sharedMappings.filter(m => !skip.includes(m));
    }
    const mappings = new shared_mappings_1.SharedMappings();
    mappings.register((0, share_utils_1.findRootTsConfigJson)(), sharedMappings);
    setDefaults(config, mappings, skip);
    const modifyEntryPlugin = createModifyEntryPlugin(config);
    const isModule = ((_a = config['library']) === null || _a === void 0 ? void 0 : _a['type']) === 'module';
    // console.log('sharedConfig.modFed', sharedConfig.modFed);
    return Object.assign(Object.assign({ output: {
            publicPath: 'auto',
        }, optimization: {
            runtimeChunk: false,
        }, resolve: {
            alias: Object.assign({}, mappings.getAliases()),
        } }, (isModule
        ? {
            experiments: {
                outputModule: true,
            },
        }
        : {})), { plugins: [
            new ModuleFederationPlugin(config),
            mappings.getPlugin(),
            ...(modifyEntryPlugin ? [modifyEntryPlugin] : []),
        ] });
}
exports.withModuleFederationPlugin = withModuleFederationPlugin;
function setDefaults(config, mappings, skip) {
    if (!config['library']) {
        config['library'] = {
            type: 'module',
        };
    }
    if (!config['filename']) {
        config['filename'] = 'remoteEntry.js';
    }
    if (!config['shared']) {
        config['shared'] = (0, share_utils_1.shareAll)({
            singleton: true,
            strictVersion: true,
            requiredVersion: 'auto',
        }, skip);
    }
    if (typeof config['shared'] === 'object') {
        config['shared'] = Object.assign(Object.assign({}, config['shared']), mappings.getDescriptors());
    }
    if (Array.isArray(config['shared'])) {
        config['shared'] = [...config['shared'], mappings.getDescriptors()];
    }
}
function createModifyEntryPlugin(config) {
    const pinned = [];
    const eager = [];
    for (const key in config['shared']) {
        const entry = config['shared'][key];
        if (entry.pinned) {
            pinned.push(key);
            delete entry.pinned;
        }
        if (entry.eager) {
            eager.push(key);
        }
    }
    const hasPinned = pinned.length > 0;
    const hasEager = eager.length > 0;
    if (hasPinned && config['remotes']) {
        throw new Error([
            'Pinned dependencies in combination with build-time remotes are not allowed. ',
            'Either remove "pinned: true" from all shared dependencies or delete all ',
            'remotes in your webpack config and use runtime remote loading instead.',
        ].join(''));
    }
    const modifyEntryConfig = {};
    let modifyEntryPlugin = null;
    if (hasPinned) {
        modifyEntryConfig['main'] = { import: pinned };
    }
    if (hasEager) {
        modifyEntryConfig['styles'] = { dependOn: ['main'] };
        modifyEntryConfig['polyfills'] = { dependOn: ['main'] };
    }
    if (hasPinned || hasEager) {
        modifyEntryPlugin = new modify_entry_plugin_1.ModifyEntryPlugin(modifyEntryConfig);
    }
    return modifyEntryPlugin;
}
//# sourceMappingURL=with-mf-plugin.js.map