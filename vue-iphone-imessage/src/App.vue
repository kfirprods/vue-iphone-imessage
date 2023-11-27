<script setup lang="ts">
import iPhone from './components/iPhoneComponent.vue';
import iMessage from './components/imessage/iMessageAppComponent.vue';
import { getClockTime } from '@/utils/time';

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
];

function handleSubmitMessage(message: string, conversation: any) {
  conversation.messages.push({
    timestamp: getClockTime(),
    text: message,
    sentByMe: true
  });
}

function handleCreateConversation(recipient: string, initialMessage: string) {
  const newConversation = {
    sender: recipient,
    messages: []
  };
  conversations.unshift(newConversation);
  handleSubmitMessage(initialMessage, newConversation);
}
</script>

<template>
  <main>
    <iPhone network-text="4G">
      <iMessage
        :conversations="conversations"
        @submit-message="handleSubmitMessage"
        @create-new-conversation="handleCreateConversation"
      />
    </iPhone>
  </main>
</template>

<style scoped lang="scss">
main {
  background: darken(blue, 42);
}
</style>
