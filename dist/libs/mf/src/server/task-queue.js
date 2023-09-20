"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enqueuTask = void 0;
const queue = [];
// tslint:disable-next-line: no-shadowed-variable
function peek(queue) {
    if (queue.length === 0) {
        return null;
    }
    return queue[queue.length - 1];
}
function startNext() {
    if (queue.length === 0) {
        return;
    }
    queue.pop();
    const task = peek(queue);
    if (task) {
        task(startNext);
    }
}
function enqueuTask(task) {
    if (queue.length === 0) {
        queue.unshift(task);
        task(startNext);
    }
    else {
        queue.unshift(task);
    }
}
exports.enqueuTask = enqueuTask;
//# sourceMappingURL=task-queue.js.map