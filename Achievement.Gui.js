const DEFAULT_MENU = {};


/**
 *  创建一个基本的玩家GUI界面
 * @returns {*}
 */
function createGUIForm() {

    let fm = mc.newSimpleForm();
    fm = fm.setTitle("成就系统");
    fm = fm.addButton("已完成成就", "textures/ui/creative_icon");
    fm = fm.addButton("未完成成就", "textures/ui/lock_color");

    return fm;
}

/**
 * 创建一个OP管理GUI界面
 * @returns {*}
 */
function createOPForm() {

    let fm = mc.newCustomForm();
    fm = fm.setTitle("成就管理系统");
    fm = fm.addDropdown("选择要查看的玩家", mc.getOnlinePlayers().map(pl => pl.name), 0);
    return fm;
}

/**
 * 创建一个成就类型列表查看界面
 * @param entry
 * @returns {*}
 */
function createEntryTypeForm(entry){
    let fm = mc.newSimpleForm();
    fm = fm.setTitle("成就类型");
    for (const entryType in entry) {
        fm = fm.addButton(entry[entryType].name,entry[entryType].ui);
    }
    return fm;
}

/**
 * 创建一个成就词条列表查看界面
 * @param details
 * @returns {*}
 */
function createEntryTypeForm(details){
    let fm = mc.newSimpleForm();
    fm = fm.setTitle("成就词条");
    for (const detail in details){
        fm = fm.addButton(details[detail].msg);
    }
    return fm;
}


/**
 * 创建一个查看成就词条详情的查看界面
 * @param detail
 * @param plInfo
 */
function createEntryDetailsForm(detail,plInfo){
    let fm = mc.newCustomForm();
    fm = fm.setTitle("成就详情");
    fm = fm.addLabel(`成就名称:${detail.msg}`);
    fm = fm.addLabel(`达成条件:${detail.condition}`);
    fm = fm.addLabel(`达成时间:${plinfo.time}`);
    fm = fm.addLabel(`达成坐标:${plinfo.pos.x} ${plinfo.pos.y} ${plinfo.pos.z} ${plinfo.pos.dim}`);
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