describe("module", () => {
    it("should exist", () => {
        expect(typeof module).toBe("object");
    });
    it("captures td items", () => {
        let hookSpy = jasmine.createSpyObj("hooks", ["callAll", "call"], ["title", "id"]);
        Hooks.callAll("render");
        expect(hookSpy.title).toHaveBeenCalled();
    });
});
