/**
 * 说实话作者其实主要方向是Java|Go后端开发，所以比较讨厌表单页面什么之类的，不过这里的表单可比web的表单简单多了，尽管如此
 * 代码相比于核心插件而言，可能还是会显得凌乱一些，毕竟只是花了两个小时随便写的，如果有不满意可以根据导出的接口自行编写表单。
 */

ll.require("Achievement-Core.js");

const namespace = "Achievement";

//是否加载
const isAppLoaded = ll.import(namespace, "isAppLoaded");

//日志
const debugLog = ll.import(namespace, "debugLog");
const infoLog = ll.import(namespace, "infoLog");
const errorLog = ll.import(namespace, "errorLog");

const getPlAchiInfo = ll.import(namespace, "getPlAchiInfo");//获取一个玩家成就的情况
const getPlAchiType = ll.import(namespace, "getPlAchiType");//获取一个玩家成就类型的信息
const getPlAchiKey = ll.import(namespace, "getPlAchiKey");//获取一个玩家指定成就词条的信息
const getPlAchiInfoStatistic = ll.import(namespace, "getPlAchiInfoStatistic");//获取一个玩家成就的统计信息
const getPlAchiDetailsStatistic = ll.import(namespace, "getPlAchiDetailsStatistic");//获取一个玩家成就类型的细节统计信息

const getAchievementEntry = ll.import(namespace, "getAchievementEntry");//获取一个成就词条
const getAchievementEntryType = ll.import(namespace, "getAchievementEntryType");//获取一个成就类型
const getAchievementStatistic = ll.import(namespace, "getAchievementStatistic");//获取成就统计情况
const getLangEntry = ll.import(namespace, "getLangEntry");//获取所有的成就词条


const DEFAULT_MENU = {};
let Global = {};

function isTrulyNull(val) {
    return (val === undefined || val === null) && val !== 0 && !val;
}

/**
 *  创建一个基本的玩家GUI界面
 * @returns {*}
 */
function createGUIForm(pl) {
    const {finished, unFinished} = getPlAchiInfoStatistic(pl.xuid);
    let fm = mc.newSimpleForm();
    fm = fm.setTitle("成就系统");
    fm = fm.addButton(`已完成成就 ${finished}个`, "textures/ui/creative_icon");
    fm = fm.addButton(`未完成成就 ${unFinished}个`, "textures/ui/lock_color");
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
 * @returns {*}
 * @param entryList
 */
function createEntryTypeListForm(entryList) {
    let fm = mc.newSimpleForm();
    fm = fm.setTitle("成就类型");
    for (const entryType of entryList) {
        fm = fm.addButton(entryType.name, entryType.ui);
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
    fm = fm.setTitle("成就词条");
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
    fm = fm.setTitle("成就详情");
    fm = fm.addLabel(`成就名称: ${detail.msg}`);
    fm = fm.addLabel(`达成条件: ${detail.condition}`);
    fm = fm.addLabel(`达成时间: ${plInfo.time}`);
    fm = fm.addLabel(`达成坐标: ${plInfo.pos.x} ${plInfo.pos.y} ${plInfo.pos.z} ${plInfo.pos.dim}`);
    return fm;
}


function confirmModelPattern(pl, callback, content = "是否返回上一步") {
    pl.sendModalForm("提示", content, "返回", "退出", (_, res) => {
        if (res) callback();
    });
}

function entryDetailsCallback(pl, type, key, isFinished) {
    let detailsInfo = getAchievementEntry(type, key);
    let plDetailsInfo = getPlAchiKey(pl.xuid, type, key);
    if (!isFinished) {
        confirmModelPattern(pl, () => {
            entryTypeListCallback(pl, false, {type});
        }, "未达成此成就，不能查看此成就信息");
    } else {
        pl.sendForm(createEntryDetailsForm(detailsInfo, plDetailsInfo), (_, id) => {
            logger.info("成就详情", id);
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
    const {finishedList, unFinishedList} = getPlAchiDetailsStatistic(pl.xuid, entryType.type);
    pl.sendForm(createEntryDetailsListForm(isFinished ? finishedList : unFinishedList), (_, id) => {
        logger.info("成就词条列表: ", id);
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
function guiFormCallBack(pl, id, op) {
    const {finishedList, unFinishedList} = getPlAchiInfoStatistic(pl.xuid);
    switch (id) {
        case 0: {
            pl.sendForm(createEntryTypeListForm(finishedList), (_, id) => {
                logger.info("成就类型列表: ", id);
                if (!isTrulyNull(id)) entryTypeListCallback(pl, true, finishedList[id]);
                else confirmModelPattern(pl, () => {
                    pl.sendForm(createGUIForm(pl), guiFormCallBack);
                });
            });
        }
            break;
        case 1: {
            pl.sendForm(createEntryTypeListForm(unFinishedList), (_, id) => {
                logger.info("成就类型列表: ", id);
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
                out.error("你没有权限进行此操作");
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
    registerCmd();
}

init();
