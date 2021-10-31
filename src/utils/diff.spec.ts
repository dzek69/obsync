import { diff, UNSET } from "./diff";

describe("diff", () => {
    it("returns empty object when no diff is found", () => {
        diff({}, {}).must.eql({});
        diff({ a: true }, { a: true }).must.eql({});
    });

    it("returns diffs when there is a difference", () => {
        diff({ a: true, b: true }, { a: false, b: true }).must.eql({ a: false });
        diff({ a: true, b: false }, { a: true, b: true }).must.eql({ b: true });
    });

    it("detects new properties as diff", () => {
        diff({ a: true }, { a: true, b: true }).must.eql({ b: true });
    });

    it("detects removed properties as diff", () => {
        diff({ a: true }, {}).must.eql({ a: UNSET });
    });
});
