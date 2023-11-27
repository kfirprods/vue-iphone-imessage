<script setup lang="ts">
import ConversationChat from './ConversationChat.vue'

defineProps({
  conversation: {
    type: Object,
    required: true
  }
})
</script>

<template lang="pug">
.conversation-viewer
  .actions-bar-background
  .actions-bar
    .back-button-container
      .back-button(@click="$emit('back')") &lt;
    .sender-info
      .avatar
      label {{ conversation.sender }}
    // A hack to center the sender info
    .back-button-container(style="opacity: 0; pointer-events: none")
      .back-button &lt;
  conversation-chat(class="chat-container" :messages="conversation.messages" @submit-message="$emit('submit-message', $event)")
</template>

<style scoped lang="scss">
.conversation-viewer {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-bottom: 24px;

  .chat-container {
    flex: 1;
    overflow: auto;
  }

  .actions-bar {
    padding: 6px;
    backdrop-filter: blur(10px);
    background-color: rgb(30, 30, 30, 0.5);
    z-index: 2;
    display: flex;
    flex-direction: row;
    color: var(--cta-foreground-color);
    justify-content: space-between;
    user-select: none;

    .sender-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      color: white;
      font-size: calc(var(--size) * 1.4);
      font-weight: 400;
    }

    .back-button-container {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;

      .back-button {
        margin-top: 4px;
        font-size: 1.5em;
        transform: scaleY(1.4);
        flex: 0;
      }
    }

    .edit,
    .back-button,
    .new-message-button {
      cursor: pointer;
    }
  }

  .actions-bar-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(var(--gutter) + var(--size) * 0.5);
    backdrop-filter: blur(10px);
    background-color: rgb(30, 30, 30, 0.5);
    z-index: 1;
  }
}
</style>
