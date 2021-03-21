<template lang="pug">
  q-layout(view="lHh Lpr lFf")
    q-header
      q-toolbar.bg-grey-1.text-grey-8
        q-btn(
          flat
          dense
          round
          :icon="leftDrawerOpen ? 'keyboard_arrow_left' : 'menu'"
          @click="leftDrawerOpen = !leftDrawerOpen"
        )

        q-toolbar-title
          p.q-ma-xs Market View

    q-drawer(
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    )
      q-list
        q-item-label.q(
          header
          class="text-grey-8"
        )
          h6.q-list__label-title DashBoard
        EssentialLink(
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        )

    q-page-container
      router-view
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

const linksData = [
  {
    title: '로그인',
    icon: 'person',
    link: '/login'
  },
  {
    title: '거래소',
    icon: 'store',
    link: '/markets'
  },
]

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData
    }
  }
}
</script>
