/**
 * author stranger
 * datetime 2022/9/25
 * description 最近写项目代码太累了，写点脚本放松下，之前插件代码也算挺屎的了，正好重写了。
 */

const PLUGINS_INFO = {
    name: "Achievement", version: "v2.0.0",
};

const ZH_CN = "zh_CN";
const EN_US = "en_US";
/**
 * 默认数据对象
 * @type Object
 */
const DEFAULT_PLAYER_DATA = {};

/**
 * 默认配置对象
 * @type Object
 */
const DEFAULT_CONFIG = {
    language: ZH_CN,//插件语言
    display: {//成就完成后的展示
        scope: 2,//作用范围 2所有人都能看到，1仅个人能看到，0不展示
        toast: {//成就弹窗
            enable: true, toastTitle: "§l§a${title}", toastMsg: "§3${msg}"
        }, beep: {//提示音
            enable: true, type: "random.toast",//提示音类型
            volume: 5, //音量
            pitchArray: [0.3, 1, 1.5]//音调数组
        }, chatBar: {//聊天栏展示
            enable: true, chatBarMsg: "§l§6[ACHIEVEMENT]§r §e玩家 ${name} §c获得成就 §a${entry}§3 ———— ${condition}"
        }
    }, reward: {//成就完成奖励
        economy: {//经济奖励
            enable: true,//是否开启
            type: "score",//经济类型 score | llmoney
            score: "money",//计分板名称
            value: 50,//要增加的经济值
        }, exp: {//经验奖励
            enable: true,//是否开启
            value: 50//要增加的经验值
        }, item: {
            enable: true,//是否开启
            type: "minecraft:cooked_beef",//熟牛肉
            count: 1,//数量
            lore: ["成就奖励物品"]//物品lore
        }
    }, antiShake: 400, //防抖粒度
    checkUpdate: true,//检查更新
    debug: true,//调试模式
};

/**
 * 语言对象
 * @type Object
 */
const LANG = {
    zh_CN: {
        Entry: {}
    }, en_US: {
        Entry: {}
    }
};

/**
 * 全局常量对象
 * @type Object
 */

const Constant = {
    version: "achi_version", typeCount: "typeCount", totalCount: "totalCount", moneyType: {
        score: "score", llmoney: "llmoney"
    }, langType: {
        zh_CN: "zh_CN", en_US: "en_US"
    }, SystemInfo: {
        zh_CN: {
            achi: {
                enter: "玩家:${pl.name} 触发事件:${type} Key:${key}",
                args: "参数校验通过",
                shake: "成就防抖通过",
                status: "成就状态未完成",
                update: "成就状态修改成功",
                exist: "存在该成就词条",
                nonExistentEntry: "不存在的成就词条",
            }, reward: {
                economyInfo: "经济奖励 对象: ${pl.name} 类型: ${economy.type} 数值: ${economy.value}",
                itemInfo: "物品奖励 对象: ${pl.name} 类型: ${item.type} 数量:${item.count} 词条:${item.lore}",
                expInfo: "经验奖励 对象 ${pl.name} 数值: ${exp.value}",
                nonExistentScore: "经济计分板项<${score}>不存在,请确认是否填写错误",
            }, display: {
                chatBar: "聊天栏展示 作用域: ${scope} 对象: ${pl.name} 信息:${finalMsg}",
                toast: "弹窗展示 对象: ${pl.name} 标题: ${title} 信息: ${msg}",
                beep: "提示音展示 对象: ${pl.name} 类型: ${beep.type} 音量: ${beep.volume} 音调: ${randomPitch}"
            }, init: {
                dirInit: "插件目录创建完成",
                data: "玩家数据文件创建完成",
                config: "插件配置文件创建完成",
                cache: "插件缓存文件创建完成",
                lang: "语言文件创建完成",
                configurationError: "插件配置文件初始化异常: ",
                configUpdate: "配置文件信息更新完毕",
                langUpdate: "语言文件信息更新完毕",
                updateError: "插件配置信息更新失败",
                runtimeData: "插件运行时配置加载完毕",
                runtimeLang: "插件运行时语言加载完毕",
                persistenceCache: "插件缓存数据加载成功",
                runtimePlData: "插件运行时玩家数据加载完毕",
                runtimeError: "插件运行时数据加载异常: ",
                currentLang: "当前语言为: ${}",
                initialData: "初始运行时数据: ${}",
                initEntryCount: "成就插件成功加载,总计${}种成就类型,${}个成就词条,${}个事件监听",
                backUp: "检测到插件版本与本地缓存版本不一致，即将开始备份，随后将更新本地文件",
                backUpSuccess: "备份成功保存在路径:",
                initError: "插件启动异常: ",
                invalidType: "无效的成就类型: ",
                langDir: "当前语言加载目录为: ",
                langFile: "成功加载语言文件:　",
            }, IO: {
                readJsonNull: "路径: ${path} JSON读取为: ${buffer}",
                readJsonError: "路径: ${path} JSON读取异常: ",
                writeJsonError: "路径: ${path} JSON写入异常: "
            },
        }, en_US: {
            achi: {
                enter: "Player:${pl.name} Triggered Event:${type} Key:${key}",
                args: "Parameter verification passed",
                shake: "achieve anti-shake pass",
                status: "Achievement status not completed",
                update: "Achievement status modified successfully",
                nonExistentEntry: "Achievement entry that does not exist",
            }, reward: {
                economyInfo: "Economy Reward Object: ${pl.name} Type: ${economy.type} Value: ${economy.value}",
                itemInfo: "Item Reward Object: ${pl.name} Type: ${item.type} Quantity: ${item.count} Item: ${item.lore}",
                expInfo: "Experience reward object ${pl.name} value: ${exp.value}",
                nonExistentScore: "The economic scoreboard item <${score}> does not exist, please confirm whether the entry is incorrect",
            }, display: {
                chatBar: "Chat Bar Display Scope: ${scope} Object: ${pl.name} Information: ${finalMsg}",
                toast: "Popup display object: ${pl.name} title: ${title} information: ${msg}",
                beep: "Beep Display Object: ${pl.name} Type: ${beep.type} Volume: ${beep.volume} Pitch: ${randomPitch}"
            }, init: {
                dirInit: "The plugin directory is created",
                data: "Player data file created",
                config: "The plugin configuration file is created",
                lang: "Language file created",
                configurationError: "Plugin configuration file initialization exception: ",
                configUpdate: "The configuration file information has been updated",
                langUpdate: "Language file information updated",
                updateError: "Failed to update plugin configuration information",
                runtimeData: "The plugin runtime configuration is loaded",
                runtimeLang: "The plugin runtime language is loaded",
                runtimePlData: "The player data is loaded when the plugin is running",
                runtimeError: "plugin runtime data loading exception: ",
                currentLang: "The current language is: ${}",
                initialData: "Initial runtime data: ${}",
                initEntryCount: "Successfully loaded ${} achievement types, with a total of ${} achievement entries",
                initError: "Plugin startup exception: "
            }, IO: {
                readJsonNull: "Path: ${path} JSON read as: ${buffer}",
                readJsonError: "Path: ${path} JSON read exception: ",
                writeJsonError: "path: ${path} JSON write exception: "
            }
        }
    }
};

/**
 * 全局运行时对象
 * @type Object
 */
const Runtime = {
    entryTypeTotalCounts: 0,//当前版本成就类型总数
    entryTotalCounts: 0,//当前版本成就词条总数
    config: {debug: true, language: ZH_CN},//配置对象
    entry: {},//词条对象
    rewardManager: undefined,//奖励对象
    displayManger: undefined,//展示对象
};


/**
 * IO操作对象
 */
class IO {

    /**
     * 读取一个json文件
     * @param path
     */
    static readJsonFile(path) {
        let readBuffer = undefined;
        try {
            readBuffer = JSON.parse(File.readFrom(path));
            if (!readBuffer) {
                LogUtils.error(Utils.loadTemplate(Runtime.SystemInfo.IO.readJsonNull, path, readBuffer));
                return;
            }
        } catch (e) {
            LogUtils.error(Utils.loadTemplate(Runtime.SystemInfo.IO.readJsonError, path), e);
        }
        return readBuffer;
    }

    /**
     * 写入一个json文件
     * @param path
     * @param data
     */
    static writeJsonFile(path, data) {
        let isSuccess = false;
        try {
            isSuccess = File.writeTo(path, JSON.stringify(data));
        } catch (e) {
            LogUtils.error(Utils.loadTemplate(Runtime.SystemInfo.IO.writeJsonError, path), e);
        }
        return isSuccess;
    }

    /**
     * 异步读取一个json文件
     * @param path
     * @returns
     */
    static readJsonFileAsync(path) {
        return new Promise((resolve, reject) => {
            try {
                let readBuffer = File.readFrom(path);
                if (!readBuffer) {
                    LogUtils.error(Utils.loadTemplate(Runtime.SystemInfo.IO.readJsonNull, path, readBuffer));
                    reject(readBuffer);
                }
                resolve(JSON.parse(readBuffer));
            } catch (e) {
                LogUtils.error(Utils.loadTemplate(Runtime.SystemInfo.IO.readJsonError, path), e);
                reject(e);
            }
        });
    }

    /**
     * 异步写入一个json文件
     * @param path
     * @param data
     */
    static writeJsonFileAsync(path, data) {
        return new Promise((resolve, reject) => {
            try {
                let writeBuffer = JSON.stringify(data);
                resolve(File.writeTo(path, writeBuffer));
            } catch (e) {
                LogUtils.error(Utils.loadTemplate(Runtime.SystemInfo.IO.writeJsonError, path), e);
                reject(data, e);
            }
        });
    }

    /**
     * 同步判断文件是否不存在
     * @param path
     * @returns {boolean}
     */
    static isNotExists(path) {
        return !File.exists(path);
    }

    /**
     * 异步判断文件是否不存在
     * @param path
     * @returns {Promise<unknown>}
     */
    static isNotExistsAsync(path) {
        return new Promise((resolve, reject) => {
            try {
                resolve(IO.isNotExists(path));
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * 克隆目录
     * @param targetPath
     * @param sourcePath
     */
    static cloneDir(sourcePath, targetPath) {
        let isExist = File.exists(targetPath);
        if (isExist) return;
        File.createDir(targetPath);
        File.copy(sourcePath, targetPath);
        let fileList = File.getFilesList(sourcePath);
        for (let file of fileList) {
            let subSourcePath = Path.concatDir(sourcePath, file);
            if (File.checkIsDir(subSourcePath)) {
                let subTargetPath = Path.concatDir(targetPath, file);
                this.cloneDir(subSourcePath, subTargetPath);
            }
        }
    }

}

/**
 * 异步工具类
 */
class AsyncUtils {

    /**
     * 异步并行遍历一个可迭代对象，返回一个promise对象
     * resolve参数为迭代对象的索引index与迭代对象对应索引的值
     * 即resolve(index,value)
     * promise会将resolve的返回值包裹成数组以供后续调用
     * @param iterator 可迭代的对象,数组，js对象，map，set等
     * @param resolve
     * @returns {Promise<Awaited<any>[]>}
     */
    static iteratorAsync(iterator, resolve) {
        return Promise.all((iterator instanceof Set || iterator instanceof Map) ? [...iterator.entries()].map(async entry => {
            return resolve(entry[0], entry[1]);
        }) : Object.keys(iterator).map(async index => {
            return resolve(index, iterator[index]);
        }));
    }

    /**
     * 休眠指定时间
     * @param time
     * @returns {Promise<unknown>}
     */
    static sleep(time) {
        return new Promise(resolve => setTimeout(() => {
            resolve();
        }, time));
    }

    /**
     * Async异常处理
     * @param promiseAsync
     * @returns {Promise<unknown | [any,null]>}
     */
    static asyncWrap(promiseAsync) {
        return promiseAsync.then(data => [null, data]).catch(err => [err, null]);
    }
}

/**
 * 通用工具类
 */
class Utils {

    /**
     * 检测玩家是否含有某一个物品
     * @param pl
     * @param type
     * @returns {boolean}
     */
    static plHasItem(pl, type) {
        for (let item of pl.getInventory().getAllItems()) {
            if (item.type === type) {
                return true;
            }
        }
        return false;
    }

    /**
     * 判断一个玩家是否已经加载完成
     * BDS服务端会在玩家进入服务器时初始化玩家数据
     * 这会大量的循环的不断的触发一些事件监听，还会进入成就的判断逻辑
     * 造成服务器的卡顿，所以需要判断玩家是否已经加载。
     * @param pl
     * @returns {boolean}
     */
    static isPlayerLoaded(pl) {
        return !Utils.isNullOrUndefined(pl.gameMode);
    }

    /**
     * 获取当前游戏时间
     * @param type daytime gametime day
     */
    static getCurrentTime(type) {
        let res = mc.runcmdEx(`time query ${type}`);
        return res ? Utils.getNumberFromStr(res.output) : undefined;
    }

    /**
     * 将pos对象转换成一个数组
     * @param pos
     * @returns {(*|0|1|2)[]}
     */
    static getPosition(pos) {
        return [pos.x, pos.y, pos.z, pos.dimid];
    }

    /**
     * 根据伤害代码获取伤害原因
     * @param cause
     * @returns {string}
     */
    static getDamageCauseInfo(cause) {
        switch (cause) {
            case 0:
                return "Override";
            case 1:
                return "Contact";
            case 2:
                return "EntityAttack";
            case 3:
                return "Projectile";
            case 4:
                return "Suffocation";
            case 5:
                return "Fall";
            case 6:
                return "Fire";
            case 7:
                return "FireTick";
            case 8:
                return "Lava";
            case 9:
                return "Drowning";
            case 10:
                return "BlockExplosion";
            case 11:
                return "EntityExplosion";
            case 12:
                return "Void";
            case 13:
                return "Suicide";
            case 14:
                return "Magic";
            case 15:
                return "Wither";
            case 16:
                return "Starve";
            case 17:
                return "Anvil";
            case 18:
                return "Thorns";
            case 19:
                return "FallingBlock";
            case 20:
                return "Piston";
            case 21:
                return "FlyIntoWall";
            case 22:
                return "Magma";
            case 23:
                return "Fireworks";
            case 24:
                return "Lightning";
            case 25:
                return "Charging";
            case 26:
                return "Temperature";
            case 27:
                return "Freezing";
            case 28:
                return "Stalactite";
            case 29:
                return "Stalagmite";
        }
    }

    /**
     * 解析一个字符串布尔表达式
     * 简单实现，限制了只能同时存在一个操作符
     * @param str
     * @param param
     */
    static parseStrBoolExp(str, ...param) {
        //去掉所有非数字项与非比较运算符以及变量占位符
        return Boolean(eval(Utils.loadTemplate(str.replaceAll(/[^0-9=<>&|+-/*%!()${}]/g, ""), ...param)));
    }

    /**
     * 得到一个字符串里的所有数字
     * @param str
     * @returns {string}
     */
    static getNumberFromStr(str) {
        return str.replaceAll(/[^0-9]/g, "");
    }

    /**
     * 判断传入的数据是否为js对象
     * @param any
     * @returns {boolean}
     */
    static isJsObject(any) {
        return Object.prototype.toString.call(any) === "[object Object]";
    }

    /**
     * 将一个实体转换为玩家对象
     * @param en
     * @returns {*|Player|undefined}
     */
    static toPlayer(en) {
        if (en.isPlayer()) return en.toPlayer(); else return undefined;
    }

    /**
     * 递归检查两个对象属性的异同,
     * source相对于target多出的属性会被添加至target
     * target中已存在的属性不会有任何变化
     * target相对于source中多出的属性会被删除。
     * 多用于自动更新配置文件
     * @param source 源对象
     * @param target 目标对象
     * @param deleted 是否进行删除
     */
    static checkDifferences(source, target, deleted) {
        // LogUtils.debug("source", JSON.stringify(source));
        // LogUtils.debug("target", JSON.stringify(target));
        // LogUtils.debug("----------------------------------------------------------------------------");
        if (!source || !target) return;
        for (let key in target) {
            if (source[key] === undefined && deleted) {
                delete target[key];
            } else if (this.isJsObject(target[key])) {
                this.checkDifferences(source[key], target[key], deleted);
            }
        }

        for (let key in source) {
            if (target[key] === undefined) {
                target[key] = source[key];
            } else if (this.isJsObject(target[key])) {
                this.checkDifferences(source[key], target[key], deleted);
            }
        }
    }

    /**
     * 对一个字符串中插入指定的变量
     * 多用于配置文件的中的变量替换
     * loadTemplate(“i am a  ${}”,man) => "i am a man"
     * @param str
     * @param params
     * @returns {*}
     */
    static loadTemplate(str, ...params) {
        let regx = /\${.*?}/;
        let param = undefined;
        let index = 0;
        while (regx.test(str)) {
            if (!Utils.isNullOrUndefined(params[index])) param = params[index++];
            str = str.replace(regx, param);
        }
        return str;
    }


    /**
     * 判断一个数据是否为空
     * @param param
     * @returns {boolean}
     */
    static isNullOrUndefined(param) {
        return param === null || param === undefined;
    }

    /**
     * 判断一堆数据是否为空
     * @param params
     * @returns {boolean}
     */
    static hasNullOrUndefined(...params) {
        for (let val of params) {
            if (this.isNullOrUndefined(val)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 防抖函数
     * @param pl
     * @param tag
     * @param time
     */
    static antiShake(pl, tag, time) {
        pl.addTag(tag);
        setTimeout(() => {
            pl.removeTag(tag);
        }, time);
    }

    /**
     * 是否正在抖动
     * @param pl
     * @param tag
     * @returns {boolean}
     */
    static isShaking(pl, tag) {
        return pl.hasTag(tag);
    }

    /**
     * 开启AOP模式
     */
    static enableAspect() {
        Function.prototype.before = function (pre) {
            let _self = this;
            return function () {
                pre.apply(this, arguments);
                return _self.apply(this, arguments);
            };
        };
        Function.prototype.after = function (post) {
            let _self = this;
            return function () {
                let res = _self.apply(this, arguments);
                //第一个参数是返回值
                post.apply(this, [res, ...arguments]);
                return res;
            };
        };
    }
}

/**
 * 日志对象
 */
class LogUtils {

    static DEBUG = "DEBUG";

    static INFO = "INFO";

    static ERROR = "ERROR";

    static RAW = 0;

    static CHAT = 1;

    static TIP = 5;

    static JSON = 9;


    /**
     * 插件调试信息
     * @param msg
     */
    static debug(...msg) {
        if (Runtime.config.debug) {
            logger.info("[DEBUG] ", ...msg);
        }
    }

    /**
     * 插件提示信息
     * @param msg
     */
    static info(...msg) {
        logger.info(...msg);
    }

    /**
     * 插件错误信息
     * @param msg
     */
    static error(...msg) {
        logger.error(...msg);
    }

    /**
     * DEBUG信息广播
     * @param msg
     */
    static debugBroadcast(msg) {
        if (Runtime.config.debug) mc.broadcast(`${Format.Red}[${this.DEBUG}] ${msg}`, this.CHAT);
    }

    /**
     * INFO信息广播
     * @param msg
     */
    static infoBroadCast(...msg) {
        return mc.broadcast(`${Format.Aqua}[${this.INFO}] ${msg}`, this.CHAT);
    }

    /**
     * ERROR信息广播
     * @param msg
     */
    static errorBroadcast(...msg) {
        return mc.broadcast(`${Format.Red}[${this.ERROR}] ${msg}`, this.CHAT);
    }

    /**
     * 发送一个聊天调试信息
     * @param pl
     * @param msg
     */
    static debugChat(pl, msg) {
        return pl.tell(`${Format.Green}[${this.DEBUG}] ${msg}`, this.CHAT);
    }

    /**
     * 发送一个聊天通知消息
     * @param pl
     * @param msg
     */
    static infoChat(pl, msg) {
        return pl.tell(`${Format.Aqua}[${this.INFO}] ${msg}`, this.CHAT);
    }

    /**
     * 发送一个聊天错误消息
     * @param pl
     * @param msg
     */
    static errorChat(pl, msg) {
        return pl.tell(`${Format.Red}[${this.ERROR}] ${msg}`, this.CHAT);
    }

    static achievementChat(pl, msg) {
        pl.tell(msg);
    }

    static achievementBroadcast(msg) {
        mc.broadcast(msg);
    }


}

class Path {

    /**
     * 插件根目录
     * @type {string}
     */
    static ROOT_DIR = "./plugins/Achievement";

    /**
     * 语言文件目录
     * @type {string}
     */
    static LANG_DIR = `${this.ROOT_DIR}/Lang`;

    /**
     * 备份目录
     * @type {string}
     */
    static BACK_UP = `./plugins/Achievement_Backup`;

    /**
     * 玩家数据文件
     * @type {string}
     */
    static PLAYER_DATA_PATH = `${this.ROOT_DIR}/Data.json`;

    /**
     * 配置文件
     * @type {string}
     */
    static CONFIG_PATH = `${this.ROOT_DIR}/Config.json`;

    /**
     * 缓存文件
     * @type {string}
     */
    static CACHE_PATH = `${this.ROOT_DIR}/Cache.json`;


    /**
     * JSON后缀
     * @type {string}
     */
    static JSON_SUFFIX = ".json";

    static FILE_SP = "/";

    static concatDir(...paths) {
        return paths.join(this.FILE_SP) + this.FILE_SP;
    }

    static concatFile(...paths) {
        return paths.join(this.FILE_SP);
    }
}

/**
 * 语言管理对象
 */
class LangManager {

    /**
     * 收集语言信息
     * @param langGroup
     */
    static collectLang(langGroup) {
        this.collectLangEntry(langGroup);
        this.collectLangMenu(langGroup);
    }

    /**
     * 收集词条信息
     * @returns {{en_US: {}, zh_CN: {}}}
     */
    static collectEntry() {
        let entry = {};
        //将所有事件的词条收集到entry中
        EventProcessor.EVENT_PROCESSOR_LIST.forEach(processor => {
            if (!processor.ENTRY) return;
            Utils.checkDifferences(processor.ENTRY, entry, false);
        });

        return entry;
    }

    /**
     * 统计词条信息
     * @param entry
     */
    static statisticEntry(entry) {
        Runtime.entryTypeTotalCounts = Object.keys(entry).length;
        for (let type in entry) {
            let details = entry[type].details;
            if (details) Runtime.entryTotalCounts += Object.keys(entry[type].details).length;
            else LogUtils.error(Runtime.SystemInfo.init.invalidType, type);
        }
    }


    /**
     * 获取一个词条对象的缓存键值
     * @param type
     * @param key
     */
    static getCacheKey(type, key) {
        return `lang-${type}-${key}`;
    }


    /**
     * 获取词条对象
     * @returns {*}
     */
    static getLangEntry() {
        return Runtime.entry;
    }

    /**
     * 获取取一个词条的触发值，触发值为undefine即该词条不存在
     * @param type
     * @param key
     */
    static getAchievementTriggerName(type, key) {
        LogUtils.debug("开始词条匹配");
        let eqRes = this.eqMatch(type, key);
        LogUtils.debug(`type: ${type} key: ${key} 等值匹配-> type: ${type} trigger: ${eqRes}`);
        if (!Utils.isNullOrUndefined(eqRes)) return eqRes;
        let regRes = this.regxMatch(type, key);
        LogUtils.debug("等值匹配未查询到对应词条，开始正则匹配");
        LogUtils.debug(`type: ${type} key: ${key} 正则匹配-> type: ${type} trigger: ${regRes}`);
        if (!Utils.isNullOrUndefined(regRes)) return regRes;
        return undefined;
    }

    /**
     * 等值匹配
     * @param type
     * @param key
     * @returns {*}
     */
    static eqMatch(type, key) {
        if (this.getAchievementEntryType(type).details[key]) return key; else return undefined;
    }

    /**
     * 正则匹配
     * @param type
     * @param key
     */
    static regxMatch(type, key) {
        let achi_type = this.getAchievementEntryType(type);
        let details = achi_type.details;
        let regxObj = achi_type.regx;
        //尝试从缓存中读取历史正则匹配结果
        if (PersistentCache.has(key)) return details[PersistentCache.get(key)];
        //缓存读不到就从正则对象里匹配
        for (let regKey in regxObj) {
            if (new RegExp(regKey).test(key)) {
                let mapTrigger = regxObj[regKey];
                //匹配成功后缓存中,下次直接从缓存中读取结果
                PersistentCache.set(key, mapTrigger);
                return this.eqMatch(type, mapTrigger);
            }
        }
        return undefined;
    }

    /**
     * 获取一个指定的成就类型
     * @param type
     * @returns {*}
     */
    static getAchievementEntryType(type) {
        let entryType = Runtime.entry[type];
        if (!entryType) return undefined; else return entryType;
    }

    /**
     * 获取一个指定的成就词条
     */
    static getAchievementEntry(type, key) {
        let achiType = this.getAchievementEntryType(type);
        if (achiType) return achiType.details[key]; else return undefined;
    }


    /**
     * 初始化系统语言
     */
    static initSystemInfoLang() {
        Runtime.SystemInfo = Runtime.config.language === ZH_CN ? Constant.SystemInfo.zh_CN : Constant.SystemInfo.en_US;
    }

    /**
     * 收集词条信息
     * @param langGroup
     */
    static collectLangEntry(langGroup) {
        let entry = this.collectEntry();
        for (let langKey in langGroup) {
            langGroup[langKey].Entry = entry[langKey];
        }
    }


    static collectLangMenu() {

    }

    static getLangTypeDir(langType) {
        return `${Path.LANG_DIR}/${langType}`;
    }

    static getLangFilePath(langType, fileName) {
        return `${this.getLangTypeDir(langType)}/${fileName}${Path.JSON_SUFFIX}`;
    }

    /**
     * 语言文件组异步遍历器
     * 第一层循环根据语言创建目录 每一个语言目录的创建是并行的
     * 第二层循环创建对应语言的文件 每一个语言文件的创建也是并行的
     * 不过语言文件的创建依赖于目录的创建 所以两者是串行的
     * 需要注意的是，并不是所有时候异步的效率都比同步高
     * 只有在文件数据特别大的时候才能体现出差别
     * 所以实际耗时 = 创建目录最长的耗时 + 创建单个语言文件最长的耗时
     * @param outerResolver
     * @param innerResolver
     * @param langGroup
     */
    static langGroupIterator(langGroup, outerResolver, innerResolver) {
        return this.langTypeIterator(langGroup, async (dir, langType, groupData, langGroup) => {
            await outerResolver(dir, langType, groupData, langGroup);
            return this.langFileIterator(langGroup, langType, (path, fileName, data, langType, langGroup) => {
                return innerResolver(path, fileName, data, langType, langGroup);
            }).catch(err => {
                throw err;
            });
        });
    }

    /**
     * 语言类型异步遍历器
     * @param langDirResolver 语言目录处理器
     * @param langGroup 语言组
     */
    static langTypeIterator(langGroup, langDirResolver) {
        return AsyncUtils.iteratorAsync(langGroup, (langType, groupData) => {
            let dir = this.getLangTypeDir(langType);
            return langDirResolver(dir, langType, groupData, langGroup);
        });
    }

    /**
     * 语言文件异步遍历器
     * @param langType
     * @param langFileResolver
     * @param langGroup
     */
    static langFileIterator(langGroup, langType, langFileResolver) {
        return AsyncUtils.iteratorAsync(langGroup[langType], (fileName, data) => {
            let path = this.getLangFilePath(langType, fileName);
            return langFileResolver(path, fileName, data, langType, langGroup);
        });
    }

    /**
     *  并行创建语言文件
     */
    static initLangFile(langGroup) {
        return this.langGroupIterator(langGroup, (dir) => {
            if (IO.isNotExists(dir)) File.mkdir(dir);
        }, (path, fileName, data) => {
            if (IO.isNotExists(path)) IO.writeJsonFile(path, data);
        });
    }

    /**
     * 并行更新语言文件
     * @param langGroup
     * @returns {Promise<Awaited<*>[]>}
     */
    static updateLangFile(langGroup) {
        return this.langGroupIterator(langGroup, () => {
        }, (path, fileName, data) => {
            return Configuration.checkUpdateAndSave(path, data, false);
        });
    }

    /**
     * 根据配置的语言选项加载语言文件
     * @param langType
     * @param langGroup
     * @returns {Promise<boolean>}
     */
    static async loadLangFile(langType, langGroup) {
        let dir = this.getLangTypeDir(langType) + Path.FILE_SP;
        let langFiles = File.getFilesList(dir);
        LogUtils.debug(Runtime.SystemInfo.init.langDir, dir);
        for (const file of langFiles) {
            if (!file.includes(Path.JSON_SUFFIX)) continue;
            let filePath = dir + file;
            let langData = IO.readJsonFile(filePath);
            Utils.checkDifferences(langData, Runtime.entry, false);
            LogUtils.debug(Runtime.SystemInfo.init.langFile, file);
        }
        return true;
    }

}

/**
 * 运行时缓存对象
 */
class RuntimeCache {

    static cacheMap = new Map();


    static getCache(key) {
        return this.cacheMap.get(key);
    }

    static setCache(key, val) {
        if (Utils.isNullOrUndefined(key)) throw new Error("key值为undefined或者null");
        this.cacheMap.set(key, val);
    }

    static removeCache(key) {
        return this.cacheMap.delete(key);
    }

    static has(key) {
        return this.cacheMap.has(key);
    }

    static toString() {
        return JSON.stringify([...this.cacheMap.entries()]);
    }

}

/**
 * 持久缓存对象
 */
class PersistentCache {

    static cacheMap = {};

    static get(key) {
        if (key) return this.cacheMap[key];
        return undefined;
    }

    static set(key, val) {
        if (typeof key === "string") this.cacheMap[key] = val; else throw new Error("错误的key数据类型");
        this.save().catch(err => {
            LogUtils.error("缓存数据保存失败: ", err);
        });
    }

    static has(key) {
        if (key) return this.get(key) == true; else return false;
    }

    static remove(key) {
        this.cacheMap[key] = undefined;
    }

    static init(obj) {
        this.cacheMap = obj;
    }

    static save() {
        return IO.writeJsonFileAsync(Path.CACHE_PATH, this.cacheMap);
    }
}

/**
 * 配置类
 */
class Configuration {


    /**
     * 用于异步更新一个配置文件并保存
     * @param path
     * @param newData
     * @param deleted
     */
    static checkUpdateAndSave(path, newData, deleted) {
        return IO.readJsonFileAsync(path).then(result => {
            Utils.checkDifferences(newData, result, deleted);
            return IO.writeJsonFileAsync(path, result);
        });
    }

    /**
     * 填充运行时数据
     * @param config
     */
    static fillRuntimeData(config) {
        Runtime.config = config;
        Runtime.displayManger = DisplayManager.assign(Runtime.config.display);
        Runtime.rewardManager = RewardManager.assign(Runtime.config.reward);
    }

    /**
     * 加载配置文件
     * 其中插件目录必须同步加载,因为后面的配置文件依赖于根目录
     * 而后的三个配置文件相互独立互不影响，即并行加载
     * @returns {Promise<void>}
     */
    static async initConfigFile() {

        //配置文件
        const config = IO.isNotExistsAsync(Path.CONFIG_PATH).then((res) => {
            if (!res) return;
            return IO.writeJsonFileAsync(Path.CONFIG_PATH, DEFAULT_CONFIG);
        }).then(() => {
            LogUtils.debug(Runtime.SystemInfo.init.config);
        });

        //缓存文件
        const cache = IO.isNotExistsAsync(Path.CACHE_PATH).then((res) => {
            if (!res) return;
            return IO.writeJsonFileAsync(Path.CACHE_PATH, PersistentCache.cacheMap);
        }).then(() => {
            LogUtils.debug(Runtime.SystemInfo.init.cache);
        });

        //玩家数据文件
        const data = IO.isNotExistsAsync(Path.PLAYER_DATA_PATH).then((res) => {
            if (!res) return;
            return IO.writeJsonFileAsync(Path.PLAYER_DATA_PATH, DEFAULT_PLAYER_DATA);
        }).then(() => {
            LogUtils.debug(Runtime.SystemInfo.init.data);
        });

        //语言文件
        const lang = IO.isNotExistsAsync(Path.LANG_DIR).then((res) => {
            if (!res) return;
            return LangManager.initLangFile(LANG);
        }).then(() => {
            LogUtils.debug(Runtime.SystemInfo.init.lang);
        });

        await Promise.all([config, cache, data, lang]).catch(err => {
            LogUtils.error(Runtime.SystemInfo.init.configurationError, err);
            throw err;
        });
    }


    /**
     * 更新配置文件
     * @returns {Promise<void>}
     */
    static async updateConfigFile() {

        let isNeedToUpdateData = true;

        //加载缓存数据
        await IO.readJsonFileAsync(Path.CACHE_PATH).then(cache => {
            LogUtils.debug(Runtime.SystemInfo.init.persistenceCache);
            PersistentCache.init(cache);
        }).then(() => {
            let cacheVersion = PersistentCache.get(Constant.version);
            //如果缓存中没有版本信息或者与当前版本一致则没有必要更新数据
            if (!cacheVersion || cacheVersion === PLUGINS_INFO.version) isNeedToUpdateData = false;
        });
        if (!isNeedToUpdateData) return;
        this.backupPluginsData();
        //更新配置,配置文件必须保持与默认的格式严格一致
        const configUpdate = IO.isNotExistsAsync(Path.CONFIG_PATH).then(res => {
            if (res) return;
            return this.checkUpdateAndSave(Path.CONFIG_PATH, DEFAULT_CONFIG, true);
        }).then(res => {
            if (res) LogUtils.debug(Runtime.SystemInfo.init.configUpdate);
        });

        //更新语言文件
        const langUpdate = IO.isNotExistsAsync(Path.LANG_DIR).then(res => {
            if (res) return;
            return LangManager.updateLangFile(LANG);
        }).then(() => {

            let newTypeCount = Runtime.entryTypeTotalCounts - PersistentCache.get(Constant.typeCount);
            let newTotalCount = Runtime.entryTotalCounts - PersistentCache.get(Constant.totalCount);
            LogUtils.debug(Runtime.SystemInfo.init.langUpdate);
            LogUtils.info(`累计新增 ${newTypeCount} 种成就类型, ${newTotalCount} 个成就词条`);
        });

        await Promise.all([configUpdate, langUpdate]).catch(err => {
            LogUtils.error(Runtime.SystemInfo.init.updateError, err);
        });
    }


    /**
     * 备份插件数据
     */
    static backupPluginsData() {
        LogUtils.info(Runtime.SystemInfo.init.backUp);
        let date = new Date();
        let backPath = `${Path.BACK_UP}/${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}/`;
        let sourcePath = `${Path.ROOT_DIR}/`;
        IO.cloneDir(sourcePath, backPath);
        LogUtils.info(Runtime.SystemInfo.init.backUpSuccess + backPath);
    }

    /**
     * 主要负责从配置文件中读取数据
     */
    static async initRuntimeData() {

        //加载配置及及语言数据
        const configRuntime = IO.readJsonFileAsync(Path.CONFIG_PATH).then(config => {
            this.fillRuntimeData(config);
            LogUtils.debug(Runtime.SystemInfo.init.runtimeData);
        }).then(() => {
            return LangManager.loadLangFile(Runtime.config.language, LANG);
        }).then(() => {
            LogUtils.debug(Runtime.SystemInfo.init.runtimeLang);
        });

        //加载玩家插件数据
        const dataRunTime = IO.readJsonFileAsync(Path.PLAYER_DATA_PATH).then(data => {
            //初始化玩家运行数据
            PlDataManager.assign(data);
            LogUtils.debug(Runtime.SystemInfo.init.runtimePlData);
        });

        await Promise.all([configRuntime, dataRunTime]).catch((err) => {
            LogUtils.error(Runtime.SystemInfo.init.runtimeError, err);
        });
    }

    /**
     * 预准备数据
     */
    static prepareData() {
        try {
            LangManager.collectLang(LANG);
            LangManager.initSystemInfoLang();
            Utils.enableAspect();
        } catch (err) {
            LogUtils.error(err);
            throw err;
        }
    }


    /**
     * 插件初始化完成后的数据处理
     */
    static postData() {
        //将版本信息写入缓存
        PersistentCache.set(Constant.version, PLUGINS_INFO.version);
        //将成就类型数量写入缓存中
        PersistentCache.set(Constant.typeCount, Runtime.entryTypeTotalCounts);
        //将词条类型数量写入缓存中
        PersistentCache.set(Constant.totalCount, Runtime.entryTotalCounts);
        //统计词条数量
        LangManager.statisticEntry(Runtime.entry);
    }

    /**
     * 初始化启动函数
     * 运行时数据的加载必须基于配置文件已经加载完成的条件
     * 所以其各自内部是并行，总体是串行
     * @returns {Promise<void>}
     */
    static async init() {
        this.prepareData();
        await this.initConfigFile();
        await this.updateConfigFile();
        await this.initRuntimeData();
    }
}

/**
 * 玩家数据对象
 */
class PlayerData {

    /**
     * 玩家xboxuuid 基于网络唯一
     */
    xuid;

    /**
     * 已完成成就数量
     */
    finished;

    constructor(xuid, name) {
        this.xuid = xuid;
        this.finished = 0;
    }

    static assign(source) {
        return Object.assign(new PlayerData(), source);
    }

}

/**
 * 玩家数据管理对象
 */
class PlDataManager {

    /**
     * 玩家数据
     */
    static plData;

    /**
     * 获取所有的玩家数据
     * @returns {*}
     */
    static getPlData() {
        return this.plData;
    }

    /**
     * 初始化数据
     * @param obj
     */
    static assign(obj) {
        this.plData = obj;
    }

    /**
     * 获取一个玩家的成就信息
     * @param xuid
     * @returns {undefined|*}
     */
    static getPlAchiInfo(xuid) {
        if (!Utils.isNullOrUndefined(xuid)) return this.plData[xuid]; else return undefined;
    }

    /**
     * 设置玩家成就信息
     * @param xuid
     * @param obj
     * @returns {boolean}
     */
    static setPlAchiInfo(xuid, obj) {
        if (!Utils.isNullOrUndefined(xuid)) {
            return this.getPlData()[xuid] = obj;
        } else return false;
    }


    /**
     * 增加一个玩家成就信息
     * @param xuid
     * @returns {boolean}
     */
    static addPlAchiInfo(xuid) {
        if (!this.hasPlayerInfo(xuid)) {
            return this.setPlAchiInfo(xuid, new PlayerData(xuid));
        }
        return false;
    }

    /**
     * 判断某个玩家数据是否存在
     */
    static hasPlayerInfo(xuid) {
        return xuid && this.getPlAchiInfo(xuid);
    }

    /**
     * 获取一个玩家成就类型的信息
     * @param xuid
     * @param type
     */
    static getPlAchiType(xuid, type) {
        if (!this.hasPlayerInfo(xuid)) return undefined;
        return this.getPlAchiInfo(xuid)[type];
    }

    /**
     * 设置一个玩家成就类型的数据
     * @param xuid
     * @param type
     * @param obj
     * @returns {boolean}
     */
    static setPlAchiType(xuid, type, obj) {
        if (!this.hasPlayerInfo(xuid)) return false;
        return this.getPlAchiInfo(xuid)[type] = obj;
    }

    /**
     * 判断某个玩家是否含有某个成就类型的数据
     * @param xuid
     * @param type
     * @returns {boolean|*}
     */
    static hasPlAchiType(xuid, type) {
        return type && this.getPlAchiType(xuid, type);
    }

    /**
     * 获取一个玩家某词条信息数据
     * @param xuid
     * @param type
     * @param key
     */
    static getPlAchiKey(xuid, type, key) {
        if (!this.hasPlAchiType(xuid, type)) return undefined;
        return this.getPlAchiType(xuid, type)[key];
    }

    /**
     * 设置某玩家的词条信息
     * @param xuid
     * @param type
     * @param key
     * @param obj
     * @returns {boolean|*}
     */
    static setPlAchiKey(xuid, type, key, obj) {
        if (!this.hasPlAchiType(xuid, type)) return false;
        return this.getPlAchiType(xuid, type)[key] = obj;
    }

    /**
     * 判断一个玩家是否含有某个成绩词条
     * @param xuid
     * @param type
     * @param key
     * @returns {*}
     */
    static hasPlAchiKey(xuid, type, key) {
        return key && this.getPlAchiKey(xuid, type, key);
    }

    static initPlayerInfo(pl, type) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        let xuid = pl.xuid;
        //如果没有玩家信息就初始化玩家信息
        if (!this.hasPlayerInfo(xuid)) this.addPlAchiInfo(xuid);
        //如果该成就类型不存在就初始化该成就类型
        if (!this.hasPlAchiType(xuid, type)) this.setPlAchiType(xuid, type, {});
    }

    /**
     * 异步保存玩家数据
     * @returns {Promise<unknown>}
     */
    static saveAsync() {
        return IO.writeJsonFileAsync(Path.PLAYER_DATA_PATH, this.getPlData());
    }

    static getCacheKey(pl, type, key) {
        return `pl-${pl.xuid}-${type}-${key}`;
    }

}

/**
 * 玩家成绩细节类
 */
class PlayerAchievement {

    /**
     * 完成状态
     */
    status;

    /**
     * 完成时间
     */
    time;

    /**
     * 完成坐标
     */
    pos;

    constructor(status, time, pos) {
        this.status = status;
        this.time = time;
        this.pos = {
            x: pos.x.toFixed(1), y: pos.y.toFixed(1), z: pos.z.toFixed(1), dim: pos.dim
        };
    }

    static assign(obj) {
        return Object.assign(new PlayerAchievement(), obj);
    }
}

/**
 * 成就展示类
 */
class DisplayManager {

    /**
     * 正常音调
     * @type {number}
     */
    normalPitch = 1;

    /**
     * 慢音调
     * @type {number}
     */
    slowPitch = 0.3;

    /**
     * 快音调
     * @type {number}
     */
    fastPitch = 1.5;


    /**
     * 展示作用域枚举常量
     * @type {{PRIVATE_SCOPE: number, NULL_SCOPE: number, PUBLIC_SCOPE: number}}
     */
    SCOPE = {
        PUBLIC_SCOPE: 2, PRIVATE_SCOPE: 1, NULL_SCOPE: 0
    };

    /**
     * 音调组
     * @type {[number,number,number]}
     */
    pitchArray = [this.normalPitch, this.fastPitch, this.slowPitch];

    /**
     * 提示音模板
     * @type {string}
     */
    toastTemplate = "execute ${target} ~ ~ ~/playsound ${sound} @s ~ ~ ~ ${volume} ${pitch}";

    /**
     * 展示作用域
     * 0 - 不展示
     * 1 - 个人展示
     * 2 - 广播展示
     * @type {number}
     */
    scope;

    /**
     * 弹窗开关项
     * @type {Object}
     */
    toast;

    /**
     * 提示音开关项
     * @type {Object}
     */
    beep;

    /**
     * 聊天栏开关项
     * @type {Object}
     */
    chatBar;

    constructor() {
    }

    static assign(display) {
        return Object.assign(new DisplayManager(), display);
    }

    /**
     * 成就聊天栏展示
     * @param pl
     * @param entry
     */
    async chatBarDisplay(pl, entry) {
        if (!this.chatBar.enable) return;
        let finalMsg = Utils.loadTemplate(this.chatBar.chatBarMsg, pl.name, entry.msg, entry.condition);
        LogUtils.debug(Utils.loadTemplate(Runtime.SystemInfo.display.chatBar, this.scope, pl.name, finalMsg));
        switch (this.scope) {
            case this.SCOPE.PUBLIC_SCOPE : {
                LogUtils.achievementBroadcast(finalMsg);
            }
                break;
            case this.SCOPE.PRIVATE_SCOPE : {
                LogUtils.achievementChat(pl, finalMsg);
            }
                break;
        }
        return true;
    }

    /**
     * 成就聊天栏弹窗
     * @param pl
     * @param entry
     */
    async toastDisplay(pl, entry) {
        if (!this.toast.enable) return;
        LogUtils.debug(Utils.loadTemplate(Runtime.SystemInfo.display.toast, pl.name, entry.msg, entry.condition));
        return pl.sendToast(Utils.loadTemplate(this.toast.toastTitle, entry.msg), Utils.loadTemplate(this.toast.toastMsg, entry.condition));
    }

    /**
     * 成就提示音
     */
    async beepDisplay(pl) {
        if (!this.beep.enable) return;
        let randomPitch = this.pitchArray[Math.floor(Math.random() * this.pitchArray.length)];
        LogUtils.debug(Utils.loadTemplate(Runtime.SystemInfo.display.beep, pl.name, this.beep.type, this.beep.volume, randomPitch));
        return mc.runcmdEx(Utils.loadTemplate(this.toastTemplate, pl.name, this.beep.type, this.beep.volume, randomPitch));
    }

    /**
     * 展示成就
     */
    displayAchievementAsync(pl, entry) {
        return Promise.all([this.chatBarDisplay(pl, entry), this.toastDisplay(pl, entry), this.beepDisplay(pl)]);
    }
}

/**
 * 成就奖励管理对象对象
 */
class RewardManager {

    /**
     * 经济配置项
     */
    economy;

    /**
     * exp配置项
     */
    exp;

    /**
     * 物品配置项
     */
    item;

    constructor() {
    }

    static assign(reward) {
        return Object.assign(new RewardManager(), reward);
    }

    /**
     * 经济奖励
     * @param pl
     * @returns {Promise<*>}
     */
    async economyReward(pl) {
        if (!this.economy.enable) return;
        //输出经济奖励信息
        LogUtils.debug(Utils.loadTemplate(Runtime.SystemInfo.reward.economyInfo, pl.name, this.economy.type, this.economy.value));
        switch (this.economy.type) {
            case "llmoney": {
                return await pl.addMoney(this.economy.value);
            }
            case "score": {
                let scoreObjective = mc.getScoreObjective(this.economy.score);
                if (!scoreObjective) {
                    LogUtils.errorChat(pl, Utils.loadTemplate(Runtime.SystemInfo.reward.nonExistentScore, this.economy.score));
                    return Promise.reject();
                }
                return pl.addScore(this.economy.score, this.economy.value);
            }
        }
    }

    /**
     * 物品奖励
     * @param pl
     * @returns {Promise<void>}
     */
    async itemReward(pl) {
        if (!this.item.enable) return;
        LogUtils.debug(Utils.loadTemplate(Runtime.SystemInfo.reward.itemInfo, pl.name, this.item.type, this.item.count, this.item.lore));
        let item = mc.newItem(this.item.type, this.item.count);
        item.setLore(this.item.lore);
        return pl.giveItem(item);
    }

    /**
     * 经验奖励
     * @param pl
     * @returns {Promise<void>}
     */
    async expReward(pl) {
        if (!this.exp.enable) return;
        LogUtils.debug(Utils.loadTemplate(Runtime.SystemInfo.reward.expInfo, pl.name, this.exp.value));
        return pl.addExperience(this.exp.value);
    }

    /**
     * 物品奖励，经济奖励，经验奖励三个操作异步并行处理，互不影响
     * @param pl
     * @returns {Promise<Awaited<*|void>[]>}
     */
    rewardAsync(pl) {
        return Promise.all([this.economyReward(pl), this.itemReward(pl), this.expReward(pl)]);
    }

}

/**
 * 成就词条对象
 */
class Achievement {

    /**
     * 是否启用
     */
    enable;
    /**
     * 成就信息
     */
    msg;

    /**
     * 成就达成条件
     */
    condition;

    constructor(msg, condition) {
        this.enable = true;
        this.msg = msg;
        this.condition = condition;
    }

    static assign(obj) {
        return Object.assign(new Achievement(), obj);
    }
}

/**
 * 成就管理对象
 */
class AchievementManager {

    /**
     * 参数校验
     * @param params
     * @returns {boolean}
     */
    static paramsValidate(...params) {
        LogUtils.debug("请求参数列表: ", ...arguments);
        //参数校验
        if (Utils.hasNullOrUndefined(...arguments)) {
            LogUtils.debug("请求参数校验不通过");
            return false;
        } else {
            LogUtils.debug("请求参数校验已通过");
            return true;
        }
    }

    /**
     * 是否有映射的triggerName
     * @param type
     * @param key
     * @returns {*|undefined}
     */
    static hasTriggerName(type, key) {
        let triggerName = LangManager.getAchievementTriggerName(type, key);//有些词条会存在映射，映射得到的最终结果才是词条 即 key -> mapEntry
        //根据key值获取词条真实的触发值
        if (Utils.isNullOrUndefined(triggerName)) {
            LogUtils.debug("未查询到对应的成就词条");
            return undefined;
        } else {
            LogUtils.debug("已查询到对应的成就词条");
            return triggerName;
        }
    }

    /**
     * 词条是否可用
     * @param type
     * @param trigger
     * @returns {{enable}|*|undefined}
     */
    static isEntryAvailable(type, trigger) {
        //获取真实对应的词条
        let mapEntry = LangManager.getAchievementEntry(type, trigger);
        //是否存在
        if (Utils.isNullOrUndefined(mapEntry)) {
            LogUtils.debug("检测到成就词条不可用");
            return undefined;
        }
        //判断该词条是否启用
        if (!mapEntry.enable) {
            LogUtils.debug("检测到成就词条未启用");
            return undefined;
        } else {
            LogUtils.debug("检测到成就词条已启用");
            LogUtils.debug(`词条信息: ${mapEntry.msg} 词条条件: ${mapEntry.condition}`);
            return mapEntry;
        }
    }

    /**
     * 是否完成某一个成就
     * @param pl
     * @param type
     * @param trigger
     */
    static isFinishedAchievement(pl, type, trigger) {
        //是否完成成就
        if (this.judgeAchievement(pl, type, trigger)) {
            LogUtils.debug("玩家曾经已完成该成就");
            return true;
        } else {
            LogUtils.debug("玩家曾经未完成该成就");
            return false;
        }
    }

    /**
     * 更新一个玩家对应的成就状态
     * @param pl
     * @param type
     * @param key
     * @param status
     */
    static updateAchievement(pl, type, key, status) {
        let originalPlData = {};
        Utils.checkDifferences(PlDataManager.getPlAchiInfo(pl.xuid), originalPlData, false);//将修改前的玩家原始数据深拷贝
        try {
            if (status) {
                //如果为true，判定为完成成就，则记录玩家达成成就的时间，坐标，
                PlDataManager.setPlAchiKey(pl.xuid, type, key, new PlayerAchievement(status, new Date().toLocaleString(), pl.pos));
                PlDataManager.getPlAchiInfo(pl.xuid).finished++;
            } else {
                //为false，则判定为删除成就，将对应的数据置为undefined
                PlDataManager.setPlAchiKey(pl.xuid, type, key, undefined);
                PlDataManager.getPlAchiInfo(pl.xuid).finished--;
            }
        } catch (err) {
            LogUtils.error("修改玩家成就装状态失败: ", err);
            PlDataManager.setPlAchiInfo(pl.xuid, originalPlData);//发生异常后，将修改前的原始数据写入玩家数据中
            return false;
        }
        //修改过玩家成就状态后，重新写入缓存。
        RuntimeCache.setCache(PlDataManager.getCacheKey(pl, type, key), status);
        LogUtils.debug("修改玩家成就状态成功");
        return true;
    }

    /**
     * 获取一个玩家的成就状态
     */
    static judgeAchievement(pl, type, key) {
        //获取缓存键值
        const cacheKey = PlDataManager.getCacheKey(pl, type, key);
        //如果击中缓存就直接返回缓存
        if (RuntimeCache.has(cacheKey)) return RuntimeCache.getCache(cacheKey);
        //玩家不存在就初始化玩家数据
        if (!PlDataManager.hasPlayerInfo(pl.xuid)) PlDataManager.initPlayerInfo(pl, type);
        //读取玩家数据判断是否完成成就
        let isFinished = Boolean(PlDataManager.getPlAchiKey(pl.xuid, type, key));
        //读取到玩家成就状态时，将其存入缓存
        RuntimeCache.setCache(cacheKey, isFinished);
        return isFinished;
    }

    /**
     * @param pl 玩家对象
     * @param type 成就类型，基本等于监听事件的名称
     * @param key 即触发器类型，如在物品栏变化事件中获得了物品工作台触发了此成就，工作台物品的type就是触发器
     * @param promises promise数组
     */
    static async process({pl, type, key}) {
        LogUtils.debug("-----接收到成就处理请求-----");
        //进行参数校验
        if (!this.paramsValidate(...arguments)) return Promise.reject();
        let trigger;
        //读取对应映射的触发值
        if (Utils.isNullOrUndefined(trigger = this.hasTriggerName(type, key))) return Promise.reject();
        let entry;
        //获取真实对应的词条
        if (Utils.isNullOrUndefined(entry = this.isEntryAvailable(type, trigger))) return Promise.reject();
        //判断玩家是否已完成成就
        if (this.isFinishedAchievement(pl, type, trigger)) return Promise.reject();
        //修改玩家成就状态
        if (!this.updateAchievement(pl, type, trigger, true)) return Promise.reject();
        LogUtils.debug("-----成就处理通过,判定为完成成就,准备异步后处理-----");
        //成就完成后处理
        return this.postProcess(pl, entry);
    }

    /**
     * 处理结果
     * @param awaitRes
     * @returns {Promise<never>|Promise<undefined | Awaited<*>[]>}
     */
    static processAsync(awaitRes) {
        return Utils.isNullOrUndefined(awaitRes) ? Promise.reject() : AchievementManager.process(awaitRes).catch(err => {
            LogUtils.debug("-----成就处理不通过,过程中有条件不符合-----");
            throw err;
        });
    }


    /**
     * 成就完成后的一些数据处理，
     * 所有操作都是异步并行，相互并不影响
     * 展示成就操作，成就奖励操作，成就数据保存操作
     * @param pl
     * @param entry
     * @returns {Promise<Awaited<unknown>[]>}
     */
    static async postProcess(pl, entry) {
        return Promise.all([Runtime.rewardManager.rewardAsync(pl), Runtime.displayManger.displayAchievementAsync(pl, entry), PlDataManager.saveAsync(), AfterFinished.process(pl, PlDataManager.getPlAchiInfo(pl.xuid))//成就达成后的成就
        ]);
    }

}


/**
 * 概述
 * 在成就插件中，每一个监听事件都是一个独立的class，可能会觉得多此一举，或者觉得很啰嗦
 * 但是这么做的好处非常多，最最最重要的就是每一个事件处理类中只需要关注自身的逻辑，且只对外暴露
 * EVENT - 事件名
 * ENTRY - 该事件下所包含的成就词条
 * process() - 这事件处理方法，同时也是监听回调方法。
 *
 * 词条
 * 后续如果需要在一个事件中增加新的成就逻辑，只需要修改事件处理类中内部的代码即可
 * 与以往不同的是，现在每一个事件的词条都是相互独立的，事件与事件之间不再关心其他事件的词条情况，
 * 在编写代码时只需要关注当前事件的词条即可，而后续的词条收集工作交给LangManager来完成
 *
 * 说明
 * 1.每一个词条类型应该为如下格式
 * achi_type_name:{
 *     enable:true,
 *     name:"displayName",
 *     details:{
 *         key:new Achievement(msg,condition)
 *     },
 *     regx:{}
 * }
 * achi_type_name即成就类型名，displayName即对于用户而言展示的名称，details即该成就类型所对应的词条细节
 * key值可以理解为一个成就词条的触发器，而每一个成就词条都必须是一个Achievement对象，包含msg-成就信息，condition-达成条件
 * 2.每一个事件处理类的成就achi_type_name值可以与其他事件重复，即代表这两个事件是同一种类型的成就
 * 3.如果一个事件处理类中没有ENTRY属性，则在词条收集工作进行时将不会包含该事件，这类事件通常是用作辅助数据处理，并不需要对应的成就词条。
 */

class NumberChange {

    static EVENT = "numberChange";

    static EventImplList = ["numberChangeImpl"];


    static numberChangeImpl(pl, type, num, multipart = false) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        EventProcessor.eventImplsProcess(NumberChange, [pl, type, num, multipart], NumberChange.EventImplList).catch(err => {
            LogUtils.error(`${NumberChange.EVENT}: `, err);
        });
    }

    /**
     * 默认实现
     * @param pl
     * @param type
     * @param num
     * @param multipart
     * @returns {Promise<never>|Promise<*[]>|Promise<{pl, type, key: string}>}
     */
    static defaultImpl(pl, type, num, multipart) {
        LogUtils.debug("数字成就实现");
        LogUtils.debug(1);
        //防抖
        if (EventProcessor.antiEventShake(pl, type)) return Promise.reject();
        //计分板防抖
        LogUtils.debug(3);
        //获取词条类型
        let entryType = LangManager.getAchievementEntryType(type);
        LogUtils.debug(4);
        //判断对应数字类型的成就是否存在或者是否启用
        if (!entryType || !entryType.enable) return Promise.reject();
        LogUtils.debug(5);
        //最后进行数字逻辑处理
        return multipart ? NumberChange.multipartImpl(pl, type, num, entryType) : NumberChange.singleImpl(pl, type, num, entryType);
    }


    /**
     * 一次逻辑只会触发一个值
     * @param pl
     * @param type
     * @param num
     * @param entryType
     * @returns {Promise<{pl, type, key: string}>}
     */
    static async singleImpl(pl, type, num, entryType) {
        for (let boolExp in entryType.details) {
            if (RuntimeCache.has(PlDataManager.getCacheKey(pl, type, boolExp))) continue;
            if (NumberChange.calculateExp(type, boolExp, num)) {
                return {
                    pl, type, key: boolExp
                };
            }
        }
    }

    /**
     * 一次逻辑会触发多个值
     * @param pl
     * @param type
     * @param num
     * @param entryType
     * @returns {Promise<*[]>}
     */
    static async multipartImpl(pl, type, num, entryType) {
        let res = [];
        let key = undefined;
        for (let boolExp in entryType.details) {
            key = boolExp;
            if (RuntimeCache.has(PlDataManager.getCacheKey(pl, type, boolExp))) continue;
            if (NumberChange.calculateExp(type, boolExp, num)) {
                res.push({pl, type, key});
            }
        }
        return res;
    }

    /**
     * 获取数字缓存key
     * @param type
     * @param exp
     * @param num
     * @returns {string}
     */
    static getNumCacheKey(type, exp, num) {
        return `num-${type}-${exp}-${num}`;
    }

    /**
     * 计算表达式
     * @param type
     * @param boolExp
     * @param num
     * @returns {boolean}
     */
    static calculateExp(type, boolExp, num) {
        let expRes;
        //获取缓存key
        let expCacheKey = NumberChange.getNumCacheKey(type, boolExp, num);
        //如果击中缓存，直接从缓存中读取
        if (RuntimeCache.has(expCacheKey)) {
            expRes = RuntimeCache.getCache(expCacheKey);
        } else {//未击中缓存则计算表达式
            expRes = Utils.parseStrBoolExp(boolExp, num);
        }
        return expRes;
    }

}

class StringEqual {

    static EVENT = "stringEqual";

    static EventImplList = ["defaultImpl"];

    static stringEqualImpl(pl, type, key) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (Utils.isShaking(pl, type)) return;
        EventProcessor.antiEventShake(pl, type);
        EventProcessor.eventImplsProcess(StringEqual, [pl, type, key], StringEqual.EventImplList).catch(err => {
            LogUtils.error(`${StringEqual.EVENT}: `, err);
        });
    }

    /**
     * 十分简单的逻辑，不能再简单了
     * @param pl 玩家对象
     * @param type 成就类型
     * @param key 成就触发值
     * @param tag 防抖tag 根据实际情况而定，有时候是key有时候是type
     * @returns {{pl, type, key}}
     */
    static async defaultImpl(pl, type, key, tag) {
        LogUtils.debug("字符串实现");
        LogUtils.debug("1");
        //类型防抖
        if (EventProcessor.antiEventShake(pl, tag)) return Promise.reject();
        LogUtils.debug("2");
        //如果击中缓存则说明该成就已经完成，不需要再去判断
        if (RuntimeCache.has(PlDataManager.getCacheKey(pl, type, key))) return Promise.reject();
        LogUtils.debug("3");
        //获取词条类型
        let entryType = LangManager.getAchievementEntryType(type);
        LogUtils.debug("4");
        //判断对应类型的成就是否存在或者是否启用
        if (!entryType || !entryType.enable) return Promise.reject();
        LogUtils.debug("5");
        return {
            pl, type, key
        };
    }
}

class SpecialType {

    static EVENT = "specialEvent";

    static TYPE = "special";

    static specialImpl(pl, key, isNum = false, multipart = false) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (Utils.isShaking(pl, SpecialType.TYPE)) return;
        EventProcessor.antiEventShake(pl, SpecialType.TYPE);
        EventProcessor.eventImplsProcess(StringEqual, [pl, key, isNum, multipart], StringEqual.EventImplList).catch(err => {
            LogUtils.error(`${SpecialType.EVENT}: `, err);
        });
    }

    /**
     * 默认实现
     * @param pl
     * @param key
     * @param isNum
     * @param multipart
     * @returns {Promise<*[]|{pl, type, key: string}>|{pl, type, key}}
     */
    static defaultImpl(pl, key, isNum, multipart) {
        return isNum ? SpecialType.defaultNumberImpl(pl, SpecialType.TYPE, key, multipart) : SpecialType.defaultStringImpl(pl, SpecialType.TYPE, key);
    }

    /**
     * 字符串成就实现
     * @param pl
     * @param type
     * @param key
     * @returns {{pl, type, key}}
     */
    static async defaultStringImpl(pl, type, key) {
        return StringEqual.defaultImpl(pl, type, key, key);
    }


    /**
     * 数字成就实现
     * @param pl
     * @param type
     * @param num
     * @param multipart
     * @returns {Promise<*[]|{pl, type, key: string}>}
     */
    static async defaultNumberImpl(pl, type, num, multipart) {
        return NumberChange.defaultImpl(pl, type, num, multipart);
    }

}

class Join {

    /**
     * 玩家加入游戏
     * @type {string}
     */
    static EVENT = "onJoin";

    /**
     * 成就词条
     * @type Object
     */
    static ENTRY = {
        zh_CN: {
            [SpecialType.TYPE]: {
                enable: true, name: "特殊成就", details: {
                    join: new Achievement("Hello World!", "首次进入服务器"),
                }, regx: {}
            }
        }, en_US: {}
    };


    static EventImplList = ["defaultImpl"];


    /**
     * 玩家进入游戏
     * @param pl
     */
    static process(pl) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (EventProcessor.antiEventShake(pl, Join.EVENT)) return;
        LogUtils.debug(`参数列表:`, ...arguments);
        LogUtils.debug(`事件:${Join.EVENT} 名称:玩家进入服务器 对象:${pl.name}`);
        EventProcessor.eventImplsProcess(Join, [pl], Join.EventImplList).catch((err) => {
            LogUtils.error(`${Join.EVENT}: `, err);
        });
    }

    /**
     * 默认实现
     * @param pl
     * @returns [{Promise<{pl, type: string, key: string}>}]
     */
    static async defaultImpl(pl) {
        const key = "join";
        return SpecialType.defaultImpl(pl, key, false, false);
    }

}

class Left {

    /**
     * 玩家离开游戏
     * @type {string}
     */
    static EVENT = "onLeft";

    /**
     * 玩家离开游戏
     * @param pl
     */
    static process(pl) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (EventProcessor.antiEventShake(pl, Left.EVENT)) return;
        //玩家退出游戏时要把一切tag删了
        EventProcessor.EVENT_PROCESSOR_LIST.forEach(processor => {
            if (processor.EVENT) {
                pl.removeTag(processor.EVENT);
            }
        });
        Object.keys(LangManager.getLangEntry()).forEach(type => {
            pl.removeTag(type);
        });
    }

}

class ChangeDim {


    /**
     * 玩家切换维度
     * @type {string}
     */
    static EVENT = "onChangeDim";

    static EventImplList = ["defaultImpl"];

    static ENTRY = {
        zh_CN: {
            changeDim: {
                enable: true, name: "维度成就", details: {
                    "0": new Achievement("真是美好的世界", "返回主世界"),
                    "1": new Achievement("地狱空空荡荡，魔鬼都在人间", "到达地狱"),
                    "2": new Achievement("永恒、无星暗夜的维度", "到达末地")
                }, regx: {}
            }
        }, en_US: {}
    };

    /**
     * 玩家维度切换
     * @param pl
     * @param dimid
     */
    static process(pl, dimid) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (EventProcessor.antiEventShake(pl, ChangeDim.EVENT)) return;
        LogUtils.debug(`参数列表:`, ...arguments);
        LogUtils.debug(`事件:${ChangeDim.EVENT} 名称:玩家维度切 玩家:${pl.name} 维度:${dimid}`);
        EventProcessor.eventImplsProcess(ChangeDim, [pl, dimid], ChangeDim.EventImplList).catch(err => {
            LogUtils.error(`${ChangeDim.EVENT}: `, err);
        });
    }

    static defaultImpl(pl, dimid) {
        const type = "changeDim";
        return StringEqual.defaultImpl(pl, type, dimid, type);
    }
}

class Destroy {

    /**
     * 玩家破坏方块完成
     * @type {string}
     */
    static EVENT = "onDestroyBlock";


    static ENTRY = {
        zh_CN: {
            destroyBlock: {
                enable: true, name: "挖掘成就", details: {
                    "minecraft:log": new Achievement("要致富，先撸树!", "首次砍掉原木"),
                    "minecraft:stone": new Achievement("疯狂的石头!", "首次挖掘石头"),
                    "minecraft:coal_ore": new Achievement("满面尘灰烟火色，两鬓苍苍十指黑", "首次挖掘煤矿"),
                    "minecraft:iron_ore": new Achievement("来点硬的!", "首次挖掘铁矿"),
                    "minecraft:gold_ore": new Achievement("黄金矿工,黄金精神！", "首次挖掘金矿"),
                    "minecraft:diamond_ore": new Achievement("谁不喜欢钻石呢?", "首次挖掘金矿"),
                    "minecraft:ancient_debris": new Achievement("远古的残骸", "首次挖掘远古残骸"),
                    "minecraft:lapis_ore": new Achievement("附魔时间到！", "首次挖掘青金石矿"),
                    "minecraft:redstone_ore": new Achievement("服务器感到了一丝危机", "首次挖掘红石矿"),
                    "minecraft:copper_ore": new Achievement("这个东西有什么用呢？", "首次挖掘铜矿"),
                    "minecraft:emerald_ore": new Achievement("村民捕获器", "首次挖掘绿宝石矿"),
                    "minecraft:end_stone": new Achievement("虚无的方块", "首次挖掘末地岩"),
                    "minecraft:netherrack": new Achievement("布满腐败血肉的肮脏物体", "首次挖掘地狱岩"),
                    "minecraft:glass": new Achievement("美好的事物就是用来破坏的", "首次破坏玻璃"),
                    "minecraft:stained_glass": new Achievement("即便染了色，美好的事物也还是用来破坏的", "首次破坏染色玻璃"),
                    "minecraft:obsidian": new Achievement("黑曜石之歌", "首次挖掘黑曜石"),
                    "minecraft:bedrock": new Achievement("你这家伙作弊了是吧", "首次破坏基岩"),
                    "minecraft:grass": new Achievement("草!(一种植物)", "首次挖掘草方块"),
                    "minecraft:bee_nest": new Achievement("嗡嗡嗡~ 麻烦来了", "首次破坏蜂巢"),
                    "minecraft:amethyst_block": new Achievement("美丽迷人的紫水晶", "首次破坏紫水晶母岩"),
                    "minecraft:leaves": new Achievement("某瑞典人：How dare you !", "首次剪掉树叶"),
                }, regx: {
                    "minecraft:log": "minecraft:log"
                }
            },

        }, en_US: {}
    };

    static EventImplList = ["defaultImpl"];

    /**
     * 玩家破坏方块完成
     * @param pl
     * @param bl
     */
    static process(pl, bl) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (EventProcessor.antiEventShake(pl, Destroy.EVENT)) return;
        LogUtils.debug(`参数列表:`, ...arguments);
        LogUtils.debug(`事件:${Destroy.EVENT} 名称:玩家破坏方块 玩家:${pl.name} 方块:${bl.type}`);
        EventProcessor.eventImplsProcess(Destroy, [pl, bl], Destroy.EventImplList).catch(err => {
            LogUtils.error(`${Destroy.EVENT}: `, err);
        });

    }

    static defaultImpl(pl, bl) {
        const type = "destroyBlock";
        return StringEqual.defaultImpl(pl, type, bl.type, type);
    }
}

class Place {

    /**
     * 玩家放置完方块
     * @type {string}
     */
    static EVENT = "afterPlaceBlock";


    static ENTRY = {
        zh_CN: {
            place: {
                enable: true, name: "放置成就", details: {
                    "minecraft:flower_pot": new Achievement("准备园艺", "放置一个花盆"),
                    "minecraft:sapling": new Achievement("环保工作", "种一颗树苗"),
                    "minecraft:sign": new Achievement("告诉大家伙!", "放置一个告示牌"),
                    "minecraft:bell": new Achievement("咚咚咚", "放置一个钟"),
                    "minecraft:tnt": new Achievement("准备干点坏事", "放置TNT"),
                    "minecraft:beacon": new Achievement("老远就能看见了", "放置一个信标"),
                    "minecraft:brewing_stand": new Achievement("炼金时间到", "放置一个炼药台"),
                }, regx: {
                    "_sign": "minecraft:sign"
                }
            }
        }, en_US: {}
    };

    static EventImplList = ["defaultImpl"];

    static process(pl, bl) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (EventProcessor.antiEventShake(pl, Place.EVENT)) return;
        LogUtils.debug(`参数列表:`, ...arguments);
        LogUtils.debug(`事件:${Place.EVENT} 名称:玩家放置方块 玩家:${pl.name} 方块:${bl.type}`);
        EventProcessor.eventImplsProcess(Place, [pl, bl], Place.EventImplList).catch(err => {
            LogUtils.error(`${Place.EVENT}: `, err);
        });
    }


    static defaultImpl(pl, bl) {
        const type = "place";
        return StringEqual.defaultImpl(pl, type, bl.type, type);
    }
}

class PlDie {
    /**
     * 玩家死亡
     * @type {string}
     */
    static EVENT = "onPlayerDie";

    static ENTRY = {
        zh_CN: {
            death: {
                enable: true, name: "死亡成就", details: {
                    "minecraft:creeper": new Achievement("突如其来的惊喜!", "死于苦力怕"),
                    "minecraft:zombie": new Achievement("倒在了尸潮中", "死于僵尸"),
                    "minecraft:skeleton": new Achievement("中门对狙", "死于小白"),
                    "minecraft:stray": new Achievement("烦人的减速！", "死于流浪者"),
                    "minecraft:zombie_pigman": new Achievement("何必呢？", "死于僵尸猪人"),
                    "minecraft:drowned": new Achievement("潜伏水下的暗影", "死于溺尸"),
                    "minecraft:elder_guardian": new Achievement("深海巨兽", "死于远古守卫"),
                    "minecraft:ghast": new Achievement("鬼泣", "死于恶魂"),
                    "minecraft:slime": new Achievement("史莱姆从天而降", "死于史莱姆"),
                    "minecraft:magma_cube": new Achievement("可怕的岩浆怪", "死于岩浆怪"),
                    "minecraft:guardian": new Achievement("小跟班", "死于守卫者"),
                    "minecraft:shulker": new Achievement("大聪明！", "死于潜影贝"),
                    "minecraft:witch": new Achievement("不要小看她", "死于女巫"),
                    "minecraft:wither_skeleton": new Achievement("地狱的骑士", "死于凋零骷髅"),
                    "minecraft:vex": new Achievement("天使下凡", "死于恼鬼"),
                    "minecraft:phantom": new Achievement("安祥的美梦", "死于幻翼"),
                    "minecraft:zombie_villager": new Achievement("加入我们的美好大家庭", "死于僵尸村民"),
                    "minecraft:silverfish": new Achievement("葬身地底", "死于囊虫"),
                    "minecraft:pillager": new Achievement("疯狂的掠夺", "死于暴民"),
                    "minecraft:ravager": new Achievement("死于冲撞", "死于劫掠兽"),
                    "minecraft:spider": new Achievement("抱脸虫", "死于蜘蛛"),
                    "minecraft:cave_spider": new Achievement("剧毒抱脸虫", "死于洞穴蜘蛛"),
                    "minecraft:enderman": new Achievement("敢瞅我？", "死于末影人"),
                    "minecraft:piglin": new Achievement("忘带钱了", "死于猪灵"),
                    "minecraft:endermite": new Achievement("小家伙", "死于末影螨"),
                    "minecraft:ender_dragon": new Achievement("末影龙:不是吧，就这？", "死于末影龙"),
                    "minecraft:wither": new Achievement("凋零:不是吧，就这？", "死于凋零"),
                    "minecraft:player": new Achievement("死于谋杀", "死于玩家"),
                    "minecraft:dolphin": new Achievement("因果报应", "死于海豚"),
                    "minecraft:panda": new Achievement("功夫熊猫", "死于熊猫"),
                }, regx: {}
            }
        }, en_US: {}
    };

    static EventImplList = ["defaultImpl"];

    static process(pl, source) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (EventProcessor.antiEventShake(pl, PlDie.EVENT)) return;
        LogUtils.debug(`参数列表:`, ...arguments);
        LogUtils.debug(`事件:${PlDie.EVENT} 名称:玩家死亡 玩家:${pl.name} 来源:${source.type}`);
        EventProcessor.eventImplsProcess(PlDie, [pl, source], PlDie.EventImplList).catch(err => {
            LogUtils.error(`${PlDie.EVENT}: `, err);
        });
    }

    static async defaultImpl(pl, source) {
        const type = "death";
        const key = source.type;
        return StringEqual.defaultImpl(pl, type, key, type);
    }
}

class AttackEntity {

    static EVENT = "onAttackEntity";

    static ENTRY = {
        zh_CN: {
            [SpecialType.TYPE]: {
                enable: true, name: "特殊成就", details: {
                    "counterattack": new Achievement("自食其果", "将恶魂的火球反弹击杀恶魂")
                }, regx: {}
            }
        }
    };

    static EventImplList = ["ghastKillerImpl"];

    static process(pl, en) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (EventProcessor.antiEventShake(pl, AttackEntity.EVENT)) return;
        LogUtils.debug(`参数列表:`, ...arguments);
        LogUtils.debug(`事件:${AttackEntity.EVENT} 名称:玩家攻击实体 玩家:${pl.name} 实体:${en.type} UID:${en.uniqueId}`);
        EventProcessor.collectPromiseCall(AttackEntity, [pl, en], AttackEntity.EventImplList);
    }

    /**
     * 火球击杀恶魂判定
     * @param pl
     * @param en
     */
    static async ghastKillerImpl(pl, en) {
        if (en.type !== "minecraft:fireball") return Promise.reject();
        RuntimeCache.setCache(en.uniqueId, pl.xuid);//将火焰球与玩家绑定
        //12秒后自动删除=从玩家反击火焰球到击杀恶魂这段时间的最大判断时间为12秒
        setTimeout(() => {
            RuntimeCache.removeCache(en.uniqueId);
        }, 12 * 1000);
        return Promise.reject();
    }
}

class MobDie {

    /**
     * 生物死亡
     * @type {string}
     */
    static EVENT = "onMobDie";

    static ENTRY = {
        zh_CN: {
            killer: {
                enable: true, name: "击杀成就", details: {
                    "minecraft:creeper": new Achievement("嘶~嘶~", "首次击杀苦力怕"),
                    "minecraft:zombie": new Achievement("僵尸围城", "首次击杀僵尸"),
                    "minecraft:skeleton": new Achievement("东风快递,使命必达", "首次击杀小白"),
                    "minecraft:stray": new Achievement("就你喜欢放风筝是吧", "首次击杀流浪者"),
                    "minecraft:zombie_pigman": new Achievement("是猪？还是僵尸？", "首次击杀僵尸猪人"),
                    "minecraft:drowned": new Achievement("刷三叉戟的工具人", "首次击杀溺尸"),
                    "minecraft:elder_guardian": new Achievement("疲于奔命", "首次击杀远古守卫者"),
                    "minecraft:ghast": new Achievement("恶魔的眼泪", "首次击杀恶魂"),
                    "minecraft:slime": new Achievement("黏黏糊糊", "首次击杀史莱姆"),
                    "minecraft:magma_cube": new Achievement("走动的岩浆", "首次击杀岩浆怪"),
                    "minecraft:shulker": new Achievement("小东西，大智慧", "首次击杀潜影贝"),
                    "minecraft:witch": new Achievement("邪恶的女巫", "首次击杀女巫"),
                    "minecraft:wither_skeleton": new Achievement("更棘手了、更吓人了、更凋零了", "首次击杀凋零骷髅"),
                    "minecraft:vex": new Achievement("令人讨厌的天使或者魔鬼", "首次击杀恼鬼"),
                    "minecraft:phantom": new Achievement("不睡觉，坏宝宝", "首次击杀幻翼"),
                    "minecraft:zombie_villager": new Achievement("生化危机", "首次击杀僵尸村民"),
                    "minecraft:silverfish": new Achievement("恶心的小家伙", "首次击杀囊虫"),
                    "minecraft:pillager": new Achievement("和平的破坏者", "首次击杀暴民"),
                    "minecraft:ravager": new Achievement("一头发飙的母牛", "首次击杀劫掠兽"),
                    "minecraft:spider": new Achievement("爬墙、爬树、爬建筑物", "首次击杀蜘蛛"),
                    "minecraft:cave_spider": new Achievement("小心剧毒", "首次击杀洞穴蜘蛛"),
                    "minecraft:enderman": new Achievement("瞅你咋地", "首次击杀末影人"),
                    "minecraft:piglin": new Achievement("地狱的商人", "首次击杀猪灵"),
                    "minecraft:endermite": new Achievement("小黑的最爱", "首次击杀末影螨"),
                    "minecraft:ender_dragon": new Achievement("末影龙?不是吧,就这?", "首次击杀末影龙"),
                    "minecraft:wither": new Achievement("凋零？不是吧，就这？", "首次击杀凋零"),
                    "minecraft:player": new Achievement("你谋杀了一个玩家!", "首次击杀玩家"),
                    "minecraft:dolphin": new Achievement("精神变态", "首次击杀海豚"),
                    "minecraft:panda": new Achievement("非法捕猎", "首次击杀熊猫"),
                    "minecraft:chicken": new Achievement("你干嘛啊~哎呦~", "首次击杀只因"),
                    "minecraft:sheep": new Achievement("谁会杀害温顺又可爱的绵羊呢？", "首次击杀绵阳"),
                    "minecraft:goat": new Achievement("山羊冲撞", "首次击杀山羊"),
                    "minecraft:pig": new Achievement("挺像你的", "首次击杀猪"),
                    "minecraft:cow": new Achievement("勇敢牛牛，不怕困难", "首次击杀牛"),
                    "minecraft:villager_v2": new Achievement("死不足惜", "首次击杀村民")
                }, regx: {}
            },
        }, en_US: {}
    };

    static EventImplList = ["defaultImpl", "ghastDieImpl"];

    /**
     * 生物死亡
     * @param mob
     * @param source
     * @param cause
     */
    static process(mob, source, cause) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (EventProcessor.antiEventShake(source, MobDie.EVENT)) return;
        LogUtils.debug(`参数列表:`, ...arguments);
        LogUtils.debug(`事件:${MobDie.EVENT} 名称:生物死亡 来源对象:${source.type} 死亡对象:${mob.type} 死因:${cause}`);
        EventProcessor.eventImplsProcess(MobDie, [mob, source, cause], MobDie.EventImplList).catch(err => {
            LogUtils.error(`${MobDie.EVENT}: `, err);
        });
    }

    static async defaultImpl(mob, source, cause) {
        let pl;
        if (!(pl = Utils.toPlayer(source))) return Promise.reject();
        const type = "killer";
        const key = mob.type;

        return StringEqual.defaultImpl(pl, type, key, key);
    }

    static async ghastDieImpl(mob, source, cause) {
        //死亡生物是恶魂，且被弹射物击杀，而且拥有与玩家绑定的UID 则判定为符合条件
        if (mob.type !== "minecraft:ghast" || source.type !== "minecraft:player" || cause !== 3) return Promise.reject();
        let pl;
        if (!(pl = Utils.toPlayer(source))) return Promise.reject();
        let xuid = RuntimeCache.getCache(mob.uniqueId);
        if (xuid !== pl.xuid) return Promise.reject();
        const key = "counterattack";
        return SpecialType.defaultImpl(pl, key, false, false);

    }

}


class MobHurt {

    static EVENT = "onMobHurt";

    static ENTRY = {

        zh_CN: {
            [SpecialType.TYPE]: {
                enable: true, details: {
                    "littleHurt": new Achievement("有一点点疼", "单次攻击造成15点伤害"),
                    "yidao999": new Achievement("是兄弟就来砍我，血战攻沙，一刀999", "单次攻击造成999点伤害"),
                }, regx: {}
            }
        }, en_US: {}
    };

    static EventImplList = ["defaultImpl"];

    static process(mob, source, damage, cause) {
        if (Utils.hasNullOrUndefined(mob, source, damage)) return;
        if (EventProcessor.antiEventShake(mob, MobDie.EVENT)) return;
        LogUtils.debug("参数列表: ", ...arguments);
        LogUtils.debug(`事件: ${MobHurt.EVENT} 名称:生物受伤 受伤生物: ${mob.type} 来源: ${source.type} 伤害值: ${damage} 原因: ${cause}`);
        EventProcessor.eventImplsProcess(MobHurt, [mob, source, damage, cause], MobHurt.EventImplList).catch(err => {
            LogUtils.error(`事件:${MobHurt.EVENT}: `, err);
        });
    }

    /**
     * 默认实现
     * @param mob
     * @param source
     * @param damage
     * @returns {Promise<never>}
     */
    static async defaultImpl(mob, source, damage) {
        let pl;
        let key;
        if (Utils.isNullOrUndefined((pl = Utils.toPlayer(source)))) return Promise.reject();
        if (damage > 999) key = "yidao999"; else if (damage > 15) key = "littleHurt";
        if (Utils.isNullOrUndefined(key)) return Promise.reject(); else return SpecialType.defaultImpl(pl, key, false, false);
    }
}

class ScoreChange {

    /**
     * 计分板变化
     * @type {string}
     */
    static EVENT = "onScoreChanged";

    static ENTRY = {
        zh_CN: {
            "ScoreMoney": {
                enable: true, name: "经济成就", details: {
                    "${}<=0": new Achievement("大负翁", "经济达到0"),
                    "${}>=1000": new Achievement("低保生活", "经济达到1k"),
                    "${}>=10000": new Achievement("卑微社畜", "经济达到1w"),
                    "${}>=100000": new Achievement("小康生活", "经济达到10w"),
                    "${}>=1000000": new Achievement("百万富翁", "经济达到100w"),
                    "${}>=10000000": new Achievement("千万富翁", "经济达到1000w"),
                    "${}>=100000000": new Achievement("亿万富翁", "经济达到10000w")
                }, regx: {}
            },
        }, en_US: {}
    };

    static EventImplList = ["defaultImpl", "scoreMoneyImpl"];

    /**
     * 计分板变化
     * @param pl
     * @param num
     * @param name
     * @param disName
     */
    static process(pl, num, name, disName) {
        if (!Utils.isPlayerLoaded(pl)) return;//进服的时候会初始化玩家计分板，这玩意会多次触发，得做玩家加载判断
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (EventProcessor.antiEventShake(pl, ScoreChange.EVENT)) return;
        LogUtils.debug(`参数列表:`, ...arguments);
        LogUtils.debug(`事件:${ScoreChange.EVENT} 名称:玩家计分板数值变化 玩家:${pl.name} 计分板:${name} 数值:${num} 展示名称:${disName}`);
        EventProcessor.eventImplsProcess(ScoreChange, [pl, num, name, disName], ScoreChange.EventImplList).catch(err => {
            LogUtils.error(`${ScoreChange.EVENT}: `, err);
        });
    }

    /**
     * 默认计分板成就实现
     * @param pl
     * @param num
     * @param name
     * @returns {Promise<{pl, type, key}>}
     */
    static async defaultImpl(pl, num, name) {
        return NumberChange.defaultImpl(pl, name, num, true);
    }

    /**
     * 默认计分板经济成就实现
     * @param pl
     * @param num
     * @param name
     * @param disName
     * @returns {Promise<*[]>}
     */
    static async scoreMoneyImpl(pl, num, name, disName) {
        if (Runtime.config.reward.economy.type === Constant.moneyType.score && name === Runtime.config.reward.economy.score) {
            let type = "ScoreMoney";//此为默认配置好的经济计分板项成就
            if (!LangManager.getAchievementEntryType(type).enable) return Promise.reject();
            return ScoreChange.defaultImpl(pl, num, type);
        }
    }

}


/**
 * 消耗图腾
 */
class ConsumeTotem {

    /**
     * 消耗图腾
     * @type {string}
     */
    static EVENT = "onConsumeTotem";

    static ENTRY = {
        zh_CN: {
            [SpecialType.TYPE]: {
                name: "特殊成就", details: {
                    "useTotem": new Achievement("大难不死，必有后福", "在濒临死亡时使用图腾")
                }
            }
        }, en_US: {}
    };

    static EventImplList = ["defaultImpl"];

    /**
     * 消耗图腾
     * @param pl
     */
    static process(pl) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (EventProcessor.antiEventShake(pl, ConsumeTotem.EVENT)) return;
        LogUtils.debug(`参数列表:`, ...arguments);
        LogUtils.debug(`事件:${ConsumeTotem.EVENT} 名称:玩家消耗图腾 玩家:${pl.name}`);
        EventProcessor.eventImplsProcess(ConsumeTotem, [pl], ConsumeTotem.EventImplList).catch(err => {
            LogUtils.error(`${ConsumeTotem.EVENT}: `, err);
        });
    }

    static async defaultImpl(pl) {
        const key = "useTotem";
        return SpecialType.defaultImpl(pl, key, false, false);
    }
}

class InventoryChange {

    /**
     * 物品栏变化
     * @type {string}
     */
    static EVENT = "onInventoryChange";

    static ENTRY = {
        zh_CN: {
            itemObtain: {
                enable: true, name: "物品成就", details: {
                    "minecraft:furnace": new Achievement("聊的火热!", "首次获得熔炉"),
                    "minecraft:crafting_table": new Achievement("工作时间到！", "首次获得工作台"),
                    "minecraft:torch": new Achievement("照亮前进的道路!", "首次获得火把"),
                    "minecraft:campfire": new Achievement("篝火晚会时间到！", "首次获得篝火"),
                    "minecraft:bread": new Achievement("你还记得至今为止吃了多少片面包吗?", "首次获得面包"),
                    "minecraft:cake": new Achievement("蛋糕是个谎言", "首次获得蛋糕"),
                    "minecraft:wooden_sword": new Achievement("击剑时间到！", "首次获得木剑"),
                    "minecraft:stone_sword": new Achievement("石矛与兽皮", "首次获得石剑"),
                    "minecraft:iron_sword": new Achievement("锻造与淬火", "首次获得铁剑"),
                    "minecraft:diamond_sword": new Achievement("更上一层", "首次获得钻石剑"),
                    "minecraft:netherite_sword": new Achievement("所有的恐惧都来自火力不足", "首次获得合金剑"),
                    "minecraft:apple": new Achievement("被咬了一口的苹果", "首次获得苹果"),
                    "minecraft:wooden_pickaxe": new Achievement("小小矿工,前来报道", "首次获得木镐"),
                    "minecraft:stone_pickaxe": new Achievement("采矿时间到", "首次获得石镐"),
                    "minecraft:iron_pickaxe": new Achievement("高级矿工", "首次获得铁镐"),
                    "minecraft:golden_pickaxe": new Achievement("黄金矿工", "首次获得金镐"),
                    "minecraft:diamond_pickaxe": new Achievement("渐入佳境", "首次获得钻镐"),
                    "minecraft:netherite_pickaxe": new Achievement("无坚不摧", "首次获得合金镐"),
                    "minecraft:wooden_hoe": new Achievement("锄禾日当午，汗滴禾下土", "首次获得木锄"),
                    "minecraft:golden_hoe": new Achievement("等我当上皇帝了一定要用金锄头锄地", "首次获得金锄"),
                    "minecraft:golden_shovel": new Achievement("金铲铲之战", "首次获得金铲"),
                    "minecraft:wooden_axe": new Achievement("小木斧，可惜不是创世神", "首次获得木斧"),
                    "minecraft:iron_axe": new Achievement("狂战士", "首次获得铁斧"),
                    "minecraft:netherite_axe": new Achievement("开天辟地", "首次获得合金斧"),
                    "minecraft:bow": new Achievement("弓箭入门", "首次获得弓箭"),
                    "minecraft:shield": new Achievement("躲在后面", "首次获得盾牌"),
                    "minecraft:golden_apple": new Achievement("君临天下", "首次获得金苹果"),
                    "minecraft:enchanted_golden_apple": new Achievement("无敌是多么寂寞", "首次获得附魔金苹果"),
                    "minecraft:clock": new Achievement("进服送终", "首次获得时钟"),
                    "minecraft:fishing_rod": new Achievement("孤舟蓑笠翁,独钓寒江雪", "首次获得钓鱼竿"),
                    "minecraft:map": new Achievement("缺德地图,竭诚为您导航", "首次获得地图"),
                }, regx: {}
            }
        }, en_US: {}
    };

    static EventImplList = ["defaultImpl", "eatImpl"];

    /**
     * 物品栏变化
     * @param pl
     * @param slot
     * @param oldItem
     * @param newItem
     */
    static process(pl, slot, oldItem, newItem) {
        if (!Utils.isPlayerLoaded(pl)) return;
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (EventProcessor.antiEventShake(pl, InventoryChange.EVENT)) return;
        LogUtils.debug(`参数列表:`, ...arguments);
        LogUtils.debug(`事件:${InventoryChange.EVENT} 名称:玩家物品栏变化 玩家:${pl.name} 格子:${slot} 旧物品:${oldItem.type} 新物品:${newItem.type}`);
        EventProcessor.eventImplsProcess(InventoryChange, [pl, slot, oldItem, newItem], InventoryChange.EventImplList).catch(err => {
            LogUtils.error(`${InventoryChange.EVENT}: `, err);
        });
    }


    /**
     * 获得物品的默认实现
     * @param pl
     * @param slot
     * @param oldItem
     * @param newItem
     * @returns {Promise<{pl, type, key}>}
     */
    static async defaultImpl(pl, slot, oldItem, newItem) {
        const type = "itemObtain";
        const key = newItem.type;
        //放入物品时才会触发成就(存在bug,玩家在背包内将一个物品放到空格里也会触发,目前没有找到解决方法)
        if (!newItem.isNull() && oldItem.isNull()) return StringEqual.defaultImpl(pl, type, key, key); else return Promise.reject();
    }

    /**
     * 吃掉食物的实现
     * @param pl
     * @param slot
     * @param oldItem
     * @param newItem
     * @returns {Promise<{pl, type, key}>}
     */
    static async eatImpl(pl, slot, oldItem, newItem) {
        const type = "eat";
        const key = oldItem.type;
        let foodCacheKey = Eat.getFoodCacheKey(pl.xuid);
        let foodType = RuntimeCache.getCache(foodCacheKey);
        if (foodType !== key) return Promise.reject();
        return StringEqual.defaultImpl(pl, type, key, key);
    }

}


class UseBucketTake {

    /**
     * 使用桶装东西
     * @type {string}
     */
    static EVENT = "onUseBucketTake";

    static ENTRY = {
        zh_CN: {
            [SpecialType.TYPE]: {
                name: "特殊成就", details: {
                    "lava": new Achievement("喝点暖暖身子", "舀一桶岩浆")
                }, regx: {
                    "lava": "lava"
                }
            }
        }, en_US: {}
    };

    static EventImplList = ["defaultImpl",];

    /**
     * 使用桶装东西
     * @param pl
     * @param item
     * @param target
     */
    static process(pl, item, target) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (EventProcessor.antiEventShake(pl, UseBucketTake.EVENT)) return;
        LogUtils.debug(`参数列表:`, ...arguments);
        LogUtils.debug(`事件:${UseBucketTake.EVENT} 名称:玩家使用桶装东西 玩家:${pl.name} 物品:${item.type} 目标:${target.type}`);
        EventProcessor.eventImplsProcess(UseBucketTake, [pl, item, target], UseBucketTake.EventImplList).catch(err => {
            LogUtils.error(`${UseBucketTake.EVENT}: `, err);
        });
    }


    static async defaultImpl(pl, item, target) {
        const key = target.type;
        return SpecialType.defaultImpl(pl, key, false, false);
    }
}

class DropItem {

    /**
     * 丢掉物品
     * @type {string}
     */
    static EVENT = "onDropItem";

    static ENTRY = {
        zh_CN: {
            [SpecialType.TYPE]: {
                name: "特殊成就", details: {}
            }
        }, en_US: {}
    };

    static EventImplList = ["defaultImpl",];

    /**
     * 丢出物品
     * @param pl
     * @param item
     */
    static process(pl, item) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (EventProcessor.antiEventShake(pl, DropItem.EVENT)) return;
        LogUtils.debug(`参数列表:`, ...arguments);
        LogUtils.debug(`事件:${DropItem.EVENT} 名称:玩家丢出物品 玩家:${pl.name} 物品:${item.type}`);
        EventProcessor.eventImplsProcess(DropItem, [pl, item], DropItem.EventImplList).catch(err => {
            LogUtils.error(`${DropItem.EVENT}: `, err);
        });
    }

    static async defaultImpl(pl, item) {
        const key = item.type;
        return SpecialType.defaultImpl(pl, key, false, false);
    }
}

class Eat {

    /**
     * 食用食物
     * @type {string}
     */
    static EVENT = "onEat";

    static ENTRY = {
        zh_CN: {
            eat: {
                enable: true, name: "食物成就", details: {
                    "minecraft:pufferfish": new Achievement("酸爽!", "吃掉一个河豚"),
                    "minecraft:cookie": new Achievement("是否接受该网站所有cookie设置", "吃掉一个饼干"),
                    "minecraft:dried_kelp": new Achievement("海的味道，我知道", "吃掉一个波力海苔"),
                    "minecraft:rotten_flesh": new Achievement("勉强充饥", "吃掉一个僵尸腐肉"),
                    "minecraft:apple": new Achievement("每天一苹果，医生远离我", "吃掉一个苹果"),
                    "minecraft:cooked_chicken": new Achievement("数一数二的烧鸡!", "吃掉一个烧鸡"),
                }
            }
        }, en_US: {}
    };

    static EventImplList = ["defaultImpl"];

    /**
     * 食用食物
     * @param pl
     * @param item
     */
    static process(pl, item) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (EventProcessor.antiEventShake(pl, Eat.EVENT)) return;
        LogUtils.debug(`参数列表:`, ...arguments);
        LogUtils.debug(`事件:${Eat.EVENT} 名称:玩家吃东西 玩家:${pl.name} 物品:${item.type}`);
        EventProcessor.eventImplsProcess(Eat, [pl, item], Eat.EventImplList).catch(err => {
            LogUtils.error(`${Eat.EVENT}: `, err);
        });
    }

    /**
     * 这里只能监听到玩家尝试吃东西，而不能监听到玩家吃完东西
     * @param pl
     * @param item
     * @returns {{pl, type, key}}
     */
    static async defaultImpl(pl, item) {
        let handItem = pl.getHand();//获取正在吃的食物
        LogUtils.debug(handItem.type);
        let foodCacheKey = Eat.getFoodCacheKey(pl.xuid);
        RuntimeCache.setCache(foodCacheKey, item.type);
        //4秒后删除缓存，代表最长判定时间为4秒。
        setTimeout(() => {
            RuntimeCache.removeCache(foodCacheKey);
        }, 4000);
        return Promise.reject();
    }

    static getFoodCacheKey(xuid) {
        return `food-${xuid}`;
    }
}

class ArmorSet {

    /**
     * 盔甲栏变化
     * @type {string}
     */
    static EVENT = "onSetArmor";

    static ENTRY = {
        zh_CN: {
            armor: {
                enable: true, name: "装备成就", details: {
                    "setAll": new Achievement("全副武装", "装备一套任意盔甲"),
                    "preFly": new Achievement("芜湖起飞!", "装备鞘翅"),
                    "netheriteAll": new Achievement("武装到牙齿", "装备一套合金盔甲")
                }
            }
        }, en_US: {}
    };

    static EventImplList = ["defaultImpl", "elytraImpl", "netheriteImpl"];


    /**
     * 盔甲栏设置
     * @param pl
     * @param slot
     * @param item
     */
    static process(pl, slot, item) {
        if (!Utils.isPlayerLoaded(pl)) return;
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (EventProcessor.antiEventShake(pl, ArmorSet.EVENT)) return;
        if (item.isNull()) return;
        LogUtils.debug(`参数列表:`, ...arguments);
        LogUtils.debug(`事件:${ArmorSet.EVENT} 名称:玩家设置盔甲栏 玩家:${pl.name} 格子:${slot} 物品:${item.type}`);
        EventProcessor.eventImplsProcess(ArmorSet, [pl, slot, item], ArmorSet.EventImplList).catch(err => {
            LogUtils.error(`${ArmorSet.EVENT}: `, err);
        });
    }

    /**
     * 装备一套盔甲和和盾牌
     * @param pl
     * @param slot
     * @param item
     * @returns {Promise<{pl, type, key}>}
     */
    static async defaultImpl(pl, slot, item) {
        const type = "armor";
        const key = "setAll";
        let armors = pl.getArmor().getAllItems();
        for (let armor of armors) {
            if (armor.isNull()) {
                return Promise.reject();
            }
        }
        return StringEqual.defaultImpl(pl, type, key, key);
    }

    /**
     * 装备一套合金盔甲
     * @param pl
     * @param slot
     * @param item
     * @returns {Promise<{pl, type, key}>}
     */
    static async netheriteImpl(pl, slot, item) {
        const type = "armor";
        const key = "netheriteAll";
        let armors = pl.getArmor().getAllItems();
        for (let armor of armors) {
            if (armor.type.indexOf("netherite") === -1) {
                return Promise.reject();
            }
        }
        return StringEqual.defaultImpl(pl, type, key, key);
    }

    /**
     * 装备鞘翅成就
     * @param pl
     * @param slot
     * @param item
     * @returns {Promise<{pl, type, key}>}
     */
    static async elytraImpl(pl, slot, item) {
        if (slot !== 1 || item.type !== "minecraft:elytra") return Promise.reject();
        const type = "armor";
        const key = "preFly";
        return StringEqual.defaultImpl(pl, type, key, key);
    }

}

class BedEnter {

    /**
     * 上床
     * @type {string}
     */
    static EVENT = "onBedEnter";

    static ENTRY = {
        zh_CN: {
            sleep: {
                enable: true, name: "睡眠成就", details: {
                    "cloudDream": new Achievement("云端之梦", "在云层之上睡一晚上"),
                    "undergroundDream": new Achievement("深渊之息", "在洞穴层睡一晚上"),
                    "normalDream": new Achievement("精神饱满", "安全的睡一晚上"),
                    "rainDream": new Achievement("屋漏偏逢连夜雨", "在雨中睡一晚上"),
                    "snowDream": new Achievement("冰雪之梦", "在雪中睡一晚上")
                }, regx: {}
            }
        }, en_US: {}
    };

    static EventImplList = ["defaultImpl",];

    /**
     * 玩家上床
     * @param pl
     * @param pos
     */
    static process(pl, pos) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (EventProcessor.antiEventShake(pl, BedEnter.EVENT)) return;
        LogUtils.debug(`参数列表:`, ...arguments);
        LogUtils.debug(`事件:${BedEnter.EVENT} 名称:玩家上床 玩家:${pl.name} 位置:${Utils.getPosition(pos)}`);
        EventProcessor.eventImplsProcess(BedEnter, [pl, pos], BedEnter.EventImplList).catch(err => {
            LogUtils.error(`${BedEnter.EVENT}: `, err);
        });
    }

    /**
     * @param pl
     * @param pos
     * @returns {Promise<[{pl: ({isSleeping}|*), type: string, key: string}]>}
     */
    static async defaultImpl(pl, pos) {
        let type = "sleep";
        let key = undefined;
        if (!LangManager.getAchievementEntryType(type).enable) return Promise.reject();//虽然后面会有开启检测，但是中间操作有点多，这里要提前检测
        if (pos.y > 200) {
            key = "cloudDream";
        } else if (pos.y < 0) {
            key = "undergroundDream";
        } else {
            key = "normalDream";
        }
        if (pl.inRain) {
            key = "rainDream";
        } else if (pl.inSnow) {
            key = "snowDream";
        }
        //睡眠判断
        return BedEnter.asyncSleepValidate(pl).then(res => {
            if (res) {
                LogUtils.debug("睡眠判定成功");
                return StringEqual.defaultImpl(pl, type, key, type);
            }
        });
    }


    /**
     * BDS中无法做到监听玩家睡醒，所以只能做曲线救国，用线程睡眠加时间判断
     * 此事件的入口是玩家点击床时，随后在接下来的5秒内,不断检测玩家是否在睡觉，和时间
     * 在检测结束后,倘若daytime变为了0-250这个区间内的数字，即变为了清晨，判断为睡醒
     * @param pl
     */
    static async asyncSleepValidate(pl) {

        let currentTime = 0;
        await AsyncUtils.sleep(500);
        LogUtils.debug("----开始睡眠检测----");

        let sleepActor = 0;//睡眠计数因子，要真的睡觉的话，这玩意必须大于等于1

        while (pl.isSleeping) {
            await AsyncUtils.sleep(500);
            if (!pl.isSleeping) break;
            if (sleepActor > 30) break;// 15秒超时时间
            sleepActor++;
            currentTime = Utils.getCurrentTime("daytime");
            LogUtils.debug(`${pl.name}是否在睡觉: ${pl.isSleeping} 当前时间为: ${currentTime}`);
        }
        await AsyncUtils.sleep(500);
        currentTime = Utils.getCurrentTime("daytime");
        LogUtils.debug("----睡眠检测结束----");
        LogUtils.debug(`当前时间为: ${currentTime}`);

        //如果时间大于250则判断为不是清晨
        return currentTime < 250 && (sleepActor >= 1 && sleepActor < 30);
    }

}

class ProjectileHitEntity {

    /**
     * 弹射物
     * @type {string}
     */
    static EVENT = "onProjectileHitEntity";

    static ENTRY = {
        zh_CN: {
            shootDistance: {
                enable: true, name: "射击成就", details: {
                    "${}>=20": new Achievement("十米开外", "用箭命中距离20以外的生物"),
                    "${}>=40": new Achievement("箭无虚发", "用箭命中距离40以外的生物"),
                    "${}>=60": new Achievement("神射手", "用箭命中距离60以外的生物"),
                    "${}>=80": new Achievement("百步穿杨", "用箭命中距离80以外的生物"),
                    "${}>=100": new Achievement("精准制导", "用箭命中距离100以外的生物")
                }, regx: {}
            }
        }, en_US: {}
    };

    static EventImplList = ["shootDistanceImpl", "fireBallGhastImpl"];

    /**
     * 生物被弹射物击中
     * @param en
     * @param source
     */
    static process(en, source) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (EventProcessor.antiEventShake(en, ProjectileHitEntity.EVENT)) return;//与其他事件不同的是，这里是给实体加检测而不是玩家
        LogUtils.debug(`参数列表:`, ...arguments);
        LogUtils.debug(`事件:${ProjectileHitEntity.EVENT} 名称:实体被弹射物击中 实体:${en.type} 弹射物:${source.type} UID:${source.uniqueId}`);
        EventProcessor.eventImplsProcess(ProjectileHitEntity, [en, source], ProjectileHitEntity.EventImplList).catch(err => {
            LogUtils.error(`${ProjectileHitEntity.EVENT}: `, err);
        });
    }

    /**
     * 射击距离成就实现
     * @param en
     * @param source
     */
    static async shootDistanceImpl(en, source) {
        if (source.type !== "minecraft:arrow") return;
        const type = "shootDistance";
        //获取绑定的玩家
        let xuid = RuntimeCache.getCache(source.uniqueId);
        if (!xuid) return;
        //获取弹射物绑定的玩家
        let pl = mc.getPlayer(xuid);
        //获取被射击的实体坐标
        let pos = en.pos;
        //计算距离
        let distance = Math.floor(pl.distanceToPos(pos));
        let res = NumberChange.defaultImpl(pl, type, distance, true);
        RuntimeCache.removeCache(source.uniqueId);
        return res;
    }

    static async fireBallGhastImpl(en, source) {
        if (source.type !== "minecraft:fireball" && en.type !== "minecraft:ghast") return Promise.reject();
        let xuid = RuntimeCache.getCache(source.uniqueId);//根据弹射物ID获取绑定的玩家
        if (Utils.isNullOrUndefined(xuid)) return Promise.reject();
        RuntimeCache.setCache(en.uniqueId, xuid);//将恶魂与玩家绑定
        return Promise.reject();
    }
}

class ProjectileCreated {
    /**
     * 弹射物创建完毕
     * @type {string}
     */
    static EVENT = "onProjectileCreated";

    static EventImplList = ["shootBindImpl",];


    static process(shooter, entity) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (!(shooter = Utils.toPlayer(shooter))) return;
        if (EventProcessor.antiEventShake(shooter, ProjectileHitEntity.EVENT)) return;
        LogUtils.debug(`参数列表:`, ...arguments);
        LogUtils.debug(`事件:${ProjectileCreated.EVENT} 名称:玩家发射弹射物 玩家:${shooter.name} 弹射物:${entity.type} UID:${entity.uniqueId}`);
        EventProcessor.eventImplsProcess(ProjectileCreated, [shooter, entity], ProjectileCreated.EventImplList).catch(err => {
            LogUtils.error(`${ProjectileCreated.EVENT}: `, err);
        });
    }

    /**
     * 射击数据绑定，当玩家发射弓箭时，
     * 用map将玩家数据与实体绑定，以便后续的逻辑处理
     * @param shooter
     * @param entity
     */
    static async shootBindImpl(shooter, entity) {
        const type = "shootDistance";
        if (!LangManager.getAchievementEntryType(type).enable) return Promise.reject();
        if (entity.type !== "minecraft:arrow") return;
        RuntimeCache.setCache(entity.uniqueId, shooter.xuid);
        return Promise.reject();//只是做数据处理，不需要发送给成就处理器。
    }
}


class PlayerCmd {

    /**
     * 玩家执行命令
     * @type {string}
     */
    static EVENT = "onPlayerCmd";

    static ENTRY = {
        zh_CN: {
            [SpecialType.TYPE]: {
                name: "特殊成就", details: {}
            }
        }, en_US: {}
    };

    static EventImplList = [];

    static process(pl, cmd) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (EventProcessor.antiEventShake(pl, PlayerCmd.EVENT)) return;
        LogUtils.debug(`参数列表:`, ...arguments);
        LogUtils.debug(`事件:${PlayerCmd.EVENT} 名称:玩家使用命令 玩家:${pl.name} 命令:${cmd}`);
        EventProcessor.eventImplsProcess(PlayerCmd, [pl, cmd], PlayerCmd.EventImplList).catch(err => {
            LogUtils.error(`${PlayerCmd.EVENT}: `, err);
        });
    }
}

class PlayerChat {

    /**
     * 玩家聊天
     * @type {string}
     */
    static EVENT = "onChat";

    static ENTRY = {
        zh_CN: {
            chat: {
                name: "聊天成就", details: {}
            }
        }, en_US: {}
    };

    static EventImplList = [];

    static process(pl, msg) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (EventProcessor.antiEventShake(pl, PlayerChat.EVENT)) return;
        LogUtils.debug(`参数列表:`, ...arguments);
        LogUtils.debug(`事件:${PlayerChat.EVENT} 名称:玩家发送聊天消息 玩家:${pl.name} 信息:${msg}`);
        EventProcessor.eventImplsProcess(PlayerCmd, [pl, msg], PlayerChat.EventImplList).catch(err => {
            LogUtils.error(`${PlayerChat.EVENT}: `, err);
        });
    }
}

/**
 * 玩家完成成就后触发的成就
 */
class AfterFinished {

    static ENTRY = {
        zh_CN: {
            "achiCount": {
                enable: true, name: "成就数量成就", details: {
                    "${}>=10": new Achievement("小有名气", "达成10个成就"),
                    "${}>=50": new Achievement("轻车熟路", "达成50个成就"),
                    "${}>=80": new Achievement("游戏人生", "达成80个成就"),
                    "${}>=100": new Achievement("忠实粉丝", "达成100个成就"),
                    "${}>=150": new Achievement("骨灰玩家", "达成150个成就"),
                }, regx: {}
            }
        }
    };

    static EventImplList = ["defaultImpl"];

    static async process(pl, plData) {
        const EVENT = "AfterFinished";
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (EventProcessor.antiEventShake(pl, EVENT)) return;
        LogUtils.debug(`事件:${EVENT} 名称:完成成就 玩家:${pl.name} 成就数据:${plData} 成就完成数量:${plData.finished}`);
        EventProcessor.eventImplsProcess(AfterFinished, [pl, plData], AfterFinished.EventImplList).catch(err => {
            LogUtils.error(`${EVENT}: `, err);
        });
    }


    static async defaultImpl(pl, plData) {
        const type = "achiCount";
        const num = plData.finished;
        return NumberChange.defaultImpl(pl, type, num, false);
    }
}


/**
 * 事件监听回调处理器
 */
class EventProcessor {

    /**
     * 一些成就没有特殊的触发器，即使用INDEX来代替
     * @type {string}
     */
    static INDEX = "index";

    /**
     * 记录了所有的事件处理class
     * @type {Array}
     */
    static EVENT_PROCESSOR_LIST = [Join, Left, ChangeDim, Destroy, Place, AttackEntity, MobHurt, MobDie, PlDie, ScoreChange, ConsumeTotem, InventoryChange, UseBucketTake, DropItem, Eat, ArmorSet, BedEnter, ProjectileHitEntity, ProjectileCreated, PlayerChat, PlayerCmd, AfterFinished];

    /**
     * pl - 玩家对象
     * type - 成就类型，基本等于监听事件的名称
     * key - 即触发器类型，如在物品栏变化事件中获得了物品工作台触发了此成就，工作台物品的type就是触发器
     * 因为考虑到很多时候一个事件监听中不同成就可能有不同的实现逻辑
     * 异步函数的返回值必须是Promise<{pl, type, key}>
     * 由Promise.all将所有的返回值收集完毕后，
     * 再由异步遍历器将参数并行循环传入成就处理器中，后续的逻辑处理则交给
     * 成就处理器来完成
     */
    static asyncParallelProcess(promises) {
        return AsyncUtils.iteratorAsync(promises, async (index, processRes) => {
            let awaitRes = await processRes;
            if (Array.isArray(awaitRes) && awaitRes.length > 0) {
                return AsyncUtils.iteratorAsync(awaitRes, (index, res) => {
                    return AchievementManager.processAsync(res);
                }).catch(err => {
                    throw err;
                });
            } else if (!Array.isArray(awaitRes)) {
                return AchievementManager.processAsync(awaitRes);
            }
        }).catch(err => {
            if (!Utils.isNullOrUndefined(err)) throw err;
        });
    }

    /**
     * 收集Promise
     * @param context
     * @param args
     * @param impls
     */
    static collectPromiseCall(context, args, impls) {
        return impls.map(func => context[func].apply(context, args));
    }

    /**
     * 调度该事件的所有逻辑处理，并异步将结果发送给成就处理器
     * @param context
     * @param args
     * @param impls
     * @returns {Promise<Awaited<*>[]>}
     */
    static eventImplsProcess(context, args, impls) {
        return this.asyncParallelProcess(this.collectPromiseCall(context, args, impls));
    }


    /**
     * 注册注册所有事件
     */
    static registerMcEvent() {
        this.EVENT_PROCESSOR_LIST.forEach(processor => {
            if (Utils.hasNullOrUndefined(processor.EVENT, processor.process)) return;
            mc.listen(processor.EVENT, processor.process);
        });
    }

    /**
     * 监听事件防抖
     * @param pl
     * @param tag
     */
    static antiEventShake(pl, tag) {
        if (Utils.isShaking(pl, tag)) return true;
        Utils.antiShake(pl, tag, Runtime.config.antiShake);
        return false;
    }
}


/**
 * 启动类
 */
class Application {

    static main() {
        Configuration.init().then(() => {
            //注册事件
            EventProcessor.registerMcEvent();
            //插件初始化成功后进行的一些数据处理
            Configuration.postData();
            LogUtils.info(Utils.loadTemplate(Runtime.SystemInfo.init.currentLang, Runtime.config.language));
            LogUtils.info(Utils.loadTemplate(Runtime.SystemInfo.init.initEntryCount, Runtime.entryTypeTotalCounts, Runtime.entryTotalCounts, EventProcessor.EVENT_PROCESSOR_LIST.length));

        }).catch(err => {
            LogUtils.error(Runtime.SystemInfo.init.initError, err);
        });
    }
}

Application.main();

const Banner = "\n" + "              _     _                                     _          ___    ___   ___  \n" + "    /\\       | |   (_)                                   | |        |__ \\  / _ \\ / _ \\ \n" + "   /  \\   ___| |__  _  _____   _____ _ __ ___   ___ _ __ | |_  __   __ ) || | | | | | |\n" + "  / /\\ \\ / __| '_ \\| |/ _ \\ \\ / / _ \\ '_ ` _ \\ / _ \\ '_ \\| __| \\ \\ / // / | | | | | | |\n" + " / ____ \\ (__| | | | |  __/\\ V /  __/ | | | | |  __/ | | | |_   \\ V // /_ | |_| | |_| |\n" + "/_/    \\_\\___|_| |_|_|\\___| \\_/ \\___|_| |_| |_|\\___|_| |_|\\__|   \\_/|____(_)___(_)___/\n";


LogUtils.info(Banner);
LogUtils.info(PLUGINS_INFO.version);
LogUtils.info("MineBBS: https://www.minebbs.com/resources/3434/");
LogUtils.info("Github: https://github.com/246859/Achievement");