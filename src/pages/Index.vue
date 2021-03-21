<template lang="pug">
  q-page.q-px-xl
    .text-grey-8.column
      h4.q-mb-none 거래소
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
          :pagination.sync="pagination",
        )
          template(v-slot:body-cell-korean_name="props")
            q-td(:props="props")
              div
                p.q-mb-none.q-mt-xs {{ `${props.row.korean_name} (${props.row.market.split('-')[1]})` }}
              div.my-table-details
                p.q-mb-xs {{ props.row.english_name }}
      q-tab-panel(name="USDT")
        q-table.q-table.q-mt-lg(
          class="text-grey-8"
          flat
          hide-bottom
          :data="tickers.usdt"
          :columns="columns"
          row-key="market"
          :rows-per-page-options="[0]",
          :pagination.sync="pagination",
        )
          template(v-slot:body-cell-korean_name="props")
            q-td(:props="props")
              div
                p.q-mb-none.q-mt-xs {{ `${props.row.korean_name} (${props.row.market.split('-')[1]})` }}
              div.my-table-details
                p.q-mb-xs {{ props.row.english_name }}
      q-tab-panel(name="BTC")
        q-table.q-table.q-mt-lg(
          class="text-grey-8"
          flat
          hide-bottom
          :data="tickers.btc"
          :columns="columns"
          row-key="market"
          :rows-per-page-options="[0]",
          :pagination.sync="pagination",
        )
          template(v-slot:body-cell-korean_name="props")
            q-td(:props="props")
              div
                p.q-mb-none.q-mt-xs {{ `${props.row.korean_name} (${props.row.market.split('-')[1]})` }}
              div.my-table-details
                p.q-mb-xs {{ props.row.english_name }}
</template>

<script>
import { Markets, Ticker } from '@boot/models'

export default {
  name: 'PageIndex',
  data() {
    return {
      interval: null,
      tab: "KRW",
      btc: [],
      markets: [],
      tickers: [],
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
        { name: 'prev_closing_price', label: '전일대비', field: 'prev_closing_price', sortable: true },
        { name: 'highest_52_week_price', label: '고가대비(52주)', field: 'highest_52_week_price' },
        { name: 'lowest_52_week_price', label: '저가대비(52주)', field: 'lowest_52_week_price' },
        { name: 'acc_trade_price_24h', label: '거래대금', field: 'acc_trade_price_24h' },
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
      return num.split('억') ? `${num.split('억')[0]} 억` : num
    },
    get_init() {
      const vm = this
      this.$market
      .get_markets()
      .then(res => Markets.create(res.data))
      .then(markets => {
        vm.markets = markets
        return markets
      })
      .then(markets => markets.map(item => item.market))
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
    }
  },

  created: function() {
    this.get_init()
  },
  mounted: function() {
    const vm = this
    console.log('mounted', vm.markets)
  }
}
</script>
