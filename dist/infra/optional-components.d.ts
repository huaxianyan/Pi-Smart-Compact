import { OPTIONAL_COMPONENTS } from "../constants.ts";
export type OptionalComponent = keyof typeof OPTIONAL_COMPONENTS;
/** This package's directory: the nearest ancestor of the module holding a package.json (dist/ or src/ layout). */
export declare function packageDir(parentUrl?: string): string;
/**
 * Where `npm install --prefix` must put a component so Node resolves it from
 * this package: Pi's install root for npm installs (the package sits in its
 * node_modules), the package itself for git or path installs.
 */
export declare function installRoot(parentUrl?: string): string;
/** Present when its manifest is on the module's lookup paths; exports conditions never matter. */
export declare function componentInstalled(component: OptionalComponent, parentUrl?: string): boolean;
/** The copy-pasteable install command for the given components, with Pi's own peer flag. */
export declare function installCommand(components: readonly OptionalComponent[], parentUrl?: string): string;
//# sourceMappingURL=optional-components.d.ts.map