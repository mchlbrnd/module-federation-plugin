export declare const packageNamespace = "@angular-architects/module-federation-tools";
export declare function getGlobalStateSlice<T>(): T;
export declare function getGlobalStateSlice<T, R>(selector: (globalState: T) => R): R;
export declare function setGlobalStateSlice<T>(slice: T): T;
