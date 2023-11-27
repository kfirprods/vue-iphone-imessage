<script setup lang="ts">
import iPhone from './components/iPhoneComponent.vue'
import iMessage from './components/iMessageAppComponent.vue'

const conversations = [
  {
    sender: '+1 (514) 469-0450',
    messages: [
      {
        timestamp: '1:10',
        text: "Don't buy snacks",
        sentByMe: false
      },
      {
        timestamp: '1:11',
        text: 'Why not?',
        sentByMe: true
      }
    ]
  },
  {
    sender: 'AnnoyingVendor',
    messages: [
      {
        timestamp: 'Thursday',
        text: 'Buy protein bars!',
        sentByMe: false
      }
    ]
  }
]

function handleSubmitMessage(message: string, conversation: any) {
  conversation.messages.push({
    timestamp: '1:12', // TODO: time now
    text: message,
    sentByMe: true
  })
}
</script>

<template>
  <main>
    <iPhone network-text="4G">
      <iMessage :conversations="conversations" @submit-message="handleSubmitMessage" />
    </iPhone>
  </main>
</template>

<style scoped lang="scss">
main {
  background: darken(blue, 48);
}
</style>
