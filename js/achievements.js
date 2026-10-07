addLayer("a", {
    
    startData() {
        return {
            unlocked: true,
            points: new EN(0),
        }
    },
    color: "yellow",
    symbol: "A",
    row: "side",
    layerShown() {
        return true
    },
    tooltip() {
        return ("成就")
    },
    achievements: {
        11: {
            name: "起点",
            done() {
                return player.points.gte(1)
            },
            tooltip: "获得 1 点数<br>奖励:1 成就点",
            onComplete() {
                return player.a.points = player.a.points.add(1)
            },
        },
        12: {
            name: "重生",
            done() {
                return player.p.points.gte(1)
            },
            tooltip: "获得 1 重生点<br>奖励:2 成就点",
            onComplete() {
                return player.a.points = player.a.points.add(2)
            },
        },
        13: {
            name: "重生百世",
            done() {
                return player.p.points.gte(100)
            },
            tooltip: "获得 100 重生点<br>奖励:2 成就点",
            onComplete() {
                return player.a.points = player.a.points.add(2)
            },
        },
        14: {
            name: "增量器",
            done() {
                return player.I.points.gte(1)
            },
            tooltip: "获得 1 增量器<br>奖励:5 成就点",
            onComplete() {
                return player.a.points = player.a.points.add(5)
            },
        },
        15: {
            name: "增量升级",
            done() {
                return hasUpgrade('I', 11)
            },
            tooltip: "购买升级 重生增量<br>奖励:5 成就点,成就点效果基础+0.04,且成就点效果对重生点获取生效",
            onComplete() {
                return player.a.points = player.a.points.add(5)
            },
        },
        16: {
            name: "自动重生",
            done() {
                return player.I.points.gte(12)
            },
            tooltip: "获得 12 增量器<br>奖励:5 成就点,永久保留第一行重生点升级",
            onComplete() {
                return player.a.points = player.a.points.add(5)
            },
        },
        21: {
            name: "重生能量",
            done() {
                return player.e.points.gte(1)
            },
            tooltip: "获得 1 能量<br>奖励:5 成就点,永久保留第二行重生点升级",
            onComplete() {
                return player.a.points = player.a.points.add(5)
            },
        },
        22: {
            name: "无限重生",
            done() {
                return player.p.points.gte('1.79e308')
            },
            tooltip: "获得 1.79e308 重生点<br>奖励:25 成就点,成就点效果基础+0.05,且成就点效果对能量获取生效",
            onComplete() {
                return player.a.points = player.a.points.add(25)
            },
        },
        23: {
            name: "增量变胀",
            done() {
                return hasUpgrade('I', 32)
            },
            tooltip: "购买升级 增胀<br>奖励:25 成就点,每秒获得 100% 能量,永久保留第一个增量器里程碑",
            onComplete() {
                return player.a.points = player.a.points.add(25)
            },
        },
        24: {
            name: "我去,软上限?!",
            done() {
                return player.BestPointsPerSec.gte('1.79e308')
            },
            tooltip: "达到第一重软上限<br>奖励:25 成就点,成就点效果对增量获取生效,解锁新层",
            onComplete() {
                return player.a.points = player.a.points.add(25)
            },
        },
        25: {
            name: "人生...",
            done() {
                return hasUpgrade('R', 13)
            },
            tooltip: "解锁人生<br>奖励:14 成就点,永久保留增量器里程碑,解锁新的重生点升级",
            onComplete() {
                return player.a.points = player.a.points.add(14)
            },
        },
        26: {
            name: "原来如此",
            done() {
                return hasUpgrade('p', 35)
            },
            tooltip: "购买升级 原来如此<br>奖励:36 成就点,成就点效果对重生经验获取生效,增量效果*(增量器数+1)",
            onComplete() {
                return player.a.points = player.a.points.add(36)
            },
        },
        31: {
            name: "漫长...",
            done() {
                return player.R.cm1Best.gte('1e155')
            },
            tooltip: "在路阻且长中达1e155点数<br>奖励:50 成就点,再来一次效果^2加成感悟颇深和能量增量效果,效果^0.5加成增量获取",
            onComplete() {
                return player.a.points = player.a.points.add(50)
            },
        },
        32: {
            name: "愈发艰难...",
            done() {
                return player.R.cm1Best.gte('1.79e308')
            },
            tooltip: "在路阻且长中达1.79e308点数<br>奖励:50 成就点,路阻且长效果1*999999.9967138,且加成增量和能量获取",
            onComplete() {
                return player.a.points = player.a.points.add(50)
            },
        },
    },
effect() {
    let base=new EN(1.01)
    if (hasAchievement('a', 15)) base=base.add(0.04)
    if (hasAchievement('a', 22)) base=base.add(0.05)
    let exp=player.a.points
    let raw=base.pow(exp)
    return raw;
},
   tabFormat: ["blank", ["display-text", function() {
        return `<h3 style='color: yellow;'>成就：${player.a.achievements.length}/${Object.keys(tmp.a.achievements).length - 2}</h3>
                <br>
                你有 <h2 style='color: yellow; text-shadow: 0 0 10px yellow'>${format(player.a.points)}</h2> 成就点。
                <br>
                <h4 style='color: #ffffff;'>点数获取 *${format(tmp.a.effect, 4, true)}</h4>`;
    }], "blank", "blank", "achievements"],
})