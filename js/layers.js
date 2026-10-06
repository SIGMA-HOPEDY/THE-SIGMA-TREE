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
        points: new EN(0),
        rexp: new EN(0), 
    }},
    color: "#3399FF",
    requires: new EN(10),
    resource: "重生点",
    baseResource: "points",
    baseAmount() {return player.points},
    type() { return "normal" },    
    exponent() { return new EN(0.5) },      
    gainMult() { 
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
             if (player.p.rexp && player.p.rexp.gt(0)) {
        let rexpEff = player.p.rexp.add(1).pow(player.p.rexp.nlg().pow(0.5));
        mult = mult.times(rexpEff);
    }
        return mult
    },
    update(diff) {
    if (!tmp.p) tmp.p = {};
    if (!player.p.points.gte("1.79e308") && player.R.activeChallenge !== 11) {
        tmp.p.rexpGain = new EN(0);
        return;
    }
    let gain = new EN(1);
    if (player.R.activeChallenge !== 11) {
        gain = player.p.points.add(1).log10()
            .div(new EN("1.79e308").log10());
        if (gain.lte(0)) gain = new EN(0);
    }
    let cmBest = player.R.cm1Best || new EN(0);
    let cap = new EN("4.44e444");
    let capped = cmBest.min(cap);
    if (capped.gt(0)) {
        gain = gain.times(capped.nlg().times(999.5436));
    }
    if (hasUpgrade("R", 11)) gain = gain.times(upgradeEffect("R", 11));
    if (hasUpgrade("p", 32)) gain = gain.times(upgradeEffect("p", 32));
    if (hasUpgrade("p", 34)) gain = gain.times(upgradeEffect("p", 34));
    if (hasAchievement('a', 26)) gain = gain.times(tmp.a.effect)
    if (player.R.activeChallenge === 11) gain = gain.pow(0.5);
    if (hasChallenge("R", 11)) gain = gain.pow(1.25);   
    if (hasUpgrade("R", 15)) gain = gain.pow(upgradeEffect("R", 15));
    player.p.rexp = player.p.rexp.add(gain.times(diff));
    tmp.p.rexpGain = gain;
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
            "升级": {
                unlocked() {return true}, 
                content: [
                    ["blank", "15px"],
                    ["raw-html", () => `<h4 style="opacity:.5">欢迎来到你的新游戏！<br>重置获得重生点。<br>重生点可以用来购买升级。</h4>`],
                    ["upgrades", [1,2,3,4,5,6,7,8,9]]
                ],
            },
            "重生经验": {
    unlocked() { return hasMilestone("R", 1); },
    content: [
        ["blank", "15px"],
        ["display-text", function() {
            let rexp = player.p.rexp || new EN(0);
            let gain = tmp.p?.rexpGain || new EN(0);
            let c = tmp.p.color;
            return `你有 ${coloredText(format(rexp, 4, true), c)} 重生经验 ` +
                   `(${coloredText("+" + format(gain, 4, true), c)}/s)`;
        }],
        ["blank", "15px"],
        ["display-text", function() {
            let rexp = player.p.rexp || new EN(1);
            let eff = rexp.add(1).pow(rexp.nlg().pow(0.5));
            let c = tmp.p.color;
            return `使重生点获取 ${coloredText("*" + format(eff, 4, true), c)}`;
        }],
        ["blank", "15px"],
        ["raw-html", () => `<h4 style="opacity:.5">重生点达到 <b>1.79e308</b> 后开始自动获取重生经验。</h4>`],
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
        unlocked() { return hasUpgrade('p', 21)||(hasUpgrade('I', 11)&&hasUpgrade('p', 15)) },    
        effect() {        
            let raw = player[this.layer].points.pow(0.005);    
            if (hasUpgrade('I', 12)) raw = raw.times(1.3)
            if (hasUpgrade('I', 22)) raw = raw.times(upgradeEffect('I', 22)) 
                if (hasUpgrade('I', 34)) raw = raw.times(upgradeEffect('I', 34)) 
                    if (hasUpgrade('e', 24)) raw = raw.times(upgradeEffect('e', 24))
                        if (hasUpgrade('p', 35)) raw = raw.pow(upgradeEffect('p', 35)) 
            if (hasUpgrade('I', 22)) raw = raw.pow(1.5) 
            if (hasUpgrade('e', 22)) raw = raw.pow(1.5)    
                if (hasUpgrade('R', 14)) raw = raw.pow(upgradeEffect('R', 14))       
            let cap0 = new EN("2");        
            if (hasUpgrade('p', 25)) cap0 = cap0.times(1.1)
                 if (hasUpgrade('I', 15)) cap0 = cap0.times(1.3)
                     if (hasUpgrade('e', 22)) cap0 = cap0.pow(1.5) 
                        if (hasUpgrade('I', 22)) cap0 = cap0.pow(1.25)
                            raw = effectWithSoftcap(raw, cap0, new EN(0.01).div(player[this.layer].points.nlg().nlg().add(1)))
                        let cap1 = new EN("25");
                         raw = effectWithSoftcap(raw, cap1, new EN(0.001).div(player[this.layer].points.nlg().nlg().add(1)))
                         let cap2 = new EN("1e9");
                         if (raw.gte(cap2)) raw = raw.div(cap2).log10().add(1).times(cap2);
                         let cap3 = new EN("3.34e38");
                         if (raw.gte(cap3)) raw = raw.div(cap3).log10().add(1).pow(0.5).times(cap3);
                          let cap4 = new EN("1.79e308");
                         if (raw.gte(cap4)) raw = raw.div(cap4).log10().add(1).pow(0.025).times(cap4);
            return raw;
        },  
        effectDisplay() { return format(upgradeEffect(this.layer, this.id),6,true) + "x" }
    },
    22: {title: "反自增",description: "重生点提升重生点获取指数",cost: new EN(1e23),    
        unlocked() { return hasUpgrade('p', 22)||(hasUpgrade('I', 13)&&hasUpgrade('p', 21) )},    
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
        unlocked() { return hasUpgrade('p', 24)||(hasUpgrade('I', 14)&&hasUpgrade('p', 23) )},    
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
    31: {
    title: "重生感悟",
    description: "重生经验加成增量获取",
    cost: new EN("9e15"),
    currencyDisplayName: "重生经验",
    currencyInternalName: "rexp",
    currencyLayer: "p",             
    unlocked() { return hasAchievement("a", 25); },
    effect() {
    let raw = player.p.rexp.add(1).pow(0.444);
    let cap = new EN("1.79e308");
    return effectWithSoftcap(raw, cap, new EN(0.555).div(player.p.rexp.nlg().nlg().add(1)));
},
effectDisplay() { return format(upgradeEffect(this.layer, this.id), 4, true) + "x" }
},
32: {
    title: "感悟颇深",
    description: "增量加成重生经验获取",
    cost: new EN("1e16"),
    currencyDisplayName: "重生经验",
    currencyInternalName: "rexp",
    currencyLayer: "p",             
    unlocked() { return hasUpgrade("p",31); },
    effect() {
    let raw = player.I.increment.nlg();
    let cap = new EN("1.79e308");
    return effectWithSoftcap(raw, cap, new EN(0.555).div(raw.nlg().nlg().add(1)));
},
effectDisplay() { return format(upgradeEffect(this.layer, this.id), 4, true) + "x" }
},
33: {
    title: "有感而发",
    description: "重生经验加成能量获取",
    cost: new EN("5e17"),
    currencyDisplayName: "重生经验",
    currencyInternalName: "rexp",
    currencyLayer: "p",             
    unlocked() { return hasUpgrade("p",32); },
    effect() {
     let raw = player.p.rexp.add(1).pow(0.666);
    let cap = new EN("1.79e308");
    return effectWithSoftcap(raw, cap, new EN(0.555).div(player.p.rexp.nlg().nlg().add(1)));
},
effectDisplay() { return format(upgradeEffect(this.layer, this.id), 4, true) + "x" }
},
34: {
    title: "不妨如此",
    description: "能量加成重生经验获取",
    cost: new EN("6.7e17"),
    currencyDisplayName: "重生经验",
    currencyInternalName: "rexp",
    currencyLayer: "p",             
    unlocked() { return hasUpgrade("p",33); },
    effect() {
     let raw = player.e.points.pow(0.04);
    let cap = new EN("1.79e308");
    return effectWithSoftcap(raw, cap, new EN(0.555).div(raw.nlg().nlg().add(1)));
},
effectDisplay() { return format(upgradeEffect(this.layer, this.id), 4, true) + "x" }
},
35: {
    title: "原来如此",
    description: "重生经验加成反重生效果,同时以^0.1后的效果加成增量获取",
    cost: new EN("2.026e22"),
    currencyDisplayName: "重生经验",
    currencyInternalName: "rexp",
    currencyLayer: "p",             
    unlocked() { return hasUpgrade("p",34); },
    effect() {
     let raw = player.p.rexp.nlg().nlg().pow(2.88);
    let cap = new EN("5");
    return effectWithSoftcap(raw, cap, new EN(0.555).div(player.p.rexp.nlg().nlg().add(1)));
},
effectDisplay() { return  "^"+format(upgradeEffect(this.layer, this.id), 4, true)  }
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
    increment: new EN(0),
    best: new EN(0), 
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
    update(diff) {
    let p = player.I.points;
    if (!p.gte(175)) {
        tmp.I.incrementGain = new EN(0);
        return;
    }
    let e13 = tmp.I?.buyables?.[13]?.effect ?? new EN(1);
    let e11 = tmp.I?.buyables?.[11]?.effect ?? new EN(1);
    let e12 = tmp.I?.buyables?.[12]?.effect ?? new EN(1);

    let exponent = new EN(0.5).times(e13);
    let base=p.div(175).sub(1).nlog(2)
    if (hasUpgrade("I", 25))base=base.times(1.05)
        if (player.R.unlocked && tmp.R?.effect) {
    base = base.times(tmp.R.effect.incrementBase);
}
    let gain =base.pow(exponent);
    gain = gain.times(e11).times(e12);
    if (hasUpgrade("I", 31))gain=gain.times(upgradeEffect('I',31))
        if (hasUpgrade("I", 33))gain=gain.times(upgradeEffect('I',33))
            if (hasUpgrade("p", 31))gain=gain.times(upgradeEffect('p',31))
        if (hasUpgrade("e", 23))gain=gain.times(upgradeEffect('e',23))
            if (hasAchievement("a", 24)) gain = gain.times(tmp.a.effect);
        if (hasUpgrade("I", 31))gain=gain.pow(1.25)
            if (hasUpgrade('p', 35)) gain = gain.pow(upgradeEffect('p', 35).pow(0.1)) 
    let cap0 = new EN('1.79e308');
        gain = effectWithSoftcap(gain, cap0, new EN(1).div(gain.nlg().nlg().add(1)));
    player.I.increment = player.I.increment.add(gain.times(diff));
    tmp.I.incrementGain = gain;
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
    base = base.times(player.I.increment.nlg().pow(2));
    if (hasAchievement('a', 26)) base = base.times(player.I.points.add(1))
    let exp=logP.times(1.01);
    let raw=base.pow(exp);
    if(hasUpgrade("I", 12)) raw=raw.pow(1.5);
    if(hasUpgrade("I", 13)) raw=raw.pow(1.75);
    if(hasUpgrade("e", 21)) raw=raw.pow(2);
    if (player.R.activeChallenge === 11) raw = raw.pow(0.5);
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
         if (hasAchievement("a", 23)) keepMilestones("I", [1])
             if (hasAchievement("a", 25)) keepMilestones("I", [2,3])
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
             "增量": {
    unlocked() { return hasUpgrade("I", 24); },
    content: [
        ["blank", "15px"],
        ["display-text", function() {
            let amt = player.I.increment || new EN(0);
            let gain = tmp.I?.incrementGain || new EN(0);
            let c = tmp.I.color;
            return `你有 ${coloredText(format(amt, 4, true), c)} 增量 ` +
                   `(${coloredText("+" + format(gain, 4, true), c)}/s)`;
        }],
        ["blank", "15px"],
        ["display-text", function() {
            let mult = player.I.increment.nlg().pow(2);
            if (hasAchievement('a', 26)) mult = mult.times(player.I.points.add(1))
            let c = tmp.I.color;
            return `使增量器效果基础 ${coloredText("*" + format(mult, 4, true), c)}`;
        }],
        ["blank", "15px"],
        "buyables",
        ["blank", "15px"],
        ["raw-html", () => `<h4 style="opacity:.5">增量器达到 <b>175</b> 后开始自动获取增量。</h4>`],
    ],
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
    22: { title: "增量^3", description: "反重生效果^1.5,反重生效果软上限延迟^1.25,增量器提升反重生效果", cost: new EN(105), unlocked() { return hasUpgrade('I', 21) } ,
        effect() {     
        let raw = player.I.points.add(1).pow(0.521);    
        if(hasUpgrade('I',34))raw=raw.pow(3)           
        let cap = new EN("1e9");        
        return effectWithSoftcap(raw, cap, new EN(0.125).div(player.I.points.nlg().nlg().add(1)));
    },    
    effectDisplay() { return format(upgradeEffect(this.layer, this.id),4,true) + "x" }
    },
    23: { title: "增量^1.79e308", description: "重生点获取^1.01", cost: new EN(169), unlocked() { return hasUpgrade('I', 22) } ,
           },
           24: { title: "增量重置", description: "解锁一个增量器子界面", cost: new EN(175), unlocked() { return hasUpgrade('I', 23) } ,
           },
            25: { title: "增量加成", description: "增量器降低增量购买项价格,并将增量获取基础*1.05,增量速度效果基础+0.05,增量强度效果基础+0.5", cost: new EN(205), unlocked() { return hasUpgrade('I', 24) } ,
            effect() {     
        let raw = player.I.points.add(1).pow(player.I.points.nlg().pow(0.5));      
        if(hasUpgrade('I',35))raw=raw.pow(3)          
        let cap = new EN("1.79e308");        
        return effectWithSoftcap(raw, cap, new EN(0.25).div(player.I.points.nlg().nlg().add(1)));
    },    
    effectDisplay() { return "/"+format(upgradeEffect(this.layer, this.id),4,true)  }
           },
           31: { title: "增量变胀", description: "增量器加成增量获取,并将增量获取^1.25", cost: new EN(217), unlocked() { return hasUpgrade('I', 25) } ,
            effect() {     
        let raw = player.I.points.add(1).pow(player.I.points.nlg().pow(0.91));  
        if(hasUpgrade('I',35))raw=raw.pow(3)              
        let cap = new EN("1.79e308");        
        return effectWithSoftcap(raw, cap, new EN(0.78).div(player.I.points.nlg().nlg().add(1)));
    },    
    effectDisplay() { return "*"+format(upgradeEffect(this.layer, this.id),4,true)  }
           },
           32: { title: "增胀", description: "增量加成能量获取,并将能量获取^1.25", cost: new EN(228), unlocked() { return hasUpgrade('I', 31) } ,
            effect() {     
        let raw = player.I.increment.pow(0.125);               
        let cap = new EN("1.79e308");        
        return effectWithSoftcap(raw, cap, new EN(0.25).div(player.I.increment.nlg().nlg().add(1)));
    },    
    effectDisplay() { return "*"+format(upgradeEffect(this.layer, this.id),4,true)  }
           },
           33: { title: "胀?", description: "增量加成增量获取", cost: new EN(244), unlocked() { return hasUpgrade('I', 32) } ,
            effect() {     
        let raw = player.I.increment.pow(0.15);               
        let cap = new EN("1.79e308");        
        return effectWithSoftcap(raw, cap, new EN(0.3).div(player.I.increment.nlg().nlg().add(1)));
    },    
    effectDisplay() { return "*"+format(upgradeEffect(this.layer, this.id),4,true)  }
           },
            34: { title: "胀!", description: "增量提升反重生效果,并将增量^3效果^3", cost: new EN(250), unlocked() { return hasUpgrade('I', 33) } ,
            effect() {     
        let raw = player.I.increment.nlg().pow(3);               
        let cap = new EN("1e9");        
        return effectWithSoftcap(raw, cap, new EN(0.03).div(player.I.increment.nlg().nlg().nlg().add(1)));
    },    
    effectDisplay() { return "*"+format(upgradeEffect(this.layer, this.id),6,true)  }
           },
           35: { title: "胀!!!", description: "增量提升能量效果,并将增量加成,增量变胀效果^3,解锁新的能量升级", cost: new EN(283), unlocked() { return hasUpgrade('I', 34) } ,
            effect() {     
        let raw = player.I.increment.nlg().pow(3.5);               
        let cap = new EN("1e9");        
        return effectWithSoftcap(raw, cap, new EN(0.035).div(player.I.increment.nlg().nlg().nlg().add(1)));
    },    
    effectDisplay() { return "*"+format(upgradeEffect(this.layer, this.id),6,true)  }
           },
},
buyables: {
    rows: 1, cols: 3,

    11: {
        title: "增量速度",
        cost(x) {let costbase = new EN(10).pow(x.nlg()).times(new EN(1.01).pow(x.pow(2))).times(new EN(0.99).pow(x));        
let costexp = new EN(1);
let cost = EN.pow(costbase, costexp); 
 if (hasUpgrade("I", 25)) cost = cost.div(upgradeEffect("I", 25));                       
return cost;
        },
        effect(x) {
            let base=new EN(1.25)
            if (hasUpgrade("I", 25))base=base.add(0.05)
            let exp=x
            let raw=base.pow(exp)
            return raw;
        },
        display() {
            let c = tmp.I.color;
            let bought = getBuyableAmount("I", 11);
            let cost = this.cost(bought);      
    let eff = this.effect(bought);
            return `价格: ${format(cost, 3, true)} 增量<br>` +
                   `数量: ${formatWhole(bought)}<br>` +
                   `效果:增量获取 ${"*" + format(eff, 4, true)}(后于增量耐性生效)`;
        },
        canAfford() {
            return player.I.increment.gte(tmp.I.buyables[11].cost);
        },
        buy() {
            player.I.increment = player.I.increment.sub(tmp.I.buyables[11].cost);
            player.I.buyables[11] = getBuyableAmount("I", 11).add(1);
        },
        buyMax() {
            while (player.I.increment.gte(this.cost(player.I.buyables[11]))) {
                player.I.increment = player.I.increment.sub(this.cost(player.I.buyables[11]));
                player.I.buyables[11] = player.I.buyables[11].add(1);
            }
        },
        unlocked() { return hasUpgrade("I", 24); },
    },

    12: {
        title: "增量强度",
        cost(x) {let costbase = new EN(10000).pow(x.nlg()).times(new EN(1.25).pow(x.pow(2))).times(new EN(0.91).pow(x));        
let costexp = new EN(1);
let cost = EN.pow(costbase, costexp); 
 if (hasUpgrade("I", 25)) cost = cost.div(upgradeEffect("I", 25));                       
return cost;
        },
        effect(x) {let base=new EN(2)
            if (hasUpgrade("I", 25))base=base.add(0.5)
            let exp=x
            let raw=base.pow(exp)
            return raw;
        },
        display() {
            let c = tmp.I.color;
            let bought = getBuyableAmount("I", 12);
           let cost = this.cost(bought);      
    let eff = this.effect(bought);
            return `价格: ${format(cost, 3, true)} 增量<br>` +
                   `数量: ${formatWhole(bought)}<br>` +
                   `效果:增量获取 ${"*" + format(eff, 4, true)}(后于增量耐性生效)`;
        },
        canAfford() {
            return player.I.increment.gte(tmp.I.buyables[12].cost);
        },
        buy() {
            player.I.increment = player.I.increment.sub(tmp.I.buyables[12].cost);
            player.I.buyables[12] = getBuyableAmount("I", 12).add(1);
        },
        buyMax() {
            while (player.I.increment.gte(this.cost(player.I.buyables[12]))) {
                player.I.increment = player.I.increment.sub(this.cost(player.I.buyables[12]));
                player.I.buyables[12] = player.I.buyables[12].add(1);
            }
        },
        unlocked() { return hasUpgrade("I", 24) && getBuyableAmount("I", 11).gte(5); },
    },

    13: {
        title: "增量耐性",
        cost(x) {       
let costbase = new EN(100000).times(new EN(1.5).pow(x.pow(2))).times(new EN(0.78).pow(x));        
let costexp = new EN(1);
let cost = EN.pow(costbase, costexp); 
 if (hasUpgrade("I", 25)) cost = cost.div(upgradeEffect("I", 25));                       
return cost;
        },
       effect(x) {
        let base = new EN(1.5);
    let raw = base.pow(x);
    let cap0 = new EN(100);
    if (raw.gte(cap0)) raw = raw.div(cap0).pow(0.13).times(cap0);
    let cap1 = new EN(22222);
    if (raw.gte(cap1)) raw = raw.div(cap1).log10().add(1).times(cap1);
    let cap2 = new EN(1919810);
    if (raw.gte(cap2)) raw = raw.div(cap2).log10().add(1).pow(0.5).times(cap2);
    return raw;
},
       display() {
    let c = tmp.I.color;
    let bought = getBuyableAmount("I", 13);
    let cost = this.cost(bought);
    let eff = this.effect(bought);
    return `价格: ${format(cost, 3, true)} 增量<br>` +
           `数量: ${formatWhole(bought)}<br>` +
           `效果:增量获取 ^${format(eff, 4, true)}`;
},
canAfford() {
    return player.I.increment.gte(this.cost(getBuyableAmount("I", 13)));
},
buy() {
    let cost = this.cost(getBuyableAmount("I", 13));
    player.I.increment = player.I.increment.sub(cost);
    player.I.buyables[13] = getBuyableAmount("I", 13).add(1);
},
        buyMax() {
            while (player.I.increment.gte(this.cost(player.I.buyables[13]))) {
                player.I.increment = player.I.increment.sub(this.cost(player.I.buyables[13]));
                player.I.buyables[13] = player.I.buyables[13].add(1);
            }
        },
        unlocked() { return hasUpgrade("I", 24) && getBuyableAmount("I", 12).gte(3); },
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
                    if (hasUpgrade('I', 32)) mult = mult.times(upgradeEffect('I', 32))
               if (hasAchievement('a', 22)) mult = mult.times(tmp.a.effect)      
                if (hasUpgrade("p", 33)) mult = mult.times(upgradeEffect("p", 33));
        return mult
    },
    gainExp() {
        let exp = new EN(1)
        if (hasUpgrade('I', 32)) exp = exp.times(1.25)
        return exp
    },
    passiveGeneration() {
    if (hasAchievement('a',23)) return 1;  // 100% = 1倍
    return 0;
},
layerShown() { return hasUpgrade("I", 15) || player.e.unlocked },
    automate() {},
    effect() {
    let p = player[this.layer].points;
    if(p.lte(0)) return new EN(1);
    let logP = p.nlg();
    let base=p.div(logP).add(2.5);
    if (player.R.unlocked && tmp.R?.effect) {
    base = base.times(tmp.R.effect.energyBase);
}
    let exp=logP.nlg().times(1.025).min(5);
    let raw=base.pow(exp);
    if(hasUpgrade("e", 14)) raw=raw.times(upgradeEffect("e", 14));
    if(hasUpgrade('I',35))raw=raw.times(upgradeEffect("I", 35)) 
    if(hasUpgrade("I", 21)) raw=raw.pow(1.3);
    if (player.R.activeChallenge === 11) raw = raw.pow(0.5);
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
    22: { title: "内能", description: "反重生效果^1.5,反重生效果软上限延迟^1.5,解锁新的增量器升级", cost: new EN(9e15),
    unlocked() { return hasUpgrade('e', 21) },    
    },
    23: { title: "机械能", description: "能量加成增量获取", cost: new EN(1e78),
    unlocked() { return hasUpgrade('I', 35)&&hasUpgrade('e', 22) },    
    effect() {        
        let raw = player.e.points.add(1).pow(0.13);               
        let cap = new EN("1.79e308");        
        return effectWithSoftcap(raw, cap, new EN(0.125).div(player.e.points.nlg().nlg().add(1)));
    },    
    effectDisplay() { return format(upgradeEffect(this.layer, this.id),4,true) + "x" }
    },
    24: { title: "电能", description: "能量提升反重生效果", cost: new EN(1e78),
    unlocked() { return hasUpgrade('e', 23) },    
    effect() {        
        let raw = player.e.points.nlg().pow(2.88);               
        let cap = new EN("1e9");        
        return effectWithSoftcap(raw, cap, new EN(0.25).div(player.e.points.nlg().nlg().add(1)));
    },    
    effectDisplay() { return format(upgradeEffect(this.layer, this.id),4,true) + "x" }
    },
    25: { title: "核能", description: "能量加成点数获取", cost: new EN(1e88),
    unlocked() { return hasUpgrade('e', 24) },    
    effect() {        
        let raw = player.e.points.nlg().pow(3.33);               
        let cap = new EN("1e9");        
        return effectWithSoftcap(raw, cap, new EN(0.33).div(player.e.points.nlg().nlg().add(1)));
    },    
    effectDisplay() { return format(upgradeEffect(this.layer, this.id),4,true) + "x" }
    },
},
})
addLayer("R", {
    name: "轮回点",
    symbol: "R",
    position: 0,
    row: 2,
    startData() { return {
        unlocked: false,
        points: new EN(0),
        best: new EN(0),
        cm1Best: new EN(0),
    }},
    color: "#ff3333",
    requires: new EN("1.79e310"),
    resource: "轮回点",
    baseResource: "points",
    baseAmount() { return player.points },
    type: "static",
    branches: ["I", "e"],
    exponent() { return new EN(3.33) },
    layerShown() { return player.points.gte("1.79e310") || player.R.unlocked },
    effect() {
        let x = player.R.best;
        let iBase = new EN(1.01);
        let eBase = x.nlg();
        if(hasMilestone('R',2))iBase=iBase.add(0.01)
            if(hasMilestone('R',2))eBase=eBase.add(0.01)
        let incBase = iBase.pow(x).min(1.79308);
        let engBase = eBase.pow(x.nlg().pow(0.5));
        return { incrementBase: incBase, energyBase: engBase };
    },
   effectDescription() {
    let c = tmp.R.color;
    let eff = tmp.R.effect;
    return `使增量获取基础 ${coloredText("*" + format(eff.incrementBase, 4, true), c)} ` +
           `能量效果基础 ${coloredText("*" + format(eff.energyBase, 4, true), c)}(基于最高)`;
},
update(diff) {
    player.R.best = player.R.best.max(player.R.points);
    if (player.R.activeChallenge === 11) {
        player.R.cm1Best = player.R.cm1Best.max(player.points);
    }
},
    doReset(resettingLayer) {
        let keep = [];
        if (layers[resettingLayer].row > this.row) layerDataReset("R", keep);
    },
    autoPrestige() { return false },

   tabFormat: [
    "main-display",
    "prestige-button",
     ["display-text", function() {
        let c = tmp.R.color;
        let best = player.R.best || new EN(0);
        return `当前最高轮回点:${coloredText(format(best, 4, true), c)}`;
    }],
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
        "人生": {
            unlocked() { return hasUpgrade("R", 13); },
            content: [
                ["blank", "15px"],
                ["raw-html", () => `<h4 style="opacity:.5">进入人生会重置较低层级的进度，完成挑战获得永久奖励。</h4>`],
                "challenges",
            ],
        },
        "里程碑": {
            content: [["blank", "15px"], "milestones"]
        },
    },
},
    milestones: {
        1: {
            requirementDescription: "1 轮回点",
            effectDescription() { return "在重生点层解锁重生点子界面" },
            done() { return player.R.points.gte(1) }
        },
        2: {
            requirementDescription: "3 轮回点",
            effectDescription() { return "轮回点效果基础+0.01" },
            done() { return player.R.points.gte(3) }
        },
    },
    upgrades: {
        rows: 9, cols: 5,
        11: {
            title: "重生",
            description: "重生点和轮回点加成重生经验获取",
            cost: new EN(2),
            effect() {
                let exp=new EN(2).times(player.R.points.add(1))
                let expcap = new EN("100"); 
                exp=effectWithSoftcap(exp, expcap, new EN(0.25).div(exp.nlg().nlg().add(1)))
        let raw = player.p.points.nlg().nlog(2).pow(exp);               
        let cap = new EN("1e9");        
        if (hasUpgrade("R", 15)) cap = cap.pow(upgradeEffect("R", 15));
        return effectWithSoftcap(raw, cap, new EN(0.25).div(raw.nlg().nlg().add(1)));
    },    
    effectDisplay() { return format(upgradeEffect(this.layer, this.id),4,true) + "x" }
    
        },
        12: {
            title: "重来",
            description: "重生经验加成点数获取(效果不低于3.34e38)",
            cost: new EN(2),
            effect() {
        let raw = player.p.rexp.add(1).pow(0.444).times(3.34e38);              
        let cap = new EN("1.79e308");        
        return effectWithSoftcap(raw, cap, new EN(0.222).div(raw.nlg().nlg().add(1)));
    },    
    effectDisplay() { return format(upgradeEffect(this.layer, this.id),4,true) + "x" }
    
        },
        13: {
    title: "人生",
    description: "解锁人生",
    cost: new EN(3),
    unlocked() { return hasUpgrade("R", 12); },
},
14: {
    title: "反轮回",
    description: "轮回点大幅加成反重生效果",
    cost: new EN(4),
    unlocked() { return hasUpgrade("R", 13); },
    effect() {
        let raw = player.R.points.nlg().pow(20);              
        let cap = new EN("20");        
        return effectWithSoftcap(raw, cap, new EN(0.0188).div(raw.nlg().add(1)));
    },    
    effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id),4,true)  }
},
15: {
    title: "再来一次",
    description: "轮回点大幅加成重生经验获取,并延迟重生效果软上限",
    cost: new EN(4),
    unlocked() { return hasUpgrade("R", 14); },
    effect() {
        let raw = player.R.points.nlg().pow(2);              
        let cap = new EN("2");        
        return effectWithSoftcap(raw, cap, new EN(0.01).div(raw.nlg().add(1)));
    },    
    effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id),4,true)  }
},
    },
    challenges: {
    11: {
        name: "路阻且长",
        challengeDescription: "点数和重生经验获取^0.5,增量器和能量效果^0.5,但重生经验一开始就能获取(+1/s)",
        goal: new EN("4.44e444"),
        goalDescription: "达到 4.44e444 点数",
       rewardDescription() {
    let c = tmp.R.color;
    let cmBest = player.R.cm1Best || new EN(0);
    let cap = new EN("4.44e444");
    let capped = cmBest.min(cap);
    let eff = capped.nlg().times(999.5436);
    if(hasAchievement('a',31))eff=eff.times(999999.9967138)
    let bestText = cmBest.gte(cap)
        ? `挑战内最高点数为 ${coloredText("4.44e444(硬上限)", c)}`
        : `挑战内最高点数为 ${coloredText(format(cmBest, 4, true), c)}`;
    return `挑战内最高点数大幅提高重生经验获取,完成后使重生经验获取^1.25<br>` +
           `${bestText}</br>使重生经验获取 ${coloredText("*" + format(eff, 4, true), c)}`;
},
        onComplete() {}, 
        unlocked() { return hasUpgrade("R", 13)|| player.R.activeChallenge == 11 || hasChallenge('R', 11); },
        style: { "color": "#ff3333", "border": "2px solid #ff3333" },
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