import { AfterContentInit, ElementRef, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadRemoteModuleOptions } from '@angular-architects/module-federation';
import * as i0 from "@angular/core";
export declare type WebComponentWrapperOptions = LoadRemoteModuleOptions & {
    elementName: string;
};
export declare class WebComponentWrapper implements AfterContentInit, OnChanges {
    private route;
    vc: ElementRef;
    options: WebComponentWrapperOptions;
    props: {
        [prop: string]: unknown;
    };
    events: {
        [event: string]: (event: Event) => void;
    };
    element: HTMLElement;
    constructor(route: ActivatedRoute);
    ngOnChanges(): void;
    private populateProps;
    private setupEvents;
    ngAfterContentInit(): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<WebComponentWrapper, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WebComponentWrapper, "mft-wc-wrapper", never, { "options": "options"; "props": "props"; "events": "events"; }, {}, never, never, false>;
}
