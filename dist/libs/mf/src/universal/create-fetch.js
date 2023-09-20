"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFetch = void 0;
// import { AbortablePromise } from 'jsdom';
const fs_1 = require("fs");
const path_1 = require("path");
const fetch = require("node-fetch");
function createFetch(mappings = {}) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return function (url, options) {
        if (!url.endsWith('.js')) {
            return null;
        }
        let path = url.replace(this.baseUrl, this.publicPath);
        for (const prefix in mappings) {
            if (path.startsWith(prefix)) {
                path = path.replace(prefix, mappings[prefix]);
            }
        }
        if (this.fileCache.has(path)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const filePromise = Promise.resolve(this.fileCache.get(path));
            filePromise.abort = () => undefined;
            return filePromise;
        }
        let read;
        if (path.match(/^http(s)?:\/\//i)) {
            // console.log('http', path);
            read = fetch(path).then((res) => res.text());
        }
        else {
            path = (0, path_1.normalize)(path);
            // console.log('file', path);
            read = fs_1.promises.readFile(path);
        }
        const promise = read.then((content) => {
            this.fileCache.set(path, content);
            return content;
        });
        promise.abort = () => undefined;
        return promise;
    };
}
exports.createFetch = createFetch;
//# sourceMappingURL=create-fetch.js.map