import { Router, UrlMatcher } from '@angular/router';
export declare function startsWith(prefix: string): UrlMatcher;
export declare function endsWith(prefix: string): UrlMatcher;
export declare function connectRouter(router: Router, useHash?: boolean): void;
