addLayer("o", {
    name: "离线",
    symbol: "OFF",
    position: 0,
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    color: "#4B8DF5",
    requires: new Decimal(10),
    resource: "离线能量",
    baseResource: "离线点数",
    baseAmount() { return player.points },
    type: "normal",
    exponent: 1,
    gainMult() {
        mult = new Decimal(1)
        if (hasUpgrade(this.layer, 11)) mult = mult.times(upgradeEffect(this.layer, 11))
        if (hasUpgrade(this.layer, 21)) mult = mult.times(upgradeEffect(this.layer, 21))
        if (hasUpgrade(this.layer, 31)) mult = mult.times(upgradeEffect(this.layer, 31))
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 0,
    hotkeys: [
        { key: "o", description: "O: 转换为离线能量", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    layerShown() { return true },

    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        "resource-display",
        ["display-text", function () {
            let limit = getOfflineLimit()
            let hours = Math.floor(limit)
            let mins = Math.floor((limit - hours) * 60)
            let days = Math.floor(hours / 24)
            hours = hours % 24
            let text = '当前离线最大容量：'
            if (days > 0) text += days + '日'
            if (hours > 0) text += hours + '时'
            if (mins > 0) text += mins + '分'
            return text
        }],
        "blank",
        "upgrades",
    ],

    upgrades: {
        11: {
            title: "离线 1",
            description: "使离线能量获取 ×2！",
            cost: new Decimal(2),
            effect() {
                return new Decimal(2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },
        12: {
            title: "点数 1",
            description: "离线点数获取速度 ×1.5！",
            cost: new Decimal(5),
            effect() {
                return new Decimal(1.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },
        13: {
            title: "点数 2",
            description: "离线能量让离线点数增长更快！",
            cost: new Decimal(8),
            effect() {
                return player[this.layer].points.add(1).pow(0.2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },
        21: {
            title: "离线 2",
            description: "使离线能量获取 ×2！",
            cost: new Decimal(25),
            unlocked() { return hasUpgrade(this.layer, 11) },
            effect() {
                return new Decimal(2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },
        22: {
            title: "点数 3",
            description: "离线点数获取速度 ×2！",
            cost: new Decimal(35),
            unlocked() { return hasUpgrade(this.layer, 12) },
            effect() {
                return new Decimal(2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },
        23: {
            title: "能量 4",
            description: "离线越多，离线越多！",
            cost: new Decimal(50),
            unlocked() { return hasUpgrade(this.layer, 21) },
            effect() {
                return player[this.layer].points.add(1).pow(0.15)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },
        24: {
            title: "离线扩容 I",
            description: "使离线时间最大容量 +2 小时！",
            cost: new Decimal(30),
            unlocked() { return hasUpgrade(this.layer, 13) },
        },
        31: {
            title: "能量 5",
            description: "使离线能量获取 ×2.5！",
            cost: new Decimal(100),
            unlocked() { return hasUpgrade(this.layer, 23) },
            effect() {
                return new Decimal(2.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },
        32: {
            title: "离线扩容 II",
            description: "使离线时间最大容量 +4 小时！",
            cost: new Decimal(75),
            unlocked() { return hasUpgrade(this.layer, 24) },
        },
        33: {
            title: "离线扩容 III",
            description: "使离线时间最大容量 +6 小时！",
            cost: new Decimal(200),
            unlocked() { return hasUpgrade(this.layer, 32) },
        },
        34: {
            title: "点数倍增器",
            description: "离线点数获取速度 ×3！",
            cost: new Decimal(150),
            unlocked() { return hasUpgrade(this.layer, 22) },
            effect() {
                return new Decimal(3)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },
    },

    achievements: {},

    milestones: {
        0: {
            requirementDescription: "离线能量达到 10",
            effectDescription: "解锁在线层",
            done() { return player[this.layer].points.gte(10) },
            onComplete() { player.on.unlocked = true },
        },
    },
})

addLayer("a", {
    name: "成就",
    symbol: "A",
    position: 1,
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    color: "#FFD700",
    resource: "成就点",
    baseResource: "成就",
    baseAmount() { return new Decimal(0) },
    type: "none",
    row: "side",
    layerShown() { return true },
    tabFormat: [
        ["display-text", function () {
            let html = '<div style="text-align:center;padding:20px"><h2>成就</h2><br>'
            let total = 0
            let completed = 0
            for (let lr in layers) {
                if (layers[lr].achievements) {
                    for (let id in layers[lr].achievements) {
                        if (isPlainObject(layers[lr].achievements[id])) {
                            total++
                            let ach = layers[lr].achievements[id]
                            let done = hasAchievement(lr, id)
                            if (done) completed++
                            let bgColor = done ? '#4CAF50' : '#555'
                            let opacity = done ? '1' : '0.55'
                            html += '<div style="display:inline-block;margin:6px;padding:10px 14px;border-radius:12px;background:' + bgColor + ';opacity:' + opacity + ';min-width:140px;transition:all 0.3s">'
                            html += '<b>' + ach.name + '</b><br><small>' + ach.description + '</small><br>'
                            html += '<small style="color:' + (done ? '#fff' : '#aaa') + '">' + (done ? '✅ 已完成' : '⬜ 未完成') + '</small>'
                            html += '</div>'
                        }
                    }
                }
            }
            html += '<br><br><div style="font-size:18px">进度：' + completed + ' / ' + total + '</div></div>'
            return html
        }],
    ],
})

addLayer("on", {
    name: "在线",
    symbol: "ON",
    position: 1,
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            unlockedGames: {},
        }
    },
    color: "#FF6B6B",
    resource: "在线点数",
    type: "none",
    row: 0,
    layerShown() { return hasMilestone("o", 0) },

    update(diff) {
        if (!player.o.points.gte(10)) return
        let gain = new Decimal(diff).div(3600)
        player[this.layer].points = player[this.layer].points.add(gain)
    },

    tabFormat: [
        ["main-display", 7],
        "blank",
        ["display-text", function () {
            let ratePerHour = new Decimal(1)
            let ratePerSec = ratePerHour.div(3600)
            return '<div style="text-align:center;color:#aaa;font-size:14px">获取速率: ' + format(ratePerSec, 7) + ' / 秒 (仅在线时)</div>'
        }],
        "blank",
        ["display-text", function () {
            return '<h3 style="text-align:center">解锁小游戏</h3>'
        }],
        "blank",
        "upgrades",
    ],

    upgrades: {
        11: {
            title: "股票大亨",
            description: "低买高卖，成为金融巨鳄！",
            cost: new Decimal(1),
            onPurchase() {
                player.on.unlockedGames["stock"] = true
                player.stock.unlocked = true
            },
            style: {
                "min-height": "80px",
                "padding": "16px",
            },
        },
    },

    achievements: {},
})

function getStockDefs() {
    return {
        "G001": {
            name: "鼎盛金融控股集团",
            icon: "🏛️",
            initPrice: 20,
            volatility: 0.01,
            trend: 0.0001,
            eventChance: 0.01,
            events: [
                { name: "央行降准利好", effect: 0.015, chance: 0.5 },
                { name: "季度报告不及预期", effect: -0.0075, chance: 0.5 },
            ],
            reversal: "weak",
            meanRevThreshold: 0.02,
            meanRevStrength: 0.005,
            tag: "低风险·稳健",
        },
        "G002": {
            name: "凌云数字科技",
            icon: "💻",
            initPrice: 8,
            volatility: 0.035,
            trend: 0.0005,
            eventChance: 0.03,
            events: [
                { name: "新产品用户暴增", effect: 0.06, chance: 0.4 },
                { name: "监管政策收紧", effect: -0.08, chance: 0.4 },
                { name: "行业标准确立", effect: 0.04, chance: 0.2 },
            ],
            reversal: "medium",
            meanRevThreshold: 0.05,
            meanRevStrength: 0.01,
            maxConsecutiveUp: 5,
            tag: "成长型·科技",
        },
        "G003": {
            name: "瀚海生物医药",
            icon: "🔬",
            initPrice: 5,
            volatility: 0.05,
            trend: 0,
            eventChance: 0.05,
            events: [
                { name: "新药临床试验成功", effect: 0.125, chance: 0.15 },
                { name: "新药审批被拒", effect: -0.16, chance: 0.15 },
                { name: "纳入医保目录", effect: 0.10, chance: 0.25 },
                { name: "药品集采降价", effect: -0.09, chance: 0.25 },
                { name: "疫苗重大突破", effect: 0.175, chance: 0.10 },
                { name: "竞争对手领先", effect: -0.06, chance: 0.10 },
            ],
            reversal: "strong",
            meanRevThreshold: 0.15,
            meanRevStrength: 0.03,
            spikeThreshold: 0.08,
            spikeReversalChance: 0.40,
            spikeReversalRatio: 0.40,
            tag: "消息驱动·高风险",
        },
        "G004": {
            name: "天域半导体科技",
            icon: "🔋",
            initPrice: 15,
            volatility: 0.04,
            trend: 0.0002,
            eventChance: 0.04,
            events: [
                { name: "国家大基金增持", effect: 0.10, chance: 0.3 },
                { name: "美国制裁升级", effect: -0.125, chance: 0.3 },
                { name: "14nm技术突破", effect: 0.15, chance: 0.2 },
                { name: "产能过剩预警", effect: -0.08, chance: 0.2 },
            ],
            reversal: "cycle",
            cycleMin: 80,
            cycleMax: 200,
            cycleBullTrend: 0.0015,
            cycleBearTrend: -0.002,
            meanRevThreshold: 0.25,
            meanRevStrength: 0.02,
            tag: "政策周期·中高风险",
        },
        "G005": {
            name: "寰宇矿业集团",
            icon: "⛏️",
            initPrice: 3,
            volatility: 0.08,
            trend: 0,
            eventChance: 0.06,
            events: [
                { name: "发现特大矿区", effect: 0.20, chance: 0.15 },
                { name: "矿山安全事故", effect: -0.175, chance: 0.15 },
                { name: "国际大宗商品涨价", effect: 0.10, chance: 0.25 },
                { name: "环保整顿停产", effect: -0.125, chance: 0.25 },
                { name: "港口封锁供应短缺", effect: 0.25, chance: 0.10 },
                { name: "矿难！", effect: -0.30, chance: 0.05 },
                { name: "地缘冲突推高资源价", effect: 0.15, chance: 0.05 },
            ],
            reversal: "extreme",
            maxConsecutiveUp: 3,
            consUpReversalChance: 0.35,
            consUpReversalEffect: -0.10,
            spikeThreshold: 0.10,
            spikeReversalChance: 0.50,
            spikeReversalRatio: 0.60,
            trendFlipChance: 0.03,
            bailoutPrice: 0.10,
            bailoutEffect: 0.25,
            tag: "妖股·极度投机",
        },
    }
}

function drawCandleChart(code) {
    let p = player.stock, chart = p.charts[code]
    if (!chart || chart.length === 0) return '<span style="color:#888">等待行情数据...</span>'
    let show = chart.slice(-30)
    let maxV = 0, minV = Infinity
    for (let c of show) { maxV = Math.max(maxV, c.high); minV = Math.min(minV, c.low) }
    if (maxV === minV) maxV = minV + 1
    let scale = 80 / (maxV - minV)
    let html = '<div style="position:relative;height:90px;width:100%;overflow:hidden">'
    html += '<svg style="position:absolute;width:100%;height:80px" xmlns="http://www.w3.org/2000/svg">'
    for (let i = 0; i < show.length; i++) {
        let c = show[i]
        let x = i * (100 / show.length) + 1
        let isUp = c.close >= c.open
        let color = isUp ? "#4CAF50" : "#F44336"
        let openY = 80 - (c.open - minV) * scale
        let closeY = 80 - (c.close - minV) * scale
        let highY = 80 - (c.high - minV) * scale
        let lowY = 80 - (c.low - minV) * scale
        html += '<line x1="' + x + '" y1="' + highY + '" x2="' + x + '" y2="' + lowY + '" stroke="' + color + '" stroke-width="1"/>'
        html += '<rect x="' + (x - 1.5) + '" y="' + Math.min(openY, closeY) + '" width="3" height="' + Math.max(1, Math.abs(openY - closeY)) + '" fill="' + color + '"/>'
    }
    html += '</svg></div>'
    return html
}

function getStockFee() {
    let fee = 0.003
    if (hasMilestone("stock", 1)) fee = 0.0015
    if (hasUpgrade("stock", 31)) fee = 0.00075
    if (hasMilestone("stock", 5)) fee = Math.max(fee, 0.0005)
    return fee
}

function buyStock(code) {
    let p = player.stock, fee = getStockFee()
    let price = p.prices[code], cost = price.times(1 + fee)
    if (p.capital.lt(cost)) return
    p.capital = p.capital.sub(cost)
    let oldH = p.holdings[code], oldAvg = p.avgPrices[code]
    let totalCost = oldAvg.times(oldH).add(price)
    p.holdings[code] = oldH.add(1)
    p.avgPrices[code] = totalCost.div(p.holdings[code])
}

function sellStock(code) {
    let p = player.stock, fee = getStockFee()
    let price = p.prices[code], income = price.times(1 - fee)
    if (p.holdings[code].lt(1)) return
    p.capital = p.capital.add(income)
    p.holdings[code] = p.holdings[code].sub(1)
    if (p.holdings[code].lte(0)) p.avgPrices[code] = new Decimal(0)
}

addLayer("stock", {
    name: "股票大亨",
    symbol: "📈",
    position: 0,
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            capital: new Decimal(250),
            holdings: { G001: new Decimal(0), G002: new Decimal(0), G003: new Decimal(0), G004: new Decimal(0), G005: new Decimal(0) },
            avgPrices: { G001: new Decimal(0), G002: new Decimal(0), G003: new Decimal(0), G004: new Decimal(0), G005: new Decimal(0) },
            prices: { G001: new Decimal(20), G002: new Decimal(8), G003: new Decimal(5), G004: new Decimal(15), G005: new Decimal(3) },
            theoPrices: { G001: new Decimal(20), G002: new Decimal(8), G003: new Decimal(5), G004: new Decimal(15), G005: new Decimal(3) },
            charts: { G001: [], G002: [], G003: [], G004: [], G005: [] },
            tickCount: 0,
            events: [],
            _tickAccum: 0,
            _cycleState: { G004: "bull" },
            _consCount: { G001: 0, G002: 0, G003: 0, G004: 0, G005: 0 },
            _trendDir: { G005: 1 },
            _trendTimer: { G005: 50 },
            _cycleTimer: { G004: 150 },
        }
    },
    color: "#00BFA5",
    resource: "股票",
    type: "none",
    row: 2,

    layerShown() {
        return player.on && player.on.unlockedGames && player.on.unlockedGames["stock"] === true
    },

    update(diff) {
        if (!player[this.layer].unlocked) return
        let p = player[this.layer]
        if (p._tickAccum === undefined) p._tickAccum = 0
        p._tickAccum += diff

        let tickMs = 2.5
        let updated = false
        while (p._tickAccum >= tickMs) {
            p._tickAccum -= tickMs
            this._doStockTick(p)
            updated = true
        }
    },

    _doStockTick(p) {
        let defs = getStockDefs()
        p.tickCount = (p.tickCount || 0) + 1
        let tc = p.tickCount

        if (!p._cycleState) p._cycleState = { G004: "bull" }
        if (!p._cycleTimer) p._cycleTimer = { G004: 150 }
        if (!p._consCount) p._consCount = { G001: 0, G002: 0, G003: 0, G004: 0, G005: 0 }
        if (!p._trendDir) p._trendDir = { G005: 1 }
        if (!p._trendTimer) p._trendTimer = { G005: 50 }
        if (!p.events) p.events = []

        for (let code in defs) {
            let d = defs[code]
            let price = p.prices[code]
            let theoPrice = p.theoPrices[code]
            let trendVal = 0
            if (d.reversal === "cycle") {
                p._cycleTimer[code] = (p._cycleTimer[code] || 150) - 1
                if (p._cycleTimer[code] <= 0) {
                    if (p._cycleState[code] === "bull") {
                        p._cycleState[code] = "bear"
                        p._cycleTimer[code] = Math.floor(Math.random() * (d.cycleMax - d.cycleMin) + d.cycleMin)
                    } else {
                        p._cycleState[code] = "bull"
                        p._cycleTimer[code] = Math.floor(Math.random() * (d.cycleMax - d.cycleMin) + d.cycleMin)
                    }
                }
                trendVal = p._cycleState[code] === "bull" ? d.cycleBullTrend : d.cycleBearTrend
            } else if (d.reversal === "extreme") {
                p._trendTimer[code] = (p._trendTimer[code] || 50) - 1
                if (p._trendTimer[code] <= 0) {
                    p._trendDir[code] = Math.random() < 0.5 ? 1 : -1
                    p._trendTimer[code] = Math.floor(Math.random() * 50 + 30)
                }
                if (Math.random() < d.trendFlipChance) {
                    p._trendDir[code] *= -1
                }
                trendVal = 0.0008 * p._trendDir[code] * (0.5 + Math.random() * 1.0)
            } else {
                trendVal = d.trend
            }
            let noise = (Math.random() * 2 - 1) * d.volatility
            let meanRev = 0
            let deviation = price.sub(theoPrice).div(theoPrice).toNumber()
            if (d.reversal !== "extreme") {
                if (Math.abs(deviation) > d.meanRevThreshold) {
                    meanRev = -deviation * d.meanRevStrength
                }
            }
            let eventEffect = 0
            let eventName = ""
            if (Math.random() < d.eventChance) {
                let r = Math.random()
                let cum = 0
                for (let e of d.events) {
                    cum += e.chance
                    if (r < cum) {
                        eventEffect = e.effect
                        eventName = e.name
                        break
                    }
                }
            }
            let reversalEffect = 0
            if (d.reversal === "strong" || d.reversal === "extreme") {
                if (d.spikeThreshold && Math.abs(eventEffect + noise + trendVal) > d.spikeThreshold) {
                    if (Math.random() < d.spikeReversalChance) {
                        let reversal = (eventEffect + noise + trendVal) * d.spikeReversalRatio
                        reversalEffect = -reversal * (0.5 + Math.random() * 0.5)
                    }
                }
            }
            if (d.maxConsecutiveUp && d.consUpReversalChance) {
                let delta = trendVal + noise + eventEffect
                if (delta > 0) {
                    p._consCount[code] = (p._consCount[code] || 0) + 1
                } else {
                    p._consCount[code] = 0
                }
                if (p._consCount[code] >= d.maxConsecutiveUp) {
                    if (Math.random() < d.consUpReversalChance) {
                        reversalEffect = d.consUpReversalEffect * (0.5 + Math.random() * 0.5)
                        p._consCount[code] = 0
                        if (!eventName) eventName = "连续上涨后回调"
                    }
                }
            }
            if (d.reversal === "medium" && d.maxConsecutiveUp) {
                let delta = trendVal + noise + eventEffect
                if (delta > 0) {
                    p._consCount[code] = (p._consCount[code] || 0) + 1
                } else {
                    p._consCount[code] = 0
                }
                if (p._consCount[code] >= d.maxConsecutiveUp && Math.random() < 0.15) {
                    reversalEffect = -Math.abs(noise * 2 + 0.03)
                    p._consCount[code] = 0
                    if (!eventName) eventName = "获利回吐"
                }
            }

            if (d.bailoutPrice && price.lte(d.bailoutPrice)) {
                eventEffect = d.bailoutEffect
                eventName = "重组利好！"
            }
            let delta = trendVal + noise + meanRev + eventEffect + reversalEffect
            let newPrice = price.times(1 + delta)
            if (newPrice.lt(0.01)) newPrice = new Decimal(0.01)
            let oldPrice = price.toNumber()
            p.prices[code] = newPrice
            if (d.reversal !== "extreme") {
                p.theoPrices[code] = p.theoPrices[code].times(1 + trendVal)
            } else {
                p.theoPrices[code] = newPrice
            }

            let chart = p.charts[code]
            if (!chart) chart = p.charts[code] = []
            let newOpen = oldPrice
            let newClose = newPrice.toNumber()
            let newHigh = Math.max(newOpen, newClose)
            let newLow = Math.min(newOpen, newClose)
            chart.push({ open: newOpen, close: newClose, high: newHigh, low: newLow, time: Date.now() })
            if (chart.length > 60) chart.shift()
            if (eventName) {
                let dir = eventEffect > 0 ? "📈" : "📉"
                let pct = (Math.abs(eventEffect) * 100).toFixed(1)
                p.events.unshift(dir + " [" + d.name + "] " + eventName + " " + (eventEffect >= 0 ? "+" : "") + pct + "%")
                if (p.events.length > 20) p.events.pop()
            }
        }
    },

    getCapital() {
        return player[this.layer].capital
    },
    getTotalAsset() {
        let p = player[this.layer]
        let total = p.capital
        for (let code in p.holdings) {
            total = total.add(p.holdings[code].times(p.prices[code]))
        }
        return total
    },
    getProfit() {
        let total = this.getTotalAsset()
        let invested = new Decimal(250)
        if (total.gt(0)) return total.sub(invested).div(invested).times(100)
        return new Decimal(0)
    },

    tabFormat: {
        "行情": {
            content: [
                ["display-text", function () {
                    let p = player.stock
                    if (!p || !p.unlocked) return '<div style="text-align:center;padding:40px;color:#aaa">请先在在线层解锁股票大亨</div>'
                    let capital = format(p.capital)
                    let totalAsset = format(layers.stock.getTotalAsset())
                    let profit = layers.stock.getProfit()
                    let profitColor = profit.gte(0) ? "#4CAF50" : "#F44336"
                    let profitSign = profit.gte(0) ? "+" : ""
                    return '<div style="display:flex;justify-content:space-around;padding:8px 0;font-size:13px">' +
                        '<span>💰 资金: <b>' + capital + '</b></span>' +
                        '<span>📊 总资产: <b>' + totalAsset + '</b></span>' +
                        '<span style="color:' + profitColor + '">📈 收益: <b>' + profitSign + format(profit) + '%</b></span>' +
                        '</div>'
                }],
                ["display-text", function () {
                    let p = player.stock
                    if (!p || !p.unlocked) return ""
                    let defs = getStockDefs()
                    let html = '<div style="font-size:12px">'
                    html += '<table style="width:100%;border-collapse:collapse">'
                    html += '<tr style="color:#aaa;font-size:10px"><th>代码</th><th>现价</th><th>涨跌</th><th>K线</th><th>操作</th></tr>'
                    for (let code in defs) {
                        let d = defs[code]
                        let price = p.prices[code] || d.initPrice
                        let prevClose = p.charts[code] && p.charts[code].length > 0 ? new Decimal(p.charts[code][p.charts[code].length - 1].open) : price
                        let change = price.sub(prevClose)
                        let changePct = prevClose.gt(0) ? change.div(prevClose).times(100) : new Decimal(0)
                        let color = change.gte(0) ? "#4CAF50" : "#F44336"
                        let arrow = change.gte(0) ? "▲" : "▼"
                        let holdings = p.holdings[code] || new Decimal(0)
                        html += '<tr style="border-bottom:1px solid rgba(255,255,255,0.06)">'
                        html += '<td style="padding:4px">' + d.icon + '<br><small>' + d.name + '</small></td>'
                        html += '<td style="padding:4px;text-align:center"><b>' + format(price) + '</b></td>'
                        html += '<td style="padding:4px;text-align:center;color:' + color + '">' + arrow + ' ' + format(changePct) + '%</td>'
                        html += '<td style="padding:2px">' + drawCandleChart(code) + '</td>'
                        html += '<td style="padding:4px;font-size:10px;text-align:center">持' + format(holdings, 0) + '股</td></tr>'
                    }
                    html += '</table></div>'
                    return html
                }],
                "blank",
                "clickables",
            ]
        },
        "持仓": {
            content: [
                ["display-text", function () {
                    let p = player.stock
                    if (!p || !p.unlocked) return ""
                    let capital = format(p.capital)
                    let totalAsset = format(layers.stock.getTotalAsset())
                    return '<div style="padding:8px;font-size:13px">💰 资金: <b>' + capital + '</b> | 📊 总资产: <b>' + totalAsset + '</b></div>'
                }],
                ["display-text", function () {
                    let p = player.stock
                    if (!p || !p.unlocked) return ""
                    let defs = getStockDefs()
                    let hasHoldings = false
                    let html = '<div style="font-size:12px">'
                    for (let code in defs) {
                        let h = p.holdings[code] || new Decimal(0)
                        if (h.gt(0)) {
                            hasHoldings = true
                            let d = defs[code]
                            let price = p.prices[code]
                            let avgPrice = p.avgPrices[code] || new Decimal(0)
                            let pnl = price.sub(avgPrice).times(h)
                            let pnlColor = pnl.gte(0) ? "#4CAF50" : "#F44336"
                            html += '<div style="margin:6px 0;padding:6px;border:1px solid rgba(255,255,255,0.1);border-radius:6px">'
                            html += d.icon + ' <b>' + d.name + '</b><br>'
                            html += format(h, 0) + '股 × ' + format(price) + ' = ' + format(h.times(price))
                            if (avgPrice.gt(0)) {
                                html += '<br>均价: ' + format(avgPrice) + ' | 盈亏: <span style="color:' + pnlColor + '">' + (pnl.gte(0) ? '+' : '') + format(pnl) + '</span>'
                            }
                            html += '</div>'
                        }
                    }
                    if (!hasHoldings) html += '<div style="text-align:center;color:#888;padding:20px">暂无持仓<br>在「行情」标签中选择股票买入</div>'
                    html += '</div>'
                    return html
                }],
            ]
        },
        "快讯": {
            content: [
                ["display-text", function () {
                    let p = player.stock
                    if (!p || !p.unlocked || !p.events || p.events.length === 0) return '<div style="text-align:center;color:#888;padding:20px">暂无市场快讯</div>'
                    let html = '<div style="font-size:12px;max-height:400px;overflow-y:auto">'
                    for (let i = 0; i < Math.min(p.events.length, 30); i++) {
                        let ev = p.events[i]
                        let color = ev.includes("📈") ? "#4CAF50" : "#F44336"
                        html += '<div style="color:' + color + ';margin:3px 0;padding:4px;border-bottom:1px solid rgba(255,255,255,0.04)">' + ev + '</div>'
                    }
                    html += '</div>'
                    return html
                }],
            ]
        },
        "升级": {
            content: ["upgrades"]
        },
        "里程碑": {
            content: ["milestones"]
        },
    },

    milestones: {
        0: {
            requirementDescription: "总资产达到 500",
            effectDescription: "解锁「市场快讯」标签页",
            done() { return layers.stock.getTotalAsset().gte(500) },
        },
        1: {
            requirementDescription: "总资产达到 2,000",
            effectDescription: "交易手续费减半 (0.3%→0.15%)",
            done() { return layers.stock.getTotalAsset().gte(2000) },
        },
        2: {
            requirementDescription: "总资产达到 10,000",
            effectDescription: "解锁杠杆交易（最高 1.5 倍）",
            done() { return layers.stock.getTotalAsset().gte(10000) },
        },
        3: {
            requirementDescription: "总资产达到 100,000",
            effectDescription: "解锁第 6 只神秘股票",
            done() { return layers.stock.getTotalAsset().gte(100000) },
        },
        4: {
            requirementDescription: "总资产达到 500,000",
            effectDescription: "解锁自动交易机器人",
            done() { return layers.stock.getTotalAsset().gte(500000) },
        },
        5: {
            requirementDescription: "总资产达到 1,000,000",
            effectDescription: "解锁做空机制，手续费降至最低 0.05%",
            done() { return layers.stock.getTotalAsset().gte(1000000) },
        },
    },

    upgrades: {
        11: {
            title: "📊 基础分析",
            description: "显示每只股票的 K 线图",
            cost: new Decimal(100),
            currencyInternalName: "capital",
            currencyLayer: "stock",
            currencyLocation() { return player.stock },
            canAfford() { return player.stock.capital.gte(100) },
            pay() { player.stock.capital = player.stock.capital.sub(100) },
        },
        12: {
            title: "📰 资讯订阅",
            description: "重大事件提前 3 秒预告",
            cost: new Decimal(500),
            currencyInternalName: "capital",
            currencyLayer: "stock",
            currencyLocation() { return player.stock },
            canAfford() { return player.stock.capital.gte(500) },
            pay() { player.stock.capital = player.stock.capital.sub(500) },
        },
        21: {
            title: "📐 量化工具",
            description: "解锁止盈止损设置",
            cost: new Decimal(2000),
            currencyInternalName: "capital",
            currencyLayer: "stock",
            currencyLocation() { return player.stock },
            unlocked() { return hasUpgrade("stock", 11) },
            canAfford() { return player.stock.capital.gte(2000) },
            pay() { player.stock.capital = player.stock.capital.sub(2000) },
        },
        22: {
            title: "🔬 深度研究",
            description: "显示每只股票的趋势方向提示",
            cost: new Decimal(10000),
            currencyInternalName: "capital",
            currencyLayer: "stock",
            currencyLocation() { return player.stock },
            unlocked() { return hasUpgrade("stock", 12) },
            canAfford() { return player.stock.capital.gte(10000) },
            pay() { player.stock.capital = player.stock.capital.sub(10000) },
        },
        31: {
            title: "⚡ 闪电交易",
            description: "交易手续费再减半 (0.15%→0.075%)",
            cost: new Decimal(50000),
            currencyInternalName: "capital",
            currencyLayer: "stock",
            currencyLocation() { return player.stock },
            unlocked() { return hasUpgrade("stock", 21) },
            canAfford() { return player.stock.capital.gte(50000) },
            pay() { player.stock.capital = player.stock.capital.sub(50000) },
        },
    },

    achievements: {},

    clickables: {
        11: {
            title: "🟢 买入 鼎盛金融",
            display() {
                let p = player.stock, code = "G001"
                let price = p.prices[code], fee = getStockFee()
                return "价格: " + format(price) + " | 手续费: " + (fee * 100).toFixed(2) + "%<br>总成本: " + format(price.times(1 + fee)) + " | 资金: " + format(p.capital)
            },
            canClick() { let p = player.stock; return p.capital.gte(p.prices["G001"].times(1.003)) },
            onClick() { buyStock("G001") },
            style: { "border-color": "#4CAF50" },
        },
        12: {
            title: "🔴 卖出 鼎盛金融",
            display() {
                let p = player.stock, code = "G001"
                return "价格: " + format(p.prices[code]) + " | 持有: " + format(p.holdings[code], 0) + "股<br>到手: " + format(p.prices[code].times(1 - getStockFee()))
            },
            canClick() { return player.stock.holdings["G001"].gte(1) },
            onClick() { sellStock("G001") },
            style: { "border-color": "#F44336" },
        },
        21: {
            title: "💻 买入 凌云科技",
            display() {
                let p = player.stock, code = "G002", fee = getStockFee()
                return "价格: " + format(p.prices[code]) + " | 手续费: " + (fee * 100).toFixed(2) + "%<br>总成本: " + format(p.prices[code].times(1 + fee)) + " | 资金: " + format(p.capital)
            },
            canClick() { let p = player.stock; return p.capital.gte(p.prices["G002"].times(1.003)) },
            onClick() { buyStock("G002") },
            style: { "border-color": "#4CAF50" },
        },
        22: {
            title: "🔴 卖出 凌云科技",
            display() {
                let p = player.stock, code = "G002"
                return "价格: " + format(p.prices[code]) + " | 持有: " + format(p.holdings[code], 0) + "股<br>到手: " + format(p.prices[code].times(1 - getStockFee()))
            },
            canClick() { return player.stock.holdings["G002"].gte(1) },
            onClick() { sellStock("G002") },
            style: { "border-color": "#F44336" },
        },
        31: {
            title: "🔬 买入 瀚海医药",
            display() {
                let p = player.stock, code = "G003", fee = getStockFee()
                return "价格: " + format(p.prices[code]) + " | 手续费: " + (fee * 100).toFixed(2) + "%<br>总成本: " + format(p.prices[code].times(1 + fee)) + " | 资金: " + format(p.capital)
            },
            canClick() { let p = player.stock; return p.capital.gte(p.prices["G003"].times(1.003)) },
            onClick() { buyStock("G003") },
            style: { "border-color": "#4CAF50" },
        },
        32: {
            title: "🔴 卖出 瀚海医药",
            display() {
                let p = player.stock, code = "G003"
                return "价格: " + format(p.prices[code]) + " | 持有: " + format(p.holdings[code], 0) + "股<br>到手: " + format(p.prices[code].times(1 - getStockFee()))
            },
            canClick() { return player.stock.holdings["G003"].gte(1) },
            onClick() { sellStock("G003") },
            style: { "border-color": "#F44336" },
        },
        41: {
            title: "🔋 买入 天域半导体",
            display() {
                let p = player.stock, code = "G004", fee = getStockFee()
                return "价格: " + format(p.prices[code]) + " | 手续费: " + (fee * 100).toFixed(2) + "%<br>总成本: " + format(p.prices[code].times(1 + fee)) + " | 资金: " + format(p.capital)
            },
            canClick() { let p = player.stock; return p.capital.gte(p.prices["G004"].times(1.003)) },
            onClick() { buyStock("G004") },
            style: { "border-color": "#4CAF50" },
        },
        42: {
            title: "🔴 卖出 天域半导体",
            display() {
                let p = player.stock, code = "G004"
                return "价格: " + format(p.prices[code]) + " | 持有: " + format(p.holdings[code], 0) + "股<br>到手: " + format(p.prices[code].times(1 - getStockFee()))
            },
            canClick() { return player.stock.holdings["G004"].gte(1) },
            onClick() { sellStock("G004") },
            style: { "border-color": "#F44336" },
        },
        51: {
            title: "⛏️ 买入 寰宇矿业",
            display() {
                let p = player.stock, code = "G005", fee = getStockFee()
                return "价格: " + format(p.prices[code]) + " | 手续费: " + (fee * 100).toFixed(2) + "%<br>总成本: " + format(p.prices[code].times(1 + fee)) + " | 资金: " + format(p.capital)
            },
            canClick() { let p = player.stock; return p.capital.gte(p.prices["G005"].times(1.003)) },
            onClick() { buyStock("G005") },
            style: { "border-color": "#4CAF50" },
        },
        52: {
            title: "🔴 卖出 寰宇矿业",
            display() {
                let p = player.stock, code = "G005"
                return "价格: " + format(p.prices[code]) + " | 持有: " + format(p.holdings[code], 0) + "股<br>到手: " + format(p.prices[code].times(1 - getStockFee()))
            },
            canClick() { return player.stock.holdings["G005"].gte(1) },
            onClick() { sellStock("G005") },
            style: { "border-color": "#F44336" },
        },
    },
})
