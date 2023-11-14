import { __awaiter } from "tslib";
import { logger } from '../utils/logger.js';
let _buildAdapter = () => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: add logger
    logger.error('Please set a BuildAdapter!');
    return [];
});
export function setBuildAdapter(buildAdapter) {
    _buildAdapter = buildAdapter;
}
export function getBuildAdapter() {
    return _buildAdapter;
}
//# sourceMappingURL=build-adapter.js.map