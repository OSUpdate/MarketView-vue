/* eslint-disable no-useless-constructor */
import _ from 'lodash'
import R from 'ramda'

class Base {
    constructor (json) {
        _.assign(this, json)
    }
}
class Trade extends Base {
    constructor (json) {
        super(json)
    }

    static create (obj) {
        return _.isArray ? _.map(obj, item => new Trade(item)) : new Trade(obj)
    }
}
class Markets extends Base {
    constructor (json) {
        super(json)
    }

    static create (obj) {
        return _.isArray ? _.map(obj, item => new Markets(item)) : new Markets(obj)
    }
}
class Ticker extends Base {
    constructor(json) {
        super(json)
        /*
        this.market = ""
        this.trade_date = ""
        this.trade_time = ""
        this.trade_date_kst = ""
        this.trade_time_kst = ""
        this.trade_timestamp = ""
        this.opening_price = 0
        this.high_price = 0
        this.low_price = 0
        this.trade_price = 0
        this.prev_closing_price = 0
        this.change = ""
        this.change_price = 0
        this.change_rate = 0
        this.signed_change_price = 0
        this.signed_change_rate = 0
        this.trade_volume = 0
        this.acc_trade_price = 0
        this.acc_trade_price_24h = 0
        this.acc_trade_volume = 0
        this.acc_trade_volume_24h = 0
        this.highest_52_week_price = 0
        this.highest_52_week_date = ""
        this.lowest_52_week_price = 0
        this.lowest_52_week_date = ""
        this.timestamp = 0
        */
    }

    static create (obj) {
        return _.isArray ? _.map(obj, item => new Ticker(item)) : new Ticker(obj)
    }
}

export {
    Trade,
    Ticker,
    Markets
}
