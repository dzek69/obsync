const UNSET = Symbol("unset");

const diff = (a: { [key: string]: unknown }, b: { [key: string]: unknown }, unsetValue: unknown = UNSET) => {
    const ak = Object.keys(a);
    const bk = Object.keys(b);

    const res: { [key: string]: unknown } = {};

    const allK = [...new Set([...ak, ...bk])];

    allK.forEach((key: string) => {
        if (key in a && key in b) {
            if (!Object.is(a[key], b[key])) {
                res[key] = b[key];
            }
            return;
        }
        if (key in a && !(key in b)) {
            res[key] = unsetValue;
            return;
        }
        if (key in b && !(key in a)) {
            res[key] = b[key];
            return;
        }
        throw new Error("Should not happen");
    });

    return res;
};

export {
    diff,
    UNSET,
};
