let modInfo = {
	name: "离线树",
	author: "陈风就是浪",
	id: "The-offline-Tree",
	pointsName: "离线点数",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 24,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "离线树",
}

let changelog = `<h1>更新日志</h1><br>
	<h3>v0.1</h3><br>
		- 初始版本，离线获得点数<br>
		当前游戏时间大概为6小时，实际你只需<br>
		打开游戏后第二天在上线即可残局<br>`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
// 离线树：只在处理离线时间时产生点数，在线时不增长
function canGenPoints(){
	return player.offTime !== undefined && player.offTime.remain > 0
}

// Calculate points/sec!
// 离线树：每分钟获得1离线点数 = 每秒 1/60 点
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1).div(60)
	if (hasUpgrade("o", 12)) gain = gain.times(upgradeEffect("o", 12))
	if (hasUpgrade("o", 13)) gain = gain.times(upgradeEffect("o", 13))
	if (hasUpgrade("o", 22)) gain = gain.times(upgradeEffect("o", 22))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

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
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}