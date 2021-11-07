import { merge } from "bottom-line-utils";

interface ID {
    id: number | string;
}
const NOT_FOUND = -1;
const UNSET = merge.UNSET;

type SingleChange<T> = Partial<{
    [Property in keyof T]: T[Property] | typeof UNSET;
}>;

const getObjectFromChangesHistory = <T extends object>(history: SingleChange<T>[]) => {
    const [h, ...istory] = history;
    return merge(h, ...istory) as Partial<T>;
};

const getListFromChangesHistory = <T extends object>(history: (SingleChange<T> & ID)[]) => {
    const list: (T & ID)[] = [];
    history.forEach((item) => {
        const index = list.findIndex(i => i.id === item.id);
        if (index === NOT_FOUND) {
            list.push(merge({}, item) as T & ID); // merge will remove `unset` value on first object if somehow defined
            return;
        }
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
            return;
        }
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
