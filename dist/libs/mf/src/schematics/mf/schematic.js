"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSsrMappings = exports.getWorkspaceFileName = exports.adjustSSR = exports.add = void 0;
const tslib_1 = require("tslib");
const schematics_1 = require("@angular-devkit/schematics");
const tasks_1 = require("@angular-devkit/schematics/tasks");
const core_1 = require("@angular-devkit/core");
const json5 = require("json5");
const semver = require("semver");
// import { spawn } from 'cross-spawn';
const path = require("path");
const create_config_1 = require("../../utils/create-config");
const prod_config_1 = require("./prod-config");
const dependencies_1 = require("@schematics/angular/utility/dependencies");
function add(options) {
    return config(options);
}
exports.add = add;
function adjustSSR(sourceRoot, ssrMappings) {
    return function (tree, context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const server = path.join(sourceRoot, 'server.ts');
            if (!tree.exists(server)) {
                return;
            }
            let content = tree.read(server).toString('utf-8');
            const imports = `import { CustomResourceLoader } from '@nguniversal/common/clover/server/src/custom-resource-loader';
import { createFetch } from '@angular-architects/module-federation/nguniversal';
`;
            content = imports + content;
            content = content.replace('const ssrEngine = new Engine();', `
// Without mappings, remotes are loaded via HTTP
const mappings = ${ssrMappings};

// Monkey Patching Angular Universal for Module Federation
CustomResourceLoader.prototype.fetch = createFetch(mappings);

const ssrEngine = new Engine();
`);
            // Compensate for issue with version 12.0.0
            content = content.replace('const HOST = `http://localhost:${PORT}`;', 'const HOST = `localhost:${PORT}`;');
            tree.overwrite(server, content);
        });
    };
}
exports.adjustSSR = adjustSSR;
function makeMainAsync(main, options) {
    return function (tree, context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const mainPath = path.dirname(main);
            const bootstrapName = path.join(mainPath, 'bootstrap.ts');
            if (tree.exists(bootstrapName)) {
                console.info(`${bootstrapName} already exists.`);
                return;
            }
            const mainContent = tree.read(main);
            tree.create(bootstrapName, mainContent);
            let newMainContent = '';
            if (options.type === 'dynamic-host') {
                newMainContent = `import { initFederation } from '@angular-architects/module-federation';

initFederation('/assets/mf.manifest.json')
  .catch(err => console.error(err))
  .then(_ => import('./bootstrap'))
  .catch(err => console.error(err));
`;
            }
            else {
                newMainContent =
                    "import('./bootstrap')\n\t.catch(err => console.error(err));\n";
            }
            tree.overwrite(main, newMainContent);
        });
    };
}
function getWorkspaceFileName(tree) {
    if (tree.exists('angular.json')) {
        return 'angular.json';
    }
    if (tree.exists('workspace.json')) {
        return 'workspace.json';
    }
    throw new Error("angular.json or workspace.json expected! Did you call this in your project's root?");
}
exports.getWorkspaceFileName = getWorkspaceFileName;
function updatePackageJson(tree) {
    const packageJson = JSON.parse(tree.read('package.json').toString('utf-8'));
    if (!packageJson.scripts) {
        packageJson.scripts = {};
    }
    if (!packageJson.scripts['run:all']) {
        packageJson.scripts['run:all'] =
            'node node_modules/@angular-architects/module-federation/src/server/mf-dev-server.js';
    }
    tree.overwrite('package.json', JSON.stringify(packageJson, null, 2));
}
function getWebpackConfigValue(nx, path) {
    if (!nx) {
        return path;
    }
    return { path };
}
function nxBuildersAvailable(tree) {
    var _a, _b, _c;
    if (!tree.exists('nx.json'))
        return false;
    const packageJson = JSON.parse(tree.read('package.json').toString('utf-8'));
    const version = (_b = (_a = packageJson === null || packageJson === void 0 ? void 0 : packageJson.devDependencies) === null || _a === void 0 ? void 0 : _a['@nrwl/workspace']) !== null && _b !== void 0 ? _b : (_c = packageJson === null || packageJson === void 0 ? void 0 : packageJson.dependencies) === null || _c === void 0 ? void 0 : _c['@nrwl/workspace'];
    if (!version)
        return false;
    const minVersion = semver.minVersion(version).raw;
    return semver.satisfies(minVersion, '>=12.9.0');
}
function infereNxBuilderNames(tree) {
    var _a, _b, _c;
    const defaultResult = {
        dev: '@nrwl/angular:webpack-dev-server',
        prod: '@nrwl/angular:webpack-browser',
    };
    const fallbackResult = {
        dev: '@nrwl/angular:webpack-server',
        prod: '@nrwl/angular:webpack-browser',
    };
    if (!tree.exists('nx.json'))
        return defaultResult;
    const packageJson = JSON.parse(tree.read('package.json').toString('utf-8'));
    const version = (_b = (_a = packageJson === null || packageJson === void 0 ? void 0 : packageJson.devDependencies) === null || _a === void 0 ? void 0 : _a['@nrwl/angular']) !== null && _b !== void 0 ? _b : (_c = packageJson === null || packageJson === void 0 ? void 0 : packageJson.dependencies) === null || _c === void 0 ? void 0 : _c['@nrwl/angular'];
    if (!version)
        defaultResult;
    const minVersion = semver.minVersion(version).raw;
    if (semver.satisfies(minVersion, '>=15.0.0')) {
        return defaultResult;
    }
    else {
        return fallbackResult;
    }
}
function generateWebpackConfig(remoteMap, projectRoot, projectSourceRoot, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const tmpl = (0, schematics_1.url)('./files');
        const applied = (0, schematics_1.apply)(tmpl, [
            (0, schematics_1.template)(Object.assign(Object.assign({ projectRoot,
                projectSourceRoot,
                remoteMap }, options), { tmpl: '' })),
            (0, schematics_1.move)(projectRoot),
        ]);
        return (0, schematics_1.mergeWith)(applied);
    });
}
function config(options) {
    return function (tree, context) {
        var _a, _b, _c, _d, _e, _f;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const workspaceFileName = getWorkspaceFileName(tree);
            const workspace = JSON.parse(tree.read(workspaceFileName).toString('utf8'));
            if (!options.project) {
                options.project = workspace.defaultProject;
            }
            if (!options.project) {
                throw new Error(`No default project found. Please specifiy a project name!`);
            }
            const projectName = options.project;
            const projectConfig = workspace.projects[projectName];
            if (!projectConfig) {
                throw new Error(`Project ${projectName} not found!`);
            }
            const projectRoot = (_a = projectConfig.root) === null || _a === void 0 ? void 0 : _a.replace(/\\/g, '/');
            const projectSourceRoot = (_b = projectConfig.sourceRoot) === null || _b === void 0 ? void 0 : _b.replace(/\\/g, '/');
            const configPath = path
                .join(projectRoot, 'webpack.config.js')
                .replace(/\\/g, '/');
            const configProdPath = path
                .join(projectRoot, 'webpack.prod.config.js')
                .replace(/\\/g, '/');
            const manifestPath = path
                .join(projectRoot, 'src/assets/mf.manifest.json')
                .replace(/\\/g, '/');
            const port = parseInt(options.port);
            const main = projectConfig.architect.build.options.main;
            const relWorkspaceRoot = path.relative(projectRoot, '');
            const tsConfigName = tree.exists('tsconfig.base.json')
                ? 'tsconfig.base.json'
                : 'tsconfig.json';
            const relTsConfigPath = path
                .join(relWorkspaceRoot, tsConfigName)
                .replace(/\\/g, '/');
            if (isNaN(port)) {
                throw new Error(`Port must be a number!`);
            }
            const remoteMap = yield generateRemoteMap(workspace, projectName);
            let generateRule = null;
            if (options.type === 'legacy') {
                const remotes = generateRemoteConfig(workspace, projectName);
                const webpackConfig = (0, create_config_1.createConfig)(projectName, remotes, relTsConfigPath, projectRoot, port);
                tree.create(configPath, webpackConfig);
            }
            else {
                generateRule = yield generateWebpackConfig(remoteMap, projectRoot, projectSourceRoot, options);
            }
            tree.create(configProdPath, prod_config_1.prodConfig);
            if (options.type === 'dynamic-host') {
                tree.create(manifestPath, JSON.stringify(remoteMap, null, '\t'));
            }
            if (options.nxBuilders && !nxBuildersAvailable(tree)) {
                console.info('To use Nx builders, make sure you have Nx version 12.9 or higher!');
                options.nxBuilders = false;
            }
            else if (typeof options.nxBuilders === 'undefined') {
                options.nxBuilders = nxBuildersAvailable(tree); // tree.exists('nx.json');
            }
            const nxBuilderNames = infereNxBuilderNames(tree);
            if (options.nxBuilders) {
                console.log('Using Nx builders!');
            }
            const webpackProperty = options.nxBuilders
                ? 'customWebpackConfig'
                : 'extraWebpackConfig';
            const buildBuilder = options.nxBuilders
                ? nxBuilderNames.prod
                : 'ngx-build-plus:browser';
            const serveBuilder = options.nxBuilders
                ? nxBuilderNames.dev
                : 'ngx-build-plus:dev-server';
            if (!((_c = projectConfig === null || projectConfig === void 0 ? void 0 : projectConfig.architect) === null || _c === void 0 ? void 0 : _c.build) || !((_d = projectConfig === null || projectConfig === void 0 ? void 0 : projectConfig.architect) === null || _d === void 0 ? void 0 : _d.serve)) {
                throw new Error(`The project doen't have a build or serve target in angular.json!`);
            }
            if (!projectConfig.architect.build.options) {
                projectConfig.architect.build.options = {};
            }
            if (!projectConfig.architect.serve.options) {
                projectConfig.architect.serve.options = {};
            }
            projectConfig.architect.build.builder = buildBuilder;
            projectConfig.architect.build.options[webpackProperty] =
                getWebpackConfigValue(options.nxBuilders, configPath);
            projectConfig.architect.build.options.commonChunk = false;
            projectConfig.architect.build.configurations.production[webpackProperty] =
                getWebpackConfigValue(options.nxBuilders, configProdPath);
            projectConfig.architect.serve.builder = serveBuilder;
            projectConfig.architect.serve.options.port = port;
            projectConfig.architect.serve.options.publicHost = `http://localhost:${port}`;
            // Only needed for ngx-build-plus
            if (!options.nxBuilders) {
                projectConfig.architect.serve.options[webpackProperty] =
                    getWebpackConfigValue(options.nxBuilders, configPath);
                projectConfig.architect.serve.configurations.production[webpackProperty] =
                    getWebpackConfigValue(options.nxBuilders, configProdPath);
            }
            // We don't change the config for testing anymore to prevent
            // issues with eager bundles and webpack
            // Consequence:
            //    Remotes: No issue
            //    Hosts: Should be tested using an E2E test
            // if (projectConfig?.architect?.test?.options) {
            //   projectConfig.architect.test.options.extraWebpackConfig = configPath;
            // }
            if ((_f = (_e = projectConfig === null || projectConfig === void 0 ? void 0 : projectConfig.architect) === null || _e === void 0 ? void 0 : _e['extract-i18n']) === null || _f === void 0 ? void 0 : _f.options) {
                projectConfig.architect['extract-i18n'].builder =
                    'ngx-build-plus:extract-i18n';
                projectConfig.architect['extract-i18n'].options.extraWebpackConfig =
                    configPath;
            }
            updateTsConfig(tree, tsConfigName);
            const localTsConfig = path.join(projectRoot, 'tsconfig.app.json');
            if (tree.exists(localTsConfig)) {
                updateTsConfig(tree, localTsConfig);
            }
            const ssrMappings = generateSsrMappings(workspace, projectName);
            tree.overwrite(workspaceFileName, JSON.stringify(workspace, null, '\t'));
            updatePackageJson(tree);
            const dep = (0, dependencies_1.getPackageJsonDependency)(tree, 'ngx-build-plus');
            if (!dep || !semver.satisfies(dep.version, '>=15.0.0')) {
                (0, dependencies_1.addPackageJsonDependency)(tree, {
                    name: 'ngx-build-plus',
                    type: dependencies_1.NodeDependencyType.Dev,
                    version: '^15.0.0',
                    overwrite: true,
                });
                context.addTask(new tasks_1.NodePackageInstallTask());
            }
            return (0, schematics_1.chain)([
                ...(generateRule ? [generateRule] : []),
                makeMainAsync(main, options),
                adjustSSR(projectSourceRoot, ssrMappings),
            ]);
        });
    };
}
exports.default = config;
function updateTsConfig(tree, tsConfigName) {
    const tsConfig = json5.parse(tree.read(tsConfigName).toString('utf-8'));
    const target = tsConfig.compilerOptions.target;
    let targetVersion = 2022;
    if (target &&
        target.toLocaleLowerCase().startsWith('es') &&
        target.length > 2) {
        targetVersion = parseInt(target.substring(2));
    }
    if (targetVersion < 2020) {
        tsConfig.compilerOptions.target = 'es2020';
    }
    tree.overwrite(tsConfigName, JSON.stringify(tsConfig, null, 2));
}
function generateRemoteConfig(workspace, projectName) {
    var _a, _b, _c, _d, _e;
    let remotes = '';
    for (const p in workspace.projects) {
        const project = workspace.projects[p];
        const projectType = (_a = project.projectType) !== null && _a !== void 0 ? _a : 'application';
        if (p !== projectName &&
            projectType === 'application' &&
            ((_b = project === null || project === void 0 ? void 0 : project.architect) === null || _b === void 0 ? void 0 : _b.serve) &&
            ((_c = project === null || project === void 0 ? void 0 : project.architect) === null || _c === void 0 ? void 0 : _c.build)) {
            const pPort = (_e = (_d = project.architect.serve.options) === null || _d === void 0 ? void 0 : _d.port) !== null && _e !== void 0 ? _e : 4200;
            remotes += `        //     "${core_1.strings.camelize(p)}": "http://localhost:${pPort}/remoteEntry.js",\n`;
        }
    }
    if (!remotes) {
        remotes =
            '        //     "mfe1": "http://localhost:3000/remoteEntry.js",\n';
    }
    return remotes;
}
function generateRemoteMap(workspace, projectName) {
    var _a, _b, _c, _d, _e;
    const result = {};
    for (const p in workspace.projects) {
        const project = workspace.projects[p];
        const projectType = (_a = project.projectType) !== null && _a !== void 0 ? _a : 'application';
        if (p !== projectName &&
            projectType === 'application' &&
            ((_b = project === null || project === void 0 ? void 0 : project.architect) === null || _b === void 0 ? void 0 : _b.serve) &&
            ((_c = project === null || project === void 0 ? void 0 : project.architect) === null || _c === void 0 ? void 0 : _c.build)) {
            const pPort = (_e = (_d = project.architect.serve.options) === null || _d === void 0 ? void 0 : _d.port) !== null && _e !== void 0 ? _e : 4200;
            result[core_1.strings.camelize(p)] = `http://localhost:${pPort}/remoteEntry.js`;
        }
    }
    if (Object.keys(result).length === 0) {
        result['mfe1'] = `http://localhost:3000/remoteEntry.js`;
    }
    return result;
}
function generateSsrMappings(workspace, projectName) {
    var _a, _b, _c, _d, _e;
    let remotes = '{\n';
    const projectOutPath = workspace.projects[projectName].architect.build.options.outputPath;
    for (const p in workspace.projects) {
        const project = workspace.projects[p];
        const projectType = (_a = project.projectType) !== null && _a !== void 0 ? _a : 'application';
        if (p !== projectName &&
            projectType === 'application' &&
            ((_b = project === null || project === void 0 ? void 0 : project.architect) === null || _b === void 0 ? void 0 : _b.serve) &&
            ((_c = project === null || project === void 0 ? void 0 : project.architect) === null || _c === void 0 ? void 0 : _c.build)) {
            const pPort = (_e = (_d = project.architect.serve.options) === null || _d === void 0 ? void 0 : _d.port) !== null && _e !== void 0 ? _e : 4200;
            const outPath = project.architect.build.options.outputPath;
            const relOutPath = path.relative(projectOutPath, outPath).replace(/\\/g, '/') + '/';
            remotes += `\t// 'http://localhost:${pPort}/': join(__dirname, '${relOutPath}')\n`;
        }
    }
    remotes += '}';
    return remotes;
}
exports.generateSsrMappings = generateSsrMappings;
//# sourceMappingURL=schematic.js.map