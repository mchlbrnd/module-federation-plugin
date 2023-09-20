import { CompilerOptions, NgModuleRef, NgZone, PlatformRef, Type, Version } from '@angular/core';
export declare type AppType = 'shell' | 'microfrontend';
export declare type Options = {
    production: boolean;
    platformFactory?: () => PlatformRef;
    compilerOptions?: CompilerOptions & BootstrapOptions;
    version?: () => string | Version;
    appType?: AppType;
    /**
     * Opt-out of ngZone sharing.
     * Not recommanded.
     * Default value true.
     */
    ngZoneSharing?: boolean;
    /**
     * Opt-out of platformSharing sharing.
     * Possible, if dependencies are not shared or each bootstrapped
     * remote app uses a different version.
     * Default value true.
     */
    platformSharing?: boolean;
    /**
     * Deactivate support for legacy mode.
     * Only recommanded if all used implementations depend on
     * @angular-architects/module-federation-tools > 13.0.1.
     * Default value true.
     */
    activeLegacyMode?: boolean;
};
declare interface BootstrapOptions {
    ngZone?: NgZone | 'zone.js' | 'noop';
    ngZoneEventCoalescing?: boolean;
    ngZoneRunCoalescing?: boolean;
}
export declare function getMajor(version: string): string;
/**
 * LEGACY IMPLEMENTATIONS START
 *
 * Can be deprecated in later major releases.
 *
 * To increase backwards compatibility legacy and current namespaces
 * within the window object are used.
 */
export declare type LegacyPlatformCache = {
    platform: Record<string, PlatformRef>;
};
export declare function shareNgZone(zone: NgZone): void;
export declare function bootstrap<M>(module: Type<M>, options: Options): Promise<NgModuleRef<M>>;
export {};
