// import * as sinon from "sinon";

describe("module", () => {
    it("should exist", () => {
        expect(typeof module).toBe("object");
    });
    it("captures td items", () => {
        let hookSpy = jest.spyOn(Hooks, "callAll");
        // let hookSpy =sinon.spy(Hooks, "callAll");
        Hooks.callAll("render");
        expect(hookSpy).toHaveBeenCalledWith("renderRollTableConfig");
        // hookSpy.calledOnceWith("render");
    });
});
