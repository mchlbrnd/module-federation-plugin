"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const rxjs_1 = require("rxjs");
const schematic_1 = require("../mf/schematic");
function bootAsync(options) {
    return function (tree) {
        var _a, _b, _c;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const workspaceFileName = (0, schematic_1.getWorkspaceFileName)(tree);
            const workspace = JSON.parse(tree.read(workspaceFileName).toString('utf8'));
            if (!options.project) {
                options.project = workspace.defaultProject;
            }
            if (!options.project) {
                throw new Error(`No default project found. Please specifiy a project name!`);
            }
            const projectName = options.project;
            const projectConfig = workspace.projects[projectName];
            if (!((_c = (_b = (_a = projectConfig === null || projectConfig === void 0 ? void 0 : projectConfig.architect) === null || _a === void 0 ? void 0 : _a.build) === null || _b === void 0 ? void 0 : _b.options) === null || _c === void 0 ? void 0 : _c.main)) {
                throw new Error(`architect.build.options.main not found for project ` + projectName);
            }
            const currentMain = projectConfig.architect.build.options.main;
            const newMainFile = options.async ? 'main.ts' : 'bootstrap.ts';
            const newMain = path
                .join(path.dirname(currentMain), newMainFile)
                .replace(/\\/g, '/');
            projectConfig.architect.build.options.main = newMain;
            tree.overwrite(workspaceFileName, JSON.stringify(workspace, null, 2));
            return (0, rxjs_1.noop)();
        });
    };
}
exports.default = bootAsync;
//# sourceMappingURL=schematic.js.map