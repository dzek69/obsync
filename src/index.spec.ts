import { getListFromChangesHistory, getObjectFromChangesHistory, UNSET } from "./index";

describe("obsync", () => {
    it("gets the final object from changes history", () => {
        interface Song {
            title: string;
            price: number;
            extra: boolean;
            duration: number;
        }

        getObjectFromChangesHistory<Song>([
            {
                title: "Jack",
            },
            {
                price: 100,
                extra: true,
            },
            {
                title: "Jack and Mary",
                duration: 105,
                extra: UNSET,
            },
        ]).must.eql({
            title: "Jack and Mary",
            price: 100,
            duration: 105,
        });
    });

    it("gets the list of items, grouping by id, merging the history", () => {
        interface Todo {
            content: string;
            done: boolean;
            deleted: boolean;
        }

        const list = getListFromChangesHistory<Todo>([
            {
                id: 1,
                content: "buy some milk",
            },
            {
                id: 2,
                content: "make a milkshake",
            },
            {
                id: 3,
                content: "ride a unicord",
            },
            {
                id: 3,
                content: "ride a unicorn!",
            },
            {
                id: 3,
                done: true,
            },
            {
                id: 2,
                deleted: true,
            },
        ]);

        list.must.eql([
            {
                id: 1,
                content: "buy some milk",
            },
            {
                id: 2,
                content: "make a milkshake",
                deleted: true,
            },
            {
                id: 3,
                content: "ride a unicorn!",
                done: true,
            },
        ]);
    });
});
