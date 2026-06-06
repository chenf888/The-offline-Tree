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
        let mult = new Decimal(1)
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
    let show = chart.slice(-16)
    let maxV = 0, minV = Infinity
    for (let c of show) { maxV = Math.max(maxV, c.high); minV = Math.min(minV, c.low) }
    if (maxV === minV) maxV = minV + 1
    let scale = 50 / (maxV - minV)
    let html = '<svg width="100%" height="56" xmlns="http://www.w3.org/2000/svg">'
    for (let i = 0; i < show.length; i++) {
        let c = show[i]
        let x = i * 6 + 3
        let isUp = c.close >= c.open
        let color = isUp ? "#4CAF50" : "#F44336"
        let openY = 52 - (c.open - minV) * scale
        let closeY = 52 - (c.close - minV) * scale
        let highY = 52 - (c.high - minV) * scale
        let lowY = 52 - (c.low - minV) * scale
        html += '<line x1="' + x + '" y1="' + highY + '" x2="' + x + '" y2="' + lowY + '" stroke="' + color + '" stroke-width="1"/>'
        html += '<rect x="' + (x - 2) + '" y="' + Math.min(openY, closeY) + '" width="3" height="' + Math.max(1, Math.abs(openY - closeY)) + '" fill="' + color + '"/>'
    }
    html += '</svg>'
    return html
}

function getStockFee() {
    let fee = 0.003
    if (hasMilestone("stock", 1)) fee = 0.0015
    if (hasUpgrade("stock", 31)) fee = 0.00075
    if (hasMilestone("stock", 5)) fee = Math.max(fee, 0.0005)
    return fee
}

function buyStock(code, qty) {
    let p = player.stock, fee = getStockFee()
    qty = qty || 1
    let price = p.prices[code], cost = price.times(1 + fee).times(qty)
    if (p.capital.lt(cost)) return
    p.capital = p.capital.sub(cost)
    let oldH = p.holdings[code], oldAvg = p.avgPrices[code]
    let totalCost = oldAvg.times(oldH).add(price.times(qty))
    p.holdings[code] = oldH.add(qty)
    p.avgPrices[code] = totalCost.div(p.holdings[code])
    p.totalTrades = (p.totalTrades || 0) + 1
}

function sellStock(code, qty) {
    let p = player.stock, fee = getStockFee()
    qty = qty || 1
    let price = p.prices[code], income = price.times(1 - fee).times(qty)
    if (p.holdings[code].lt(qty)) return
    p.capital = p.capital.add(income)
    p.holdings[code] = p.holdings[code].sub(qty)
    if (p.holdings[code].lte(0)) p.avgPrices[code] = new Decimal(0)
    p.totalTrades = (p.totalTrades || 0) + 1
}

function checkStockUnlock() {
    let p = player.stock, asset = layers.stock.getTotalAsset()
    if (p._stockVersion !== 2) {
        p.unlockedStocks = { G001: true, G002: false, G003: false, G004: false, G005: false }
        p._stockVersion = 2
        p._unlockNotified = {}
    }
    if (!p.unlockedStocks) {
        p.unlockedStocks = { G001: true, G002: false, G003: false, G004: false, G005: false }
    }
    if (!p._unlockNotified) p._unlockNotified = {}
    let thresholds = { G002: 1000, G003: 5000, G004: 25000, G005: 100000 }
    let names = { G002: "凌云数字科技", G003: "瀚海生物医药", G004: "天域半导体科技", G005: "寰宇矿业集团" }
    for (let code in thresholds) {
        if (!p.unlockedStocks[code] && asset.gte(thresholds[code])) {
            p.unlockedStocks[code] = true
            if (!p._unlockNotified[code]) { p._unlockNotified[code] = true; p.events.unshift("🔓 解锁" + names[code] + "！") }
        }
    }
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
            batchSize: 1,
            unlockedStocks: { G001: true, G002: false, G003: false, G004: false, G005: false },
            _stockVersion: 2,
            totalTrades: 0,
            stopLoss: -1,
            takeProfit: -1,
            eventPreview: null,
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
    resource: "资金",
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
        checkStockUnlock()
        if (hasUpgrade("stock", 21) && (p.stopLoss > 0 || p.takeProfit > 0)) {
            for (let code in p.holdings) {
                let h = p.holdings[code], price = p.prices[code], avg = p.avgPrices[code]
                if (h.lte(0) || avg.lte(0)) continue
                let pct = price.sub(avg).div(avg).times(100).toNumber()
                if (p.stopLoss > 0 && pct <= -p.stopLoss) { sellStock(code, h.toNumber()) }
                else if (p.takeProfit > 0 && pct >= p.takeProfit) { sellStock(code, h.toNumber()) }
            }
        }
    },

    automate() {
        let p = player.stock
        if (!p || !p.unlocked) return
        if (hasMilestone("stock", 4)) {
            for (let code in p.unlockedStocks) {
                if (!p.unlockedStocks[code]) continue
                let price = p.prices[code], bs = p.batchSize || 1, fee = getStockFee()
                if (p.capital.gte(price.times(1 + fee).times(bs))) { buyStock(code, bs); break }
            }
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
                let msg = dir + " [" + d.name + "] " + eventName + " " + (eventEffect >= 0 ? "+" : "") + pct + "%"
                if (hasUpgrade("stock", 12)) {
                    p.eventPreview = { msg: msg, code: code, ticks: 6 }
                } else {
                    p.events.unshift(msg)
                    if (p.events.length > 20) p.events.pop()
                }
            }
            // 推送预告到期的事件
            if (p.eventPreview) {
                p.eventPreview.ticks--
                if (p.eventPreview.ticks <= 0) {
                    p.events.unshift("⏰ " + p.eventPreview.msg)
                    if (p.events.length > 20) p.events.pop()
                    p.eventPreview = null
                }
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
                    if (!p || !p.unlocked) return '<div style="text-align:center;padding:50px 20px;color:#8899AA;font-size:14px">🔒 请先在「在线」层解锁股票大亨</div>'
                    let capital = format(p.capital)
                    let totalAsset = format(layers.stock.getTotalAsset())
                    let profit = layers.stock.getProfit()
                    let pc = profit.gte(0) ? "#00E676" : "#FF5252"
                    let ps = profit.gte(0) ? "+" : ""
                    let bs = p.batchSize || 1
                    let ulCount = 0, totalStocks = 5
                    if (p.unlockedStocks) for (let c in p.unlockedStocks) if (p.unlockedStocks[c]) ulCount++
                    let canBatch = hasMilestone("stock", 2)
                    return '<div style="display:flex;gap:1px;background:rgba(255,255,255,0.04);border-radius:10px;overflow:hidden;margin:2px 0 8px">' +
                        '<div style="flex:1;text-align:center;padding:8px 6px"><span style="font-size:9px;color:#667788">💰资金</span> <b style="font-size:14px;color:#DDD">' + capital + '</b></div>' +
                        '<div style="flex:1;text-align:center;padding:8px 6px;border-left:1px solid rgba(255,255,255,0.04)"><span style="font-size:9px;color:#667788">📊总资产</span> <b style="font-size:14px;color:#DDD">' + totalAsset + '</b></div>' +
                        '<div style="flex:1;text-align:center;padding:8px 6px;border-left:1px solid rgba(255,255,255,0.04)"><span style="font-size:9px;color:#667788">📈收益率</span> <b style="font-size:14px;color:' + pc + '">' + ps + format(profit) + '%</b></div>' +
                        '<div style="flex:1;text-align:center;padding:8px 6px;border-left:1px solid rgba(255,255,255,0.04)"><span style="font-size:9px;color:#667788">🔓解锁</span> <b style="font-size:14px;color:#FFD54F">' + ulCount + '/' + totalStocks + '</b></div>' +
                        (canBatch ? '<div style="flex:1;text-align:center;padding:8px 6px;border-left:1px solid rgba(255,255,255,0.04)"><span style="font-size:9px;color:#667788">📦批量</span> <b style="font-size:14px;color:#80CBC4">' + bs + '股/次</b></div>' : '') +
                        '</div>'
                }],
                ["display-text", function () {
                    let p = player.stock
                    if (!p || !p.unlocked) return ""
                    let defs = getStockDefs()
                    let fee = getStockFee(), bs = p.batchSize || 1, hasK = hasUpgrade("stock", 11), hasTr = hasUpgrade("stock", 22)
                    let codes = ["G001", "G002", "G003", "G004", "G005"]
                    let thresholds = { G002: 1000, G003: 5000, G004: 25000, G005: 100000 }
                    let names = { G002: "凌云数字科技", G003: "瀚海生物医药", G004: "天域半导体科技", G005: "寰宇矿业集团" }
                    let nextCode = "", nextName = "", nextTh = 0
                    for (let i = 0; i < codes.length; i++) {
                        let c = codes[i]
                        if (c === "G001") continue
                        if (p.unlockedStocks && p.unlockedStocks[c]) continue
                        nextCode = c; nextName = names[c]; nextTh = thresholds[c]; break
                    }
                    let allUnlocked = !nextCode
                    let html = ''
                    for (let idx = 0; idx < codes.length; idx++) {
                        let code = codes[idx], d = defs[code]
                        let isUnlocked = p.unlockedStocks && p.unlockedStocks[code]
                        if (!isUnlocked) continue
                        let price = p.prices[code] || new Decimal(d.initPrice)
                        let chart = p.charts[code]
                        let prevClose = chart && chart.length > 0 ? new Decimal(chart[chart.length - 1].open) : price
                        let change = price.sub(prevClose)
                        let changePct = prevClose.gt(0) ? change.div(prevClose).times(100) : new Decimal(0)
                        let isUp = change.gte(0), accent = isUp ? "#00E676" : "#FF5252"
                        let holdings = p.holdings[code] || new Decimal(0), mv = holdings.times(price)
                        let canBuy = p.capital.gte(price.times(1 + fee).times(bs)), canSell = holdings.gte(bs)
                        let buyLabel = bs > 1 ? ('买'+bs+'股') : '买入'
                        let sellLabel = bs > 1 ? ('卖'+bs+'股') : '卖出'
                        html += '<div style="background:linear-gradient(135deg,rgba(20,22,28,0.9),rgba(24,26,34,0.9));border:1px solid rgba(255,255,255,0.08);border-left:3px solid ' + accent + ';border-radius:10px;padding:12px 14px 10px;margin-bottom:8px">'
                        html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">'
                        html += '<div style="display:flex;align-items:center;gap:10px;min-width:0">'
                        html += '<span style="font-size:26px;flex-shrink:0">' + d.icon + '</span>'
                        html += '<div style="min-width:0"><div style="font-weight:700;font-size:13px;color:#E8E8E8">' + d.name + '</div>'
                        html += '<span style="display:inline-block;font-size:9px;padding:2px 8px;border-radius:10px;background:rgba(255,255,255,0.05);color:#8899AA;margin-top:2px">' + d.tag + '</span></div>'
                        html += '</div>'
                        html += '<div style="text-align:right;flex-shrink:0"><div style="font-size:18px;font-weight:800;color:#FFF;font-family:monospace">' + format(price) + '</div>'
                        html += '<div style="font-size:12px;font-weight:600;color:' + accent + '">' + (isUp ? "▲" : "▼") + ' ' + format(changePct) + '%</div></div>'
                        html += '</div>'
                        if (hasTr) {
                            let trendHtml = ''
                            if (d.reversal === "cycle") {
                                let dirTxt = p._cycleState && p._cycleState[code] === "bull" ? "🐂 牛市" : "🐻 熊市"
                                trendHtml = '<span style="font-size:9px;color:#8899AA">📐 ' + dirTxt + '</span>'
                            } else if (d.reversal === "extreme") {
                                trendHtml = '<span style="font-size:9px;color:#8899AA">📐 随机游走</span>'
                            } else {
                                let t = d.trend
                                trendHtml = '<span style="font-size:9px;color:#8899AA">📐 ' + (t > 0 ? '温和看涨' : t < -0.0001 ? '温和看跌' : '横盘') + '</span>'
                            }
                            html += '<div style="margin-bottom:4px">' + trendHtml + '</div>'
                        }
                        if (hasK) {
                            html += '<div style="background:rgba(0,0,0,0.2);border-radius:8px;padding:4px 6px;margin-bottom:6px;overflow:hidden">'
                            html += drawCandleChart(code)
                            html += '</div>'
                        }
                        html += '<div style="display:flex;align-items:center;gap:8px;font-size:10px">'
                        html += '<span style="color:#667788;flex:1">📦持仓 <b style="color:#BBB">' + format(holdings, 0) + '</b>股 · 市值 <b style="color:#BBB">' + format(mv) + '</b></span>'
                        html += '<button onclick="buyStock(\'' + code + '\',player.stock.batchSize)" style="border:none;border-radius:6px;padding:5px 12px;font-size:11px;font-weight:600;cursor:pointer;' + (canBuy ? 'background:#00E67633;color:#00E676;' : 'background:rgba(255,255,255,0.04);color:#555;cursor:default;') + '" ' + (canBuy ? '' : 'disabled') + '>' + buyLabel + '</button>'
                        html += '<button onclick="sellStock(\'' + code + '\',player.stock.batchSize)" style="border:none;border-radius:6px;padding:5px 12px;font-size:11px;font-weight:600;cursor:pointer;' + (canSell ? 'background:#FF525233;color:#FF5252;' : 'background:rgba(255,255,255,0.04);color:#555;cursor:default;') + '" ' + (canSell ? '' : 'disabled') + '>' + sellLabel + '</button>'
                        html += '</div></div>'
                    }
                    if (!allUnlocked) {
                        let asset = layers.stock.getTotalAsset()
                        let remain = new Decimal(nextTh).sub(asset).max(0)
                        html += '<div style="background:rgba(255,213,79,0.04);border:1px solid rgba(255,213,79,0.10);border-radius:8px;padding:10px 14px;margin-top:4px;text-align:center;font-size:11px;color:#FFD54F">'
                        html += '🔒 下一只股票: <b>' + nextName + '</b> · 需要总资产 <b>' + format(nextTh) + '</b> · 还差 <b>' + format(remain) + '</b></div>'
                    }
                    return html
                }],
            ]
        },
        "持仓": {
            content: [
                ["display-text", function () {
                    let p = player.stock
                    if (!p || !p.unlocked) return ""
                    let capital = format(p.capital)
                    let totalAsset = format(layers.stock.getTotalAsset())
                    let profit = layers.stock.getProfit()
                    let pc = profit.gte(0) ? "#00E676" : "#FF5252"
                    let ps = profit.gte(0) ? "+" : ""
                    let bs = p.batchSize || 1
                    let canBatch = hasMilestone("stock", 2)
                    let html = '<div style="display:flex;gap:1px;background:rgba(255,255,255,0.04);border-radius:10px;overflow:hidden;margin:2px 0 10px">'
                    html += '<div style="flex:1;text-align:center;padding:8px 6px"><span style="font-size:9px;color:#667788">💰资金</span> <b style="font-size:14px;color:#DDD">' + capital + '</b></div>'
                    html += '<div style="flex:1;text-align:center;padding:8px 6px;border-left:1px solid rgba(255,255,255,0.04)"><span style="font-size:9px;color:#667788">📊总资产</span> <b style="font-size:14px;color:#DDD">' + totalAsset + '</b></div>'
                    html += '<div style="flex:1;text-align:center;padding:8px 6px;border-left:1px solid rgba(255,255,255,0.04)"><span style="font-size:9px;color:#667788">📈总收益</span> <b style="font-size:14px;color:' + pc + '">' + ps + format(profit) + '%</b></div>'
                    if (canBatch) {
                        html += '<div style="flex:1.4;display:flex;align-items:center;justify-content:center;gap:6px;padding:4px 6px;border-left:1px solid rgba(255,255,255,0.04)">'
                        html += '<span style="font-size:9px;color:#667788;flex-shrink:0">📦批量</span>'
                        html += '<button onclick="player.stock.batchSize=Math.max(1,(player.stock.batchSize||1)-1)" style="border:none;border-radius:5px;padding:3px 10px;font-size:13px;font-weight:700;background:rgba(255,255,255,0.06);color:#AAA;cursor:pointer;line-height:1">−</button>'
                        html += '<b style="font-size:14px;color:#80CBC4;min-width:36px;text-align:center">' + bs + '</b>'
                        html += '<button onclick="player.stock.batchSize=Math.min(10,(player.stock.batchSize||1)+1)" style="border:none;border-radius:5px;padding:3px 10px;font-size:13px;font-weight:700;background:rgba(255,255,255,0.06);color:#AAA;cursor:pointer;line-height:1">+</button>'
                        html += '</div>'
                    }
                    html += '</div>'
                    return html
                }],
                ["display-text", function () {
                    let p = player.stock
                    if (!p || !p.unlocked) return ""
                    let defs = getStockDefs(), hasHoldings = false, html = ''
                    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">'
                    for (let code in defs) {
                        let h = p.holdings[code] || new Decimal(0)
                        if (!h.gt(0)) continue
                        hasHoldings = true
                        let d = defs[code], price = p.prices[code], avgPrice = p.avgPrices[code] || new Decimal(0)
                        let mv = h.times(price), cb = avgPrice.gt(0) ? avgPrice.times(h) : new Decimal(0)
                        let pnl = avgPrice.gt(0) ? price.sub(avgPrice).times(h) : new Decimal(0)
                        let pct = cb.gt(0) ? pnl.div(cb).times(100) : new Decimal(0)
                        let up = pnl.gte(0), ac = up ? "#00E676" : "#FF5252", sn = up ? "+" : ""
                        html += '<div style="background:linear-gradient(135deg,rgba(20,22,28,0.9),rgba(24,26,34,0.9));border:1px solid rgba(255,255,255,0.08);border-left:3px solid ' + ac + ';border-radius:10px;padding:10px">'
                        html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">'
                        html += '<div style="display:flex;align-items:center;gap:8px;min-width:0"><span style="font-size:20px;flex-shrink:0">' + d.icon + '</span>'
                        html += '<div style="min-width:0"><div style="font-weight:700;font-size:12px;color:#DDD;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + d.name + '</div>'
                        html += '<div style="font-size:8px;color:#667788">' + d.tag + '</div></div></div>'
                        html += '<div style="text-align:right;font-size:14px;font-weight:800;color:#FFF;font-family:monospace;flex-shrink:0">' + format(price) + '</div></div>'
                        html += '<div style="font-size:10px;line-height:1.7">'
                        html += '<div style="display:flex;justify-content:space-between"><span style="color:#667788">持仓</span><span style="color:#CCC">' + format(h, 0) + '股</span></div>'
                        html += '<div style="display:flex;justify-content:space-between"><span style="color:#667788">市值</span><span style="color:#CCC">' + format(mv) + '</span></div>'
                        if (avgPrice.gt(0)) {
                            html += '<div style="display:flex;justify-content:space-between"><span style="color:#667788">均价</span><span style="color:#CCC">' + format(avgPrice) + '</span></div>'
                            html += '<div style="display:flex;justify-content:space-between"><span style="color:#667788">盈亏</span><span style="color:' + ac + ';font-weight:600">' + sn + format(pnl) + ' (' + sn + format(pct) + '%)</span></div>'
                        }
                        html += '</div></div>'
                    }
                    html += '</div>'
                    if (!hasHoldings) html += '<div style="text-align:center;padding:30px 20px"><div style="font-size:36px;margin-bottom:8px">📭</div><div style="color:#667788;font-size:12px">暂无持仓 · 前往「行情」开始交易</div></div>'
                    return html
                }],
            ]
        },
        "快讯": {
            unlocked() { return hasMilestone("stock", 0) },
            content: [
                ["display-text", function () {
                    let p = player.stock
                    if (!p || !p.unlocked || !p.events || p.events.length === 0) return '<div style="text-align:center;padding:30px 20px"><div style="font-size:36px;margin-bottom:8px">📰</div><div style="color:#667788;font-size:12px">暂无市场快讯 · 行情波动时自动推送</div></div>'
                    let html = ''
                    if (p.eventPreview) {
                        html += '<div style="background:rgba(255,213,79,0.06);border:1px solid rgba(255,213,79,0.15);border-radius:8px;padding:6px 8px;margin-bottom:6px;font-size:11px;color:#FFD54F">⏳ 预告: ' + p.eventPreview.msg + '</div>'
                    }
                    html += '<div style="font-size:10px;color:#667788;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;padding:0 2px">📋 实时快讯</div>'
                    for (let i = 0; i < Math.min(p.events.length, 30); i++) {
                        let ev = p.events[i], isUp = ev.includes("📈")
                        let color = isUp ? "#00E676" : "#FF5252"
                        let bg = isUp ? "rgba(0,230,118,0.03)" : "rgba(255,82,82,0.03)"
                        html += '<div style="display:flex;align-items:flex-start;gap:8px;padding:6px 8px;margin-bottom:3px;background:' + bg + ';border-left:2px solid ' + color + ';border-radius:0 6px 6px 0;font-size:11px">'
                        html += '<span style="color:' + color + ';line-height:1.4">' + ev + '</span></div>'
                    }
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
            requirementDescription: "解锁 G002 后",
            effectDescription: "解锁批量交易 (batchSize 可调 1~10)",
            done() { let p=player.stock; return p.unlockedStocks && p.unlockedStocks["G002"] },
        },
        3: {
            requirementDescription: "解锁 G003 后",
            effectDescription: "提前解锁第 5 只股票 G005",
            done() { let p=player.stock; return p.unlockedStocks && p.unlockedStocks["G003"] },
            onComplete() { if (player.stock.unlockedStocks) player.stock.unlockedStocks["G005"] = true },
        },
        4: {
            requirementDescription: "总资产达到 50,000",
            effectDescription: "解锁自动交易机器人",
            done() { return layers.stock.getTotalAsset().gte(50000) },
        },
        5: {
            requirementDescription: "总资产达到 1,000,000",
            effectDescription: "手续费降至最低 0.05%",
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
            description: "重大事件提前 3 秒预告 (<b>已生效</b>)",
            cost: new Decimal(500),
            currencyInternalName: "capital",
            currencyLayer: "stock",
            currencyLocation() { return player.stock },
            canAfford() { return player.stock.capital.gte(500) },
            pay() { player.stock.capital = player.stock.capital.sub(500) },
        },
        21: {
            title: "📐 量化工具",
            description: "解锁止盈止损 (<b>已生效</b>，在持仓页设置)",
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
            description: "显示趋势方向提示 (<b>已生效</b>)",
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
            description: "交易手续费再减半 (0.15%→0.075%) (<b>已生效</b>)",
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
})
