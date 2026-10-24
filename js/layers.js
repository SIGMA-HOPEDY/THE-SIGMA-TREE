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
        mult = mult.times(getRexpEffect());
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
    let cm1Best = player.R.cm1Best || new EN(0);
    let cap1 = new EN("4.44e444");
    let capped1 = cm1Best.min(cap1);
    if (capped1.gt(0)) {
        gain = gain.times(capped1.nlg().times(999.5436));
        if (hasAchievement('a', 32)) gain = gain.times(999999.9967138)
    }
    if (hasUpgrade("R", 11)) gain = gain.times(upgradeEffect("R", 11));
    if (hasUpgrade("p", 32)) gain = gain.times(upgradeEffect("p", 32));
    if (hasUpgrade("p", 34)) gain = gain.times(upgradeEffect("p", 34));
    if(hasMilestone('I',7))gain=gain.times('1e66')
    if (hasAchievement('a', 26)) gain = gain.times(tmp.a.effect)
    if (player.R.activeChallenge === 11) gain = gain.pow(0.5);
     if (player.R.activeChallenge === 12) gain = gain.pow(0.25);
    if (hasChallenge("R", 11)) gain = gain.pow(1.65);   
    if (hasUpgrade("R", 15)) gain = gain.pow(upgradeEffect("R", 15));
    if (hasUpgrade('Q', 12)) gain = gain.pow(upgradeEffect('Q', 12).pow(0.5))
         let cap0 = new EN('1e10000');
        gain = effectWithSoftcap(gain, cap0, new EN(1).div(gain.nlg().nlg().add(1)));
    player.p.rexp = player.p.rexp.add(gain.times(diff));
    tmp.p.rexpGain = gain;
},
    gainExp() {
        let exp = new EN(1)
        if (hasUpgrade('p', 22)) exp = exp.times(upgradeEffect('p', 22))
            if (hasUpgrade('p', 25)) exp = exp.times(upgradeEffect('p', 25))
                if(hasMilestone("e", 1)) exp = exp.times(1.1)
                    if(hasUpgrade("I", 23)) exp = exp.times(1.01)
if (hasUpgrade('Q', 11)) exp = exp.times(upgradeEffect('Q', 11).pow(0.5))
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
            let raw = getRexpEffect();
            let c = tmp.p.color;
            return `使重生点获取 ${coloredText("*" + format(raw, 4, true), c)}`;
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
        if (hasUpgrade('R',24))cap=cap.times('1.79e299')     
        if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.5).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e1e4");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("e1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
    },    
    effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" }
    },
    13: {title: "反经典",description: "点数提升重生点获取",cost: new EN(25),    
        unlocked() { return hasUpgrade('p', 12) },    
        effect() {        
            let raw = player.points.add(1).pow(0.2);               
            let cap = new EN("1e9");  
            if (hasUpgrade('R',24))cap=cap.times('1.79e299')      
           if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.5).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e1e4");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("e1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
        },    
        effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" }
    },
    14: {title: "点数自增",description: "点数提升点数获取", cost: new EN(100),    
        unlocked() { return hasUpgrade('p', 13) },    
        effect() {        
            let raw = player.points.add(1).pow(0.25);               
            let cap = new EN("1e9"); 
            if (hasUpgrade('R',24))cap=cap.times('1.79e299')       
            if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.4).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e1e4");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("e1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
        },    
        effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" }
    },
    15: {title: "反复重生",description: "重生点提升重生点获取,解锁增量器",cost: new EN(250),    
        unlocked() { return hasUpgrade('p', 14) },    
        effect() {        
            let raw = player[this.layer].points.add(1).pow(0.25); 
            if (hasUpgrade('R', 23))raw=raw.pow(2.5)                 
            let cap = new EN("1e9"); 
        if (hasUpgrade('R',24))cap=cap.times('1.79e299')       
            if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.3).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e1e4");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("e1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
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
                        raw = raw.times(effuq());
                        if (hasUpgrade('p', 35)) raw = raw.pow(upgradeEffect('p', 35)) 
            if (hasUpgrade('I', 22)) raw = raw.pow(1.5) 
            if (hasUpgrade('e', 22)) raw = raw.pow(1.5)    
                if (hasUpgrade('R', 14)) raw = raw.pow(upgradeEffect('R', 14)) 
                    if (hasUpgrade('R', 23))raw=raw.pow(2.5)         
            let cap0 = new EN("2");        
            if (hasUpgrade('p', 25)) cap0 = cap0.times(1.1)
                 if (hasUpgrade('I', 15)) cap0 = cap0.times(1.3)
                     if (hasUpgrade('e', 22)) cap0 = cap0.pow(1.5) 
                        if (hasUpgrade('I', 22)) cap0 = cap0.pow(1.25)
                            raw = effectWithSoftcap(raw, cap0, new EN(0.01).div(raw.nlg().nlg().add(1)))
                        let cap1 = new EN("25");
                         raw = effectWithSoftcap(raw, cap1, new EN(0.001).div(raw.nlg().nlg().add(1)))
                         let cap2 = new EN("1e9");
                         if (raw.gte(cap2)) raw = raw.div(cap2).log10().add(1).times(cap2);
                         let cap3 = new EN("3.34e38");
                         if (raw.gte(cap3)) raw = raw.div(cap3).log10().add(1).pow(0.5).times(cap3);
                          let cap4 = new EN("1.79e308");
                         if (raw.gte(cap4)) raw = raw.div(cap4).log10().add(1).pow(0.025).times(cap4);
                         let cap5 = new EN("e1.79e308");
                         if (raw.gte(cap5)) raw = EN.pow('10',raw.log10().div(cap5.log10()).log10().add(1).pow(0.00125).times(cap5.log10()));
                         let cap6 = new EN("10^^7");
                         if (raw.gte(cap6)) raw = EN.tetrate('10',raw.slog().div(cap6.slog()).pow(0.5).times(cap6.slog()));
            return raw;
        },  
        effectDisplay() { return format(upgradeEffect(this.layer, this.id),6,true) + "x" }
    },
    22: {title: "反自增",description: "重生点提升重生点获取指数",cost: new EN(1e23),    
        unlocked() { return hasUpgrade('p', 22)||(hasUpgrade('I', 13)&&hasUpgrade('p', 21) )},    
        effect() {        
            let raw = player[this.layer].points.nlg().nlg().pow(0.25);               
            let cap = new EN("2");        
            if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.125).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e9");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.125).times(cap1.log10()));
    let cap2 = new EN("1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.0125).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
        },    
        effectDisplay() { return "^" + format(upgradeEffect(this.layer, this.id),6,true)  }
    },
    23: {title: "胀",description: "重生点提升点数获取指数",cost: new EN(1e28),    
        unlocked() { return hasUpgrade('p', 22) },    
        effect() {        
            let raw = player[this.layer].points.nlg().nlg().pow(0.2);               
            let cap = new EN("2");        
            if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.13).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e9");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.13).times(cap1.log10()));
    let cap2 = new EN("1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.013).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
        },    
        effectDisplay() { return "^" + format(upgradeEffect(this.layer, this.id),6,true)  }
    },
    24: {title: "胀^2",description: "点数提升点数获取指数",cost: new EN(3e33),    
        unlocked() { return hasUpgrade('p', 24)||(hasUpgrade('I', 14)&&hasUpgrade('p', 23) )},    
        effect() {        
            let raw = player.points.nlg().nlg().pow(0.1);               
            let cap = new EN("2");        
            if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.1).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e9");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.1).times(cap1.log10()));
    let cap2 = new EN("1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.01).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
        },    
        effectDisplay() { return "^" + format(upgradeEffect(this.layer, this.id),6,true)  }
    },
    25: {title: "胀^胀",description: "点数提升重生点获取指数,并将反重生效果软上限延迟1.1倍",cost: new EN(3.34e38),    
        unlocked() { return hasUpgrade('p', 24) },    
        effect() {        
            let raw = player.points.nlg().nlg().pow(0.125);               
            let cap = new EN("2");        
            if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.091).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e9");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.091).times(cap1.log10()));
    let cap2 = new EN("1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.0091).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
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
    if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.555).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e1e4");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("e1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
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
    if (hasUpgrade("R", 15)&&hasAchievement('a',31)) raw = raw.pow(upgradeEffect("R", 15).pow(2));
    let cap = new EN("1.79e308");
    if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.555).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e1e4");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("e1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
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
    if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.555).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e1e4");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("e1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
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
    if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.555).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e1e4");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("e1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
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
    if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.555).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e9");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
},
effectDisplay() { return  "^"+format(upgradeEffect(this.layer, this.id), 4, true)  }
},
},
    doReset(resettingLayer){
    if(layers[resettingLayer].row > this.row) {
        layerDataReset(this.layer)
        if (hasAchievement("a", 16)) keepUpgrades("p", [11, 12, 13, 14, 15])
            if (hasAchievement("a", 21)) keepUpgrades("p", [21, 22, 23, 24, 25])
                if (hasAchievement("a", 33)) keepUpgrades("p", [31, 32, 33, 34, 35])
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
    autoTime: 0,
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
    let d = new EN(2);
    if (hasChallenge("R", 12)) {
            d = d.sub(0.5);
        }
    let base=p.div(175).sub(1).nlog(d)
    if (hasUpgrade("I", 25))base=base.times(1.05)
        if (player.R.unlocked && tmp.R?.effect) {
    base = base.times(tmp.R.effect.incrementBase);
}
if(hasMilestone("R",3))base=base.times(1.3)
    if (hasUpgrade("R", 31))base = base.times(e11).times(e12);
    let gain =base.pow(exponent);
    if (!hasUpgrade("R", 31))gain = gain.times(e11).times(e12);
    if (hasUpgrade("I", 31))gain=gain.times(upgradeEffect('I',31))
        if (hasUpgrade("I", 33))gain=gain.times(upgradeEffect('I',33))
            if (hasUpgrade("p", 31))gain=gain.times(upgradeEffect('p',31))
        if (hasUpgrade("e", 23))gain=gain.times(upgradeEffect('e',23))
            if (hasAchievement("a", 24)) gain = gain.times(tmp.a.effect);
    if (hasAchievement('a', 32)){let cmBest = player.R.cm1Best || new EN(0);
    let cap = new EN("4.44e444");
    let capped = cmBest.min(cap);
    if (capped.gt(0)) {
        gain = gain.times(capped.nlg().times(999.5436)).times(999999.9967138)
    }}
        if (hasUpgrade("I", 31))gain=gain.pow(1.25)
            if (hasUpgrade('p', 35)) gain = gain.pow(upgradeEffect('p', 35).pow(0.1)) 
                if (hasUpgrade('Q', 12)) gain = gain.pow(upgradeEffect('Q', 12))
                if (hasUpgrade("R", 15)&&hasAchievement('a',31)) gain = gain.pow(upgradeEffect("R", 15).pow(0.5));
    let cap0 = new EN('1.79e308');
    if(hasMilestone("R",3))cap0=new EN('1e1000')
        gain = effectWithSoftcap(gain, cap0, new EN(1).div(gain.nlg().nlg().add(1)));
    player.I.increment = player.I.increment.add(gain.times(diff));
    tmp.I.incrementGain = gain;
    if (hasMilestone("R", 5)) {
    player.I.autoTime = (player.I.autoTime || 0) + diff;
    if (player.I.autoTime >= 0.05) {
        let times = Math.floor(player.I.autoTime / 0.05);
        player.I.autoTime -= times * 0.05;
        let maxCount = new EN(times * 50);
        layers.I.buyables[11].buyMax(maxCount);
        layers.I.buyables[12].buyMax(maxCount);
        layers.I.buyables[13].buyMax(maxCount);
    }
}
},
directMult() {
    let mult = new EN(1)
    if (hasUpgrade('p', 21)) mult = mult.times(upgradeEffect('p', 21))
        if (hasUpgrade('R',24))mult=mult.times(1.01) 
                if (hasAchievement("a", 33)) mult=mult.times(tmp.a.effect.slog())
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
    let ie=player.I.increment.nlg().pow(2)
    if (hasAchievement('a', 26)) ie = ie.times(player.I.points.add(1))
        let pbase=new EN('1.001')
    let hpbase=new EN('1e1000')
    let ap=EN.pow(pbase,p).min(hpbase)
    if(hasMilestone('R',9))base=base.times(ap)
    base = base.times(ie).times(2.026);
base = base.times(getLightEff2());
let icap = new EN("1.79e308");
        if (base.gte(icap))base=effectWithSoftcap(base, icap, new EN(0.5).div(base.nlg().nlg().add(1)));
    let icap1 = new EN("1e1e4");
    if (base.gte(icap1)) base = EN.pow('10',base.log10().div(icap1.log10()).log10().add(1).pow(0.5).times(icap1.log10()));
    let icap2 = new EN("e1.79e308");
    if (base.gte(icap2)) base = EN.pow('10',base.log10().div(icap2.log10()).log10().add(1).pow(0.025).times(icap2.log10()));
                         let icap3 = new EN("10^^7");
                         if (base.gte(icap3)) base = EN.tetrate('10',base.slog().div(icap3.slog()).pow(0.5).times(icap3.slog()));
let hard=new EN('101')
    let exp=logP.times(1.01).min(hard);
    let raw=base.pow(exp);
    if(hasUpgrade("I", 12)) raw=raw.pow(1.5);
    if(hasUpgrade("I", 13)) raw=raw.pow(1.75);
    if(hasUpgrade("e", 21)) raw=raw.pow(2);
    if (player.R.activeChallenge === 11) raw = raw.pow(0.5);
     if (player.R.activeChallenge === 12)raw = raw.pow(0.25);
    let cap1 = new EN("1e1e4");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("e1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
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
                if (hasAchievement("a", 34)) keepMilestones("I", [4,5,6,7])
                if (hasAchievement("a", 33)) keepUpgrades("I", [11, 12, 13, 14, 15,21,22,23,24,25])
                    if (hasAchievement("a", 35)) keepUpgrades("I", [31, 32, 33, 34, 35])
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
            let ie=player.I.increment.nlg().pow(2)
    if (hasAchievement('a', 26)) ie = ie.times(player.I.points.add(1))
        let icap = new EN("1.79e308");
        if (ie.gte(icap))ie=effectWithSoftcap(ie, icap, new EN(0.5).div(ie.nlg().nlg().add(1)));
    let icap1 = new EN("1e1e4");
    if (ie.gte(icap1)) ie = EN.pow('10',ie.log10().div(icap1.log10()).log10().add(1).pow(0.5).times(icap1.log10()));
    let icap2 = new EN("e1.79e308");
    if (ie.gte(icap2)) ie = EN.pow('10',ie.log10().div(icap2.log10()).log10().add(1).pow(0.025).times(icap2.log10()));
                         let icap3 = new EN("10^^7");
                         if (ie.gte(icap3)) ie = EN.tetrate('10',ie.slog().div(icap3.slog()).pow(0.5).times(icap3.slog()));
            let c = tmp.I.color;
            return `使增量器效果基础 ${coloredText("*" + format(ie, 4, true), c)}`;
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
        4: {
            requirementDescription: "996 增量器",
            effectDescription() { return "增量获取基础*1.3,能量效果基础^1.88" },
            done() { return player.I.points.gte(996) }
        },
        5: {
            requirementDescription: "2963 增量器",
            effectDescription() { return "点数获取一重软上限效果弱化1.5" },
            done() { return player.I.points.gte(2963) }
        },
        6: {
            requirementDescription: "3353 增量器",
            effectDescription() { return "点数获取一重软上限效果弱化1.167" },
            done() { return player.I.points.gte(3353) }
        },
        7: {
            requirementDescription: "3560 增量器",
            effectDescription() { return "重生经验获取*1e66" },
            done() { return player.I.points.gte(3560) }
        },
    },
    upgrades: {        
rows: 9, cols: 5,        
   11: { title: "重生增量", description: "解锁一个新重生点升级", cost: new EN(5) },
    12: { title: "增量", description: "增量器效果^1.5,反重生效果*1.3", cost: new EN(8), unlocked() { return hasUpgrade('I', 11) }   },
    13: { title: "再次增量", description: "增量器效果^1.75,解锁两个新重生点升级", cost: new EN(12), unlocked() { return hasUpgrade('I', 12) }  },
    14: { title: "反复增量", description: "增量器效果基础*2,解锁两个新重生点升级", cost: new EN(18), unlocked() { return hasUpgrade('I', 13) }  },
    15: { title: "增量增量", description: "反重生效果软上限延迟1.3倍,解锁一个新层级", cost: new EN(24), unlocked() { return hasUpgrade('I', 14) }  },
    21: { title: "增量^2", description: "能量效果^1.3,91增量器后使增量器提升能量获取", cost: new EN(101), unlocked() { return hasUpgrade('I', 21)||(hasUpgrade('I', 15) && hasUpgrade('e', 22)) } ,
        effect() {        if(player.I.points.lt(91)) return new EN(1);
        let raw = player.I.points.pow(2);
        if(hasMilestone("R", 4))raw=raw.pow(3)
            if(hasUpgrade('R',25))raw=raw.pow(3.33)               
        let cap = new EN("3.38e38");        
        if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.125).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e1e4");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("e1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
    },    
    effectDisplay() { return format(upgradeEffect(this.layer, this.id),4,true) + "x" }
    },
    22: { title: "增量^3", description: "反重生效果^1.5,反重生效果软上限延迟^1.25,增量器提升反重生效果", cost: new EN(105), unlocked() { return hasUpgrade('I', 21) } ,
        effect() {     
        let raw = player.I.points.add(1).pow(0.521);    
        if(hasUpgrade('I',34))raw=raw.pow(3)  
        if(hasMilestone("R", 4))raw=raw.pow(3) 
            if(hasUpgrade('R',25))raw=raw.pow(3.33)             
        let cap = new EN("3.38e38");        
        if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.125).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e1e4");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("e1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
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
           if(hasMilestone("R", 4))raw=raw.pow(4)  
            if (hasChallenge("R", 12)) {
            raw = raw.pow(player.I.points.add(1));
        }         
        let cap = new EN("1e1e4");        
        if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.25).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e1e9");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("e1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
    },    
    effectDisplay() { return "/"+format(upgradeEffect(this.layer, this.id),4,true)  }
           },
           31: { title: "增量变胀", description: "增量器加成增量获取,并将增量获取^1.25", cost: new EN(217), unlocked() { return hasUpgrade('I', 25) } ,
            effect() {     
        let raw = player.I.points.add(1).pow(player.I.points.nlg().pow(0.91));  
        if(hasUpgrade('I',35))raw=raw.pow(3)  
        if(hasMilestone("R", 4))raw=raw.pow(5)  
            if (hasUpgrade("R", 31))raw=raw.pow(player.I.points.add(1))            
        let cap = new EN("1.79e308");        
        if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.78).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e1e4");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("e1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
    },    
    effectDisplay() { return "*"+format(upgradeEffect(this.layer, this.id),4,true)  }
           },
           32: { title: "增胀", description: "增量加成能量获取,并将能量获取^1.25", cost: new EN(228), unlocked() { return hasUpgrade('I', 31) } ,
            effect() {     
        let raw = player.I.increment.pow(0.125);               
        let cap = new EN("1.79e308");        
        if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.21).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e1e4");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("e1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
                         if (raw.lt(1)) return new EN(1);
    return raw
    },    
    effectDisplay() { return "*"+format(upgradeEffect(this.layer, this.id),4,true)  }
           },
           33: { title: "胀?", description: "增量加成增量获取", cost: new EN(244), unlocked() { return hasUpgrade('I', 32) } ,
            effect() {     
        let raw = player.I.increment.pow(0.15);               
        let cap = new EN("1.79e308");        
        if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.255).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e1e4");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("e1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
                         if (raw.lt(1)) return new EN(1);
    return raw
    },    
    effectDisplay() { return "*"+format(upgradeEffect(this.layer, this.id),4,true)  }
           },
            34: { title: "胀!", description: "增量提升反重生效果,并将增量^3效果^3", cost: new EN(250), unlocked() { return hasUpgrade('I', 33) } ,
            effect() {     
        let raw = player.I.increment.nlg().pow(3);               
        let cap = new EN("1e9");  
        if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.0333).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e1e4");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("e1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
    },    
    effectDisplay() { return "*"+format(upgradeEffect(this.layer, this.id),6,true)  }
           },
           35: { title: "胀!!!", description: "增量提升能量效果,并将增量加成,增量变胀效果^3,解锁新的能量升级", cost: new EN(283), unlocked() { return hasUpgrade('I', 34) } ,
            effect() {     
        let raw = player.I.increment.nlg().pow(3.5);               
        let cap = new EN("1e9");        
        if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.039).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e1e4");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("e1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
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
if(x.gte(500))cost=cost.pow(x.div(500).pow(1.1)) 
    if(x.gte(1500))cost=cost.pow(x.div(1500).pow(1.25)) 
 if (hasUpgrade("I", 25)) cost = cost.div(upgradeEffect("I", 25));                       
return cost;
        },
        effect(x) {
            let base=new EN(1.25)
            if (hasUpgrade("I", 25))base=base.add(0.05)
            let exp=x
            let raw=base.pow(exp)
            if(x.gte(500))raw=raw.times(x.div(500).pow(x.nlg().pow(3)))
                if(x.gte(1500))raw=raw.pow(x.div(1500).pow(0.91))
                    if(hasUpgrade('R',25))raw=raw.pow(2)   
                let cap0 = new EN(1.79e308);
    if (raw.gte(cap0)) raw = raw.div(cap0).pow(0.5).times(cap0);
    if (hasUpgrade("R", 31))raw=raw.nlg().nlg().pow(0.5)
            return raw;
        },
        display() {
            let c = tmp.I.color;
            let bought = getBuyableAmount("I", 11);
            let cost = this.cost(bought);      
    let eff = this.effect(bought);
            return `价格: ${format(cost, 3, true)} 增量<br>` +
                   `数量: ${formatWhole(bought)}<br>` +
                   `效果:增量获取 ${"*" + format(eff, 6, true)}(后于增量耐性生效)`;
        },
        canAfford() {
            return player.I.increment.gte(tmp.I.buyables[11].cost);
        },
         buy() {
        if (!this.canAfford()) return;
        let cost = this.cost(getBuyableAmount("I", 11));
        player.I.buyables[11] = getBuyableAmount("I", 11).add(1);
        if (!hasMilestone("R", 5)) {
            player.I.increment = player.I.increment.sub(cost);
        }
    },
    buyMax(maximum) {
        let count = 0;
        let limit = maximum !== undefined ? maximum.toNumber() : 1000;
        while (count < limit) {
            let x = getBuyableAmount("I", 11);
            let cost = this.cost(x);
            if (!cost.isFinite()) break;
            if (player.I.increment.lt(cost)) break;
            player.I.buyables[11] = x.add(1);
            if (!hasMilestone("R", 5)) {
                player.I.increment = player.I.increment.sub(cost);
            }
            count++;
        }
    },
        unlocked() { return hasUpgrade("I", 24); },
    },

    12: {
        title: "增量强度",
        cost(x) {let costbase = new EN(10000).pow(x.nlg()).times(new EN(1.25).pow(x.pow(2))).times(new EN(0.91).pow(x));        
let costexp = new EN(1);
let cost = EN.pow(costbase, costexp); 
if(x.gte(100))cost=cost.pow(x.div(100).pow(1.2)) 
    if(x.gte(500))cost=cost.pow(x.div(500).pow(1.44)) 
 if (hasUpgrade("I", 25)) cost = cost.div(upgradeEffect("I", 25));                
return cost;
        },
        effect(x) {let base=new EN(2)
            if (hasUpgrade("I", 25))base=base.add(0.5)
            let exp=x
            let raw=base.pow(exp)
            if(x.gte(100))raw=raw.times(x.div(100).pow(x.nlg().pow(2))) 
                if(x.gte(500))raw=raw.pow(x.div(500).pow(0.9))
            if(hasUpgrade('R',25))raw=raw.pow(2.5)   
                let cap0 = new EN(1.79e308);
    if (raw.gte(cap0)) raw = raw.div(cap0).pow(0.5).times(cap0);
    if (hasUpgrade("R", 31))raw=raw.nlg().nlg().pow(0.5)
            return raw;
        },
        display() {
            let c = tmp.I.color;
            let bought = getBuyableAmount("I", 12);
           let cost = this.cost(bought);      
    let eff = this.effect(bought);
            return `价格: ${format(cost, 3, true)} 增量<br>` +
                   `数量: ${formatWhole(bought)}<br>` +
                   `效果:增量获取 ${"*" + format(eff, 6, true)}(后于增量耐性生效)`;
        },
        canAfford() {
            return player.I.increment.gte(tmp.I.buyables[12].cost);
        },
        buy() {
        if (!this.canAfford()) return;
        let cost = this.cost(getBuyableAmount("I", 12));
        player.I.buyables[12] = getBuyableAmount("I", 12).add(1);
        if (!hasMilestone("R", 5)) {
            player.I.increment = player.I.increment.sub(cost);
        }
    },
    buyMax(maximum) {
        let count = 0;
        let limit = maximum !== undefined ? maximum.toNumber() : 1000;
        while (count < limit) {
            let x = getBuyableAmount("I", 12);
            let cost = this.cost(x);
            if (!cost.isFinite()) break;
            if (player.I.increment.lt(cost)) break;
            player.I.buyables[12] = x.add(1);
            if (!hasMilestone("R", 5)) {
                player.I.increment = player.I.increment.sub(cost);
            }
            count++;
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
if(x.gte(100))cost=cost.pow(x.div(100).pow(2))
    if(x.gte(250))cost=cost.pow(x.div(250).pow(4))
 if (hasUpgrade("I", 25)) cost = cost.div(upgradeEffect("I", 25));                       
return cost;
        },
       effect(x) {
        let base = new EN(1.5);
    let raw = base.pow(x);
    if(x.gte(100))raw=raw.times(x.div(100).pow(x.nlg()))
       if(x.gte(250))raw=raw.times(x.div(250).pow(x.nlg())) 
    let cap0 = new EN(100);
if (hasUpgrade('R', 22))cap0=cap0.times(6)
    if (raw.gte(cap0)) raw = raw.div(cap0).pow(0.13).times(cap0);
    let cap1 = new EN(22222);
    if (hasUpgrade('R', 22))cap1=cap1.times(3)
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
        if (!this.canAfford()) return;
        let cost = this.cost(getBuyableAmount("I", 13));
        player.I.buyables[13] = getBuyableAmount("I", 13).add(1);
        if (!hasMilestone("R", 5)) {
            player.I.increment = player.I.increment.sub(cost);
        }
    },
    buyMax(maximum) {
        let count = 0;
        let limit = maximum !== undefined ? maximum.toNumber() : 1000;
        while (count < limit) {
            let x = getBuyableAmount("I", 13);
            let cost = this.cost(x);
            if (!cost.isFinite()) break;
            if (player.I.increment.lt(cost)) break;
            player.I.buyables[13] = x.add(1);
            if (!hasMilestone("R", 5)) {
                player.I.increment = player.I.increment.sub(cost);
            }
            count++;
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
        light: new EN(0),
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
        mult=mult.times(getLightEff1())
        if (hasAchievement('a', 32)){let cmBest = player.R.cm1Best || new EN(0);
    let cap = new EN("4.44e444");
    let capped = cmBest.min(cap);
    if (capped.gt(0)) {
        mult = mult.times(capped.nlg().times(999.5436)).times(999999.9967138)
    }}
        return mult
    },
    gainExp() {
        let exp = new EN(1)
        if (hasUpgrade('I', 32)) exp = exp.times(1.25)
            if (hasUpgrade('Q', 11)) exp = exp.times(upgradeEffect('Q', 11))
        return exp
    },
    passiveGeneration() {
    if (hasAchievement('a',23)) return 1;  // 100% = 1倍
    return 0;
},
    update(diff) {
        let p = player.e.points;
        if (p.lte(0)) {
            tmp.e.lightGain = new EN(0);
            return;
        }
        let baselight= new EN(10)
        if (hasUpgrade('Q', 13))baselight=baselight.sub(3)
            if (hasUpgrade('Q', 14))baselight=baselight.sub(2)
                 if (hasMilestone("R", 10))baselight=baselight.sub(2)
        let gain = p.nlog(baselight).div(3e5);
         if (player.Q.unlocked) {
        gain = gain.times(tmp.Q.effect);
    }
       if (hasAchievement("a", 35)) {
        let achCount = new EN(player.a.achievements.length);
        gain = gain.times(achCount);
    }
            if (hasUpgrade("R", 32))gain = gain.times(player.R.points.add(1).pow(10));
    let cm2Best = player.R.cm2Best || new EN(0);
            let cap2 = new EN("1e555");
            let capped2 = cm2Best.min(cap2);
            if (capped2.gt(0)) gain = gain.times(capped2.add(1).pow(0.001555));
    if (hasChallenge("R", 12)) {
            gain = gain.pow(1.5);
        }
if (hasUpgrade('Q', 13))gain=gain.pow(upgradeEffect("Q",13))
    if (!gain.isFinite() || gain.isNaN()) gain = new EN(0); // 防爆
    
        player.e.light = player.e.light.add(gain.times(diff));
        tmp.e.lightGain = gain;
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
base = base.times(getLightEff1());
if(hasMilestone("R",3))base=base.pow(1.88)
    let exp=logP.nlg().times(1.025).min(5);
    let raw=base.pow(exp);
    if(hasUpgrade("e", 14)) raw=raw.times(upgradeEffect("e", 14));
    if(hasUpgrade('I',35))raw=raw.times(upgradeEffect("I", 35)) 
    if(hasUpgrade("I", 21)) raw=raw.pow(1.3);
    if (player.R.activeChallenge === 11) raw = raw.pow(0.5);
     if (player.R.activeChallenge === 12) raw = raw.pow(0.25);
    let cap = new EN("1e1e4");
    if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.5).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e1e9");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("e1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
},
    effectDescription(){
    let c = tmp[this.layer].color;
    return `使重生点获取 ${coloredText("*" + format(tmp.e.effect, 4, true), c)}`;
},
    doReset(resettingLayer) {
        let keep = [];
        if (layers[resettingLayer].row > this.row) layerDataReset("e", keep);
        if (hasAchievement("a", 33)) keepUpgrades("e", [11, 12, 13, 14, 15,21,22,23,24,25])
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
        
        "光子": {
    unlocked() { return hasMilestone("R", 9); },
    content: [
        ["blank", "15px"],
        ["display-text", function() {
            let light = player.e.light || new EN(0);
            let gain = tmp.e?.lightGain || new EN(0);
            let c = tmp.e.color;
            return `你有 ${coloredText(format(light, 4, true), c)} 光子 ` +
                   `(${coloredText("+" + format(gain, 4, true), c)} 光子/s)`;
        }],
        ["blank", "15px"],
        ["display-text", function() {
            let light = player.e.light || new EN(0);
            let c = tmp.e.color;
            if (light.lt(1)) {
                return `<h4 style="opacity:.5">效果I:达到 1 光子解锁</h4>`;
            } else {
                return `效果I:光子加成能量获取和能量效果基础 ${coloredText("*" + format(getLightEff1(), 4, true), c)}`;
            }
        }],
        ["display-text", function() {
            let light = player.e.light || new EN(0);
            let c = tmp.e.color;
            if (light.lt(7)) {
                return `<h4 style="opacity:.5">效果II:达到 7 光子解锁</h4>`;
            } else {
                return `效果II:光子加成增量器效果基础 ${coloredText("*" + format(getLightEff2(), 4, true), c)}`;
            }
        }],
        ["display-text", function() {
            let light = player.e.light || new EN(0);
            let c = tmp.e.color;
            if (light.lt(13)) {
                return `<h4 style="opacity:.5">效果III:达到 13 光子解锁</h4>`;
            } else {
                return `效果III:光子加成成就点效果基础 ${coloredText("+" + format(getLightEff3(), 4, true), c)}`;
            }
        }],
    ],
},
    },},
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
         if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.25).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e1e4");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("e1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
    },    
    effectDisplay() { return format(upgradeEffect(this.layer, this.id),4,true) + "x" }
    },
    12: { title: "能量增量", description: "能量提升增量器效果基础", cost: new EN(66),
    unlocked() { return hasUpgrade('e', 11) },    
    effect() {        
        let raw = player[this.layer].points.nlg().pow(0.78);
        if (hasUpgrade("R", 15)&&hasAchievement('a',31)) raw = raw.pow(upgradeEffect("R", 15).pow(2));
          if (hasUpgrade('e', 15)) raw = raw.pow(2);
          if (hasUpgrade("R", 31))raw=raw.pow(128)                
        let cap = new EN("1e9");        
        if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.25).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e1e4");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("e1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
    },    
    effectDisplay() { return format(upgradeEffect(this.layer, this.id),4,true) + "x" }
    },
    13: { title: "E=mc²", description: "点数提升能量获取", cost: new EN(1234),
    unlocked() { return hasUpgrade('e', 12) },    
    effect() {        
        let raw = player.points.nlg().pow(0.67); 
          if (hasUpgrade('e', 15)) raw = raw.pow(2);  
          if (hasUpgrade('R',24))raw=raw.pow('30')              
        let cap = new EN("1e9");        
        if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(1).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e1e4");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("e1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
    },    
    effectDisplay() { return format(upgradeEffect(this.layer, this.id),4,true) + "x" }
    },
    14: { title: "E=1/2mv²", description: "能量提升能量效果", cost: new EN(12345),
    unlocked() { return hasUpgrade('e', 13) },    
    effect() {        
        let raw = player.e.points.add(1).pow(1.3);               
        let cap = new EN("1e9");        
        if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.125).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e1e4");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("e1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
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
    unlocked() { return hasUpgrade('e', 23)||(hasUpgrade('I', 35)&&hasUpgrade('e', 22)) },    
    effect() {        
        let raw = player.e.points.add(1).pow(0.13);               
        let cap = new EN("1.79e308");        
        if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.125).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e1e4");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("e1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
    },    
    effectDisplay() { return format(upgradeEffect(this.layer, this.id),4,true) + "x" }
    },
    24: { title: "电能", description: "能量提升反重生效果", cost: new EN(1e84),
    unlocked() { return hasUpgrade('e', 23) },    
    effect() {        
        let raw = player.e.points.nlg().pow(2.88);               
        let cap = new EN("1e9");        
        if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.25).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e1e4");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("e1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
    },    
    effectDisplay() { return format(upgradeEffect(this.layer, this.id),4,true) + "x" }
    },
    25: { title: "核能", description: "能量加成点数获取", cost: new EN(1e88),
    unlocked() { return hasUpgrade('e', 24) },    
    effect() {        
        let raw = player.e.points.nlg().pow(3.33); 
        if(hasMilestone("R", 4))raw=raw.pow(3.33)                
        let cap = new EN("1e9");  
        if(hasMilestone("R", 4))cap=cap.pow(3.33)      
        if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.33).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e1e4");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("e1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
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
        cm2Best: new EN(0),
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
    directMult() {
    let mult = new EN(1)
    if (hasMilestone('R',5)) mult = mult.times(1.2)
        if (hasUpgrade('R',21)) mult = mult.times(1.25)
            if (hasUpgrade('R',23)) mult = mult.times(1.088)
                if (hasUpgrade('R',25)) mult = mult.times(1.078)
    return mult
},
canBuyMax() { return hasMilestone("R", 8) },
    effect() {
        let x = player.R.best;
        let iBase = new EN(1.01);
        let eBase = x.nlg();
        if(hasMilestone('R',2))iBase=iBase.add(0.01)
            if(hasMilestone('R',7))iBase=iBase.add(0.01)
            if(hasMilestone('R',2))eBase=eBase.add(0.01)
        let incBase = iBase.pow(x);
        let engBase = eBase.pow(x.nlg().pow(0.5));
        let icap0 = new EN("1.79308"); 
                incBase=effectWithSoftcap(incBase, icap0, new EN(0.25).div(incBase.nlg().nlg().add(1)))
                let icap1 = new EN("2"); 
                incBase=effectWithSoftcap(incBase, icap1, new EN(0.125).div(incBase.nlg().nlg().add(1)))
                let icap2 = new EN("10"); 
                incBase=effectWithSoftcap(incBase, icap2, new EN(0.0675).div(incBase.nlg().nlg().add(1)))
                let icap3 = new EN("100"); 
                incBase=effectWithSoftcap(incBase, icap3, new EN(0.001).div(incBase.nlg().nlg().add(1)))
                let icap4 = new EN("1000"); 
                incBase=EN.pow(10,effectWithSoftcap(incBase.log10(), icap4.log10(), new EN(0.01).div(incBase.log10().nlg().nlg().add(1))))
                let icap5 = new EN("1e9"); 
                incBase=EN.pow(10,EN.pow(10,effectWithSoftcap(incBase.log10().log10(), icap5.log10().log10(), new EN(0.001).div(incBase.log10().log10().nlg().nlg().add(1)))))
        if(hasMilestone('R',6))engBase=engBase.times(8.88).pow(6.66)
            let ecap0 = new EN("1.79e308"); 
                engBase=effectWithSoftcap(engBase, ecap0, new EN(0.5).div(engBase.nlg().nlg().add(1)))
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
    if (player.R.activeChallenge === 12) {
        player.R.cm2Best = player.R.cm2Best.max(player.points);
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
                ["raw-html", () => `<h4 style="opacity:.5">进入挑战会重置较低层级的进度，完成挑战获得永久奖励。</h4>`],
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
            effectDescription() { return "在重生点层解锁一个子界面" },
            done() { return player.R.points.gte(1) }
        },
        2: {
            requirementDescription: "3 轮回点",
            effectDescription() { return "轮回点效果基础+0.01" },
            done() { return player.R.points.gte(3) }
        },
        3: {
            requirementDescription: "在路阻且长中达1e182点数",
            effectDescription() { return "延迟增量获取软上限至1e1000" },
            done() { return player.R.cm1Best.gte('1e182') }
        },
        4: {
            requirementDescription: "5 轮回点",
            effectDescription() { return "增量^2和增量^3效果^3,核能效果和软上限阀值^3.33" },
            done() { return player.R.points.gte(5) }
        },
        5: {
            requirementDescription: "在路阻且长中达1.79e308点数",
            effectDescription() { return "自动购买增量购买项,且不消耗增量,轮回点获取*1.2" },
            done() { return player.R.cm1Best.gte('1.79e308') }
        },
        6: {
            requirementDescription: "8 轮回点",
            effectDescription() { return "轮回点效果II*8.88后^6.66" },
            done() { return player.R.points.gte(8) }
        },
        7: {
            requirementDescription: "9 轮回点",
            effectDescription() { return "轮回点效果I基础+0.01,点数获取一重软上限效果弱化1.44" },
            done() { return player.R.points.gte(9) }
        },
        8: {
            requirementDescription: "15 轮回点",
            effectDescription() { return "你可以最大购买轮回点" },
            done() { return player.R.points.gte(15) }
        },
        9: {
            requirementDescription: "18 轮回点",
            effectDescription() { return "解锁增量器效果基础因子III,并在能量层解锁一个子界面" },
            done() { return player.R.points.gte(18) }
        },
        10: {
            requirementDescription: "23 轮回点",
            effectDescription() { return "轮回点加成夸克获取,光子获取公式的对数底数-2,解锁一个新挑战" },
            done() { return player.R.points.gte(23) }
        },
        11: {
            requirementDescription: "25 轮回点",
            effectDescription() { return "解锁新层" },
            done() { return player.R.points.gte(25) }
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
        if (hasUpgrade('R', 23))raw=raw.pow(2.5)      
        let cap = new EN("1e9");        
        if (hasUpgrade("R", 15)) cap = cap.pow(upgradeEffect("R", 15));
       if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.25).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e1e4");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("e1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
    },    
    effectDisplay() { return format(upgradeEffect(this.layer, this.id),4,true) + "x" }
    
        },
        12: {
            title: "重来",
            description: "重生经验加成点数获取(效果不低于3.34e38)",
            cost: new EN(2),
            unlocked() { return hasUpgrade("R", 11)},
            effect() {
        let raw = player.p.rexp.add(1).pow(0.444).times(3.34e38);              
        let cap = new EN("1.79e308");        
        if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.222).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e1e4");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("e1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
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
        if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.0188).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e9");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
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
        if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.01).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e9");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
    },    
    effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id),4,true)  }
},
21: {
    title: "再次轮回",
    description: "轮回点获取*1.25",
    cost: new EN(6),
    unlocked() { return hasUpgrade("R", 15); },
},
22: {
            title: "不断重来",
            description: "增量耐性第一重软上限延迟至600,第二重软上限延迟至66666,轮回点加成点数获取(效果不低于1.78e34)",
            cost: new EN(8),
            unlocked() { return hasUpgrade("R", 21)},
            effect() {
        let raw = EN.pow('1.78e34',player.R.points.add(1));              
        let cap = new EN("1.79e308");        
        if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.222).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e1e4");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("e1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
    },    
    effectDisplay() { return format(upgradeEffect(this.layer, this.id),3,true) + "x" }
    
        },
        23: {
    title: "转生",
    description: "重生,反重生,反复重生效果^2.5,轮回点获取*1.088",
    cost: new EN(10),
    unlocked() { return hasUpgrade("R", 22); },
},
24: {
    title: "转世",
    description: "经典,反经典,点数自增,反复重生效果软上限延迟至1.79e308,E=mc²效果^3,增量器获取*1.01",
    cost: new EN(11),
    unlocked() { return hasUpgrade("R", 23); },
},
25: {
    title: "重重",
    description: "增量速度,增量强度效果^2,^2.5,增量^2和增量^3效果^3.33,轮回点获取*1.078",
    cost: new EN(12),
    unlocked() { return hasUpgrade("R", 24); },
},
31: {
    title: "一次又一次",
    description: "增量速度,增量强度先于增量耐性生效,但效果大幅削弱,能量增量效果^128,增量变胀效果^增量器,介子和胶子获取*轮回点^2",
    cost: new EN(30),
    unlocked() { return hasUpgrade("R", 25)&&hasMilestone('B',1); },
},
32: {
    title: "光速轮回",
    description: "光子获取*轮回点^10",
    cost: new EN(36),
    unlocked() { return hasUpgrade("R", 31); },
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
    if(hasAchievement('a',32))eff=eff.times(999999.9967138)
    let bestText = cmBest.gte(cap)
        ? `挑战内最高点数:${coloredText("4.44e444(硬上限)", c)}`
        : `挑战内最高点数:${coloredText(format(cmBest, 4, true), c)}`;
    return `完成后使重生经验获取^1.65<br>` +
           `${bestText}</br>使重生经验获取${coloredText("*" + format(eff, 4, true), c)}`;
},
        onComplete() {}, 
        unlocked() { return hasUpgrade("R", 13)|| player.R.activeChallenge == 11 || hasChallenge('R', 11); },
        style: { "color": "#ff3333", "border": "2px solid #ff3333" },
    },
    12: {
        name: "艰苦岁月",
        challengeDescription: "点数和重生经验获取^0.25,增量器,能量和光子效果I,II^0.25,但光子效果III*7",
        goal: new EN("1e555"),
        goalDescription: "达到 1e555 点数",
       rewardDescription() {
    let c = tmp.R.color;
    let cmBest = player.R.cm2Best || new EN(0);
    let cap = new EN("1e555");
    let capped = cmBest.min(cap);
    let eff = capped.add(1).pow(0.001555);
    let bestText = cmBest.gte(cap)
        ? `挑战内最高点数:${coloredText("1e555(硬上限)", c)}`
        : `挑战内最高点数:${coloredText(format(cmBest, 4, true), c)}`;
    return `完成后使光子获取^1.5,增量加成效果^增量器,增量获取公式的对数底数-0.5<br>` +
           `${bestText}</br>使光子获取${coloredText("*" + format(eff, 4, true), c)}`;
},
        onComplete() {}, 
        unlocked() { return hasMilestone("R", 10)|| player.R.activeChallenge == 12 || hasChallenge('R', 12); },
        style: { "color": "#ff3333", "border": "2px solid #ff3333" },
    },
},
})
addLayer("Q", {
    name: "夸克",
    symbol: "Q",
    position: 1,
    row: 2,
    branches: ["e"], 
    startData() { return {
        unlocked: false,
        points: new EN(0),
        uq: new EN(0),      
        dq: new EN(0),      
        ud: new EN(0),     
        g: new EN(0),       
    }},
    color: "#a020f0", 
    requires: new EN(100), 
    resource: "夸克",
    baseResource: "光子",
    baseAmount() { return player.e.light || new EN(0) },
    type: "normal",
    exponent() { return new EN(0.5) }, 
    gainMult() {
        let mult = new EN(1)
        if (hasMilestone("Q", 2)) {
            mult = mult.times(player.Q.g.add(10).log10());
        }
        if (hasMilestone("R", 10)) {
            mult = mult.times(player.R.points.add(1));
        }
        return mult
    },
    gainExp() {
        return new EN(1)
    },
    layerShown() { return player.e.light.gte(100) || player.Q.unlocked },
    passiveGeneration() {let q=new EN('0')
    if (hasUpgrade('Q', 15))q=q.add(upgradeEffect("Q",15))
    return q;
},
    update(diff) {
        // 夸克购买项自动产出
        let uqEff = tmp.Q?.buyables?.[11]?.effect ?? new EN(0);
        let dqEff = tmp.Q?.buyables?.[12]?.effect ?? new EN(0);
        
        if (uqEff.gt(0)) player.Q.uq = player.Q.uq.add(uqEff.times(diff));
        if (dqEff.gt(0)) player.Q.dq = player.Q.dq.add(dqEff.times(diff));

        // 介子获取 (里程碑1解锁)
        if (hasMilestone("Q", 1)) {
            let udGain = player.Q.dq.times(player.Q.uq).times(1e6).add(1).log10();
            if (hasUpgrade("R", 31))udGain = udGain.times(player.R.points.add(1).pow(2));
            if (udGain.gt(0)) {
                player.Q.ud = player.Q.ud.add(udGain.times(diff));
            }
            tmp.Q.udGain = udGain;
        } else {
            tmp.Q.udGain = new EN(0);
        }

        // 胶子获取 (里程碑2解锁)
        if (hasMilestone("Q", 2)) {
            let term1 = player.Q.ud.pow(2);
            let term2 = player.Q.uq.add(1).pow(0.5);
            let term3 = player.Q.dq.add(1).pow(0.5);
            let gGain = term1.times(term2).times(term3).add(1).log10();
            if (hasUpgrade("R", 31))gGain = gGain.times(player.R.points.add(1).pow(2));
            if (gGain.gt(0)) {
                player.Q.g = player.Q.g.add(gGain.times(diff));
            }
            tmp.Q.gGain = gGain;
        } else {
            tmp.Q.gGain = new EN(0);
        }
    },

    effect() {
        let eff = player.Q.points.add(1).pow(0.5).times(new EN(10).pow(player.Q.points.min(1)));
        
        // 介子加成
        if (hasMilestone("Q", 1)) {
            eff = eff.times(player.Q.ud.add(10).log10().pow(player.Q.ud.add(10).slog()));
                            if (hasMilestone("Q", 3))eff=eff.pow(1.3)
        }
        return eff;
    },
    
    effectDescription() {
        let c = tmp.Q.color;
        return `使光子获取速度 ${coloredText("*" + format(tmp.Q.effect, 4, true), c)}`;
    },

    doReset(resettingLayer) {
        let keep = [];
        if (layers[resettingLayer].row > this.row) layerDataReset("Q", keep);
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
            "粒子": {
                content: [
                    ["blank", "15px"],
                    // 资源数量与产速
                    ["display-text", function() {
                        let uq = player.Q.uq || new EN(0);
                        let dq = player.Q.dq || new EN(0);
                        let uqGain = tmp.Q?.buyables?.[11]?.effect || new EN(0);
                        let dqGain = tmp.Q?.buyables?.[12]?.effect || new EN(0);
                        
                        let text = `你有 ${coloredText(format(uq, 4, true), "#ff6666")} 上夸克 ` +
                                   `(${coloredText("+" + format(uqGain, 4, true) + "/s", "#ff6666")})<br>` +
                                   `你有 ${coloredText(format(dq, 4, true), "#6666ff")} 下夸克 ` +
                                   `(${coloredText("+" + format(dqGain, 4, true) + "/s", "#6666ff")})`;

                        if (hasMilestone("Q", 1)) {
                            let ud = player.Q.ud || new EN(0);
                            let udGain = tmp.Q?.udGain || new EN(0);
                            text += `<br>你有 ${coloredText(format(ud, 4, true), "#00ffff")} 介子 ` +
                                    `(${coloredText("+" + format(udGain, 4, true) + "/s", "#00ffff")})`;
                        }

                        if (hasMilestone("Q", 2)) {
                            let g = player.Q.g || new EN(0);
                            let gGain = tmp.Q?.gGain || new EN(0);
                            text += `<br>你有 ${coloredText(format(g, 4, true), "#ff00ff")} 胶子 ` +
                                    `(${coloredText("+" + format(gGain, 4, true) + "/s", "#ff00ff")})`;
                        }
                        return text;
                    }],
                    
                    ["blank", "20px"], 
                    
                    // 资源效果集中显示
                    ["display-text", function() {
                        let uqEff = effuq();
                        let dqEff = effdq();
                        let text = coloredText(`上夸克效果: 反重生效果 *${format(uqEff, 4, true)}`, "#ff6666", "1.2em") + "<br>" +
                                   coloredText(`下夸克效果: 光子效果II *${format(dqEff, 4, true)}`, "#6666ff", "1.2em");

                        if (hasMilestone("Q", 1)) {
                            let ud = player.Q.ud || new EN(0);
                            let udEff = ud.add(10).log10().pow(ud.add(10).slog());
                            if (hasMilestone("Q", 3))udEff=udEff.pow(1.3)
                            text += `<br>` + coloredText(`介子效果: 夸克效果 *${format(udEff, 4, true)}`, "#00ffff", "1.2em");
                        }

                        if (hasMilestone("Q", 2)) {
                            let g = player.Q.g || new EN(0);
                            let gEff = g.add(10).log10();
                            let gEff2 = gEff.pow(3);
                            text += `<br>` + coloredText(`胶子效果: 夸克获取 *${format(gEff, 4, true)} 上下夸克获取 *${format(gEff2, 4, true)}`, "#ff00ff", "1.2em");
                        }
                        return text;
                    }],
                    
                    ["blank", "20px"],
                    "buyables",
                ]
            },
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
    buyables: {
        rows: 1, cols: 2,
        11: {
            title: "上夸克生成器",
            cost(x) {
                return new EN(2).pow(new EN(1.1).pow(x)).div(2).times(x.add(1));
            },
            effect(x) {
                let base = new EN(x);
                let raw = base.pow(3).div(200).times(EN.pow(2, x));
                if (hasMilestone("Q", 2)) {
                    raw = raw.times(player.Q.g.add(10).log10().pow(3));
                }
                if (hasUpgrade('Q', 14))raw=raw.times(upgradeEffect("Q",14))
                return raw;
            },
            display() {
                let cost = tmp.Q.buyables[11].cost;
                let level = getBuyableAmount("Q", 11);
                let eff = tmp.Q.buyables[11].effect;
                return `价格: ${format(cost)} 夸克<br>` +
                       `数量: ${formatWhole(level)}<br>` +
                       `效果: ${format(eff)} 上夸克/s`;
            },
            canAfford() {
                return player.Q.points.gte(tmp.Q.buyables[11].cost);
            },
            buy() {
                player.Q.points = player.Q.points.sub(tmp.Q.buyables[11].cost);
                player.Q.buyables[11] = getBuyableAmount("Q", 11).add(1);
            },
        },
        12: {
            title: "下夸克生成器",
            cost(x) {
                return new EN(2).pow(new EN(1.1).pow(x)).div(2).times(x.add(1));
            },
            effect(x) {
                let base = new EN(x);
                let raw = base.pow(3).div(200).times(EN.pow(2, x));
                if (hasMilestone("Q", 2)) {
                    raw = raw.times(player.Q.g.add(10).log10().pow(3));
                }
                if (hasUpgrade('Q', 14))raw=raw.times(upgradeEffect("Q",14))
                return raw;
            },
            display() {
                let cost = tmp.Q.buyables[12].cost;
                let level = getBuyableAmount("Q", 12);
                let eff = tmp.Q.buyables[12].effect;
                return `价格: ${format(cost)} 夸克<br>` +
                       `数量: ${formatWhole(level)}<br>` +
                       `效果: ${format(eff)} 下夸克/s`;
            },
            canAfford() {
                return player.Q.points.gte(tmp.Q.buyables[12].cost);
            },
            buy() {
                player.Q.points = player.Q.points.sub(tmp.Q.buyables[12].cost);
                player.Q.buyables[12] = getBuyableAmount("Q", 12).add(1);
            },
        }
    },
    milestones: {
        1: {
            requirementDescription: "12 夸克",
            effectDescription() { return "解锁新资源:介子" },
            done() { return player.Q.points.gte(12) }
        },
        2: {
            requirementDescription: "500 夸克",
            effectDescription() { return "解锁新资源:胶子" },
            done() { return player.Q.points.gte(500) }
        },
        3: {
            requirementDescription: "5000 夸克",
            effectDescription() { return "介子效果^1.3" },
            done() { return player.Q.points.gte(5000) }
        },
    },
    upgrades: {
        rows: 9, cols: 5,
        11: {title: "夸克能",description: "夸克提升能量获取,效果开平方后提升重生点获取",cost: new EN(12000),    
        unlocked() { return true },    
        effect() {        
            let raw = player[this.layer].points.nlg().pow(0.3);               
            let cap = new EN("4");        
            if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.13).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e9");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.13).times(cap1.log10()));
    let cap2 = new EN("1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.013).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
        },    
        effectDisplay() { return "^" + format(upgradeEffect(this.layer, this.id),6,true)  }
    },
    12: {title: "夸克结合",description: "夸克提升增量获取,效果开平方后提升重生经验获取",cost: new EN(34000),    
        unlocked() { return hasUpgrade('Q', 11) },    
        effect() {        
            let raw = player[this.layer].points.nlg().pow(0.13);               
            let cap = new EN("4");        
            if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.13).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e9");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.13).times(cap1.log10()));
    let cap2 = new EN("1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.013).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
        },    
        effectDisplay() { return "^" + format(upgradeEffect(this.layer, this.id),6,true)  }
    },
    13: {title: "夸克色荷",description: "夸克提升光子获取,光子获取公式的对数底数改为7",cost: new EN(67000),    
        unlocked() { return hasUpgrade('Q', 12) },    
        effect() {        
            let raw = player[this.layer].points.nlg().pow(0.0333);               
            let cap = new EN("3");        
            if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.13).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e9");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.13).times(cap1.log10()));
    let cap2 = new EN("1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.013).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
        },    
        effectDisplay() { return "^" + format(upgradeEffect(this.layer, this.id),6,true)  }
    },
    14: {title: "夸克裂解",description: "夸克提升上下夸克获取,光子获取公式的对数底数改为5",cost: new EN(99000),    
        unlocked() { return hasUpgrade('Q', 13) },    
        effect() {        
            let raw = player[this.layer].points.pow(0.5);               
            let cap = new EN("1e9");        
        if (raw.gte(cap))raw=effectWithSoftcap(raw, cap, new EN(0.25).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e1e4");
    if (raw.gte(cap1)) raw = EN.pow('10',raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("e1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10',raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
                         let cap3 = new EN("10^^7");
                         if (raw.gte(cap3)) raw = EN.tetrate('10',raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw
        },    
        effectDisplay() { return "*" + format(upgradeEffect(this.layer, this.id),6,true)  }
    },
    15: {title: "夸克激发",description: "基于点数自动获取夸克",cost: new EN(130000),    
        unlocked() { return hasUpgrade('Q', 14) },    
        effect() {        
            let raw = player.points.slog().div(100);               
    return raw
        },    
        effectDisplay() { return "+" + format(upgradeEffect(this.layer, this.id).times(100),6,true)+"%"  }
    },
    },
})
addLayer("B", {
    name: "助推器",
    symbol: "B",
    position: 0,
    row: 2,
    branches: ["I"],
    color: "#ff8800", // 橙色，与I层的蓝色区分开
    startData() { return {
        unlocked: false,
        points: new EN(0),
    }},
    requires: new EN(14000), // 14000增量器
    resource: "助推器",
    baseResource: "增量器",
    baseAmount() { return player.I.points },
    type: "static",
    exponent() { let exp = new EN(1)
        exp=exp.add(player.B.points.pow(0.05).div(10))
        return exp }, // static类型公式：基础量/需求，再^(1/exponent)
    gainMult() {
        let mult = new EN(1)
        return mult
    },
    directMult() {
    let mult = new EN(1)
    mult=mult.times(player.B.points.pow(0.1).div(10).add(1))
    return mult
},
    gainExp() { return new EN(1) },
    canBuyMax() { return false }, // 暂时不给自动购买，或者你可以基于某个里程碑解锁
    
    layerShown() { return hasMilestone("R", 11) || player.B.unlocked },
    
    effect() {
       let raw=player.B.points.nlg().pow(10)
        return raw;
    },
    effectDescription() {
        let c = tmp.B.color;
        return `使点数获取${coloredText("^" + format(tmp.B.effect, 4, true), c)}`;
    },
    
    doReset(resettingLayer) {
        let keep = [];
        if (layers[resettingLayer].row > this.row) layerDataReset("B", keep);
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
                unlocked() { return player.B.unlocked; },
                content: [
                    ["blank", "15px"],
                    ["raw-html", () => `<h4 style="opacity:.5">助推器会极大提升你的点数获取。</h4>`],
                    ["upgrades", [1, 2, 3, 4, 5]]
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
            requirementDescription: "1 助推器",
            effectDescription() { return "解锁新的R层升级" }, 
            done() { return player.B.points.gte(1) }
        },
        2: {
            requirementDescription: "25 助推器",
            effectDescription() { return "你可以最大购买助推器" },
            done() { return player.B.points.gte(25) }
        }
    },
    upgrades: {
        rows: 1, cols: 5,
        
    }
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