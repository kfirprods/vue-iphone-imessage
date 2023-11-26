<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  conversations: {
    type: Array,
    required: true
  }
})

const selectedConversation = ref(null)

function openConversation(conversation: any) {
  selectedConversation.value = conversation
}
</script>

<template lang="pug">
.imessage-container
  .conversations-list-view(v-if="!selectedConversation")
    .actions-bar
      .edit Edit
      .new-message-button New
    h1 Messages
    .search-box
      .search-icon
      div Search
    .conversation-list
      .conversation-container(v-for="conversation, index in conversations" :key="index" @click="openConversation(conversation)") 
        .avatar
        .text-container
          .title-line
            .sender {{ conversation.sender }}
            .timestamp {{ conversation.timestamp }}
            .right-chevron >
          .text-lines
            label {{ conversation.text }}
  .conversations-viewer(v-else)
    .actions-bar
      .back-button(@click="selectedConversation = null") &lt;
      .conversation-title {{ selectedConversation.sender }}
      .empty
    .messages-list
      .message-container(v-for="message, index in selectedConversation.messages" :key="index")
        .text-container
          .title-line
            .timestamp {{ message.timestamp }}
          .text-lines
            label {{ message.text }}
</template>

<style scoped lang="scss">
.imessage-container {
  background: black;
  color: white;
  width: 100%;
  height: 100%;
  font-size: 12px;
  padding: 2px;

  .actions-bar {
    display: flex;
    flex-direction: row;
    color: rgb(12, 131, 248);
    justify-content: space-between;
    cursor: pointer;
    user-select: none;
    padding-top: 6px;
    padding-bottom: 12px;
  }

  h1 {
    font-size: 24px;
    font-weight: bold;
    margin-top: 4px;
  }

  .search-box {
    --search-box-foreground: #999;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    width: 100%;
    background: #111;
    color: var(--search-box-foreground);
    border-radius: 6px;
    padding: 6px 4px;
    margin: 8px 0;

    .search-icon {
      --search-icon-size: 14px;
      width: 14px;
      height: 14px;
      position: relative;

      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: calc(var(--search-icon-size) * 0.6);
        height: calc(var(--search-icon-size) * 0.6);
        border-radius: 50%;
        border: 1px solid var(--search-box-foreground);
      }

      &:after {
        content: '';
        position: absolute;
        top: calc(var(--search-icon-size) * 0.6);
        left: calc(var(--search-icon-size) * 0.6);
        width: 1px;
        height: calc(var(--search-icon-size) * 0.4);
        background: var(--search-box-foreground);
        transform: rotateZ(-45deg);
        transform-origin: top left;
      }
    }
  }

  .conversation-list {
    display: flex;
    flex-direction: column;

    .conversation-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 2px 0;
      padding-left: 8px;
      gap: 6px;
      cursor: pointer;
      user-select: none;

      .avatar {
        --avatar-size: 32px;
        background-image: linear-gradient(
          45deg,
          rgb(141, 141, 151) 0%,
          rgb(145, 149, 160) 35%,
          rgb(154, 162, 173) 100%
        );
        border-radius: 50%;
        width: var(--avatar-size);
        height: var(--avatar-size);
        position: relative;

        /* Head */
        &:before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateY(-80%) translateX(-50%);
          width: calc(var(--avatar-size) / 3);
          height: calc(var(--avatar-size) / 3);
          border-radius: 50%;
          background: white;
        }

        /* Body */
        &:after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%) rotate(30deg);
          transform-origin: center;
          width: calc(var(--avatar-size) * 0.5);
          height: calc(var(--avatar-size) / 3);
          border-radius: 100% 0;
          background: white;
        }
      }

      .text-container {
        flex-grow: 1;
        border-top: 1px solid #222;
        padding-top: 8px;
        padding-bottom: 8px;

        .title-line {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 4px;

          .sender {
            flex-grow: 1;
          }

          .timestamp {
            color: gray;
            font-size: 10px;
          }

          .right-chevron {
            font-size: 12px;
            color: gray;
            opacity: 0.6;
            transform: scaleX(0.8) scaleY(1.3);
          }
        }
      }

      .text-lines {
        margin-top: 2px;
        color: gray;
      }
    }
  }

  .conversation-viewer {
    display: flex;
    flex-direction: column;
  }
}
</style>
