<template lang="pug">
  q-page.q-px-xl
    .text-grey-8.column
      h4.q-mb-none 거래소
      q-btn(@click="close_socket")
    q-tabs(
          v-model="tab"
          dense
          class="text-grey-8"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
    )
          q-tab(name="KRW" label="KRW")
          q-tab(name="USDT" label="USDT")
          q-tab(name="BTC" label="BTC")
    q-separator
    q-tab-panels(v-model="tab" animated)
      q-tab-panel(name="KRW")
        q-table.q-table.q-mt-lg(
          class="text-grey-8"
          flat
          hide-bottom
          :data="tickers.krw"
          :columns="columns"
          row-key="market"
          :rows-per-page-options="[0]",
        )
          template(v-slot:body-cell-korean_name="props")
            q-td(:props="props")
              div
                p.q-mb-none.q-mt-xs {{ `${props.row.korean_name} (${props.row.coin})` }}
              div.my-table-details
                p.q-mb-xs {{ props.row.english_name }}
          template(v-slot:body-cell-trade_price="props")
            q-td(:props="props")
              div
                p.q-mb-none.q-mt-xs {{ `${props.row.trade_price.toLocaleString()} 원` }}
              div.my-table-details
                p.q-mb-xs
          template(v-slot:body-cell-prev_closing_price="props")
            q-td(:props="props")
              div
                p.q-mb-none.q-mt-xs {{ `${props.row.prev_closing_price} %` }}
          template(v-slot:body-cell-highest_52_week_price="props")
            q-td(:props="props")
              div
                p.q-mb-none.q-mt-xs {{ `${props.row.highest_52_week_price} %` }}
          template(v-slot:body-cell-lowest_52_week_price="props")
            q-td(:props="props")
              div
                p.q-mb-none.q-mt-xs {{ `${props.row.lowest_52_week_price} %` }}
          template(v-slot:body-cell-acc_trade_price_24h="props")
            q-td(:props="props")
              div
                p.q-mb-none.q-mt-xs {{ calc_korea(props.row.acc_trade_price_24h) }}
      q-tab-panel(name="USDT")
        q-table.q-table.q-mt-lg(
          class="text-grey-8"
          flat
          hide-bottom
          :data="tickers.usdt"
          :columns="columns"
          row-key="market"
          :rows-per-page-options="[0]",
        )
          template(v-slot:body-cell-korean_name="props")
            q-td(:props="props")
              div
                p.q-mb-none.q-mt-xs {{ `${props.row.korean_name} (${props.row.market.split('-')[1]})` }}
              div.my-table-details
                p.q-mb-xs {{ props.row.english_name }}
          template(v-slot:body-cell-trade_price="props")
            q-td(:props="props")
              div
                p.q-mb-none.q-mt-xs {{ `$ ${props.row.trade_price.toLocaleString()}` }}
              div.my-table-details
                p.q-mb-xs
          template(v-slot:body-cell-prev_closing_price="props")
            q-td(:props="props")
              div
                p.q-mb-none.q-mt-xs {{ `${props.row.prev_closing_price} %` }}
          template(v-slot:body-cell-highest_52_week_price="props")
            q-td(:props="props")
              div
                p.q-mb-none.q-mt-xs {{ `${props.row.highest_52_week_price} %` }}
          template(v-slot:body-cell-lowest_52_week_price="props")
            q-td(:props="props")
              div
                p.q-mb-none.q-mt-xs {{ `${props.row.lowest_52_week_price} %` }}
          template(v-slot:body-cell-acc_trade_price_24h="props")
            q-td(:props="props")
              div
                p.q-mb-none.q-mt-xs {{ props.row.acc_trade_price_24h }}
      q-tab-panel(name="BTC")
        q-table.q-table.q-mt-lg(
          class="text-grey-8"
          flat
          hide-bottom
          :data="tickers.btc"
          :columns="columns"
          row-key="market"
          :rows-per-page-options="[0]",
        )
          template(v-slot:body-cell-korean_name="props")
            q-td(:props="props")
              div
                p.q-mb-none.q-mt-xs {{ `${props.row.korean_name} (${props.row.market.split('-')[1]})` }}
              div.my-table-details
                p.q-mb-xs {{ props.row.english_name }}
          template(v-slot:body-cell-trade_price="props")
            q-td(:props="props")
              div
                p.q-mb-none.q-mt-xs {{ `${Math.floor(props.row.trade_price * btc.trade_price).toLocaleString()} 원` }}
              div.my-table-details
                p.q-mb-xs
          template(v-slot:body-cell-prev_closing_price="props")
            q-td(:props="props")
              div
                p.q-mb-none.q-mt-xs {{ `${props.row.prev_closing_price} %` }}
          template(v-slot:body-cell-highest_52_week_price="props")
            q-td(:props="props")
              div
                p.q-mb-none.q-mt-xs {{ `${props.row.highest_52_week_price} %` }}
          template(v-slot:body-cell-lowest_52_week_price="props")
            q-td(:props="props")
              div
                p.q-mb-none.q-mt-xs {{ `${props.row.lowest_52_week_price} %` }}
          template(v-slot:body-cell-acc_trade_price_24h="props")
            q-td(:props="props")
              div
                p.q-mb-none.q-mt-xs {{ calc_korea(props.row.acc_trade_price_24h * btc.trade_price) }}
</template>

<script>
import { Markets, Ticker } from '@boot/models'
import { upbitSocket } from '@boot/socket'
import { v4 } from 'uuid'

export default {
  name: 'PageIndex',
  data() {
    return {
      uuid: v4(),
      log: [],
      markets_key: {},
      tickers_key: {
        krw: {},
        usdt: {},
        btc: {}
      },
      socket: null,
      status: false,
      interval: null,
      tab: "KRW",
      btc: {},
      markets: [],
      tickers: {
        krw: {},
        usdt: {},
        btc: {}
      },
      columns: [
        {
          name: 'korean_name',
          required: true,
          label: '이름',
          align: 'left',
          field: "korean_name",
          format: val => `${val}`,
          sortable: true
        },
        { name: 'trade_price', align: 'right', label: '현재가', field: 'trade_price', sortable: true },
        { name: 'prev_closing_price', label: '전일대비', field: 'prev_closing_price', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'highest_52_week_price', label: '고가대비(52주)', field: 'highest_52_week_price', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'lowest_52_week_price', label: '저가대비(52주)', field: 'lowest_52_week_price', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'acc_trade_price_24h', label: '거래대금', field: 'acc_trade_price_24h', sortable: true },
      ],

    }
  },
  methods: {
    calc_per(cur, prev) {
      return (((cur - prev) / prev) * 100).toFixed(2)
    },
    calc_korea(money) {
      const words = ['', '만', '억', '조']
      if (money < 10000) {
        return Math.floor(money)
      }
      // eslint-disable-next-line array-callback-return
      const kor = words.reduce((acc, item, index) => {
        const res = Math.floor(money % Math.pow(10000, index + 1) / Math.pow(10000, index))
        if (res > 0) {
          return [...acc, res]
        }
        return acc
      }, [])
      const num = kor.reduce((acc, item, index) => {
        acc = `${item} ${words[index]} ${acc}`
        return acc
      }, '')
      const check = num.split('억')
      return check[1] ? `${check[0]} 억` : num
    },
    async set_connect() {
      const vm = this
      vm.socket = await upbitSocket()
      vm.socket.onmessage = (res) => {
        const enc = new TextDecoder("utf-8")
        const arr = new Uint8Array(res.data)
        const ticker = JSON.parse(enc.decode(arr))
        // eslint-disable-next-line array-callback-return
        const market_name = ticker.code.split('-')[0].toLowerCase()
        if (ticker.code === 'KRW-BTC') {
            vm.btc = ticker
        }
        vm.tickers_key[market_name][ticker.code] = {
          ...ticker,
          ...vm.markets_key[ticker.code],
          prev_closing_price: vm.calc_per(ticker.trade_price, ticker.prev_closing_price),
          highest_52_week_price: vm.calc_per(ticker.trade_price, ticker.highest_52_week_price),
          lowest_52_week_price: vm.calc_per(ticker.trade_price, ticker.lowest_52_week_price),
        }
        //console.log(vm.tickers_key[ticker.code])
        vm.tickers[market_name] = Object.values(vm.tickers_key[market_name])
        //console.log(vm.tickers)
        /*
        let check = false
        const change = vm.tickers.map(item => {
          if (item.code === ticker.code) {
            check = true
            return {
              ...ticker,
              ...vm.markets_key[ticker.code],
            }
          }
          return item
        })
        vm.tickers = check
        ? [...change]
        : [...change,
        {
          ...ticker,
          ...vm.markets_key[ticker.code],
        }]
        */
        //console.log(ticker)
      }
    },
    close_socket() {
      this.socket.close()
    },
    get_init() {
      const vm = this
      this.$market
      .get_markets()
      .then(res => Markets.create(res.data))
      .then(markets => {
        markets.forEach(item => {
          const [money, coin] = item.market.split('-')
          vm.markets_key[item.market] = {
            ...item,
            money: money,
            coin: coin
          }
        })
        vm.markets = markets
        return markets
      })
      .then(markets => markets.map(item => item.market))
      /* krw 마켓만 사용할 시
      .then(markets => markets.filter(item => item.market.split('-')[0] === 'KRW'))
      .then(markets => markets.map(item => item.market))
      */
      // websocket을 이용한 ticker
      .then(tickers => JSON.stringify([{ ticket: vm.uuid }, { type: "ticker", codes: tickers }]))
      .then(async data => {
        await this.set_connect()
        this.socket.send(data)
        /*
        upbitSocket()
        .then(scoket => {
          vm.socket = scoket
          vm.socket.onmessage = (res) => {
            const enc = new TextDecoder("utf-8")
            const arr = new Uint8Array(res.data)
            const ticker = JSON.parse(enc.decode(arr))
            console.log(res.data)
          }
        }
        */
        //console.log(data)
        //vm.socket.send(data)
        //vm.socket.close()
      })
      /* rest api를 이용한 ticker
      .then(names => names.join(','))
      .then(ticker => vm.$ticker.get_ticker(ticker))
      .then(res => Ticker.create(res.data))
      .then(tickers => {
        const ticker = {
          btc: [],
          krw: [],
          usdt: []
        }
        tickers.forEach((item, index) => {
          const name = item.market.split('-')
          switch (name[0]) {
            case 'KRW':
              ticker.krw = [...ticker.krw, {
                ...item,
                prev_closing_price: `${vm.calc_per(item.trade_price, item.prev_closing_price)} %`,
                highest_52_week_price: `${vm.calc_per(item.trade_price, item.highest_52_week_price)} %`,
                lowest_52_week_price: `${vm.calc_per(item.trade_price, item.lowest_52_week_price)} %`,
                acc_trade_price_24h: `${vm.calc_korea(item.acc_trade_price_24h)}`,
                trade_price: `${item.trade_price.toLocaleString()} 원`,
                ...vm.markets[index]
              }]
              break
            case 'USDT':
              ticker.usdt = [...ticker.usdt, {
                ...item,
                ...vm.markets[index]
              }]
              break
            case 'BTC':
              ticker.btc = [...ticker.btc, {
                ...item,
                ...vm.markets[index]
              }]
              break
          }
        })
        return ticker
      })
      .then(tickers => {
        console.log(tickers)
        vm.tickers = tickers
        return tickers
      })
      .then(tickers => tickers.krw.filter(item => {
        const [money, coin] = item.market.split('-')
        if (coin.includes('BTC')) {
          return item
        }
        return false
      }))
      .then(btc => {
        vm.btc = btc
      })
      */
      .catch(error => console.log(error))
    },
    get_ticker(vm) {
      vm.$ticker
      .get_ticker(vm.markets.join(','))
      .then(res => Ticker.create(res.data))
      .then(tickers => tickers.map((item, index) => {
        return {
          ...item,
          ...vm.markets[index]
        }
      }))
      .then(tickers => {
        console.log(tickers)
        vm.tickers = tickers
        return tickers
      })
      .then(tickers => tickers.filter(item => {
        const [money, coin] = item.market.split('-')
        if (coin.includes('BTC')) {
          return item
        }
        return false
      }))
      .then(btc => {
        vm.btc = btc
      })
      .catch(error => console.log(error))
    },
    disconnect() {
    this.sock.close()
    this.status = false
    },
    connect() {
      const vm = this
      vm.socket = new WebSocket('wss://api.upbit.com/websocket/v1')
      vm.socket.binaryType = 'arraybuffer'
      vm.uuid = v4()
      vm.socket.onopen = () => {
        vm.socket.onmessage = (res) => {
          //data.map(i => console.log(i))
          const enc = new TextDecoder("utf-8")
          const arr = new Uint8Array(res.data)
          const data = JSON.parse(enc.decode(arr))
          console.log(data)
          //console.log(res)
          vm.log = [...vm.log, res]
        }
      }
    }
  },
  created: function() {
    const vm = this
    //vm.connect()
    vm.get_init()
    /*
    vm.socket.onopen = () => {
      vm.status = true
      vm.socket.onmessage = (res) => {
        //data.map(i => console.log(i))
        const enc = new TextDecoder("utf-8")
        const arr = new Uint8Array(res.data)
        const data = JSON.parse(enc.decode(arr))
        console.log(data)
        //console.log(res)
        vm.log = [...vm.log, res]
        vm.socket.close()
      }
      // isOnlySnapshot: false 스냅샷만 제공 옵션
      // isOnlyRealtime: false 실시간 시세만 제공 옵션
      const data = JSON.stringify([{ ticket: vm.uuid }, { type: "ticker", codes: ["KRW-BTC"] }])
      vm.socket.send(data)
    }
    console.log(this.socket)
    */
  },
  mounted: function() {
    const vm = this
    console.log('mounted', vm.markets)
  }
}
</script>
