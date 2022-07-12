/**
 * @description 插件初始化全局常量
 */
const dir = "./plugins/Achievement";//插件目录
const deprecatedPath = "./plugins/Achievement/configs.json"//数据文件 旧
const plDataFile = "./plugins/Achievement/data.json";//玩家数据文件 新
const langFile = "./plugins/Achievement/lang.json";//语言文件
const langConfigFile = "./plugins/Achievement/langConfig.json";//语言配置文件
const plCountFile = "./plugins/Achievement/count.json";//数据统计文件

const icon_Achieved = "textures/ui/New_confirm_Hover";//图标路径
const icon_unAchieved = "textures/ui/redX1";

/**
 * @description 初始化全局变量
 */
const plCountData = {};
const plData = {players: []};
const langData_zh_CN = {
    "achievement": {
        "blockBreak": {
            "minecraft:log": "要致富，先撸树!",
            "minecraft:log2": "要致富，先撸树!",
            "minecraft:stone": "疯狂的石头!",
            "minecraft:coal_ore": "满面尘灰烟火色，两鬓苍苍十指黑",
            "minecraft:iron_ore": "来点硬的!",
            "minecraft:gold_ore": "黄金矿工,黄金精神！",
            "minecraft:diamond_ore": "谁不喜欢钻石呢?",
            "minecraft:lapis_ore": "附魔时间到！",
            "minecraft:redstone_ore": "服务器感到了一丝危机",
            "minecraft:copper_ore": "这个东西有什么用呢？",
            "minecraft:ancient_debris": "一团生锈的金属片",
            "minecraft:emerald_ore": "村民捕获器",
            "minecraft:end_stone": "紫色虚空中飘浮的淡黄色岛屿",
            "minecraft:netherrack": "布满腐败血肉的肮脏物体",
            "minecraft:glass": "小心轻放",
            "minecraft:stained_glass": "易碎品",
            "minecraft:obsidian": "黑曜石之歌",
            "minecraft:bedrock": "弑神",
            "minecraft:grass": "草!(一种植物)",
            "minecraft:bee_nest": "嗡嗡嗡~ 麻烦来了",
            "minecraft:amethyst_block": "美丽迷人的紫水晶",
            "minecraft:leaves": "环保主义者",
        },
        "inventoryChanges": {
            "minecraft:furnace": "聊的火热!",
            "minecraft:crafting_table": "工作时间到！",
            "minecraft:torch": "照亮前进的道路!",
            "minecraft:campfire": "篝火晚会时间到！",
            "minecraft:bread": "你记得自己至今为止吃了多少片面包吗?",
            "minecraft:cake": "蛋糕是个谎言",
            "minecraft:wooden_sword": "击剑时间到！",
            "minecraft:stone_sword": "石矛与兽皮",
            "minecraft:iron_sword": "锻造与淬火",
            "minecraft:diamond_sword": "更上一层",
            "minecraft:netherite_sword": "所有的恐惧来自火力不足",
            "minecraft:apple": "被咬了一口的苹果",
            "minecraft:wooden_pickaxe": "小小矿工,前来报道",
            "minecraft:stone_pickaxe": "采矿时间到",
            "minecraft:iron_pickaxe": "高级矿工",
            "minecraft:diamond_pickaxe": "渐入佳境",
            "minecraft:golden_pickaxe": "黄金矿工",
            "minecraft:netherite_pickaxe": "无坚不摧",
            "minecraft:wooden_hoe": "锄禾日当午，汗滴禾下土",
            "minecraft:stone_hoe": "首次获得石锄",
            "minecraft:iron_hoe": "首次获得铁锄",
            "minecraft:diamond_hoe": "首次获得钻石锄",
            "minecraft:golden_hoe": "首次获得金锄",
            "minecraft:netherite_hoe": "暴殄天物",
            "minecraft:wooden_shovel": "好像没什么用",
            "minecraft:stone_shovel": "首次获得石铲",
            "minecraft:iron_shovel": "首次获得铁铲",
            "minecraft:diamond_shovel": "首次获得钻石铲",
            "minecraft:golden_shovel": "金铲铲之战",
            "minecraft:netherite_shovel": "富得流油",
            "minecraft:wooden_axe": "小木斧",
            "minecraft:stone_axe": "首次获得石斧",
            "minecraft:iron_axe": "狂战士奥拉夫",
            "minecraft:diamond_axe": "首次获得钻石斧",
            "minecraft:golden_axe": "首次获得金斧",
            "minecraft:netherite_axe": "盘古开天",
            "minecraft:bow": "弓箭入门",
            "minecraft:shield": "固若金汤",
            "minecraft:golden_apple": "君临天下",
            "minecraft:enchanted_golden_apple": "无敌是多么寂寞",
            "minecraft:bamboo": "岁寒三友",
            "minecraft:egg": "妈妈的味道",
            "minecraft:lit_pumpkin": "不给糖,就捣蛋",
            "minecraft:yellow_flower": "你是友情,还是错过的爱情",
            "minecraft:bone": "狗狗的最爱",
            "minecraft:nether_wart": "炼药师入门",
            "minecraft:wheat": "锄禾日当午,汗滴禾下土",
            "minecraft:chest": "箱子!",
            "minecraft:clock": "进服送终",
            "minecraft:fishing_rod": "孤舟蓑笠翁,独钓寒江雪",
            "minecraft:map": "高德地图,竭诚为您导航",
        },
        "entitiesKilled": {
            "minecraft:creeper": "嘶~嘶~",
            "minecraft:zombie": "僵尸围城",
            "minecraft:skeleton": "东风快递,使命必达",
            "minecraft:stray": "白色的眼睛和致命的弓",
            "minecraft:zombie_pigman": "是猪？还是僵尸？",
            "minecraft:drowned": "三叉戟的唯一来源",
            "minecraft:elder_guardian": "疲于奔命",
            "minecraft:ghast": "恶魔的眼泪",
            "minecraft:slime": "黏黏糊糊",
            "minecraft:magma_cube": "走动的岩浆",
            "minecraft:guardian": "美味佳肴",
            "minecraft:shulker": "小东西，大智慧",
            "minecraft:witch": "邪恶的女巫",
            "minecraft:wither_skeleton": "更棘手了、更吓人了、更凋零了",
            "minecraft:vex": "令人讨厌的天使或者魔鬼",
            "minecraft:phantom": "不睡觉，坏宝宝",
            "minecraft:zombie_villager": "瘟疫正在传播！“啊啊，吼吼",
            "minecraft:silverfish": "恶心的小家伙",
            "minecraft:pillager": "和平的破坏者",
            "minecraft:ravager": "一头发飙的母牛",
            "minecraft:spider": "爬墙、爬树、爬建筑物",
            "minecraft:cave_spider": "小心剧毒",
            "minecraft:enderman": "瞅你咋地",
            "minecraft:piglin": "地狱的商人",
            "minecraft:endermite": "小黑的最爱",
            "minecraft:ender_dragon": "末影龙?不是吧,就这?",
            "minecraft:wither": "凋零？不是吧，就这？",
            "minecraft:player": "谋杀犯",
            "minecraft:dolphin": "精神变态",
            "minecraft:panda": "国家一级保护动物",
            "minecraft:chicken": "鸡肉大餐",
            "minecraft:sheep": "谁会杀害温顺又可爱的绵羊呢？",
            "minecraft:goat": "山羊冲撞",
            "minecraft:pig": "挺像你的",
            "minecraft:cow": "勇敢牛牛，不怕困难",
            "minecraft:villager_v2": "死不足惜"
        },
        "beKilled": {
            "minecraft:creeper": "突如其来的惊喜!",
            "minecraft:zombie": "倒在了尸潮中",
            "minecraft:skeleton": "中门对狙",
            "minecraft:stray": "烦人的减速！",
            "minecraft:zombie_pigman": "何必呢？",
            "minecraft:drowned": "潜伏水下的暗影",
            "minecraft:elder_guardian": "死于奔命",
            "minecraft:ghast": "鬼泣",
            "minecraft:slime": "史莱姆从天而降",
            "minecraft:magma_cube": "可怕的岩浆怪",
            "minecraft:guardian": "小跟班",
            "minecraft:shulker": "大聪明！",
            "minecraft:witch": "不要小看她",
            "minecraft:wither_skeleton": "地狱的骑士",
            "minecraft:vex": "天使下凡",
            "minecraft:phantom": "安祥的美梦",
            "minecraft:zombie_villager": "愉快的大家庭",
            "minecraft:silverfish": "葬身地底",
            "minecraft:pillager": "疯狂的掠夺",
            "minecraft:ravager": "死于冲撞",
            "minecraft:spider": "抱脸虫",
            "minecraft:cave_spider": "剧毒抱脸虫",
            "minecraft:enderman": "敢瞅我？",
            "minecraft:piglin": "地狱的奸商",
            "minecraft:endermite": "小家伙",
            "minecraft:ender_dragon": "菜鸡",
            "minecraft:wither": "弱鸡",
            "minecraft:player": "死于谋杀",
            "minecraft:dolphin": "因果报应",
            "minecraft:panda": "熊猫战士",
        },
        "dimensionalChange": {
            "1": "地狱空空荡荡,魔鬼都在人间!",
            "2": "永恒、无星暗夜的维度"
        },
        "onScoreChange":{
            "moneyChange0":"大负翁",
            "moneyChange1e4":"酒足饭饱",
            "moneyChange1e5":"小康生活",
            "moneyChange1e6":"百万富翁",
            "moneyChange1e7":"千万富翁",
            "moneyChange1e8":"富可敌国",
        },
        "other": {
            "firstEnter": "Hello,world!",
            "getAll":"Goodbye,world"
        }
    },
    "menu": {//菜单语言配置
        "mainTitle": "§l§5成§6就§b系§4统",
        "achieved": "§l§a已完成成就",
        "unAchieved": "§l§c未完成成就",
        "broadcastMsg": "§l[MINECRAFT]§r 玩家 §6${pl.name} §5获§b得§3成§e就 §2${msg}",
        "cmdDescription": "查看成就系统GUI View Achievement System GUI ",
        "cmdError": "执行主体为空或者非玩家",
        "error": "配置文件读取错误",
        "achi_type": {//成就类型语言配置
            "blockBreak": "方块破坏类",
            "inventoryChanges": "物品获得类",
            "entitiesKilled": "生物击杀类",
            "dimensionalChange": "维度变化类",
            "onScoreChange": "计分板变化",
            "other": "其它类",
            "beKilled": "被击杀类"
        },
    }
}
const langData_en_US = {
    "achievement": {
        "blockBreak": {
            "minecraft:log": "To get rich, first hit the tree!",
            "minecraft:log2": "To get rich, first hit the tree!",
            "minecraft:stone": "Crazy Stone!",
            "minecraft:coal_ore": "The face is full of dust and fireworks, and the temples and fingers are black",
            "minecraft:iron_ore": "Come harder!",
            "minecraft:gold_ore": "Gold miner, gold spirit!",
            "minecraft:diamond_ore": "Who doesn't like diamonds?",
            "minecraft:lapis_ore": "Enchanting time is up!",
            "minecraft:redstone_ore": "The server feels a little bit of danger",
            "minecraft:copper_ore": "What's the use of this thing?",
            "minecraft:ancient_debris": "A mass of rusted metal",
            "minecraft:emerald_ore": "Villager Capturer"
        },
        "inventoryChanges": {
            "minecraft:furnace": "The chat is hot!",
            "minecraft:crafting_table": "Time to work!",
            "minecraft:torch": "Life is not a short candle, but a torch that we temporarily hold",
            "minecraft:campfire": "It's time for the campfire!",
            "minecraft:bread": "Bread!",
            "minecraft:cake": "Cake is a lie",
            "minecraft:wooden_sword": "It's time for fencing!",
            "minecraft:stone_sword": "Stone Spear and Hide",
            "minecraft:iron_sword": "Forge and Harden",
            "minecraft:diamond_sword": "A step up",
            "minecraft:netherite_sword": "All fear comes from lack of firepower",
            "minecraft:apple": "A bitten apple",
            "minecraft:wooden_pickaxe": "Little miners, come and report",
            "minecraft:stone_pickaxe": "Mining time is up",
            "minecraft:iron_pickaxe": "Advanced Miner",
            "minecraft:diamond_pickaxe": "Getting better",
            "minecraft:golden_pickaxe": "Golden Miner",
            "minecraft:netherite_pickaxe": "Invincible",
            "minecraft:wooden_hoe": "In the afternoon of the hoeing day, sweat dripped down the soil",
            "minecraft:stone_hoe": "First time getting a stone hoe",
            "minecraft:iron_hoe": "Get an iron hoe for the first time",
            "minecraft:diamond_hoe": "First time getting a diamond hoe",
            "minecraft:golden_hoe": "Get a golden hoe for the first time",
            "minecraft:netherite_hoe": "Netherite",
            "minecraft:wooden_shovel": "It doesn't seem to work",
            "minecraft:stone_shovel": "Get a stone shovel for the first time",
            "minecraft:iron_shovel": "First time getting a shovel",
            "minecraft:diamond_shovel": "First time getting a diamond shovel",
            "minecraft:golden_shovel": "Golden Shovel Battle",
            "minecraft:netherite_shovel": "Netherite shovel",
            "minecraft:wooden_axe": "small wooden axe",
            "minecraft:stone_axe": "First time getting a stone axe",
            "minecraft:iron_axe": "Olav the Berserker",
            "minecraft:diamond_axe": "First time getting a diamond axe",
            "minecraft:golden_axe": "Get the golden axe for the first time",
            "minecraft:netherite_axe": "Pangu Kaitian",
            "minecraft:bow": "Introduction to Bow and Arrow",
            "minecraft:shield": "Fortified",
            "minecraft:golden_apple": "ruler of the world",
            "minecraft:enchanted_golden_apple": "How lonely it is to be invincible"
        },
        "entitiesKilled": {
            "minecraft:creeper": "his~his~",
            "minecraft:zombie": "Zombie Siege",
            "minecraft:skeleton": "Beware of cold arrows",
            "minecraft:stray": "white eyes and deadly bow",
            "minecraft:zombie_pigman": "A pig? A zombie?",
            "minecraft:drowned": "The only source of tridents",
            "minecraft:elder_guardian": "Exhausted",
            "minecraft:ghast": "Devil's Tears",
            "minecraft:slime": "Slimy",
            "minecraft:magma_cube": "walking magma",
            "minecraft:guardian": "Delicious Food",
            "minecraft:shulker": "Small things, great wisdom",
            "minecraft:witch": "Wicked Witch",
            "minecraft:wither_skeleton": "Trickier, scarier, wither",
            "minecraft:vex": "nasty angel or devil",
            "minecraft:phantom": "Don't sleep, bad baby",
            "minecraft:zombie_villager": "The plague is spreading!\"Ahhhhhhhhh\"",
            "minecraft:silverfish": "Disgusting little guy",
            "minecraft:pilager": "Peacebreaker",
            "minecraft:ravager": "A cow that's running wild",
            "minecraft:spider": "Climb walls, climb trees, climb buildings",
            "minecraft:cave_spider": "Beware of poison",
            "minecraft:enderman": "Look at you",
            "minecraft:piglin": "Hell's Merchant",
            "minecraft:endermite": "Black's Favorite",
            "minecraft:ender_dragon": "ender dragon? No, that's all?",
            "minecraft:wither": "Wither? Isn't it, that's all?",
            "minecraft:player": "Murderer",
            "minecraft:dolphin": "Psychopath",
            "minecraft:panda": "National first-class protected animal",
            "minecraft:chicken": "Chicken Dinner",
            "minecraft:sheep": "Who would kill a docile and lovely sheep?",
            "minecraft:goat": "Goat Crash",
            "minecraft:pig": "It looks like yours",
            "minecraft:cow": "Brave cattle, not afraid of difficulties",
            "minecraft:villager_v2": "Death is not a pity"
        },
        "beKilled": {
            "minecraft:creeper": "Sudden surprise!",
            "minecraft:zombie": "Falled in the zombie tide",
            "minecraft:skeleton": "Middle door sniper",
            "minecraft:stray": "Annoying slowdown!",
            "minecraft:zombie_pigman": "Why?",
            "minecraft:drowned": "Shadows lurking underwater",
            "minecraft:elder_guardian": "Death on the Run",
            "minecraft:ghast": "Devil May Cry",
            "minecraft:slime": "Slime fell from the sky",
            "minecraft:magma_cube": "The scary magma cube",
            "minecraft:guardian": "Little follower",
            "minecraft:shulker": "Big cleverness!",
            "minecraft:witch": "Don't underestimate her",
            "minecraft:wither_skeleton": "Knight of Hell",
            "minecraft:vex": "Angels descend to earth",
            "minecraft:phantom": "A peaceful dream",
            "minecraft:zombie_villager": "happy family",
            "minecraft:silverfish": "Buried underground",
            "minecraft:pillager": "Crazy Plunder",
            "minecraft:ravager": "Die in collision",
            "minecraft:spider": "face hugger",
            "minecraft:cave_spider": "Poisonous Facehugger",
            "minecraft:enderman": "Dare to look at me?",
            "minecraft:piglin": "The profiteer of hell",
            "minecraft:endermite": "Little Guy",
            "minecraft:ender_dragon": "Chicken",
            "minecraft:wither": "Weak Chicken",
            "minecraft:player": "died by murder",
            "minecraft:dolphin": "Karma",
            "minecraft:panda": "Panda Warrior"
        },
        "dimensionalChange": {
            "1": "Hell is empty, the devil is in the world!",
            "2": "It's over?"
        },
        "onScoreChange":{
            "moneyChange0":"big negative",
            "moneyChange1e4":"satiated",
            "moneyChange1e5":"Well-off life",
            "moneyChange1e6":"millionaire",
            "moneyChange1e7":"multimillionaire",
            "moneyChange1e8":"rich to rival the country",
        },
        "other": {
            "firstEnter": "Hello,world!",
            "achieveAll":"Goodbye,world"
        }
    },
    "menu": {//菜单语言配置
        "mainTitle": "§l§6achievement §bsystem",
        "achieved": "§aAchievement completed",
        "unAchieved": "§cunfinished achievement",
        "broadcastMsg": "§l[MINECRAFT]§r player §6${pl.name} §5get achievement §2${msg}",
        "cmdDescription": "View Achievement System GUI 查看成就系统GUI",
        "cmdError": "The execution body is empty or non-player",
        "error": "Configuration file read error",
        "achi_type": {//成就类型语言配置
            "blockBreak": "block destroyer",
            "inventoryChanges": "item acquisition",
            "entitiesKilled": "biological kill",
            "dimensionalChange": "dimension change",
            "other": "others",
            "beKilled": "beKilled"
        },
    }
}

const langConfig = {//成就配置项
    "language": "zh_CN",
    "money":{
        "switch":true,
        "type":"llmoney",
        "score":50,
        "name":"money"
    },
    "Exp":{
        "switch":true,
        "type":"xp",
        "score":30
    },
    "reward":{
        "type":"minecraft:cooked_beef",
        "count":1,
        "lore":"成就奖励物品"
    },
    "economy":{
        "rank1":0,
        "rank2":1e4,
        "rank3":1e5,
        "rank4":1e6,
        "rank5":1e7,
        "rank6":1e8
    }
}


/**
 * @description:运行时全局变量
 */

let lang = {};//成就词条
let achi_type = {};//成就类型
let config = {}; //配置项
let achievementCounts=0;//成就总数

/**
 * @description文件IO操作
 */

function savePlData(list) {//保存玩家数据文件
    file.writeTo(plDataFile, JSON.stringify({players: list}));
}

function loadPlData() {//读取玩家数据文件
    cfg = file.readFrom(plDataFile);
    if (cfg) {
        return (JSON.parse(cfg)).players;
    } else {
        deBug(lang.menu.error);
        return null;
    }
}

function readFromJsonFile(path) {//读取一个json文件
    try {
        let data = file.readFrom(path);
        if (data) {
            return JSON.parse(data);
        } else {
            deBug(lang.menu.error);
            return null;
        }
    } catch (err) {
        logger.error("json文件读取出错||Error reading json file:" + err.toString());
    }
}

function saveJsonFile(path, data) {
    try {
        file.writeTo(path, JSON.stringify(data));
    } catch (err) {
        logger.error("json文件保存出错||Error saving json file:" + err.toString());
    }

}


/**
 * @description:成就数据操作
 */

function achievementJudge(player, type,key ,list){//玩家触发监听事件时判断成就获取
    addTagAndRemoveAwhile(player, type);//给玩家添加tag防止短时间内多次触发成就
    isGetAchievement(key, player, list, type);//判断是否当前成就是否已获取
    isGetAllAchievement(player);//是否全成就
    saveAchievementCount(player);//保存玩家成就完成数量
}


function getPlayerAchievementCount(pl) {//获取玩家成就完成情况
    let plData = getPlayer(loadPlData(), pl.uniqueId);
    let count = 0;
    if (plData) {
        let plKeys = Object.keys(plData);
        for (let i = 1; i < plKeys.length; i++) {
            let achiKeys = Object.keys(plData[plKeys[i]]);
            for (let j = 0; j < achiKeys.length; j++) {
                if (plData[plKeys[i]][achiKeys[j]])
                    count++;
            }
        }
    }
    return count;
}

function saveAchievementCount(pl){//保存玩家成就完成情况
    let countData = readFromJsonFile(plCountFile);
    let count  = getPlayerAchievementCount(pl);
    countData[pl.name]= {
            xid:pl.xuid,
            achieved:count,
            unAchieved:achievementCounts -count
        };
    saveJsonFile(plCountFile,countData);
}


function sumAchievementCount(){//统计成就词条总数
    let sum = 0;
    if (lang["achievement"]){
        let achievement = lang["achievement"];
        for (let ach_type in achievement) {
            sum += Object.keys(achievement[ach_type]).length;
        }
    }
    return sum;
}

function isGetAchievement(key, player, list, type) {//是否获取成就
    let pl = getPlayer(list, player.uniqueId);
    if (pl) {//玩家是否存在
        if (!pl[type])
            pl[type] = {};

        if (!pl[type][key]) {//成就是否完成
            let msg = lang.achievement[type][key];
            if (msg && msg !== "") {//成就是否存在
                broadcast(player, msg);//此处的player使用实时的玩家对象
                pl[type][key] = true;
                savePlData(list);//保存配置文件
            }
        }
    }
}

function getPlayer(list, id) {//获取玩家数据
    for (let i = 0; i < list.length; i++)
        if (list[i].id === id)
            return list[i];
    return null;
}

function rewardItem() {//奖励物品
    if (!config || !config.reward) return;

    let reward = config.reward;
    let rewardItem = mc.newItem(reward.type, reward.count);//生成物品
    if (reward.lore !== "")
        rewardItem.setLore([reward.lore]);//lore
    return rewardItem;
}

function money_add(pl){//奖励金币
    if (!config || !config.money) return false;

    let addMoney = config.money;
    if(addMoney.switch){
        switch(addMoney.type){
            case "llmoney":
                let r=money.add(pl.xuid,addMoney.score);
                return r;
            case "scoreboard":
                let ob=mc.getScoreObjective(addMoneyname);
                if(ob == null){
                    return false;
                };
                pl.addScore(addMoney.name,addMoney.score);
                return true;
            default :
                return false;
        }
    }else{
        return false;
    }
}

function addExp(pl){//奖励经验
    if (!config || !config.Exp) return false;
    let Exp = config.Exp;
    if(Exp.switch){
        switch(Exp.type){
            case "level":
            case "lv":
                return pl.addLevel(Exp.score);
            case "xp":
            case "exp":
                return pl.addExperience(Exp.score);
            default :
                return false;
        }
    }else{
        return false;
    }
}

function addTagAndRemoveAwhile(pl, tag) {//添加tag并在300毫秒后删除
    pl.addTag(tag);
    setTimeout(() => {
        pl.removeTag(tag);
    }, 300);
}

function isGetAllAchievement(pl){//是否获得全成就;
     if (getPlayerAchievementCount(pl) === achievementCounts-1){
         broadcast(pl,lang.other.achieveAll);
     }
}

/**
 * @description特殊成就处理
 */

function economyProcess(money){
    let moneyKey='moneyChange';
    if (!config || !config.economy)return;

    let economy = config.economy;

    switch (true){
        case money <= economy.rank1:moneyKey+='0';break;
        case money >= economy.rank2 && money <= economy.rank3:moneyKey+='1e4';break;
        case money >= economy.rank3 && money <= economy.rank4:moneyKey+='1e5';break;
        case money >= economy.rank4 && money <= economy.rank5:moneyKey+='1e6';break;
        case money >= economy.rank5 && money <= economy.rank6:moneyKey+='1e7';break;
        case money >= economy.rank6 :moneyKey+='1e8';break;
    }
    return moneyKey;
}

/**
 *@description:玩家行为监听
 */
function join(player) {//进服初始化玩家数据
    let list = loadPlData();//第一次进服初始化玩家数据
    if (list && player) {
        let id = player.uniqueId;
        let pl = getPlayer(list, id);
        if (!pl) {
            list.push({
                id: id,
                blockBreak: {},
                inventoryChanges: {},
                entitiesKilled: {},
                dimensionalChange: {},
                beKilled: {},
                onScoreChange:{},
                other: {
                    firstEnter: true,
                }
            });
            savePlData(list);
            broadcast(player, lang.achievement.other.firstEnter);
            saveAchievementCount(player);
        }
    }
}

function destroyBlock(player, block) {//方块破坏类
    let list = loadPlData()
    if (player && block && list && !player.hasTag("blockBreak")) {
        addTagAndRemoveAwhile(player, "blockBreak");
        isGetAchievement(block.type, player, list, "blockBreak");
        saveAchievementCount(player);
    }
}

function inventoryChange(player, slotNum, oldItem, newItem) {//物品栏变化类
    let list = loadPlData();
    if (player && newItem && list && !player.hasTag("inventoryChanges")) {
        achievementJudge(player,"inventoryChanges",newItem.type,list);
    }
}

function dimChange(player, dimId) {//维度变化
    let list = loadPlData();
    if (player && dimId && !player.hasTag("dimensionalChange")) {
        achievementJudge(player,"dimensionalChange",dimId.toString(),list);
    }
}

function entitiesKilled(mob, source) {//杀死实体
    let list = loadPlData();
    if (mob && source && source.type === "minecraft:player" && list && !source.hasTag("entitiesKilled")) {
        let player = source.toPlayer();
        achievementJudge(player,"entitiesKilled",mob.type,list);
    }
}

function playerBeKilled(player, source) {//被杀死
    let list = loadPlData();
    if (player && list && source && !player.hasTag("beKilled")) {
        achievementJudge(player,"beKilled",source.type,list);
    }
}

function onScoreChange(player,num,name,disName){//计分板数值变化监听
    let list = loadPlData();
    if (player && name && disName){
        if (name === "money"){
           achievementJudge(player,"onScoreChange",economyProcess(num),list);
        }
    }
}

function beforeLeft(pl) {//玩家退出时删除所有tag
    if (pl) {
        let tags = Object.keys(achi_type);
        tags.forEach(tag => {
            pl.removeTag(tag);
        })
    }
}

/**
 * @description:表单构建
 */

function achievementMenu(pl) {
    let fm = mc.newSimpleForm();
    let count = getPlayerAchievementCount(pl);
    fm.setTitle(lang.menu.mainTitle);
    fm.addButton(lang.menu.achieved+` ${count}`, icon_Achieved);
    fm.addButton(lang.menu.unAchieved+ ` ${achievementCounts - count}`, icon_unAchieved);

    return fm;
}

function judge(fm, lang_keys, achievement, plData, type) {//根据个人完成情况展示成就 type指的是否完成
    for (let i = 0; i < lang_keys.length; i++) {
        let lang_pro_keys = Object.keys(achievement[lang_keys[i]]);
        fm = fm.addLabel("§l§o§6" + achi_type[lang_keys[i]]);
        for (let j = 0; j < lang_pro_keys.length; j++) {
            if (Boolean(plData[lang_keys[i]][lang_pro_keys[j]]) === type) {
                fm = fm.addLabel("  " + achievement[lang_keys[i]][lang_pro_keys[j]]);
            }
        }
    }
    return fm;
}

function achievementDetails(pl, type, title) {

    let fm = mc.newCustomForm();
    fm.setTitle(title);
    let plData = getPlayer(loadPlData(), pl.uniqueId);
    let achievement = lang.achievement;
    let lang_keys = Object.keys(achievement);
    if (plData && lang_keys)
        fm = judge(fm, lang_keys, achievement, plData, type);

    return fm;
}

function returnLast(pl, data) {
    viewAchievement(null, {player:pl});
}

function achievementChoose(pl, id) {
    if (id !== null && id !== undefined) {
        let type = id === 0;
        let title = type ? "§l§a" + lang.menu.achieved : "§l§4" + lang.menu.unAchieved;//true已完成，false未完成
        pl.sendForm(achievementDetails(pl, type, title), returnLast);
    }
}

function viewAchievement(cmd, origin, output, results) {//表单查看
    if (origin && origin.player) {
        updatePlData(origin.player);
        origin.player.sendForm(achievementMenu(origin.player), achievementChoose);
    }
}

/**
 *@description:调试输出
 */
function broadcast(pl, msg) {//全服广播
    mc.runcmd("playsound random.toast @a ~ ~ ~ 10 1 1");//播放音效
    mc.broadcast(broadcastMsgFormat(lang.menu.broadcastMsg, pl.name, msg));//广播信息
    money_add(pl);
    addExp(pl);
    pl.giveItem(rewardItem());
    pl.refreshItems();//刷新物品栏
}


function broadcastMsgFormat(rawMsg, plName, msg) {//替换变量
    rawMsg = rawMsg.replace("${pl.name}", plName);
    rawMsg = rawMsg.replace("${msg}", msg);
    return rawMsg;
}

function deBug(msg) {
    mc.broadcast(`§l[MINECRAFT]§r §4${msg}`);
}


/**
 * @description:配置初始化
 */
function initFile() {//创建初始化配置文件
    if (!file.exists(dir))//创建文件夹
        file.mkdir(dir);
    if (file.exists(deprecatedPath))//将旧数据文件更名
        file.rename(deprecatedPath,plDataFile);
    if (!file.exists(plDataFile))//创建玩家数据文件
        file.writeTo(plDataFile, JSON.stringify(plData));
    if (!file.exists(plCountFile))//创建玩家统计文件
        file.writeTo(plCountFile, JSON.stringify(plCountData));

    if (!file.exists(langConfigFile))//创建语言配置文件
        file.writeTo(langConfigFile, JSON.stringify(langConfig));
    else
        loadLocalConfigAndUpdate();

    if (!file.exists(langFile))//创建语言文件
        file.writeTo(langFile, JSON.stringify(languageJudge()));
    else //若存在则检查更新并追加内容
        loadLocalDataAndUpdate();
}

function initData() {//初始化数据
    let langData = readFromJsonFile(langFile);
    let configData = readFromJsonFile(langConfigFile);
    if (langData && configData) {
        lang = langData; //加载全局语言变量
        achi_type = lang.menu.achi_type;//成就类型
        config = configData; //加载全局配置变量
        achievementCounts = sumAchievementCount();//加载成就总数
    } else {
        logger.error(lang.menu.error);
    }
}

function updatePlData(pl){//更新玩家数据中的监听对象
    let list = loadPlData();
    let player = getPlayer(list,pl.uniqueId);
    let keys = Object.keys(achi_type);
    keys.forEach(key=>{
        if (!player[key])
            player[key] = {};
    });
    savePlData(list);
}

function loadLocalDataAndUpdate() {//加载本地的语言数据文件,并且检查更新
    let localLangData = readFromJsonFile(langFile);//本地语言对象
    let langData = languageJudge();//初始语言对象

    if (!localLangData) return;//如果本地语言对象为空

    let keys = Object.keys(langData);
    keys.forEach(key => {//检查初始语言对象中是否含有新的一级属性,若有的话则将其添加至本地语言对象
        if (!localLangData[key])
            localLangData[key] = langData[key];
    })

    keys = Object.keys(langData["achievement"]);
    keys.forEach(key => {//检查初始语言对象中是否含有新的二级属性,若有的话则将其添加至本地语言对象
        if (!localLangData["achievement"][key])
            localLangData["achievement"][key] = langData["achievement"][key];
        Object.keys(langData["achievement"][key]).forEach(subKey=>{//检查成就词条是否有更新
            if (!localLangData["achievement"][key][subKey])
                localLangData["achievement"][key][subKey] = langData["achievement"][key][subKey];
        })
    })

    saveJsonFile(langFile, localLangData);//保存
}

function loadLocalConfigAndUpdate(){//加载本地的配置文件,并且检查更新
    let localConfig = readFromJsonFile(langConfigFile);
    Object.keys(langConfig).forEach(key=>{
        if (!localConfig[key])
            localConfig[key] = langConfig[key];
    });
    saveJsonFile(langConfigFile,localConfig);
}

function languageJudge() {//在配置文件读取失败的情况默认使用中文
    let languageConfig = readFromJsonFile(langConfigFile);
    if (languageConfig) {
        if (languageConfig.language === "zh_CN") {
            return langData_zh_CN;
        } else {
            return langData_en_US;
        }
    }
    return langData_zh_CN;
}


/**
 * @description 真指令注册
 */
function cmdSignUp() {
    let cmd = mc.newCommand("view", lang.menu.cmdDescription, PermType.Any, 0x80);
    cmd.overload([]);
    cmd.setCallback(viewAchievement);
    cmd.setup();
}


//事件监听
mc.listen("onJoin", join);
mc.listen("onInventoryChange", inventoryChange);
mc.listen("onDestroyBlock", destroyBlock);
mc.listen("onMobDie", entitiesKilled);
mc.listen("onChangeDim", dimChange);
mc.listen("onPlayerDie", playerBeKilled);
mc.listen("onLeft", beforeLeft);
mc.listen('onScoreChanged',onScoreChange);

//注册玩家命令
mc.listen("onServerStarted", cmdSignUp);
//初始化配置
initFile();
//初始化运行时数据
initData();
logger.setConsole(true, 4);
logger.info("[Achievement]Version:1.9");
logger.info("[Achievement]Author:Stranger");
logger.info("[Achievement]Language:" + config.language);
logger.info("[Achievement]website:https://www.minebbs.com/resources/3434/");


