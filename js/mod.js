let modInfo = {
	name: "The Sigma Tree",
	id: "sigma-tree",
	author: "Sigma",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js",  "achievements.js", "globals.js"],
	initialStartPoints: new ExpantaNum (0), 
	offlineLimit: 24, 
}

let VERSION = {
	num: "0.0.1",
	name: ""
}

let changelog = `
懒得写
`
let winText = `恭喜！你已到达终点并通关了这款游戏，但目前……
`
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new ExpantaNum(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}
function getPointGen() {
    if (!canGenPoints()) return new EN(0);

    let gain = new EN(1);

    // ---- 基础加成----
    if (hasUpgrade('p', 11)) gain = gain.times(2);
    if (hasUpgrade('p', 12)) gain = gain.times(upgradeEffect('p', 12));
    if (hasUpgrade('p', 14)) gain = gain.times(upgradeEffect('p', 14));
    if (hasUpgrade('e', 25)) gain = gain.times(upgradeEffect('e', 25));
    if (hasUpgrade('R', 12)) gain = gain.times(upgradeEffect('R', 12));
    if (hasUpgrade('R', 22)) gain = gain.times(upgradeEffect('R', 22));
    if (player.I.unlocked) gain = gain.times(tmp.I.effect);
   if (player.a.unlocked) gain = gain.times(tmp.a.effect);
   if (hasAchievement("a", 34))gain=gain.times(1e225)
   if (hasUpgrade('p', 23)) gain = gain.pow(upgradeEffect('p', 23));
   if (hasUpgrade('p', 24)) gain = gain.pow(upgradeEffect('p', 24));
   if (player.B.unlocked && tmp.B && tmp.B.effect && tmp.B.effect.gt(1)) {
        gain = gain.pow(tmp.B.effect)}
       // 挑战削弱
    if (player.R.activeChallenge === 11) gain = gain.pow(0.5);
    if (player.R.activeChallenge === 12) gain = gain.pow(0.25); // 新增
    // ---- 一重软上限----
    let p1 = new EN("1.79e308");
    let ep1= new EN("0.5");
    if(hasMilestone('R',7))ep1=ep1.times(1.44)
        if(hasMilestone('I',5))ep1=ep1.times(1.5)
            if(hasMilestone('I',6))ep1=ep1.times(1.167)
    gain = applySoftcap(gain, p1, ep1, 'softcapHint');

    // ---- 二重软上限----
    let p2 = new EN("1e1e4");
    let ep2= new EN("0.25");
    gain = applySoftcap(gain, p2, ep2, 'doubleSoftcapHint');

    // ---- 三重软上限 ----
    let p3 = new EN("1e1e9");
    let ep3= new EN("0.0125");
    gain = applySoftcap(gain, p3, ep3, 'tripleSoftcapHint');

    // ---- 溢出软上限：超过 10^^4 (即 ee1e10) ----
    const overflowThreshold = EN.tetrate('10', '4');
    gain = overflowSoftcap(gain, overflowThreshold);

    // ---- 记录最高点数 ----
    if (player.points.gt(player.BestPoints)) player.BestPoints = new EN(player.points);
    if (gain.gt(player.BestPointsPerSec)) player.BestPointsPerSec = new EN(gain);

    return gain;
}

function addedPlayerData() {
    return {
        cleanedUpgrades: false,
        // ── 记录 ──
        BestPoints: new EN(0),
        BestPointsPerSec: new EN(0),
    };
}
function convertToB16(n){
    let codes = {
            0: "0",
            1: "1",
            2: "2",
            3: "3",
            4: "4",
            5: "5",
            6: "6",
            7: "7",
            8: "8",
            9: "9",
            10: "A",
            11: "B",
            12: "C",
            13: "D",
            14: "E",
            15: "F",
    }
    let x = n % 16
    return codes[(n-x)/16] + codes[x]
}
function getUndulatingColor(period = Math.sqrt(760)){
	let t = new Date().getTime()
	let a = Math.sin(t / 1e3 / period * 2 * Math.PI + 0) 
	let b = Math.sin(t / 1e3 / period * 2 * Math.PI + 2)
	let c = Math.sin(t / 1e3 / period * 2 * Math.PI + 4)
	a = convertToB16(Math.floor(a*128) + 128)
	b = convertToB16(Math.floor(b*128) + 128)
	c = convertToB16(Math.floor(c*128) + 128)
	return "#"+String(a) + String(b) + String(c)
}
var displayThings = [
	function(){
		let x = getUndulatingColor()
		let a = "当前残局: "+colorText("h2", x,format("4"))+" 助推点"
		let d = isEndgame()?makeRed("<br>你超过了残局,<br>游戏可能在这里不平衡"):""
		return a+d
	},
]
function isEndgame() {
return player.B.points.gte("4")}

var backgroundStyle = {

}


function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}