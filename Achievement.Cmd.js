ll.require("Achievement.Gui.js");
const printObj = ll.import("bbc", "printObj");

function test() {
    return 2 + 3;
}

// printObj(test);
printObj(Promise.resolve("test"));