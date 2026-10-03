function makeRed(c){
    return "<span style='color:#FF0000'>" + c + "</span>"
}

addLayer("p", {
    name: "重生点",
    symbol: "P",
    position: 0,
    row: 0,
    startData() { return {
        unlocked: true,
        points: new ExpantaNum(0),
    }},
    color: "#3399FF",
    requires: new ExpantaNum(10),
    resource: "重生点",
    baseResource: "points",
    baseAmount() {return player.points},
    type() { return "normal" },    
    exponent() { return new EN(0.5) },      
    gainMult() { // 只保留 p 层级自己的加成
        let mult = new EN(1)
        if (hasUpgrade('p', 13)) mult = mult.times(upgradeEffect('p', 13))
            if (hasUpgrade('p', 15)) mult = mult.times(upgradeEffect('p', 15))
                if (player.I.unlocked && tmp.I && tmp.I.effect) {
    mult = mult.times(tmp.I.effect.pow(0.78));
}
if (player.e.unlocked && tmp.e && tmp.e.effect) {
    mult = mult.times(tmp.e.effect);
}
        if (hasAchievement('a', 15)) mult = mult.times(tmp.a.effect)
        return mult
    },
    gainExp() {
        let exp = new EN(1)
        if (hasUpgrade('p', 22)) exp = exp.times(upgradeEffect('p', 22))
            if (hasUpgrade('p', 25)) exp = exp.times(upgradeEffect('p', 25))
                if(hasMilestone("e", 1)) exp = exp.times(1.1)
                    if(hasUpgrade("I", 23)) exp = exp.times(1.01)
        return exp
    },
    passiveGeneration() {
    if (hasMilestone("I", 1)) return 1;  // 100% = 1倍
    return 0;
},
    tabFormat: [
        "main-display",
        "prestige-button",
        ["microtabs", "stuff"],
        ["blank", "25px"],
    ],
    microtabs: {
        stuff: {
            "Upgrades": {
                unlocked() {return true}, 
                content: [
                    ["blank", "15px"],
                    ["raw-html", () => `<h4 style="opacity:.5">欢迎来到你的新游戏！<br>重置获得重生点。<br>重生点可以用来购买升级。</h4>`],
                    ["upgrades", [1,2,3,4,5,6,7,8,9]]
                ],
            },
        },
    },
    upgrades: {        
rows: 5, cols: 5,        
   11: { title: "一切的开端", description: "双倍点数获取", cost: new EN(1) },
   12: { title: "经典", description: "重生点提升点数获取", cost: new EN(10),
    unlocked() { return hasUpgrade('p', 11) },    
    effect() {        
        let raw = player[this.layer].points.add(1).pow(0.5);               
        let cap = new EN("1e9");        
        return effectWithSoftcap(raw, cap, new EN(0.5).div(player[this.layer].points.nlg().nlg().add(1)));
    },    
    effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" }
    },
    13: {title: "反经典",description: "点数提升重生点获取",cost: new EN(25),    
        unlocked() { return hasUpgrade('p', 12) },    
        effect() {        
            let raw = player.points.add(1).pow(0.2);               
            let cap = new EN("1e9");        
            return effectWithSoftcap(raw, cap, new EN(0.5).div(player.points.nlg().nlg().add(1)));
        },    
        effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" }
    },
    14: {title: "点数自增",description: "点数提升点数获取", cost: new EN(100),    
        unlocked() { return hasUpgrade('p', 13) },    
        effect() {        
            let raw = player.points.add(1).pow(0.25);               
            let cap = new EN("1e9");        
            return effectWithSoftcap(raw, cap, new EN(0.4).div(player.points.nlg().nlg().add(1)));
        },    
        effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" }
    },
    15: {title: "反复重生",description: "重生点提升重生点获取,解锁增量器",cost: new EN(250),    
        unlocked() { return hasUpgrade('p', 14) },    
        effect() {        
            let raw = player[this.layer].points.add(1).pow(0.25);               
            let cap = new EN("1e9");        
            return effectWithSoftcap(raw, cap, new EN(0.3).div(player[this.layer].points.nlg().nlg().add(1)));
        },    
        effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" }
    },
    21: {title: "反重生",description: "重生点提升增量器获取",cost: new EN(1919810),    
        unlocked() { return hasUpgrade('I', 11)&&hasUpgrade('p', 15) },    
        effect() {        
            let raw = player[this.layer].points.pow(0.005);    
            if (hasUpgrade('I', 12)) raw = raw.times(1.3)
            if (hasUpgrade('I', 22)) raw = raw.times(upgradeEffect('I', 22)) 
            if (hasUpgrade('I', 22)) raw = raw.pow(1.5) 
            if (hasUpgrade('e', 22)) raw = raw.pow(1.5)          
            let cap = new EN("2");        
            if (hasUpgrade('p', 25)) cap = cap.times(1.1)
                 if (hasUpgrade('I', 15)) cap = cap.times(1.3)
                     if (hasUpgrade('e', 22)) cap = cap.pow(1.5) 
                        if (hasUpgrade('I', 22)) cap = cap.pow(1.25)
            return effectWithSoftcap(raw, cap, new EN(0.01).div(player[this.layer].points.nlg().nlg().add(1)));
        },  
        effectDisplay() { return format(upgradeEffect(this.layer, this.id),6,true) + "x" }
    },
    22: {title: "反自增",description: "重生点提升重生点获取指数",cost: new EN(1e23),    
        unlocked() { return hasUpgrade('I', 13)&&hasUpgrade('p', 21) },    
        effect() {        
            let raw = player[this.layer].points.nlg().nlg().pow(0.25);               
            let cap = new EN("2");        
            return effectWithSoftcap(raw, cap, new EN(0.125).div(player[this.layer].points.nlg().nlg().add(1)));
        },    
        effectDisplay() { return "^" + format(upgradeEffect(this.layer, this.id),6,true)  }
    },
    23: {title: "胀",description: "重生点提升点数获取指数",cost: new EN(1e28),    
        unlocked() { return hasUpgrade('p', 22) },    
        effect() {        
            let raw = player[this.layer].points.nlg().nlg().pow(0.2);               
            let cap = new EN("2");        
            return effectWithSoftcap(raw, cap, new EN(0.13).div(player[this.layer].points.nlg().nlg().add(1)));
        },    
        effectDisplay() { return "^" + format(upgradeEffect(this.layer, this.id),6,true)  }
    },
    24: {title: "胀^2",description: "点数提升点数获取指数",cost: new EN(3e33),    
        unlocked() { return hasUpgrade('I', 14)&&hasUpgrade('p', 23) },    
        effect() {        
            let raw = player.points.nlg().nlg().pow(0.1);               
            let cap = new EN("2");        
            return effectWithSoftcap(raw, cap, new EN(0.1).div(player.points.nlg().nlg().add(1)));
        },    
        effectDisplay() { return "^" + format(upgradeEffect(this.layer, this.id),6,true)  }
    },
    25: {title: "胀^胀",description: "点数提升重生点获取指数,并将反重生效果软上限延迟1.1倍",cost: new EN(3.34e38),    
        unlocked() { return hasUpgrade('p', 24) },    
        effect() {        
            let raw = player.points.nlg().nlg().pow(0.125);               
            let cap = new EN("2");        
            return effectWithSoftcap(raw, cap, new EN(0.091).div(player.points.nlg().nlg().add(1)));
        },    
        effectDisplay() { return "^" + format(upgradeEffect(this.layer, this.id),6,true)  }
    },
},
    doReset(resettingLayer){
    if(layers[resettingLayer].row > this.row) {
        layerDataReset(this.layer)
        if (hasAchievement("a", 16)) keepUpgrades("p", [11, 12, 13, 14, 15])
            if (hasAchievement("a", 21)) keepUpgrades("p", [21, 22, 23, 24, 25])
    }
},
    layerShown(){ return true } 
})
addLayer("I", {
    name: "增量器",
    symbol: "I",
    position: 0,
    startData() { return {
        unlocked: false,
        points: new EN(0),
        auto: false,
    }},
    color: "#3b18ff",
    requires: new EN(1e5),
    resource: "增量器",
    baseResource: "points",
    baseAmount() {return player.points},
    type: "static",
    branches: ["p"],
    exponent() {return new EN(1.91981)},
    resetsNothing() { return player.I.auto || hasMilestone("I", 3) },
    gainMult() {
        let mult = new EN(1)
        return mult
    },
directMult() {
    let mult = new EN(1)
    if (hasUpgrade('p', 21)) mult = mult.times(upgradeEffect('p', 21))
    return mult
},
    gainExp() {
        return new EN(1)
    },
    canBuyMax() { return hasMilestone("I", 2) },
    row: 1,
    layerShown() { return hasUpgrade("p", 15) || player.I.unlocked },
    automate() {},
    effect() {
    let p = player[this.layer].points;
    if(p.lte(0)) return new EN(1);
    let logP = p.nlg();
    let base=p.div(logP).add(1);
    if(hasUpgrade("I", 14)) base=base.times(2);
    if(hasUpgrade("e", 12)) base=base.times(upgradeEffect('e', 12));
    let exp=logP.times(1.01);
    let raw=base.pow(exp);
    if(hasUpgrade("I", 12)) raw=raw.pow(1.5);
    if(hasUpgrade("I", 13)) raw=raw.pow(1.75);
    if(hasUpgrade("e", 21)) raw=raw.pow(2);
    return raw;
},
    effectDescription(){
    let c = tmp[this.layer].color;
    return `使点数获取 ${coloredText("*" + format(tmp.I.effect, 4, true), c)} ` +
           `重生点获取 ${coloredText("*" + format(tmp.I.effect.pow(0.78), 4, true), c)}`;
},
    doReset(resettingLayer) {
        let keep = [];
        if (layers[resettingLayer].row > this.row) layerDataReset("I", keep);
    },
    autoPrestige() { return hasMilestone("I", 3) },
    tabFormat: [
        "main-display",
        "prestige-button",
        ["microtabs", "stuff"],
        ["blank", "25px"],
    ],
    microtabs: {
        stuff: {
            "升级": {
                 unlocked() {return (hasAchievement("a", 11))},
                 content: [
                     ["blank", "15px"],
                     ["raw-html", () => `<h4 style="opacity:.5">你会看到里程碑，它们对你的进度帮助很大</h4>`],
                     ["upgrades", [1,2,3,4,5,6,7,8,9]]
                 ]
             },
            "里程碑": {
                content: [
                    ["blank", "15px"],
                    "milestones"
                ]
            },
        },
    },
    milestones: {
        1: {
            requirementDescription: "12 增量器",
            effectDescription() { return "每秒获得 100% 重生点" }, 
            done() { return player.I.points.gte(12) }
        },
        2: {
            requirementDescription: "25 增量器",
            effectDescription() { return "你可以最大购买增量器" },
            done() { return player.I.points.gte(25) }
        },
        3: {
            requirementDescription: "107 增量器",
            effectDescription() { return "自动进行增量器重置,并且不重置任何内容" },
            done() { return player.I.points.gte(107) }
        },
    },
    upgrades: {        
rows: 9, cols: 5,        
   11: { title: "重生增量", description: "解锁一个新重生点升级", cost: new EN(5) },
    12: { title: "增量", description: "增量器效果^1.5,反重生效果*1.3", cost: new EN(8), unlocked() { return hasUpgrade('I', 11) }   },
    13: { title: "再次增量", description: "增量器效果^1.75,解锁两个新重生点升级", cost: new EN(12), unlocked() { return hasUpgrade('I', 12) }  },
    14: { title: "反复增量", description: "增量器效果基础*2,解锁两个新重生点升级", cost: new EN(18), unlocked() { return hasUpgrade('I', 13) }  },
    15: { title: "增量增量", description: "反重生效果软上限延迟1.3倍,解锁一个新层级", cost: new EN(24), unlocked() { return hasUpgrade('I', 14) }  },
    21: { title: "增量^2", description: "能量效果^1.3,91增量器后使增量器提升能量获取", cost: new EN(101), unlocked() { return hasUpgrade('I', 15) && hasUpgrade('e', 22) } ,
        effect() {        if(player.I.points.lt(91)) return new EN(1);
        let raw = player.I.points.pow(2);               
        let cap = new EN("1e9");        
        return effectWithSoftcap(raw, cap, new EN(0.125).div(player.I.points.nlg().nlg().add(1)));
    },    
    effectDisplay() { return format(upgradeEffect(this.layer, this.id),4,true) + "x" }
    },
    22: { title: "增量^3", description: "反重生效果^1.5,反重生效果软上限延迟^1.5,增量器提升反重生效果", cost: new EN(105), unlocked() { return hasUpgrade('I', 21) } ,
        effect() {     
        let raw = player.I.points.add(1).pow(0.521);               
        let cap = new EN("1e9");        
        return effectWithSoftcap(raw, cap, new EN(0.125).div(player.I.points.nlg().nlg().add(1)));
    },    
    effectDisplay() { return format(upgradeEffect(this.layer, this.id),4,true) + "x" }
    },
    23: { title: "增量^1.79e308", description: "重生点获取^1.01", cost: new EN(169), unlocked() { return hasUpgrade('I', 22) } ,
           },
},
})
addLayer("e", {
    name: "能量",
    symbol: "E",
    position: 1,
    row: 1,
    startData() { return {
        unlocked: false,
        points: new ExpantaNum(0),
    }},
    color: "#ffeb33ff",
    requires: new ExpantaNum(1e33),
    resource: "能量",
    branches: ["p"],
    baseResource: "points",
    baseAmount() {return player.points},
    type() { return "normal" },    
    exponent() { return new EN(0.1) },      
    gainMult() { 
        let mult = new EN(1)
        if (hasUpgrade('e', 11)) mult = mult.times(upgradeEffect('e', 11))
            if (hasUpgrade('e', 13)) mult = mult.times(upgradeEffect('e', 13))
                if (hasUpgrade('I', 21)) mult = mult.times(upgradeEffect('I', 21))
               if (hasAchievement('a', 22)) mult = mult.times(tmp.a.effect)      
        return mult
    },
    gainExp() {
        let exp = new EN(1)
        return exp
    },
    passiveGeneration() {
    return 0;
},
layerShown() { return hasUpgrade("I", 15) || player.e.unlocked },
    automate() {},
    effect() {
    let p = player[this.layer].points;
    if(p.lte(0)) return new EN(1);
    let logP = p.nlg();
    let base=p.div(logP).add(2.5);
    let exp=logP.nlg().times(1.025).min(5);
    let raw=base.pow(exp);
    if(hasUpgrade("e", 14)) raw=raw.times(upgradeEffect("e", 14));
    if(hasUpgrade("I", 21)) raw=raw.pow(1.3);
    return raw;
},
    effectDescription(){
    let c = tmp[this.layer].color;
    return `使重生点获取 ${coloredText("*" + format(tmp.e.effect, 4, true), c)}`;
},
    doReset(resettingLayer) {
        let keep = [];
        if (layers[resettingLayer].row > this.row) layerDataReset("e", keep);
    },
    autoPrestige() { return false },
    tabFormat: [
        "main-display",
        "prestige-button",
        ["microtabs", "stuff"],
        ["blank", "25px"],
    ],
    microtabs: {
        stuff: {
            "升级": {
                 content: [
                     ["blank", "15px"],
                     ["upgrades", [1,2,3,4,5,6,7,8,9]]
                 ]
             },
            "里程碑": {
                content: [
                    ["blank", "15px"],
                    "milestones"
                ]
            },
        },
    },
    milestones: {
        1: {
            requirementDescription: "1 能量",
            effectDescription() { return "重生点获取^1.1" }, 
            done() { return player.e.points.gte(1) }
        },
    },
    upgrades: {        
rows: 9, cols: 5,        
 11: { title: "经典重现", description: "能量提升能量获取", cost: new EN(15),
    unlocked() { return true },    
    effect() {        
        let raw = player[this.layer].points.add(1).pow(0.25);     
        if (hasUpgrade('e', 15)) raw = raw.pow(2);          
        let cap = new EN("1e9");        
        return effectWithSoftcap(raw, cap, new EN(0.25).div(player[this.layer].points.nlg().nlg().add(1)));
    },    
    effectDisplay() { return format(upgradeEffect(this.layer, this.id),4,true) + "x" }
    },
    12: { title: "能量增量", description: "能量提升增量器效果基础", cost: new EN(66),
    unlocked() { return hasUpgrade('e', 11) },    
    effect() {        
        let raw = player[this.layer].points.nlg().pow(0.78);
          if (hasUpgrade('e', 15)) raw = raw.pow(2);                
        let cap = new EN("1e9");        
        return effectWithSoftcap(raw, cap, new EN(0.25).div(player[this.layer].points.nlg().nlg().add(1)));
    },    
    effectDisplay() { return format(upgradeEffect(this.layer, this.id),4,true) + "x" }
    },
    13: { title: "E=mc²", description: "点数提升能量获取", cost: new EN(1234),
    unlocked() { return hasUpgrade('e', 12) },    
    effect() {        
        let raw = player.points.nlg().pow(0.67); 
          if (hasUpgrade('e', 15)) raw = raw.pow(2);               
        let cap = new EN("1e9");        
        return effectWithSoftcap(raw, cap, new EN(0.25).div(player.points.nlg().nlg().add(1)));
    },    
    effectDisplay() { return format(upgradeEffect(this.layer, this.id),4,true) + "x" }
    },
    14: { title: "E=1/2mv²", description: "能量提升能量效果", cost: new EN(12345),
    unlocked() { return hasUpgrade('e', 13) },    
    effect() {        
        let raw = player.e.points.add(1).pow(1.3);               
        let cap = new EN("1e9");        
        return effectWithSoftcap(raw, cap, new EN(0.125).div(player.e.points.nlg().nlg().add(1)));
    },    
    effectDisplay() { return format(upgradeEffect(this.layer, this.id),4,true) + "x" }
    },
    15: { title: "能量守恒", description: "前三能量升级效果^2", cost: new EN(100000),
    unlocked() { return hasUpgrade('e', 14) },    
    },
    21: { title: "动能定理", description: "增量器效果^2", cost: new EN(1e10),
    unlocked() { return hasUpgrade('e', 15) },    
    },
    22: { title: "内能", description: "反重生效果^1.5,反重生效果软上限延迟^1.25,解锁一个新增量器升级", cost: new EN(9e15),
    unlocked() { return hasUpgrade('e', 21) },    
    },
},
})
addLayer("stat", {
    name: "统计",
    symbol: "📈",
    position: 0,
    startData() { return { points: 0, unlocked: true } },
    color: "#ffffff",
    tooltip(){return "统计"},
    row: "side",
    layerShown(){return true},
    tabFormat:{
        "Stats":{
            content:[
                ["display-text", function(){return getStatTab()}]
            ]
        },
    },
})

function getStatTab(){
    let br = "<br>"
    let x = "<h1 style='color: #ffffff'>点数</h1>"
    x += br
    x += "<h3>你有 " + format(player.points) + " 点数。</h3>"
    x += br
    x += "<h3>你的最高点数为 " + format(player.BestPoints) + "。</h3>"    
    x += br
    x += "<h3>你的最高每秒点数为 " + format(player.BestPointsPerSec) + "。</h3>"    
    x += br
    x += "<h1>时间:🕒</h1>"
    x += br
    x += "<h3>你已经游玩了 " + formatTime(player.timePlayed, true) + "。</h3>"
    return x
}