/**
 * author stranger
 * datetime 2022/9/25
 * description 最近写项目代码太累了，写点脚本放松下，之前插件代码也算挺屎的了，正好重写了。
 */

const PLUGINS_INFO = {
    name: "Achievement",
    version: "v2.0.0",
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
            enable: true
        },
        beep: {//提示音
            enable: true,
            type: "random.toast",//提示音类型
            volume: 5, //音量
            pitchArray: [0.3, 1, 1.5]//音调数组
        },
        chatBar: {//聊天栏展示
            enable: true
        }
    },
    reward: {//成就完成奖励
        economy: {//经济奖励
            enable: true,//是否开启
            type: "score",//经济类型 score | llmoney
            score: "money",//计分板名称
            value: 50,//要增加的经济值
        },
        exp: {//经验奖励
            enable: true,//是否开启
            value: 50//要增加的经验值
        },
        item: {
            enable: true,//是否开启
            type: "minecraft:cooked_beef",//熟牛肉
            count: 1,//数量
            lore: ["成就奖励物品"]//物品lore
        }
    },
    antiShake: 400, //防抖粒度
    checkUpdate: true,//检查更新
    debug: true//调试模式
};

/**
 * 语言对象
 * @type Object
 */
const LANG = {
    zh_CN: {
        Entry: {},
        Menu: {
            display: {
                toastTitle: "§l§a${title}",
                toastMsg: "§3${msg}",
                chatBar: "§l§6[ACHIEVEMENT]§r §e玩家 ${name} §c获得成就 §a${entry}§3 ———— ${condition}"
            }
        }
    },
    en_US: {
        Entry: {},
        Menu: {}
    }
};

/**
 * 全局常量对象
 * @type Object
 */

const Constant = {
    version: "achi_version",
    moneyType: {
        score: "score",
        llmoney: "llmoney"
    },
    langType: {
        zh_CN: "zh_CN",
        en_US: "en_US"
    },
    SystemInfo: {
        zh_CN: {
            achi: {
                enter: "玩家:${pl.name} 触发事件:${type} Key:${key}",
                args: "参数校验通过",
                shake: "成就防抖通过",
                status: "成就状态未完成",
                update: "成就状态修改成功",
                exist: "存在该成就词条",
                nonExistentEntry: "不存在的成就词条",
            },
            reward: {
                economyInfo: "经济奖励 对象: ${pl.name} 类型: ${economy.type} 数值: ${economy.value}",
                itemInfo: "物品奖励 对象: ${pl.name} 类型: ${item.type} 数量:${item.count} 词条:${item.lore}",
                expInfo: "经验奖励 对象 ${pl.name} 数值: ${exp.value}",
                nonExistentScore: "经济计分板项<${score}>不存在,请确认是否填写错误",
            },
            display: {
                chatBar: "聊天栏展示 作用域: ${scope} 对象: ${pl.name} 信息:${finalMsg}",
                toast: "弹窗展示 对象: ${pl.name} 标题: ${title} 信息: ${msg}",
                beep: "提示音展示 对象: ${pl.name} 类型: ${beep.type} 音量: ${beep.volume} 音调: ${randomPitch}"
            },
            init: {
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
                initError: "插件启动异常: "
            },
            IO: {
                readJsonNull: "路径: ${path} JSON读取为: ${buffer}",
                readJsonError: "路径: ${path} JSON读取异常: ",
                writeJsonError: "路径: ${path} JSON写入异常: "
            },
        },
        en_US: {
            achi: {
                enter: "Player:${pl.name} Triggered Event:${type} Key:${key}",
                args: "Parameter verification passed",
                shake: "achieve anti-shake pass",
                status: "Achievement status not completed",
                update: "Achievement status modified successfully",
                nonExistentEntry: "Achievement entry that does not exist",
            },
            reward: {
                economyInfo: "Economy Reward Object: ${pl.name} Type: ${economy.type} Value: ${economy.value}",
                itemInfo: "Item Reward Object: ${pl.name} Type: ${item.type} Quantity: ${item.count} Item: ${item.lore}",
                expInfo: "Experience reward object ${pl.name} value: ${exp.value}",
                nonExistentScore: "The economic scoreboard item <${score}> does not exist, please confirm whether the entry is incorrect",
            },
            display: {
                chatBar: "Chat Bar Display Scope: ${scope} Object: ${pl.name} Information: ${finalMsg}",
                toast: "Popup display object: ${pl.name} title: ${title} information: ${msg}",
                beep: "Beep Display Object: ${pl.name} Type: ${beep.type} Volume: ${beep.volume} Pitch: ${randomPitch}"
            },
            init: {
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
            },
            IO: {
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
    entry: undefined,//词条对象
    menu: undefined,//菜单对象
    rewardManager: undefined,//奖励对象
    displayManger: undefined,//展示对象
    achievementManager: undefined//成就管理对象
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
            resolve(entry[0], entry[1]);
        }) : Object.keys(iterator).map(async index => {
            resolve(index, iterator[index]);
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
}

/**
 * 通用工具类
 */
class Utils {

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
        return Boolean(eval(Utils.loadTemplate(str.replaceAll(/[^0-9=<>&|+-/*%!()${}]/g, ''), ...param)));
    }

    /**
     * 得到一个字符串里的所有数字
     * @param str
     * @returns {string}
     */
    static getNumberFromStr(str) {
        return str.replaceAll(/[^0-9]/g, '');
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
        if (en.isPlayer()) return en.toPlayer();
        else return undefined;
    }

    /**
     * 递归检查两个对象属性的异同,
     * source相对于target多出的属性会被添加至target
     * target中已存在的属性不会有任何变化
     * target相对于source中多出的属性会被删除。
     * 多用于自动更新配置文件
     * @param source 源对象
     * @param target 目标对象
     */
    static checkDifferences(source, target) {

        for (let key in target) {
            if (source[key] === undefined) {
                delete target[key];
            } else if (this.isJsObject(target[key])) {
                this.checkDifferences(source[key], target[key]);
            }
        }

        for (let key in source) {
            if (target[key] === undefined) {
                target[key] = source[key];
            } else if (this.isJsObject(target[key])) {
                this.checkDifferences(source[key], target[key]);
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
            if (params[index]) param = params[index++];
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
        if (this.isNullOrUndefined(params)) return false;
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
                pre.apply(this, arguments)
                return _self.apply(this, arguments);
            }
        }
        Function.prototype.after = function (post) {
            let _self = this;
            return function () {
                let res = _self.apply(this, arguments);
                //第一个参数是返回值
                post.apply(this, [res, ...arguments]);
                return res;
            }
        }
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
        if (Runtime.config.debug)
            mc.broadcast(`${Format.Red}[${this.DEBUG}] ${msg}`, this.CHAT);
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
    static backUpDir = `${this.ROOT_DIR}/Temp`;

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
        let entry = {
            zh_CN: {},
            en_US: {}
        };
        //记录成就类型数量
        EventProcessor.EVENT_PROCESSOR_LIST.forEach(processor => {
            if (!processor.ENTRY) return;
            for (let langKey in processor.ENTRY) {
                for (let achi_type in processor.ENTRY[langKey]) {
                    //entry中不存在此成就类型
                    if (!entry[langKey][achi_type]) {
                        //记录成就种类数量
                        Runtime.entryTypeTotalCounts++;
                        //将此成就类型复制给entry中
                        entry[langKey][achi_type] = processor.ENTRY[langKey][achi_type];

                    } else {
                        for (let key in processor.ENTRY[langKey][achi_type].details) {
                            entry[langKey][achi_type].details[key] = processor.ENTRY[langKey][achi_type].details[key];
                        }
                    }
                    Runtime.entryTotalCounts += Object.keys(entry[langKey][achi_type].details).length;
                }
            }
        });

        return entry;
    }

    /**
     * 获取指定的一个成就词条
     * @param type
     * @param key
     */
    static getAchievementEntry(type, key) {
        let eqRes = this.eqMatch(type, key);
        if (eqRes) return eqRes;
        let regRes = this.regxMatch(type, key);
        if (regRes) return regRes;
        throw new Error(Runtime.SystemInfo.achi.nonExistentEntry);
    }

    /**
     * 等值匹配
     * @param type
     * @param key
     * @returns {*}
     */
    static eqMatch(type, key) {
        return this.getAchievementEntryType(type).details[key];
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
                //放入缓存中
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
        if (!entryType) return undefined;
        return entryType;
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
                throw err
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
            return Configuration.checkUpdateAndSave(path, data);
        })
    }

    /**
     * 根据配置的语言选项加载语言文件
     * @param langType
     * @param langGroup
     * @returns {Promise<Awaited<*>[]>}
     */
    static loadLangFile(langType, langGroup) {
        //如果是非内置的语言需要额外初始化一下
        if (!langGroup[langType]) {
            langGroup[langType] = {};
            for (let key in langGroup[ZH_CN]) {
                langGroup[langType][key] = {};
            }
        }
        return this.langFileIterator(langGroup, langType, (path, fileName) => {
            Runtime[fileName.toLocaleLowerCase()] = IO.readJsonFile(path);
        });
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
        if (typeof key === "string") this.cacheMap[key] = val;
        else throw new Error("错误的key数据类型");
        this.save().catch(err => {
            LogUtils.error("缓存数据保存失败: ", err)
        });
    }

    static has(key) {
        if (key) return this.get(key) == true;
        else return false;
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
     */
    static checkUpdateAndSave(path, newData) {
        return IO.readJsonFileAsync(path).then(result => {
            Utils.checkDifferences(newData, result);
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
        Runtime.achievementManager = AchievementManager.assign({});
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
        })

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
            if (Utils.isNullOrUndefined(cacheVersion) || cacheVersion === PLUGINS_INFO.version) {
                isNeedToUpdateData = false;
            }
        });

        if (!isNeedToUpdateData) return;

        //更新配置,配置文件必须保持与默认的格式严格一致
        const configUpdate = IO.isNotExistsAsync(Path.CONFIG_PATH).then(res => {
            if (res) return;
            return this.checkUpdateAndSave(Path.CONFIG_PATH, DEFAULT_CONFIG);
        }).then(res => {
            if (res) LogUtils.debug(Runtime.SystemInfo.init.configUpdate);
        });

        //更新语言文件
        const langUpdate = IO.isNotExistsAsync(Path.LANG_DIR).then(res => {
            if (res) return;
            return LangManager.updateLangFile(LANG);
        }).then(() => {
            LogUtils.debug(Runtime.SystemInfo.init.langUpdate);
        });

        await Promise.all([configUpdate, langUpdate]).catch(err => {
            LogUtils.error(Runtime.SystemInfo.init.updateError, err);
        });
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
            Runtime.plData = data;
            LogUtils.debug(Runtime.SystemInfo.init.runtimePlData);
        });

        await Promise.all([configRuntime, dataRunTime]).catch((err) => {
            LogUtils.error(Runtime.SystemInfo.init.runtimeError, err);
        });
    }

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
     * 玩家名称
     */
    name;
    /**
     * 玩家xboxuuid 基于网络唯一
     */
    xuid;
    /**
     * 玩家本地存档uuid 基于存档唯一
     */
    uuid;

    /**
     * 已完成成就数量
     */
    finished;

    constructor(name, xuid, uuid) {
        this.name = name;
        this.xuid = xuid;
        this.uuid = uuid;
        this.finished = 0;
    }

    static assign(source) {
        return Object.assign(new PlayerData(), source);
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
            x: pos.x.toFixed(1),
            y: pos.y.toFixed(1),
            z: pos.z.toFixed(1),
            dim: pos.dim
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
        PUBLIC_SCOPE: 2,
        PRIVATE_SCOPE: 1,
        NULL_SCOPE: 0
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
        LogUtils.debug(JSON.stringify(entry));
        if (!this.chatBar.enable) return;
        let finalMsg = Utils.loadTemplate(Runtime.menu.display.chatBar, pl.name, entry.msg, entry.condition);
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
        return pl.sendToast(
            Utils.loadTemplate(Runtime.menu.display.toastTitle, entry.msg),
            Utils.loadTemplate(Runtime.menu.display.toastMsg, entry.condition));
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
    economy

    /**
     * exp配置项
     */
    exp

    /**
     * 物品配置项
     */
    item

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

    constructor() {
    }

    static assign(obj) {
        return Object.assign(new AchievementManager(), obj);
    }

    /**
     * 判断玩家是否完成某个成就
     */
    judgeAchievement(pl, type, key, plData) {
        this.initAchievement(pl, type, plData);
        return plData[pl.xuid][type][key];
    }

    /**
     * 修改指定玩家的指定成就的状态
     */
    modifyAchievement(pl, type, key, status, plData) {
        this.initAchievement(pl, type, plData);
        //status 为true是新增,false是删除
        if (status) {
            plData[pl.xuid][type][key] = new PlayerAchievement(status, new Date().toLocaleString(), pl.pos);
            plData[pl.xuid].finished++;
        } else {
            plData[pl.xuid][type][key] = undefined;
            plData[pl.xuid].finished--;
        }
    }

    /**
     * 初始化一个成就
     * @param pl
     * @param type
     * @param plData
     */
    initAchievement(pl, type, plData) {
        //如果玩家数据不存在就初始化该玩家的数据
        if (!plData[pl.xuid]) plData[pl.xuid] = new PlayerData(pl.name, pl.xuid, pl.uuid);
        //如果该类型的成就数据不存在就初始化该类型的成就数据
        if (!plData[pl.xuid][type]) plData[pl.xuid][type] = {};
    }

    /**
     * 保存玩家的成就数据
     * @param plData
     */
    savePlDataAsync(plData) {
        return IO.writeJsonFileAsync(Path.PLAYER_DATA_PATH, plData);
    }

    /**
     * @param pl 玩家对象
     * @param type 成就类型，基本等于监听事件的名称
     * @param key 即触发器类型，如在物品栏变化事件中获得了物品工作台触发了此成就，工作台物品的type就是触发器
     * @param promises promise数组
     */
    async process({pl, type, key}) {
        LogUtils.debug(Utils.loadTemplate(Runtime.SystemInfo.achi.enter, pl.name, type, key));
        //参数校验
        if (Utils.hasNullOrUndefined(pl, type, key)) return Promise.reject();
        LogUtils.debug(Runtime.SystemInfo.achi.args);
        let mapEntry;//有些词条会存在映射，映射得到的最终结果才是词条 即 key -> mapEntry
        //该词条是否存在
        if (!(mapEntry = LangManager.getAchievementEntry(type, key))) return;
        LogUtils.debug(Runtime.SystemInfo.achi.exist);
        //判断该词条是否启用
        if (!mapEntry.enable) return;
        LogUtils.debug(`启用状态:${mapEntry.enable} 词条信息:${mapEntry.msg} 触发条件:${mapEntry.condition}`)
        //是否完成成就
        if (this.judgeAchievement(pl, type, mapEntry.msg, Runtime.plData)) return;
        LogUtils.debug(Runtime.SystemInfo.achi.status);
        //修改成就完成状态
        this.modifyAchievement(pl, type, mapEntry.msg, true, Runtime.plData);
        LogUtils.debug(Runtime.SystemInfo.achi.update);
        //成就完成后处理
        return this.postProcess(pl, mapEntry);
    }

    /**
     * 成就完成后的一些数据处理，
     * 所有操作都是异步并行，相互并不影响
     * 展示成就操作，成就奖励操作，成就数据保存操作
     * @param pl
     * @param entry
     * @returns {Promise<Awaited<unknown>[]>}
     */
    async postProcess(pl, entry) {
        return Promise.all([
            Runtime.rewardManager.rewardAsync(pl),
            Runtime.displayManger.displayAchievementAsync(pl, entry),
            this.savePlDataAsync(Runtime.plData),
            AfterFinished.process(pl, Runtime.plData[pl.xuid])
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
 * 2.每一个事件处理类的成就词条key值可以与其他事件重复，即代表这两个事件是同一种类型的成就
 * 3.如果一个事件处理类中没有ENTRY属性，则在词条收集工作进行时将不会包含该事件，这类事件通常是用作辅助数据处理，并不需要对应的成就词条。
 */
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
            special: {
                enable: true,
                name: "特殊成就",
                details: {
                    join: new Achievement("Hello World!", "首次进入服务器"),
                },
                regx: {}
            }
        },
        en_US: {}
    }


    /**
     * 玩家进入游戏
     * @param pl
     */
    static process(pl) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (Utils.isShaking(pl, Join.EVENT)) return;
        LogUtils.debug(`事件:${Join.EVENT} 名称:玩家进入服务器 参数列表:${[...arguments]} 对象:${pl.name}`);
        EventProcessor.asyncParallelCall(Join.defaultImpl(pl)).catch((err) => {
            LogUtils.error(`${Join.EVENT}: `, err);
        });
    }

    /**
     * 默认实现
     * @param pl
     * @returns [{Promise<{pl, type: string, key: string}>}]
     */
    static async defaultImpl(pl) {
        const type = "special";
        const key = "join";
        if (!LangManager.getAchievementEntryType(type).enable) return Promise.reject();
        return [
            {
                pl,
                type,
                key
            }
        ];
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
        if (Utils.isShaking(pl, Left.EVENT)) return;
    }

}

class ChangeDim {


    /**
     * 玩家切换维度
     * @type {string}
     */
    static EVENT = "onChangeDim";

    static ENTRY = {
        zh_CN: {
            changeDim: {
                enable: true,
                name: "维度成就",
                details: {
                    "0": new Achievement("真是美好的世界", "到达主世界"),
                    "1": new Achievement("地狱空空荡荡，魔鬼都在人间", "到达地狱"),
                    "2": new Achievement("永恒、无星暗夜的维度", "到达末地")
                },
                regx: {}
            }
        },
        en_US: {}
    }

    /**
     * 玩家维度切换
     * @param pl
     * @param dimid
     */
    static process(pl, dimid) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (Utils.isShaking(pl, ChangeDim.EVENT)) return;
        LogUtils.debug([...arguments]);
        LogUtils.debug(`事件:${ChangeDim.EVENT} 名称:玩家维度切换 参数列表:${[...arguments]} 玩家:${pl.name} 维度:${dimid}`);
        EventProcessor.asyncParallelCall(ChangeDim.defaultImpl(...arguments)).catch(err => {
            LogUtils.error(`${ChangeDim.EVENT}: `, err);
        })
    }

    static defaultImpl(pl, dimid) {
        const type = "changeDim";
        if (!LangManager.getAchievementEntryType(type).enable) return Promise.reject();
        return {
            pl,
            type,
            key: dimid
        };
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
                enable: true,
                name: "挖掘成就",
                details: {
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
                },
                regx: {
                    "minecraft:log": "minecraft:log"
                }
            },

        },
        en_US: {}
    }

    /**
     * 玩家破坏方块完成
     * @param pl
     * @param bl
     */
    static process(pl, bl) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (Utils.isShaking(pl, Destroy.EVENT)) return;
        LogUtils.debug([...arguments]);
        LogUtils.debug(`事件:${Destroy.EVENT} 名称:玩家破坏方块 参数列表:${[...arguments]} 玩家:${pl.name} 方块:${bl.type}`);
        EventProcessor.asyncParallelCall(Destroy.defaultImpl(pl, bl)).catch(err => {
            LogUtils.error(`${Destroy.EVENT}: `, err);
        });

    }

    static defaultImpl(pl, bl) {
        const type = "destroyBlock";
        if (!LangManager.getAchievementEntryType(type).enable) return Promise.reject();
        EventProcessor.antiEventShake(pl, type);
        return [{
            pl,
            type,
            key: bl.type
        }];
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
                enable: true,
                name: "放置成就",
                details: {},
                regx: {}
            }
        },
        en_US: {}
    }

    static process(pl, bl) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        LogUtils.debug(`事件:${Place.EVENT} 名称:玩家放置方块 参数列表:${[...arguments]} 玩家:${pl.name} 方块:${bl.type}`);
    }


    static defaultImpl(pl, bl) {

    }
}

class PlDie {
    /**
     * 玩家死亡
     * @type {string}
     */
    static EVENT = "onPlayerDie"

    static ENTRY = {
        zh_CN: {
            death: {
                enable: true,
                name: "死亡成就",
                details: {
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
                    "minecraft:ender_dragon": new Achievement("不是吧，就这？", "死于末影龙"),
                    "minecraft:wither": new Achievement("不是吧，就这？", "死于凋零"),
                    "minecraft:player": new Achievement("死于谋杀", "死于玩家"),
                    "minecraft:dolphin": new Achievement("因果报应", "死于海豚"),
                    "minecraft:panda": new Achievement("功夫熊猫", "死于熊猫"),
                },
                regx: {}
            }
        },
        en_US: {}
    }

    static process(pl, source) {
        LogUtils.debug([...arguments]);
        LogUtils.debug(`事件:${PlDie.EVENT} 名称:玩家死亡 参数列表:${[...arguments]} 玩家:${pl.name} 来源:${source.type}`);
        EventProcessor.asyncParallelCall(PlDie.defaultImpl(...arguments)).catch(err => {
            LogUtils.error(`${PlDie.EVENT}: `, err);
        })
    }

    static async defaultImpl(pl, source) {
        const type = "death";
        const key = source.type;
        if (!LangManager.getAchievementEntryType(type).enable) return Promise.reject();
        return [{
            pl,
            type,
            key
        }]
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
                enable: true,
                name: "击杀成就",
                details: {
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
                    "minecraft:chicken": new Achievement("数一数二的烧鸡", "首次击杀鸡"),
                    "minecraft:sheep": new Achievement("谁会杀害温顺又可爱的绵羊呢？", "首次击杀羊"),
                    "minecraft:goat": new Achievement("山羊冲撞", "首次击杀山羊"),
                    "minecraft:pig": new Achievement("挺像你的", "首次击杀猪"),
                    "minecraft:cow": new Achievement("勇敢牛牛，不怕困难", '首次击杀牛'),
                    "minecraft:villager_v2": new Achievement("死不足惜", "首次击杀村民")
                },
                regx: {}
            },
        },
        en_US: {}
    }

    /**
     * 生物死亡
     * @param mob
     * @param source
     * @param cause
     */
    static process(mob, source, cause) {
        if (Utils.hasNullOrUndefined(...arguments)) return;

        if (Utils.isShaking(source, MobDie.EVENT)) return;
        LogUtils.debug([...arguments]);
        LogUtils.debug(`事件:${MobDie.EVENT} 名称:生物死亡 参数列表:${[...arguments]} 死亡对象:${source.type} 来源对象:${mob.type} 死因:${cause}`);
        EventProcessor.asyncParallelCall(MobDie.killerImpl(mob, source, cause)).catch(err => {
            LogUtils.error(`${MobDie.EVENT}: `, err);
        })
    }

    static async killerImpl(mob, source, cause) {
        const type = "killer";
        if (!(source = Utils.toPlayer(source))) return;
        if (!LangManager.getAchievementEntryType(type).enable) return Promise.reject();
        EventProcessor.antiEventShake(source, type);
        return [{
            pl: source,
            type,
            key: mob.type
        }]
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
                enable: true,
                name: "经济成就",
                details: {
                    "${}<=0": new Achievement("大负翁", "经济小于等于0"),
                    "${}>=1000": new Achievement("低保生活", "经济大于等于1k"),
                    "${}>=10000": new Achievement("卑微社畜", "经济大于等于1w"),
                    "${}>=100000": new Achievement("小康生活", "经济大于等于10w"),
                    "${}>=1000000": new Achievement("百万富翁", "经济大于等于100w"),
                    "${}>=10000000": new Achievement("千万富翁", "经济大于等于1000w"),
                    "${}>=100000000": new Achievement("亿万富翁", "经济大于等于10000w")
                },
                regx: {}
            },
        },
        en_US: {}
    }

    /**
     * 计分板变化
     * @param pl
     * @param num
     * @param name
     * @param disName
     */
    static process(pl, num, name, disName) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        LogUtils.debug([...arguments]);
        LogUtils.debug(`事件:${ScoreChange.EVENT} 名称:玩家计分板数值变化 参数列表:${[...arguments]} 玩家:${pl.name} 计分板:${name} 数值:${num} 展示名称:${disName}`);
        EventProcessor.asyncParallelCall(ScoreChange.defaultImpl(...arguments), ScoreChange.scoreMoneyImpl(...arguments)).catch(err => {
            LogUtils.error(`${ScoreChange.EVENT}: `, err);
        });
    }

    /**
     * 默认计分板成就实现
     * @param pl
     * @param num
     * @param name
     * @param disName
     * @returns {Promise<*[]>}
     */
    static async defaultImpl(pl, num, name, disName) {
        if (Utils.isShaking(pl, ScoreChange.EVENT)) return undefined;
        let entryType = LangManager.getAchievementEntryType(name);
        if (!entryType) return undefined;
        let type = name;
        if (!LangManager.getAchievementEntryType(type).enable) return Promise.reject();
        //如果变化计分板名称是配置中所设置的经济计分板 且开启了配置中经济配置方式为计分板
        let key = undefined;
        let res = [];
        for (let exp in entryType.details) {
            key = exp;
            //如果该成就已完成则跳过
            if (Runtime.achievementManager.judgeAchievement(pl, type, key, Runtime.plData)) continue;
            let expRes = Utils.parseStrBoolExp(exp, num);
            if (expRes) {
                res.push({
                    pl,
                    type,
                    key
                })
            }
        }
        //计分板防抖
        EventProcessor.antiEventShake(pl, type);
        return res;
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
            return await ScoreChange.defaultImpl(pl, num, type, type);
        }
    }

}

class ConsumeTotem {


    /**
     * 消耗图腾
     * @type {string}
     */
    static EVENT = "onConsumeTotem";

    static ENTRY = {
        zh_CN: {
            special: {
                name: "特殊成就",
                details: {}
            }
        },
        en_US: {}
    }

    /**
     * 消耗图腾
     * @param pl
     */
    static process(pl) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (Utils.isShaking(pl, ConsumeTotem.EVENT)) return;
        LogUtils.debug([...arguments]);
        LogUtils.debug(`事件:${ConsumeTotem.EVENT} 名称:玩家消耗图腾 参数列表:${[...arguments]} 玩家:${pl.name}`);
    }

    static default(pl) {
        return {
            pl,
            type: this.EVENT,
            key: EventProcessor.INDEX
        };
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
                enable: true,
                name: "物品成就",
                details: {
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
                },
                regx: {}
            }
        },
        en_US: {}
    }

    /**
     * 物品栏变化
     * @param pl
     * @param slot
     * @param oldItem
     * @param newItem
     */
    static process(pl, slot, oldItem, newItem) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (Utils.isShaking(pl, InventoryChange.EVENT)) return;
        LogUtils.debug([...arguments]);
        LogUtils.debug(`事件:${InventoryChange.EVENT} 名称:玩家物品栏变化 参数列表:${[...arguments]} 玩家:${pl.name} 格子:${slot} 旧物品:${oldItem.type} 新物品:${newItem.type}`);
        EventProcessor.asyncParallelCall(InventoryChange.defaultImpl(pl, slot, oldItem, newItem)).catch(err => {
            LogUtils.error(`${InventoryChange.EVENT}: `, err);
        })
    }


    static async defaultImpl(pl, slot, oldItem, newItem) {
        const type = "itemObtain";
        if (!LangManager.getAchievementEntryType(type).enable) return Promise.reject();
        EventProcessor.antiEventShake(pl, type);
        if (oldItem.type === "" && newItem.type === "") return Promise.reject();
        return [{
            pl,
            type,
            key: newItem.type
        }]
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
            special: {
                name: "特殊成就",
                details: {}
            }
        },
        en_US: {}
    }

    /**
     * 使用桶装东西
     * @param pl
     * @param item
     * @param target
     */
    static process(pl, item, target) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (Utils.isShaking(pl, UseBucketTake.EVENT)) return;
        LogUtils.debug(`事件:${UseBucketTake.EVENT} 名称:玩家使用桶装东西 参数列表:${[...arguments]} 玩家:${pl.name} 物品:${item.type} 目标:${target.type}`);
    }


    static defaultImpl(pl, item, target) {
        const type = "special";
        if (!LangManager.getAchievementEntryType(type).enable) return Promise.reject();
        return {
            pl,
            type: this.EVENT,
            key: target.type
        };
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
            special: {
                name: "特殊成就",
                details: {}
            }
        },
        en_US: {}
    }

    /**
     * 丢出物品
     * @param pl
     * @param item
     */
    static process(pl, item) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (Utils.isShaking(pl, DropItem.EVENT)) return;
        LogUtils.debug(`事件:${DropItem.EVENT} 名称:玩家丢出物品 参数列表:${[...arguments]} 玩家:${pl.name} 物品:${item.type}`);
    }

    static default(pl, item) {
        return {
            pl,
            type: this.EVENT,
            key: item.type
        };
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
                name: "食物成就",
                details: {}
            }
        },
        en_US: {}
    }


    /**
     * 食用食物
     * @param pl
     * @param item
     */
    static process(pl, item) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (Utils.isShaking(pl, Eat.EVENT)) return;
        LogUtils.debug(`事件:${Eat.EVENT} 名称:玩家吃东西 参数列表:${[...arguments]} 玩家:${pl.name} 物品:${item.type}`);

    }

    static default(pl, item) {
        return {
            pl,
            type: this.EVENT,
            key: item.type
        }
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
                name: "装备成就",
                details: {}
            }
        },
        en_US: {}
    }

    /**
     * 盔甲栏设置
     * @param pl
     * @param slot
     * @param item
     */
    static process(pl, slot, item) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (Utils.isShaking(pl, ArmorSet.EVENT)) return;
        LogUtils.debug(`事件:${ArmorSet.EVENT} 名称:玩家设置盔甲栏 参数列表:${[...arguments]} 玩家:${pl.name} 格子:${slot} 物品:${item.type}`);
    }

    static default(pl, slot, item) {
        //TODO 装备盔甲成就实现
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
                enable: true,
                name: "睡眠成就",
                details: {
                    "cloudDream": new Achievement("云端之梦", "在云层之上睡一晚上"),
                    "undergroundDream": new Achievement("深渊之息", "在洞穴层睡一晚上"),
                    "normalDream": new Achievement("精神饱满", "安全的睡一晚上"),
                    "rainDream": new Achievement("屋漏偏逢连夜雨", "在雨中睡一晚上")
                },
                regx: {}
            }
        },
        en_US: {}
    }

    /**
     * 玩家上床
     * @param pl
     * @param pos
     */
    static process(pl, pos) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (Utils.isShaking(pl, BedEnter.EVENT)) return;
        LogUtils.debug(`事件:${BedEnter.EVENT} 名称:玩家上床 参数列表:${[...arguments]} 玩家:${pl.name} 位置:${Utils.getPosition(pos)} 是否在睡觉:${pl.isSleeping}`);

        EventProcessor.asyncParallelCall(BedEnter.defaultImpl(...arguments)).catch(err => {
            LogUtils.error(`事件:${BedEnter.EVENT}: `, err);
        });
    }

    /**
     * @param pl
     * @param pos
     * @returns {Promise<[{pl: ({isSleeping}|*), type: string, key: string}]>}
     */
    static async defaultImpl(pl, pos) {
        if (Utils.isShaking(pl, BedEnter.EVENT)) return Promise.reject();
        EventProcessor.antiEventShake(pl, BedEnter.EVENT);//为了防止死循环重复，必须提前防抖
        let type = "sleep";
        let key = undefined;
        if (!LangManager.getAchievementEntryType(type).enable) return Promise.reject();
        if (pos.y > 200) {
            key = "cloudDream";
        } else if (pos.y < 0) {
            key = "undergroundDream";
        } else {
            key = "normalDream";
        }
        if (pl.inRain) {
            key = "rainDream";
        }
        return BedEnter.asyncSleepValidate(pl).then(res => {
            if (res) {
                return [{
                    pl,
                    type,
                    key
                }
                ];
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
        LogUtils.debug("开始睡觉检测");

        let sleepActor = 0;//睡眠计数因子，要真的睡觉的话，这玩意必须大于等于1

        while (pl.isSleeping) {
            await AsyncUtils.sleep(500);
            if (!pl.isSleeping) break;
            sleepActor++;
            currentTime = Utils.getCurrentTime("daytime");
            LogUtils.debug(`${pl.name}是否在睡觉: ${pl.isSleeping} 当前时间为: ${currentTime}`);
        }
        await AsyncUtils.sleep(700);
        currentTime = Utils.getCurrentTime("daytime");
        LogUtils.debug("睡觉检测结束")
        LogUtils.debug(`当前时间为: ${currentTime}`)

        //如果时间大于250则判断为不是清晨
        return currentTime < 250 && sleepActor >= 1;
    }

}

class Ride {

    /**
     * 骑乘
     * @type {string}
     */
    static EVENT = "onRide";

    static ENTRY = {
        zh_CN: {
            ride: {
                name: "骑乘成就",
                details: {}
            }
        },
        en_US: {}
    }

    /**
     * 生物被骑乘
     * @param en1
     * @param en2
     */
    static process(en1, en2) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (!(en1 = Utils.toPlayer(en1))) return;
        if (Utils.isShaking(en1, Ride.EVENT)) return;
        LogUtils.debug(`事件:${Ride.EVENT} 名称:玩家骑乘实体 参数列表:${[...arguments]} 玩家:${en1.name} 实体:${en2.type}`);

    }

    static async default(pl, mob) {
        const type = "ride";
        if (!LangManager.getAchievementEntryType(type).enable) return Promise.reject();
        return {
            pl,
            type: this.EVENT,
            key: mob.type
        }
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
                enable: true,
                name: "射击成就",
                details: {
                    "20": new Achievement("十米开外", "用箭命中距离20以外的生物"),
                    "40": new Achievement("箭无虚发", "用箭命中距离40以外的生物"),
                    "60": new Achievement("神射手", "用箭命中距离60以外的生物"),
                    "80": new Achievement("百步穿杨", "用箭命中距离80以外的生物"),
                    "100": new Achievement("精准制导", "用箭命中距离100以外的生物")
                },
                regx: {}
            }
        },
        en_US: {}
    }

    /**
     * 生物被弹射物击中
     * @param en
     * @param source
     */
    static process(en, source) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (Utils.isShaking(en, ProjectileHitEntity.EVENT)) return;
        LogUtils.debug([...arguments]);
        LogUtils.debug(`事件:${ProjectileHitEntity.EVENT} 名称:实体被弹射物击中 参数列表:${[...arguments]} 实体:${en.type} 弹射物:${source.type}`);

        EventProcessor.asyncParallelCall(ProjectileHitEntity.shootDistanceImpl(...arguments)).catch(err => {
            LogUtils.error(`${ProjectileHitEntity.EVENT}: `, err);
        })
    }

    /**
     * 射击距离成就实现
     * @param en
     * @param source
     */
    static async shootDistanceImpl(en, source) {
        const type = "shootDistance";
        if (!LangManager.getAchievementEntryType(type).enable) return Promise.reject();
        let xuid = RuntimeCache.getCache(source.uniqueId);
        LogUtils.debug(xuid);
        if (!xuid) return;
        //获取弹射物绑定的玩家
        let pl = mc.getPlayer(xuid);
        //获取被射击的实体坐标
        let pos = en.pos;
        //计算距离
        let distance = Math.floor(pl.distanceToPos(pos));
        let res = [];
        for (let key in LangManager.getAchievementEntryType(type).details) {
            if (distance > Number.parseInt(key)) {
                res.push({
                    pl,
                    type,
                    key
                });
            }
        }
        RuntimeCache.removeCache(source.uniqueId);
        EventProcessor.antiEventShake(pl, type);
        return res;
    }
}

class ProjectileCreated {
    /**
     * 弹射物创建完毕
     * @type {string}
     */
    static EVENT = "onProjectileCreated";

    static process(shooter, entity) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (!(shooter = Utils.toPlayer(shooter))) return;
        if (Utils.isShaking(shooter, ProjectileHitEntity.EVENT)) return;
        LogUtils.debug([...arguments]);
        LogUtils.debug(`事件:${ProjectileCreated.EVENT} 名称:玩家发射弹射物 参数列表:${[...arguments]} 玩家:${shooter.name} 弹射物:${entity.type} UID:${entity.uniqueId}`);
        EventProcessor.asyncParallelCall(ProjectileCreated.shootBindImpl(shooter, entity)).catch(err => {
            throw err;
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
            special: {
                name: "特殊成就",
                details: {}
            }
        },
        en_US: {}
    }

    static process(pl, cmd) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (Utils.isShaking(pl, PlayerCmd.EVENT)) return;
        LogUtils.debug([...arguments]);
        LogUtils.debug(`事件:${PlayerCmd.EVENT} 名称:玩家使用命令 参数列表:${[...arguments]} 玩家:${pl.name} 命令:${cmd}`);
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
                name: "聊天成就",
                details: {}
            }
        },
        en_US: {}
    }

    static process(pl, msg) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        if (Utils.isShaking(pl, PlayerChat.EVENT)) return;
        LogUtils.debug(`事件:${PlayerCmd.EVENT} 名称:玩家发送聊天消息 参数列表:${[...arguments]} 玩家:${pl.name} 信息:${msg}`);
    }
}

/**
 * 玩家完成成就后触发的成就
 */
class AfterFinished {

    static ENTRY = {
        zh_CN: {
            "achiCount": {
                enable: true,
                name: "成就数量成就",
                details: {
                    "10": new Achievement("小有名气", "达成10个成就"),
                    "50": new Achievement("轻车熟路", "达成50个成就"),
                    "80": new Achievement("游戏人生", "达成80个成就"),
                    "100": new Achievement("忠实粉丝", "达成100个成就"),
                    "150": new Achievement("骨灰玩家", "达成150个成就"),
                },
                regx: {}
            }
        }
    }

    static async process(pl, plData) {
        if (Utils.hasNullOrUndefined(...arguments)) return;
        const EVENT = "AfterFinished";
        LogUtils.debug(`事件:${EVENT} 名称:完成成就 参数列表${[...arguments]} 玩家:${pl.name} 成就数据:${plData} 成就完成数量:${plData.finished}`);
        EventProcessor.asyncParallelCall(AfterFinished.defaultImpl(...arguments)).catch(err => {
            LogUtils.error(`事件:${EVENT}: `, err);
        })
    }


    static async defaultImpl(pl, plData) {
        const type = "achiCount";
        let res = [];
        for (let count in LangManager.getAchievementEntryType(type).details) {
            let key = count;
            count = Number.parseInt(count);
            if (plData.finished > count) {
                res.push({
                    pl,
                    type,
                    key
                });
            }
        }

        return res;
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
    static EVENT_PROCESSOR_LIST =
        [
            Join,
            Left,
            ChangeDim,
            Destroy,
            MobDie,
            PlDie,
            ScoreChange,
            ConsumeTotem,
            InventoryChange,
            UseBucketTake,
            DropItem,
            Eat,
            ArmorSet,
            BedEnter,
            Ride,
            ProjectileHitEntity,
            ProjectileCreated,
            PlayerChat,
            PlayerCmd,
            AfterFinished
        ];

    /**
     * pl - 玩家对象
     * type - 成就类型，基本等于监听事件的名称
     * key - 即触发器类型，如在物品栏变化事件中获得了物品工作台触发了此成就，工作台物品的type就是触发器
     * 因为考虑到很多时候一个事件监听中不同成就可能有不同的实现逻辑
     * 异步函数的返回值必须是Promise<[{pl, type, key}]>
     * 由Promise.all将所有的返回值收集完毕后，
     * 再由异步遍历器将参数并行循环传入成就处理器中，后续的逻辑处理则交给
     * 成就处理器来完成
     * @param calls 成就逻辑判别函数的返回值数组
     */
    static asyncParallelCall(...calls) {
        return AsyncUtils.iteratorAsync(calls, async (index, options) => {
            return Utils.isNullOrUndefined(options) ? undefined : AsyncUtils.iteratorAsync([...await options], (index, option) => {
                return Runtime.achievementManager.process(option);
            }).catch(err => {
                throw err;
            });
        });
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
        Utils.antiShake(pl, tag, Runtime.config.antiShake);
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
            //将版本信息写入缓存
            PersistentCache.set(Constant.version, PLUGINS_INFO.version);
            LogUtils.info(Utils.loadTemplate(Runtime.SystemInfo.init.currentLang, Runtime.config.language));
            LogUtils.info(Utils.loadTemplate(Runtime.SystemInfo.init.initEntryCount, Runtime.entryTypeTotalCounts, Runtime.entryTotalCounts, EventProcessor.EVENT_PROCESSOR_LIST.length));

        }).catch(err => {
            LogUtils.error(Runtime.SystemInfo.init.initError, err);
        });
    }
}

Application.main();

const Banner =
    "\n" +
    "              _     _                                     _          ___    ___   ___  \n" +
    "    /\\       | |   (_)                                   | |        |__ \\  / _ \\ / _ \\ \n" +
    "   /  \\   ___| |__  _  _____   _____ _ __ ___   ___ _ __ | |_  __   __ ) || | | | | | |\n" +
    "  / /\\ \\ / __| '_ \\| |/ _ \\ \\ / / _ \\ '_ ` _ \\ / _ \\ '_ \\| __| \\ \\ / // / | | | | | | |\n" +
    " / ____ \\ (__| | | | |  __/\\ V /  __/ | | | | |  __/ | | | |_   \\ V // /_ | |_| | |_| |\n" +
    "/_/    \\_\\___|_| |_|_|\\___| \\_/ \\___|_| |_| |_|\\___|_| |_|\\__|   \\_/|____(_)___(_)___/    By Stranger \n";


LogUtils.info(Banner);
LogUtils.info(PLUGINS_INFO.version);
LogUtils.info("MineBBS: https://www.minebbs.com/resources/3434/");
LogUtils.info("Github: https://github.com/246859/Achievement");