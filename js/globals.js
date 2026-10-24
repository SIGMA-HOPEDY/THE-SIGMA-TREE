function coloredText(text, color, fontSize = "1.4em", glow = 10) {
    return `<span style="color:${color}; font-size:${fontSize}; text-shadow:0px 0px ${glow}px ${color};">${text}</span>`;
}
function keepUpgrades(layer, ids) {
    for (let id of ids) {
        if (!player[layer].upgrades.includes(id.toString())) {
            player[layer].upgrades.push(id.toString());
        }
    }
}
function getRexpEffect() {
    let rexp = player.p.rexp;
    let raw = rexp.add(1).pow(rexp.nlg().pow(0.5));
    let cap = new EN("1e1e4");
    if (raw.gte(cap)) raw = effectWithSoftcap(raw, cap, new EN(0.5).div(raw.nlg().nlg().add(1)));
    let cap1 = new EN("1e1e9");
    if (raw.gte(cap1)) raw = EN.pow('10', raw.log10().div(cap1.log10()).log10().add(1).pow(0.5).times(cap1.log10()));
    let cap2 = new EN("e1.79e308");
    if (raw.gte(cap2)) raw = EN.pow('10', raw.log10().div(cap2.log10()).log10().add(1).pow(0.025).times(cap2.log10()));
    let cap3 = new EN("10^^7");
    if (raw.gte(cap3)) raw = EN.tetrate('10', raw.slog().div(cap3.slog()).pow(0.5).times(cap3.slog()));
    return raw;
}
function keepMilestones(layer, ids) {
    for (let id of ids) {
        if (!player[layer].milestones.includes(id.toString())) {
            player[layer].milestones.push(id.toString());
        }
    }
}
function applySoftcap(gain, threshold, baseExponent, hintKey) {
    if (gain.lte(threshold)) {
        if (tmp && tmp.other && hintKey) tmp.other[hintKey] = "";
        return gain;
    }
    let ratio = gain.div(threshold).max(1);
    let logGain = ratio.log10();
    let loglogGain = logGain.add(1).log10();
    let exponent = new EN(baseExponent).div(new EN(9).plus(loglogGain));
    if (!exponent.isFinite() || exponent.isNaN() || exponent.lte(0)) exponent = new EN(0.91);
    let result = threshold.times(ratio.pow(exponent));

    if (tmp && tmp.other && hintKey) {
        const names = {
            'softcapHint': '一重软上限',
            'doubleSoftcapHint': '二重软上限',
            'tripleSoftcapHint': '三重软上限',
        };
        let name = names[hintKey] || hintKey;
        tmp.other[hintKey] = `${name}:点数获取>${format(threshold, 3, true)}后超出部分^${format(exponent, 9, true)}`;
    }
    return result;
}
function effectWithSoftcap(raw, cap, softPower, customCappedPower) {    
if (raw.lte(cap)) return raw;    
let ratio = raw.div(cap);    
let capped = ratio.pow(softPower);    
if (customCappedPower) {        
capped = customCappedPower(capped, ratio);
    }    
return cap.times(capped);
}
function overflowSoftcap(value, threshold) {
    value = new EN(value);
    threshold = new EN(threshold);
    if (value.lte(threshold)) {
        if (tmp && tmp.other) { tmp.other.overflowActive = false; tmp.other.overflowHint = ""; }
        return value;
    }
    const base = new EN(10);
    const k0 = new EN(0.1);
    const c = new EN(10);
    const x = value.slog(base);
    const a = threshold.slog(base);
    if (a.lt(new EN('1e-9'))) return value;
    const k = k0.div(a);
    const expNegKc = EN.exp(k.mul(-1).mul(c));
    const numerator = new EN(0.19).mul(EN.add(1, expNegKc));
    const denominator = EN.add(1, EN.exp(k.mul(x.sub(a).sub(c))));
    const f = new EN(0.8).add(numerator.div(denominator));
    const g = a.mul(x.div(a).pow(f));
    if (tmp && tmp.other) {
        tmp.other.overflowActive = true;
        tmp.other.overflowHint = `溢出:点数获取>${format(threshold, 3, true)} 后,slog^${format(f, 4, true)}`;
        ['softcapHint','doubleSoftcapHint','tripleSoftcapHint'].forEach(k => tmp.other[k] = "");
    }
    return EN.tetrate(base, g);
}
function getLightEff1() {
    let l = player.e.light || new EN(0);
    if (l.lt(1)) return new EN(1);
    let eff = l.times('3e5').pow(l.min(30));
    if (player.R.activeChallenge === 12) eff = eff.pow(0.25); // 新增
    return eff;
}
function getLightEff2() {
    let l = player.e.light || new EN(0);
    if (l.lt(7)) return new EN(1);
    let eff = l.pow(3.5).times('3e5').times(effdq());
    if (player.R.activeChallenge === 12) eff = eff.pow(0.25); // 新增
    return eff;
}
function getLightEff3() {
    let l = player.e.light || new EN(0);
    if (l.lt(13)) return new EN(0);
    let eff = l.slog().div('13');
    if (player.R.activeChallenge === 12) eff = eff.times(7); // 新增
    return eff;
}// 计算 uq (上夸克) 效果
function effuq() {
    // 为了防止 Q 层还没初始化时调用报错，加上保护
    if (!player.Q || !player.Q.uq) return new EN(1);
    return player.Q.uq.add(1).pow(5);
}

// 计算 dq (下夸克) 效果
function effdq() {
    if (!player.Q || !player.Q.dq) return new EN(1);
    return player.Q.dq.add(1).pow(3)
}