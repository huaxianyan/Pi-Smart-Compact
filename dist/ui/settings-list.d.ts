import { type SettingItem, SettingsList } from "@earendil-works/pi-tui";
/** Shown in the value column so inactive rows do not widen the label column. */
export declare const INACTIVE_PREFIX = "inactive \u00B7 ";
export declare const CHANGED_MARK = " \u2022";
export declare class SmartSettingsList extends SettingsList {
    private readonly onReset;
    /** Ids of rows that currently have no effect; kept live by the owner. */
    private readonly inactive;
    /**
     * Called on Enter/Space before the default action; return true to consume
     * it (action rows, rows that are blocked with a visible reason).
     */
    private readonly onActivate?;
    constructor(items: SettingItem[], maxVisible: number, onChange: (id: string, value: string) => void, onCancel: () => void, onReset?: (id: string) => void, 
    /** Ids of rows that currently have no effect; kept live by the owner. */
    inactive?: ReadonlySet<string>, 
    /**
     * Called on Enter/Space before the default action; return true to consume
     * it (action rows, rows that are blocked with a visible reason).
     */
    onActivate?: ((id: string) => boolean) | undefined);
    /** Keep values readable on narrow screens; display shortening never reaches storage. */
    render(width: number): string[];
    /** Id of the highlighted row, or undefined when the list is empty. */
    selectedId(): string | undefined;
    handleInput(data: string): void;
}
//# sourceMappingURL=settings-list.d.ts.map