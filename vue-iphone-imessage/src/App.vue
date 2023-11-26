<script setup lang="ts">
import iPhone from './components/iPhoneComponent.vue'
import iMessage from './components/iMessageAppComponent.vue'

const conversations = [
  {
    sender: '+1 (514) 469-0450',
    timestamp: '1:10',
    text: "Don't buy snacks",
    messages: {
      timestamp: '1:10',
      text: "Don't buy snacks"
    }
  },
  {
    sender: '+972 54-8363203',
    timestamp: 'Thursday',
    text: 'Buy protein snacks!'
  }
]
</script>

<template>
  <main>
    <iPhone network-text="4G">
      <iMessage :conversations="conversations" />
    </iPhone>
  </main>
</template>

<style scoped lang="scss">
main {
  background: darken(blue, 48);
}
</style>
