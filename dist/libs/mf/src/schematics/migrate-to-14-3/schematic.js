"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = void 0;
const tslib_1 = require("tslib");
const dependencies_1 = require("@schematics/angular/utility/dependencies");
const tasks_1 = require("@angular-devkit/schematics/tasks");
function index() {
    return function (tree, context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            (0, dependencies_1.addPackageJsonDependency)(tree, {
                name: 'ngx-build-plus',
                type: dependencies_1.NodeDependencyType.Dev,
                version: '^14.0.0',
                overwrite: true,
            });
            context.addTask(new tasks_1.NodePackageInstallTask());
        });
    };
}
exports.index = index;
//# sourceMappingURL=schematic.js.map