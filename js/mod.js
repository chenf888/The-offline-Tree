let modInfo = {
	name: "在/离线树",
	author: "陈风就是浪",
	id: "The-on-offline-Tree",
	pointsName: "离线点数",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal(0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours (base), can be upgraded
}

// Set your version in num and name
let VERSION = {
	num: "0.2.1",
	name: "在/离线树",
}

let changelog = `<h1>更新日志</h1><br>
    <h3>v0.2.1</h3><br>
        fix-由于id变更，导致所有玩家存档全部失效，请硬重置后游玩<br>
    <h3>v0.2.0</h3><br>
	    离线树进入新时代，更名为在/离线树。游戏链接展示不变，点击<a href="https://qm.qq.com/q/Ae8KXBQ4HS" target="_blank" style="color:#2196F3;text-decoration:underline">这里</a>加入QQ群<br>
		主要玩法准备由单纯的离线变为以小游戏为主的在/离线结合<br>
		这种玩法的灵感来源于1001tree，虽然目前还没有什么实质性的内容，但后续会慢慢添加<br>
		当前在线点数获取为1/h，每秒约为0.0002778/s，这个数字只是巧合<br>
        现在只有一个小游戏，由于是赶出来的，所有体验较差，数值部分还未平衡<br>
    <h3>v0.1.3</h3><br>
	    优化部分glassui动画<br>
	    增加了离线时间显示弹窗，初始离线容量改为1小时<br>
	    目前升级效果并未同步更改，所以稍麻烦一点<br>
    <h3>v0.1.2</h3><br>
	    一次ui尝试<br>
        通过在设置界面的glass ui选项控制开关<br>
    <h3>v0.1.1</h3><br>
        更改了离线点数计算方式<br>
	<h3>v0.1</h3><br>
		- 初始版本，离线获得点数<br>
		当前游戏时间大概为6小时，实际你只需<br>
		打开游戏后第二天在上线即可残局<br>`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything", "_doStockTick", "getCapital", "getTotalAsset", "getProfit", "getStockFee", "buyStock", "sellStock", "drawCandleChart"]

function getStartPoints() {
	return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints() {
	return player.offTime !== undefined && player.offTime.remain > 0
}

// Calculate points/sec!
function getPointGen() {
	if (!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1).div(60)
	if (hasUpgrade("o", 12)) gain = gain.times(upgradeEffect("o", 12))
	if (hasUpgrade("o", 13)) gain = gain.times(upgradeEffect("o", 13))
	if (hasUpgrade("o", 22)) gain = gain.times(upgradeEffect("o", 22))
	if (hasUpgrade("o", 34)) gain = gain.times(upgradeEffect("o", 34))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() {
	return {
		offlineMax: 1,  // Current max offline hours
	}
}

function getOfflineLimit() {
	let limit = player.offlineMax || modInfo.offlineLimit
	if (hasUpgrade("o", 24)) limit += 2
	if (hasUpgrade("o", 32)) limit += 4
	if (hasUpgrade("o", 33)) limit += 6
	return limit
}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return (3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion) {
}