import * as i0 from '@angular/core';
import { ElementRef, Component, ViewChild, Input, NgModule, PlatformRef, VERSION, enableProdMode, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i1 from '@angular/router';
import { Router } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { platformBrowser } from '@angular/platform-browser';

// eslint-disable-next-line @angular-eslint/component-class-suffix
class WebComponentWrapper {
    constructor(route) {
        this.route = route;
    }
    ngOnChanges() {
        if (!this.element)
            return;
        this.populateProps();
    }
    populateProps() {
        for (const prop in this.props) {
            this.element[prop] = this.props[prop];
        }
    }
    setupEvents() {
        for (const event in this.events) {
            this.element.addEventListener(event, this.events[event]);
        }
    }
    async ngAfterContentInit() {
        const options = this.options ?? this.route.snapshot.data;
        try {
            await loadRemoteModule(options);
            this.element = document.createElement(options.elementName);
            this.populateProps();
            this.setupEvents();
            this.vc.nativeElement.appendChild(this.element);
        }
        catch (error) {
            console.error(error);
        }
    }
}
WebComponentWrapper.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.1.1", ngImport: i0, type: WebComponentWrapper, deps: [{ token: i1.ActivatedRoute }], target: i0.ɵɵFactoryTarget.Component });
WebComponentWrapper.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.1.1", type: WebComponentWrapper, selector: "mft-wc-wrapper", inputs: { options: "options", props: "props", events: "events" }, viewQueries: [{ propertyName: "vc", first: true, predicate: ["vc"], descendants: true, read: ElementRef, static: true }], usesOnChanges: true, ngImport: i0, template: '<div #vc></div>', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.1.1", ngImport: i0, type: WebComponentWrapper, decorators: [{
            type: Component,
            args: [{
                    // eslint-disable-next-line @angular-eslint/component-selector
                    selector: 'mft-wc-wrapper',
                    template: '<div #vc></div>',
                }]
        }], ctorParameters: function () { return [{ type: i1.ActivatedRoute }]; }, propDecorators: { vc: [{
                type: ViewChild,
                args: ['vc', { read: ElementRef, static: true }]
            }], options: [{
                type: Input
            }], props: [{
                type: Input
            }], events: [{
                type: Input
            }] } });

class ModuleFederationToolsModule {
}
ModuleFederationToolsModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.1.1", ngImport: i0, type: ModuleFederationToolsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ModuleFederationToolsModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.1.1", ngImport: i0, type: ModuleFederationToolsModule, declarations: [WebComponentWrapper], imports: [CommonModule], exports: [WebComponentWrapper] });
ModuleFederationToolsModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.1.1", ngImport: i0, type: ModuleFederationToolsModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.1.1", ngImport: i0, type: ModuleFederationToolsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [WebComponentWrapper],
                    exports: [WebComponentWrapper],
                }]
        }] });

const packageNamespace = '@angular-architects/module-federation-tools';
function getGlobalState() {
    const globalState = window;
    globalState[packageNamespace] =
        globalState[packageNamespace] || {};
    return globalState[packageNamespace];
}
function getGlobalStateSlice(selector) {
    const globalState = getGlobalState();
    return selector ? selector(globalState) : globalState;
}
function setGlobalStateSlice(slice) {
    return Object.assign(getGlobalState(), slice);
}

function startsWith(prefix) {
    return (url) => {
        const fullUrl = url.map((u) => u.path).join('/');
        if (fullUrl.startsWith(prefix)) {
            return { consumed: url };
        }
        return null;
    };
}
function endsWith(prefix) {
    return (url) => {
        const fullUrl = url.map((u) => u.path).join('/');
        if (fullUrl.endsWith(prefix)) {
            return { consumed: url };
        }
        return null;
    };
}
function connectRouter(router, useHash = false) {
    let url;
    if (!useHash) {
        url = `${location.pathname.substring(1)}${location.search}`;
        router.navigateByUrl(url);
        window.addEventListener('popstate', () => {
            router.navigateByUrl(url);
        });
    }
    else {
        url = `${location.hash.substring(1)}${location.search}`;
        router.navigateByUrl(url);
        window.addEventListener('hashchange', () => {
            router.navigateByUrl(url);
        });
    }
}

let ngZoneSharing = true;
let platformSharing = true;
let legacyMode = true;
function getMajor(version) {
    const pre = version.match(/\d+/)[0];
    const post = version.match(/-.*/);
    if (!pre) {
        throw new Error('Cound not identify major version: ' + version);
    }
    if (post) {
        return pre + post[0];
    }
    return pre;
}
function getLegacyPlatformCache() {
    const platformCache = window;
    platformCache.platform = platformCache.platform || {};
    return platformCache;
}
function getLegacyPlatform(key) {
    const platform = getLegacyPlatformCache().platform[key];
    /**
     * If dependencies are not shared, platform with same version is different
     * and shared platform will not be returned.
     */
    return platform instanceof PlatformRef ? platform : null;
}
function setLegacyPlatform(key, platform) {
    getLegacyPlatformCache().platform[key] = platform;
}
function getLegacyNgZone() {
    return window['ngZone'];
}
function setLegacyNgZone(zone) {
    window['ngZone'] = zone;
}
/**
 * LEGACY IMPLEMENTATIONS END
 */
function getPlatformCache() {
    return (getGlobalStateSlice((state) => state.platformCache) ||
        setGlobalStateSlice({
            platformCache: new Map(),
        }).platformCache);
}
function setPlatform(version, platform) {
    if (platformSharing) {
        legacyMode && setLegacyPlatform(version.full, platform);
        getPlatformCache().set(version, platform);
    }
}
function getPlatform(options) {
    if (!platformSharing) {
        return options.platformFactory();
    }
    const versionResult = options.version();
    const version = versionResult === VERSION.full ? VERSION : versionResult;
    const versionKey = typeof version === 'string' ? version : version.full;
    let platform = getPlatformCache().get(version) ||
        (legacyMode && getLegacyPlatform(versionKey));
    if (!platform) {
        platform = options.platformFactory();
        setPlatform(VERSION, platform);
        options.production && enableProdMode();
    }
    return platform;
}
function getNgZone() {
    return (getGlobalStateSlice((state) => state.ngZone) ||
        getLegacyNgZone());
}
function shareNgZone(zone) {
    if (ngZoneSharing) {
        legacyMode && setLegacyNgZone(zone);
        setGlobalStateSlice({ ngZone: zone });
    }
}
function bootstrap(module, options) {
    ngZoneSharing = options.ngZoneSharing !== false;
    platformSharing = options.platformSharing !== false;
    legacyMode = options.activeLegacyMode !== false;
    options.platformFactory =
        options.platformFactory || (() => platformBrowser());
    options.version = options.version || (() => VERSION);
    if (ngZoneSharing && !options.compilerOptions?.ngZone) {
        options.compilerOptions = options.compilerOptions || {};
        options.compilerOptions.ngZone = getNgZone();
    }
    return getPlatform(options)
        .bootstrapModule(module, options.compilerOptions)
        .then((ref) => {
        if (options.appType === 'shell') {
            shareShellZone(ref.injector);
        }
        else if (options.appType === 'microfrontend') {
            connectMicroFrontendRouter(ref.injector);
        }
        return ref;
    });
}
function shareShellZone(injector) {
    const ngZone = injector.get(NgZone, null);
    if (!ngZone) {
        console.warn('No NgZone to share found');
        return;
    }
    shareNgZone(ngZone);
}
function connectMicroFrontendRouter(injector) {
    const router = injector.get(Router);
    const useHash = location.href.includes('#');
    if (!router) {
        console.warn('No router to connect found');
        return;
    }
    connectRouter(router, useHash);
}

/**
 * Generated bundle index. Do not edit.
 */

export { ModuleFederationToolsModule, WebComponentWrapper, bootstrap, connectRouter, endsWith, getMajor, shareNgZone, startsWith };
//# sourceMappingURL=angular-architects-module-federation-tools.mjs.map
