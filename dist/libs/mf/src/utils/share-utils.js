"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.share = exports.setInferVersion = exports.shareAll = exports.findRootTsConfigJson = exports.DEFAULT_SECONARIES_SKIP_LIST = exports.DEFAULT_SKIP_LIST = void 0;
const path = require("path");
const fs = require("fs");
const process_1 = require("process");
let inferVersion = false;
exports.DEFAULT_SKIP_LIST = [
    '@softarc/native-federation-runtime',
    '@softarc/native-federation-core',
    '@softarc/native-federation',
    '@angular-architects/module-federation',
    '@angular-architects/module-federation-runtime',
    'tslib',
    'zone.js',
];
exports.DEFAULT_SECONARIES_SKIP_LIST = [
    '@angular/router/upgrade',
    '@angular/common/upgrade',
];
function findRootTsConfigJson() {
    const packageJson = findPackageJson((0, process_1.cwd)());
    const projectRoot = path.dirname(packageJson);
    const tsConfigBaseJson = path.join(projectRoot, 'tsconfig.base.json');
    const tsConfigJson = path.join(projectRoot, 'tsconfig.json');
    if (fs.existsSync(tsConfigBaseJson)) {
        return tsConfigBaseJson;
    }
    else if (fs.existsSync(tsConfigJson)) {
        return tsConfigJson;
    }
    throw new Error('Neither a tsconfig.json nor a tsconfig.base.json was found');
}
exports.findRootTsConfigJson = findRootTsConfigJson;
function findPackageJson(folder) {
    while (!fs.existsSync(path.join(folder, 'package.json')) &&
        path.dirname(folder) !== folder) {
        folder = path.dirname(folder);
    }
    const filePath = path.join(folder, 'package.json');
    if (fs.existsSync(filePath)) {
        return filePath;
    }
    throw new Error('no package.json found. Searched the following folder and all parents: ' +
        folder);
}
function readVersionMap(packagePath) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const json = require(packagePath);
    const versions = Object.assign({}, json['dependencies']);
    return versions;
}
function lookupVersion(key, versions) {
    const parts = key.split('/');
    if (parts.length >= 2 && parts[0].startsWith('@')) {
        key = parts[0] + '/' + parts[1];
    }
    else {
        key = parts[0];
    }
    if (key.toLowerCase() === '@angular-architects/module-federation-runtime') {
        key = '@angular-architects/module-federation';
    }
    if (!versions[key]) {
        throw new Error(`Shared Dependency ${key} has requiredVersion:'auto'. However, this dependency is not found in your package.json`);
    }
    return versions[key];
}
function _findSecondaries(libPath, excludes, shareObject, acc) {
    const files = fs.readdirSync(libPath);
    const dirs = files
        .map((f) => path.join(libPath, f))
        .filter((f) => fs.lstatSync(f).isDirectory() && f !== 'node_modules');
    const secondaries = dirs.filter((d) => fs.existsSync(path.join(d, 'package.json')));
    for (const s of secondaries) {
        const secondaryLibName = s
            .replace(/\\/g, '/')
            .replace(/^.*node_modules[/]/, '');
        if (excludes.includes(secondaryLibName)) {
            continue;
        }
        acc[secondaryLibName] = Object.assign({}, shareObject);
        _findSecondaries(s, excludes, shareObject, acc);
    }
}
function findSecondaries(libPath, excludes, shareObject) {
    const acc = {};
    _findSecondaries(libPath, excludes, shareObject, acc);
    return acc;
}
function getSecondaries(includeSecondaries, packagePath, key, shareObject, exclude = [...exports.DEFAULT_SECONARIES_SKIP_LIST]) {
    if (typeof includeSecondaries === 'object') {
        if (Array.isArray(includeSecondaries.skip)) {
            exclude = includeSecondaries.skip;
        }
        else if (typeof includeSecondaries.skip === 'string') {
            exclude = [includeSecondaries.skip];
        }
    }
    const libPath = path.join(path.dirname(packagePath), 'node_modules', key);
    if (!fs.existsSync(libPath)) {
        return {};
    }
    const configured = readConfiguredSecondaries(key, libPath, exclude, shareObject);
    if (configured) {
        return configured;
    }
    // Fallback: Search folders
    const secondaries = findSecondaries(libPath, exclude, shareObject);
    return secondaries;
}
function readConfiguredSecondaries(parent, libPath, exclude, shareObject) {
    const libPackageJson = path.join(libPath, 'package.json');
    if (!fs.existsSync(libPackageJson)) {
        return null;
    }
    const packageJson = JSON.parse(fs.readFileSync(libPackageJson, 'utf-8'));
    const exports = packageJson['exports'];
    if (!exports) {
        return null;
    }
    const keys = Object.keys(exports).filter((key) => key != '.' &&
        key != './package.json' &&
        !key.endsWith('*') &&
        (exports[key]['default'] || typeof exports[key] === 'string'));
    const result = {};
    for (const key of keys) {
        // const relPath = exports[key]['default'];
        const secondaryName = path.join(parent, key).replace(/\\/g, '/');
        if (exclude.includes(secondaryName)) {
            continue;
        }
        result[secondaryName] = Object.assign({}, shareObject);
    }
    return result;
}
function shareAll(config = {}, skip = [...exports.DEFAULT_SKIP_LIST, ...exports.DEFAULT_SECONARIES_SKIP_LIST], packageJsonPath = '') {
    if (!packageJsonPath) {
        packageJsonPath = (0, process_1.cwd)();
    }
    const packagePath = findPackageJson(packageJsonPath);
    const versions = readVersionMap(packagePath);
    const share = {};
    for (const key in versions) {
        if (skip.includes(key)) {
            continue;
        }
        share[key] = Object.assign({}, config);
    }
    return module.exports.share(share, packageJsonPath, skip);
}
exports.shareAll = shareAll;
function setInferVersion(infer) {
    inferVersion = infer;
}
exports.setInferVersion = setInferVersion;
function share(shareObjects, packageJsonPath = '', skip = exports.DEFAULT_SECONARIES_SKIP_LIST) {
    if (!packageJsonPath) {
        packageJsonPath = (0, process_1.cwd)();
    }
    const packagePath = findPackageJson(packageJsonPath);
    const versions = readVersionMap(packagePath);
    const result = {};
    let includeSecondaries;
    for (const key in shareObjects) {
        includeSecondaries = false;
        const shareObject = shareObjects[key];
        if (shareObject.requiredVersion === 'auto' ||
            (inferVersion && typeof shareObject.requiredVersion === 'undefined')) {
            const version = lookupVersion(key, versions);
            shareObject.requiredVersion = version;
            shareObject.version = version.replace(/^\D*/, '');
        }
        if (typeof shareObject.includeSecondaries === 'undefined') {
            shareObject.includeSecondaries = true;
        }
        if (shareObject.includeSecondaries) {
            includeSecondaries = shareObject.includeSecondaries;
            delete shareObject.includeSecondaries;
        }
        result[key] = shareObject;
        if (includeSecondaries) {
            const secondaries = getSecondaries(includeSecondaries, packagePath, key, shareObject, skip);
            addSecondaries(secondaries, result);
        }
    }
    return result;
}
exports.share = share;
function addSecondaries(secondaries, result) {
    for (const key in secondaries) {
        result[key] = secondaries[key];
    }
}
//# sourceMappingURL=share-utils.js.map