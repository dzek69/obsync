import { merge, mergeUNSET } from "@ezez/utils";

interface ID {
    id: number | string;
}
const NOT_FOUND = -1;

/**
 * Use this to unset a value in an object.
 */
const UNSET = mergeUNSET;

type SingleChange<T> = Partial<{
    [Property in keyof T]: T[Property] | typeof UNSET;
}>;

/**
 * Merges all changes in the history of a single entity into a single object.
 * @param history - list of changes
 * @example
 * ```typescript
 * getObjectFromChangesHistory([{ a: 1, b: 1 }, { a: 2, b: UNSET }, { c: 3 }]) // { a: 2, c: 3 }
 * ```
 */
const getObjectFromChangesHistory = <T extends object>(history: SingleChange<T>[]) => { // eslint-disable-line @typescript-eslint/no-shadow
    const [h, ...istory] = history;
    return merge(h, ...istory) as Partial<T>;
};

const getListFromChangesHistory = <T extends object>(history: (SingleChange<T> & ID)[]) => { // eslint-disable-line @typescript-eslint/no-shadow
    const list: (T & ID)[] = [];
    history.forEach((item) => {
        const index = list.findIndex(i => i.id === item.id);
        if (index === NOT_FOUND) {
            list.push(merge({}, item) as T & ID); // merge will remove `unset` value on first object if somehow defined
            return;
        }
        // @ts-expect-error TS issue I don't even understand
        list[index] = merge(list[index], item);
    });

    return list;
};

const getListFromCallback = <T>() => {
    const list: (T & ID)[] = [];
    const callback = (item: SingleChange<T> & ID) => {
        const index = list.findIndex(i => i.id === item.id);
        if (index === NOT_FOUND) {
            list.push(merge({}, item) as T & ID); // merge will remove `unset` value on first object if somehow defined
        }
        // @ts-expect-error TS issue I don't even understand
        list[index] = merge(list[index], item);
    };

    return {
        list, callback,
    };
};

export {
    getObjectFromChangesHistory,
    getListFromChangesHistory,
    getListFromCallback,
    UNSET,
};
