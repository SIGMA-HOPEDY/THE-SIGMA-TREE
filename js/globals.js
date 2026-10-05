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
        tmp.other[hintKey] = `${name}:点数获取>${format(threshold, 3, true)}后^${format(exponent, 9, true)}`;
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