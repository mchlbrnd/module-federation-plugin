"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readProjectInfos = exports.readWorkspaceDef = exports.isWorkspace = void 0;
const fs = require("fs");
const path = require("path");
function getWorkspaceFileName() {
    if (fs.existsSync('angular.json')) {
        return 'angular.json';
    }
    if (fs.existsSync('workspace.json')) {
        return 'workspace.json';
    }
    return null;
}
function isWorkspace() {
    return getWorkspaceFileName() !== null;
}
exports.isWorkspace = isWorkspace;
function readWorkspaceDef() {
    const fileName = getWorkspaceFileName();
    if (!fileName) {
        throw new Error('This is not an Angular workspace!');
    }
    const content = fs.readFileSync(fileName, { encoding: 'utf-8' });
    const nxOrCliWorspaceDef = JSON.parse(content);
    const worspaceDef = toCliWorkspaceDef(nxOrCliWorspaceDef);
    return worspaceDef;
}
exports.readWorkspaceDef = readWorkspaceDef;
function toCliWorkspaceDef(def) {
    const result = { projects: {} };
    for (const key in def.projects) {
        const project = def.projects[key];
        if (typeof project === 'string') {
            const def = path.join(project, 'project.json');
            result.projects[key] = loadProjectDef(def);
        }
        else {
            result.projects[key] = project;
        }
    }
    return result;
}
function readProjectInfos() {
    const workspace = readWorkspaceDef();
    const projectNames = Object.keys(workspace.projects);
    return projectNames.map((name) => {
        var _a, _b, _c, _d, _e, _f;
        return (Object.assign(Object.assign({}, workspace.projects[name]), { name, port: (_c = (_b = (_a = workspace.projects[name].architect) === null || _a === void 0 ? void 0 : _a.serve) === null || _b === void 0 ? void 0 : _b.options) === null || _c === void 0 ? void 0 : _c.port, outputPath: (_f = (_e = (_d = workspace.projects[name].architect) === null || _d === void 0 ? void 0 : _d.build) === null || _e === void 0 ? void 0 : _e.options) === null || _f === void 0 ? void 0 : _f.outputPath }));
    });
}
exports.readProjectInfos = readProjectInfos;
function loadProjectDef(projectDef) {
    try {
        const def = JSON.parse(fs.readFileSync(projectDef, 'utf-8'));
        if (!def.architect) {
            def.architect = def.targets;
        }
        return def;
    }
    catch (_a) {
        throw new Error(`File ${projectDef} not found. Please start this command from your workspace root.`);
    }
}
//# sourceMappingURL=workspace.js.map