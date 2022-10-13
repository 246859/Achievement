/**
 * 说实话作者其实主要方向是Java|Go后端开发，所以比较讨厌表单页面什么之类的，不过这里的表单可比web的表单简单多了，尽管如此
 * 代码相比于核心插件而言，可能还是会显得凌乱一些，毕竟只是花了两个小时随便写的，如果有不满意可以根据导出的接口自行编写表单。
 */

ll.require("Achievement-Core.js");

const namespace = "Achievement";

//是否加载
const isAppLoaded = ll.import(namespace, "isAppLoaded");


const getPlayerKeyInfo = ll.import(namespace, "getPlayerKeyInfo");//获取一个玩家指定成就词条的信息
const getPlayerTypeStatistic = ll.import(namespace, "getPlayerTypeStatistic");//获取一个玩家成就的统计信息
const getPlayerDetailStatistic = ll.import(namespace, "getPlayerDetailStatistic");//获取一个玩家成就类型的细节统计信息
const getAchievementEntry = ll.import(namespace, "getAchievementEntry");//获取一个成就词条
const renderTemplate = ll.import(namespace, "renderTemplate");
const getConfig = ll.import(namespace, "getConfig");


const DEFAULT_MENU = {
    zh_CN: {
        GUI_TITLE: "成就系统",
        FINISHED: "已完成成就 ${}个",
        UN_FINISHED: "未完成成就 ${}个",
        MANAGE: "成就管理系统",
        WATCH_PL: "选择要查看的玩家",
        ACHI_TYPE: "成就类型",
        ACHI_ENTRY: "成就词条",
        ACHI_DETAILS: "成就详情",
        ACHI_NAME: "成就名称: ${}",
        ACHI_CONDITION: "达成条件: ${}",
        ACHI_TIME: "达成时间: ${}",
        ACHI_POS: "达成坐标: ${} ${} ${} ${}",
        CONFIRM: "确认",
        CANCEL: "退出",
        TIP: "提示",
        BACK: "是否返回上一步",
        NO_ACHI: "未达成此成就，不能查看此成就信息",
        NO_AUTH: "你没有权限进行此操作"
    },
    en_US: {
        GUI_TITLE: "Achievement System",
        FINISHED: "Completed ${} achievements",
        UN_FINISHED: "Unfinished achievement ${}",
        MANAGE: "Achievement Management System",
        WATCH_PL: "Choose a player to view",
        ACHI_TYPE: "Achievement Type",
        ACHI_ENTRY: "Achievement Entry",
        ACHI_DETAILS: "Achievement Details",
        ACHI_NAME: "Achievement Name: ${}",
        ACHI_CONDITION: "Condition fulfilled: ${}",
        ACHI_TIME: "Achievement time: ${}",
        ACHI_POS: "Achievement coordinates: ${} ${} ${} ${}",
        CONFIRM: "Confirm",
        CANCEL: "CANCEL",
        TIP: "Tips",
        BACK: "Whether to return to the previous step",
        NO_ACHI: "You can't view this achievement if you haven't achieved this achievement",
        NO_AUTH: "You do not have permission to perform this operation"
    }
};
let Global = {lang: {}};

function isTrulyNull(val) {
    return (val === undefined || val === null) && val !== 0 && !val;
}

/**
 *  创建一个基本的玩家GUI界面
 * @returns {*}
 */
function createGUIForm(pl) {
    const {finished, unFinished} = getPlayerTypeStatistic(pl.xuid);
    let fm = mc.newSimpleForm();
    fm = fm.setTitle(Global.lang.GUI_TITLE);
    fm = fm.addButton(renderTemplate(Global.lang.FINISHED, finished), "textures/ui/creative_icon");
    fm = fm.addButton(renderTemplate(Global.lang.UN_FINISHED, unFinished), "textures/ui/lock_color");
    return fm;
}

/**
 * 创建一个OP管理GUI界面
 * @returns {*}
 */
function createOPForm() {

    let fm = mc.newCustomForm();
    fm = fm.setTitle(Global.lang.MANAGE);
    fm = fm.addDropdown(Global.lang.WATCH_PL, mc.getOnlinePlayers().map(pl => pl.name), 0);
    return fm;
}

/**
 * 创建一个成就类型列表查看界面
 * @returns {*}
 * @param entryList
 */
function createEntryTypeListForm(entryList) {
    let fm = mc.newSimpleForm();
    fm = fm.setTitle(Global.lang.ACHI_TYPE);
    for (const entryType of entryList) {
        if (entryType.ui) fm = fm.addButton(entryType.name, entryType.ui);
        else fm = fm.addButton(entryType.name);
    }
    return fm;
}

/**
 * 创建一个成就词条列表查看界面
 * @returns {*}
 * @param detailList
 */
function createEntryDetailsListForm(detailList) {
    let fm = mc.newSimpleForm();
    fm = fm.setTitle(Global.lang.ACHI_ENTRY);
    for (const detail of detailList) {
        if (detail.ui) fm = fm.addButton(detail.name, detail.ui);
        else fm = fm.addButton(detail.name);
    }
    return fm;
}


/**
 * 创建一个查看成就词条详情的查看界面
 * @param detail
 * @param plInfo
 */
function createEntryDetailsForm(detail, plInfo) {
    let fm = mc.newCustomForm();
    fm = fm.setTitle(Global.lang.ACHI_DETAILS);
    fm = fm.addLabel(renderTemplate(Global.lang.ACHI_NAME, detail.msg));
    fm = fm.addLabel(renderTemplate(Global.lang.ACHI_CONDITION, detail.condition));
    fm = fm.addLabel(renderTemplate(Global.lang.ACHI_TIME, plInfo.time));
    fm = fm.addLabel(renderTemplate(Global.lang.ACHI_POS, plInfo.pos.x, plInfo.pos.y, plInfo.pos.z, plInfo.pos.dim));
    return fm;
}


/**
 * 模式表单
 * @param pl
 * @param callback
 * @param content
 */
function confirmModelPattern(pl, callback, content = Global.lang.BACK) {
    pl.sendModalForm(Global.lang.TIP, content, Global.lang.CONFIRM, Global.lang.CANCEL, (_, res) => {
        if (res) callback();
    });
}

/**
 * 成就细节表单回调
 * @param pl
 * @param type
 * @param key
 * @param isFinished
 */
function entryDetailsCallback(pl, type, key, isFinished) {
    let detailsInfo = getAchievementEntry(type, key);
    let plDetailsInfo = getPlayerKeyInfo(pl.xuid, type, key);
    if (!isFinished) {
        confirmModelPattern(pl, () => {
            entryTypeListCallback(pl, false, {type});
        }, Global.lang.NO_ACHI);
    } else {
        pl.sendForm(createEntryDetailsForm(detailsInfo, plDetailsInfo), (_, id) => {
            if (isTrulyNull(id)) confirmModelPattern(pl, () => {
                entryTypeListCallback(pl, true, {type});
            });
        });
    }
}


/**
 * 成就类型列表回调
 * @param pl
 * @param isFinished
 * @param entryType
 */
function entryTypeListCallback(pl, isFinished, entryType) {
    const {finishedList, unFinishedList} = getPlayerDetailStatistic(pl.xuid, entryType.type);
    pl.sendForm(createEntryDetailsListForm(isFinished ? finishedList : unFinishedList), (_, id) => {
        if (!isTrulyNull(id)) entryDetailsCallback(pl, entryType.type, (isFinished ? finishedList : unFinishedList)[id].key, isFinished);
        else confirmModelPattern(pl, () => {
            guiFormCallBack(pl, isFinished ? 0 : 1);
        });
    });
}

/**
 * 普通玩家GUI列表回调
 * @param pl
 * @param id
 */
function guiFormCallBack(pl, id) {
    const {finishedList, unFinishedList} = getPlayerTypeStatistic(pl.xuid);
    switch (id) {
        case 0: {
            pl.sendForm(createEntryTypeListForm(finishedList), (_, id) => {
                if (!isTrulyNull(id)) entryTypeListCallback(pl, true, finishedList[id]);
                else confirmModelPattern(pl, () => {
                    pl.sendForm(createGUIForm(pl), guiFormCallBack);
                });
            });
        }
            break;
        case 1: {
            pl.sendForm(createEntryTypeListForm(unFinishedList), (_, id) => {
                if (!isTrulyNull(id)) entryTypeListCallback(pl, false, unFinishedList[id]);
                else confirmModelPattern(pl, () => {
                    pl.sendForm(createGUIForm(pl), guiFormCallBack);
                });
            });
        }
            break;
    }
}

/**
 * 回调地狱表单
 * @param cmd
 * @param origin
 * @param out
 * @param res
 */
function cmdCallBack(cmd, origin, out, res) {
    let pl = origin.player;
    if (!pl) return;
    let level = pl.permLevel;
    let action = res.action;
    switch (action) {
        case "op": {
            if (level < 1) {
                out.error(Global.lang.NO_AUTH);
                return;
            }
            pl.sendForm(createOPForm(), (player) => {
                pl.sendForm(createGUIForm(player), guiFormCallBack);
            });

        }
            break;
        case "gui": {
            pl.sendForm(createGUIForm(pl), guiFormCallBack);
        }
    }
}

/**
 * 注册命令
 */
function registerCmd() {
    let cmd = mc.newCommand("view", "查看成就/view Achievement", PermType.Any, 0x80);
    cmd.setEnum("gui_action", ["gui", "op"]);
    cmd.mandatory("action", ParamType.Enum, "gui_action", 1);
    cmd.overload(["gui_action"]);
    cmd.setCallback(cmdCallBack);
    cmd.setup();
}

function sleep(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}

/**
 * 等待核心加载完毕
 * @returns {Promise<boolean>}
 */
async function waitingCoreLoaded() {
    while (!isAppLoaded()) {
        await sleep(400);
    }
    return true;
}

function init() {
    Global.lang = {...DEFAULT_MENU.en_US};
    registerCmd();
}

const MENU_PATH = "./plugins/Achievement/Menu/";

/**
 * 初始化语言文件
 */
function initMenu() {
    try {
        for (let langKey in DEFAULT_MENU) {
            let filePAth = `${MENU_PATH}${langKey}/Menu.json`;
            File.writeTo(filePAth, JSON.stringify(DEFAULT_MENU[langKey]));
        }
    } catch (err) {
        logger.error("菜单文件初始化异常: ", err);
    }
}

/**
 * 加载语言
 * @param lang
 */
function loadMenu(lang) {
    try {
        let filePath = `${MENU_PATH}${lang}/Menu.json`;
        Global.lang = JSON.parse(File.readFrom(filePath));
    } catch (err) {
        logger.error("菜单文件加载失败: ", err);
    }
}

/**
 * 等待核心插件加载完成
 */
waitingCoreLoaded().then(res => {
    initMenu();
    loadMenu(getConfig().language);
});

init();
