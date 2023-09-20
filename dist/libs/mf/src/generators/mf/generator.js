"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const devkit_1 = require("@nrwl/devkit");
const path = require("path");
function normalizeOptions(host, options) {
    const name = (0, devkit_1.names)(options.name).fileName;
    const projectDirectory = options.directory
        ? `${(0, devkit_1.names)(options.directory).fileName}/${name}`
        : name;
    const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
    const projectRoot = `${(0, devkit_1.getWorkspaceLayout)(host).libsDir}/${projectDirectory}`;
    const parsedTags = options.tags
        ? options.tags.split(',').map((s) => s.trim())
        : [];
    return Object.assign(Object.assign({}, options), { projectName,
        projectRoot,
        projectDirectory,
        parsedTags });
}
function addFiles(host, options) {
    const templateOptions = Object.assign(Object.assign(Object.assign({}, options), (0, devkit_1.names)(options.name)), { offsetFromRoot: (0, devkit_1.offsetFromRoot)(options.projectRoot), template: '' });
    (0, devkit_1.generateFiles)(host, path.join(__dirname, 'files'), options.projectRoot, templateOptions);
}
function default_1(host, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const normalizedOptions = normalizeOptions(host, options);
        (0, devkit_1.addProjectConfiguration)(host, normalizedOptions.projectName, {
            root: normalizedOptions.projectRoot,
            projectType: 'library',
            sourceRoot: `${normalizedOptions.projectRoot}/src`,
            targets: {
                build: {
                    executor: '@angular-architects/mf:build',
                },
            },
            tags: normalizedOptions.parsedTags,
        });
        addFiles(host, normalizedOptions);
        yield (0, devkit_1.formatFiles)(host);
    });
}
exports.default = default_1;
//# sourceMappingURL=generator.js.map