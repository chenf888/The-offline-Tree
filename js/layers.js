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
    },
})
