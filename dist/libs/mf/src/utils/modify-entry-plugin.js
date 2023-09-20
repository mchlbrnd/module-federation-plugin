"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModifyEntryPlugin = void 0;
const tslib_1 = require("tslib");
const PLUGIN_NAME = 'modify-entry-plugin';
class ModifyEntryPlugin {
    constructor(config) {
        this.config = config;
    }
    apply(compiler) {
        compiler.hooks.afterEnvironment.tap(PLUGIN_NAME, () => {
            const webpackOptions = compiler.options;
            const entry = typeof webpackOptions.entry === 'function'
                ? webpackOptions.entry()
                : webpackOptions.entry;
            webpackOptions.entry = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const entries = yield entry;
                const mergeEntry = (keyFn, key) => [
                    ...(keyFn(this.config[key]) || []),
                    ...(keyFn(entries[key]) || []),
                ];
                const cfgOrRemove = (objFn, valueFn, key) => {
                    const values = mergeEntry(valueFn, key);
                    return values.length > 0 ? objFn(values) : {};
                };
                Object.keys(this.config).forEach((key) => {
                    entries[key] = Object.assign(Object.assign({}, cfgOrRemove((v) => ({ import: v }), (c) => c.import, key)), cfgOrRemove((v) => ({ dependOn: v }), (c) => c.dependOn, key));
                });
                return entries;
            });
        });
    }
}
exports.ModifyEntryPlugin = ModifyEntryPlugin;
//# sourceMappingURL=modify-entry-plugin.js.map