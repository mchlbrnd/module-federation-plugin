export declare type AbortablePromise<T> = Promise<T> & {
    abort: () => unknown;
};
export declare type StringDict = {
    [key: string]: string;
};
export declare function createFetch(mappings?: StringDict): (url: string, options: unknown) => AbortablePromise<Buffer>;
