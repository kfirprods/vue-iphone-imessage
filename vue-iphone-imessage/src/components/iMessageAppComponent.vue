<script setup lang="ts">
import { ref, computed } from 'vue'

defineProps({
  conversations: {
    type: Array,
    required: true
  }
})

const emit = defineEmits({
  'submit-message': (message: string, conversation: any) => true
})

const selectedConversation = ref(null)
const inputText = ref('')

function openConversation(conversation: any) {
  selectedConversation.value = conversation
  console.log(selectedConversation.value)
}

function getLastMessageFromConversation(conversation: any) {
  return conversation.messages[conversation.messages.length - 1]
}

function submitMessage() {
  emit('submit-message', inputText.value, selectedConversation.value)
  inputText.value = ''
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
            .timestamp {{ getLastMessageFromConversation(conversation).timestamp }}
            .right-chevron >
          .text-lines
            label {{ getLastMessageFromConversation(conversation).text }}

  .conversation-viewer(v-else)
    .actions-bar-background
    .actions-bar
      .back-button-container
        .back-button(@click="selectedConversation = null") &lt;
      .sender-info
        .avatar
        label {{ selectedConversation.sender }}
      // A hack to center the sender info
      .back-button-container(style="opacity: 0; pointer-events: none")
        .back-button &lt;
    .messages-list
      .message-container(v-for="message, index in selectedConversation.messages" :key="index")
        .text-container
          .title-line
            .timestamp {{ message.timestamp }}
          .text-lines(v-bind:class="{ 'sent-by-me': message.sentByMe }")
            label {{ message.text }}
    .reply-container
      .add-attachment-button
      .input-container
        input(type="text" placeholder="Text message" v-model="inputText" @keyup.enter="submitMessage")
        .submit-button(v-if="inputText" @click="submitMessage")
</template>

<style scoped lang="scss">
.imessage-container {
  background: black;
  color: white;
  width: 100%;
  height: 100%;
  font-size: 1.8em;

  .conversations-list-view {
    padding: 2px;
  }

  .actions-bar {
    display: flex;
    flex-direction: row;
    color: rgb(12, 131, 248);
    justify-content: space-between;
    user-select: none;
    padding-top: 6px;
    padding-bottom: 12px;

    .edit,
    .back-button,
    .new-message-button {
      cursor: pointer;
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

    .sender-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      color: white;
      font-size: calc(var(--size) * 1.4);
      font-weight: 400;
    }
  }

  h1 {
    font-size: calc(var(--size) * 3.14);
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
      --search-icon-size: calc(var(--size) * 2);
      width: var(--search-icon-size);
      height: var(--search-icon-size);
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
            font-size: calc(var(--size) * 1.5);
          }

          .right-chevron {
            font-size: calc(var(--size) * 1.8);
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
}

.avatar {
  --avatar-size: calc(var(--size) * 4.5);
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

.conversation-viewer {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-bottom: 24px;

  .actions-bar {
    padding: 6px;
    backdrop-filter: blur(10px);
    background-color: rgb(30, 30, 30, 0.5);
    z-index: 2;
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

  .messages-list {
    display: flex;
    flex-direction: column;
    gap: calc(var(--size) * 1.5);
    padding: 6px 4px;
    flex: 1;
    overflow-y: auto;
    --offset: calc(-1 * (var(--gutter) * 2));
    margin-top: var(--offset);
    padding-top: calc(-1 * var(--offset) + 6px);
  }

  /* move scrollbar track to match padding of messages-list */
  ::-webkit-scrollbar-track {
    margin-top: calc(-1 * var(--offset) + 6px);
  }

  .message-container {
    .text-container {
      display: flex;
      flex-direction: column;
      align-items: baseline;
      gap: 4px;

      .title-line {
        align-self: center;
        font-size: calc(var(--size) * 1.3);
        color: rgb(113, 113, 113);
        font-weight: bold;
      }
    }
    .text-lines {
      background: rgb(38, 38, 40);
      border-radius: 12px;
      padding: 4px 8px;

      &.sent-by-me {
        background: rgb(49, 208, 89);
        color: rgb(236, 255, 232);
        align-self: flex-end;
      }
    }
  }

  .reply-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;

    .add-attachment-button {
      --button-size: calc(var(--size) * 3.4);
      width: var(--button-size);
      height: var(--button-size);
      border-radius: 50%;
      background: rgb(31, 31, 31);
      color: rgb(167, 167, 167);
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      &:before {
        content: '+';
        font-size: calc(var(--button-size) - 4px);
        line-height: var(--button-size);
        text-align: center;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }
    }

    .input-container {
      display: flex;
      flex-grow: 1;
      background: black;
      border: 1px solid rgb(20, 20, 20);
      border-radius: 12px;
      padding: 2px;
    }

    input {
      flex: 1;
      background: none;
      border: none;
      font-size: calc(var(--size) * 1.7);
      outline: none;
      color: white;
      padding: 4px 6px;
    }

    .submit-button {
      background: rgb(58, 199, 84);
      border-radius: 50%;
      width: calc(var(--size) * 3.14);
      height: calc(var(--size) * 3.14);
      position: relative;
      cursor: pointer;

      /* Up arrow */
      &:before {
        content: '';
        position: absolute;
        left: 7px;
        top: 6px;
        width: 6px;
        height: 6px;
        border-top: 2px solid white;
        border-right: 2px solid white;
        transform: rotateZ(-45deg);
        transform-origin: center center;
      }

      /* Arrow base line */
      &:after {
        content: '';
        position: absolute;
        left: 10px;
        top: 6px;
        width: 2px;
        height: 11px;
        background: white;
      }
    }
  }
}
</style>
