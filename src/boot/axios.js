import Vue from 'vue'
import axios from 'axios'

const URL = "https://api.upbit.com"
const VERSION = "v1"

class APIBase {
    constructor() {
        this.base_url = URL
        this.version = VERSION
    }

    get base() {
        return `${this.base_url}/${this.version}`
    }
}
class Candles extends APIBase {
    constructor() {
        super()
        this.url = "candles"
    }

    get_days(day, market) {
        return axios.get(`${this.base}/${this.url}/days`, {
            params: {
                count: day,
                market: market
            }
        })
    }
}
class Market extends APIBase {
    constructor() {
        super()
        this.url = "market"
    }

    get_markets() {
        return axios.get(`${this.base}/${this.url}/all`)
    }

    get_market(market) {
        return axios.get(`${this.base}/${this.url}/${market}`)
    }
}
class Ticker extends APIBase {
    constructor() {
        super()
        this.url = "ticker"
    }

    get_ticker(market) {
        return axios.get(`${this.base}/${this.url}`, {
            params: {
                markets: market
            }
        })
    }
}
class Orders extends APIBase {
    constructor() {
        super()
        this.url = "orders"
    }

    get_chance(market, option) {
        return axios.get(`${this.base}/${this.url}/chance`, {
            params: {
                market: market
            },
            option: option
        })
    }

    get_orders(body, options) {
        return axios.post(`${this.base}/${this.url}`, body, options)
    }
}

Vue.prototype.$candles = new Candles()
Vue.prototype.$ticker = new Ticker()
Vue.prototype.$market = new Market()
Vue.prototype.$orders = new Orders()
