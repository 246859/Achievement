const namespace = "Achievement";

ll.require("Achievement.Core.js");
const getAchiStatistic = ll.import(namespace, "getAchievementStatistic");
const getPlAchiInfo = ll.import(namespace, "getPlAchiInfo");

const DEFAULT_MENU = {};


function createGUIForm() {

    let fm = mc.newSimpleForm();
    fm = fm.setTitle("成就系统");
    fm = fm.addButton("已完成成就", "textures/ui/New_confirm_Hover");
    fm = fm.addButton("未完成成就", "textures/ui/redX1");

    return fm;
}

function createOPForm() {

    let fm = mc.newCustomForm();
    fm = fm.setTitle("成就管理系统");
    fm = fm.addDropdown("选择要查看的玩家", mc.getOnlinePlayers().map(pl => pl.name), 0);
    return fm;
}

function cmdCallBack(cmd, origin, out, res) {
    let pl = origin.player;
    if (!pl) return;
    let level = pl.permLevel;
    let action = res.action;
    switch (action) {
        case "op": {
            if (level < 1) {
                out.error("你没有权限进行此操作");
                return;
            }
            pl.sendForm(createOPForm(), () => {
            });

        }
            break;
        case "gui": {
            pl.sendForm(createGUIForm(), () => {
            });
        }
    }
}


function registerCmd() {
    let cmd = mc.newCommand("view", "查看成就/view Achievement", PermType.Any, 0x80);
    cmd.setEnum("gui_action", ["gui", "op"]);
    cmd.mandatory("action", ParamType.Enum, "gui_action", 1);
    cmd.overload(["gui_action"]);
    cmd.setCallback(cmdCallBack);
    cmd.setup();
}

registerCmd();
