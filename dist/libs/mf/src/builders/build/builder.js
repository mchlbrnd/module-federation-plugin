"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runBuilder = void 0;
const architect_1 = require("@angular-devkit/architect");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
function runBuilder(options, context) {
    return (0, rxjs_1.of)({ success: true }).pipe((0, operators_1.tap)(() => {
        context.logger.info('Builder ran for build');
    }));
}
exports.runBuilder = runBuilder;
exports.default = (0, architect_1.createBuilder)(runBuilder);
//# sourceMappingURL=builder.js.map