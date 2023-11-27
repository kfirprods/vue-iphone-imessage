<script setup lang="ts">
import iPhone from './components/iPhoneComponent.vue';
import iMessage from './components/imessage/iMessageAppComponent.vue';
import { getClockTime } from '@/utils/time';
import type { AttachmentFile } from './types';

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

function handleSubmitMessage({
  message,
  attachments,
  conversation
}: {
  message: string;
  attachments: AttachmentFile[];
  conversation: any;
}) {
  conversation.messages.push({
    timestamp: getClockTime(),
    text: message,
    sentByMe: true,
    attachments
  });
}

function handleCreateConversation({
  recipient,
  initialMessage,
  attachments
}: {
  recipient: string;
  initialMessage: string;
  attachments: AttachmentFile[];
}) {
  const newConversation = {
    sender: recipient,
    messages: []
  };
  conversations.unshift(newConversation);
  handleSubmitMessage({ message: initialMessage, attachments, conversation: newConversation });
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
