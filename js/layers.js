addLayer("o", {
    name: "离线",
    symbol: "O",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4B8DF5",
    requires: new Decimal(10),
    resource: "离线能量",
    baseResource: "离线点数",
    baseAmount() {return player.points},
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
        {key: "o", description: "O: 转换为离线能量", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},

    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        "resource-display",
        ["display-text", function() {
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
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        12: {
            title: "点数 1",
            description: "离线点数获取速度 ×1.5！",
            cost: new Decimal(5),
            effect() {
                return new Decimal(1.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        13: {
            title: "点数 2",
            description: "离线能量让离线点数增长更快！",
            cost: new Decimal(8),
            effect() {
                return player[this.layer].points.add(1).pow(0.2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        21: {
            title: "离线 2",
            description: "使离线能量获取 ×2！",
            cost: new Decimal(25),
            unlocked() { return hasUpgrade(this.layer, 11) },
            effect() {
                return new Decimal(2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        22: {
            title: "点数 3",
            description: "离线点数获取速度 ×2！",
            cost: new Decimal(35),
            unlocked() { return hasUpgrade(this.layer, 12) },
            effect() {
                return new Decimal(2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        23: {
            title: "能量 4",
            description: "离线越多，离线越多！",
            cost: new Decimal(50),
            unlocked() { return hasUpgrade(this.layer, 21) },
            effect() {
                return player[this.layer].points.add(1).pow(0.15)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
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
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
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
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
    },

    achievements: {},
})

addLayer("a", {
    name: "成就",
    symbol: "A",
    position: 1,
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#FFD700",
    resource: "成就点",
    baseResource: "成就",
    baseAmount() { return new Decimal(0) },
    type: "none",
    row: "side",
    layerShown(){return true},
    tabFormat: [
        ["display-text", function() {
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
                            html += '<div style="display:inline-block;margin:6px;padding:10px 14px;border-radius:12px;background:'+bgColor+';opacity:'+opacity+';min-width:140px;transition:all 0.3s">'
                            html += '<b>' + ach.name + '</b><br><small>' + ach.description + '</small><br>'
                            html += '<small style="color:'+(done?'#fff':'#aaa')+'">' + (done?'✅ 已完成':'⬜ 未完成') + '</small>'
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
