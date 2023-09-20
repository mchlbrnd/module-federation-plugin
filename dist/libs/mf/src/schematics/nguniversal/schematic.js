"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const schematics_1 = require("@angular-devkit/schematics");
const schematic_1 = require("../mf/schematic");
function nguniversal(options) {
    return function (tree) {
        var _a;
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
            const projectSourceRoot = projectConfig.sourceRoot;
            if (!((_a = projectConfig === null || projectConfig === void 0 ? void 0 : projectConfig.architect) === null || _a === void 0 ? void 0 : _a.server)) {
                console.error('No server target found. Did you add Angular Universal? Try ng add @nguniversal/common');
            }
            const ssrMappings = (0, schematic_1.generateSsrMappings)(workspace, projectName);
            tree.overwrite(workspaceFileName, JSON.stringify(workspace, null, '\t'));
            return (0, schematics_1.chain)([
                (0, schematic_1.adjustSSR)(projectSourceRoot, ssrMappings),
                (0, schematics_1.externalSchematic)('ngx-build-plus', 'ng-add', {
                    project: options.project,
                }),
            ]);
        });
    };
}
exports.default = nguniversal;
//# sourceMappingURL=schematic.js.map