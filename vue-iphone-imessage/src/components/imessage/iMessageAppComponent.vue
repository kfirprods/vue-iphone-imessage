<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import FullscreenModal from '@/components/FullscreenModal.vue';
import ConversationViewer from './ConversationViewer.vue';
import ConversationChat from './ConversationChat.vue';
import type { AttachmentFile } from '@/types';

const props = defineProps({
  conversations: {
    type: Array as () => any[],
    required: true
  }
});
const emits = defineEmits({
  'submit-message': ({
    message,
    attachments,
    conversation
  }: {
    message: string;
    attachments: AttachmentFile[];
    conversation: any;
  }) => true,
  'create-new-conversation': ({
    recipient,
    initialMessage,
    attachments
  }: {
    recipient: string;
    initialMessage: string;
    attachments: AttachmentFile[];
  }) => true
});

const selectedConversation = ref(null);
const isNewMessageModalVisible = ref(false);
const newMessageRecipient = ref('');

function openConversation(conversation: any) {
  selectedConversation.value = conversation;
}

function getLastMessageFromConversation(conversation: any) {
  return conversation.messages[conversation.messages.length - 1];
}

function createMessage() {
  isNewMessageModalVisible.value = true;
}

function sendMessageToNewConversation({
  message,
  attachments
}: {
  message: string;
  attachments: AttachmentFile[];
}) {
  const existingConversation = props.conversations.find(
    (conversation: any) => conversation.sender === newMessageRecipient.value
  );

  if (existingConversation) {
    selectedConversation.value = existingConversation;
    emits('submit-message', { message, attachments, conversation: existingConversation });
  } else {
    emits('create-new-conversation', {
      recipient: newMessageRecipient.value,
      initialMessage: message,
      attachments
    });

    // Immediately open the new conversation (in case of async creation, developers can just call the exposed setSelectedConversation function)
    const createdConversation = props.conversations.find(
      (conversation: any) => conversation.sender === newMessageRecipient.value
    );
    if (createdConversation) {
      selectedConversation.value = createdConversation;
    }
  }

  newMessageRecipient.value = '';

  nextTick(() => {
    isNewMessageModalVisible.value = false;
  });
}

function sendMessageToSelectedConversation({
  message,
  attachments
}: {
  message: string;
  attachments: AttachmentFile[];
}) {
  emits('submit-message', { message, attachments, conversation: selectedConversation.value });
}

defineExpose({
  setSelectedConversation: openConversation
});
</script>

<template lang="pug">
.imessage-container
  fullscreen-modal(title="New Message" :visible="isNewMessageModalVisible" @cancel="isNewMessageModalVisible = false")
    .new-message-modal
      .recipient-input-container
        label To:
        input(type="tel" v-model="newMessageRecipient")
      conversation-chat(class="new-chat" :messages="[]" :submit-disabled="!newMessageRecipient" @submit-message="sendMessageToNewConversation")

  .slide-container(style="height: 100%")
    .conversations-list-view(:class="{ 'is-conversation-sliding-in': selectedConversation, 'is-modal-sliding-up': isNewMessageModalVisible }")
      .actions-bar
        .edit Edit
        .new-message-button(@click="createMessage")
      h1 Messages
      .search-box
        .search-icon
        div Search
      .conversation-list(v-if="conversations.length > 0")
        .conversation-container(v-for="conversation, index in conversations" :key="index" @click="openConversation(conversation)") 
          .avatar
          .text-container
            .title-line
              .sender {{ conversation.sender }}
              .timestamp {{ (getLastMessageFromConversation(conversation)?.timestamp ?? "") }}
              .right-chevron >
            .text-lines
              label {{ getLastMessageFromConversation(conversation)?.text ?? "" }}
      .empty-conversations-message(v-else class="empty-conversations-message")
        label No conversations yet

    transition(v-if="!isNewMessageModalVisible" name="slide")
      conversation-viewer(v-if="selectedConversation" class="conversation-viewer" :conversation="selectedConversation" @back="selectedConversation = null" @submit-message="sendMessageToSelectedConversation")
</template>

<style scoped lang="scss">
.imessage-container {
  background: black;
  color: white;
  width: 100%;
  height: 100%;
  font-size: 1.8em;

  .slide-container {
    height: 100%;
    overflow: hidden;
    position: relative;

    .conversation-viewer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: black;
    }
  }

  .conversations-list-view {
    padding: 2px var(--size);
    transform: translate(0), scale(1);
    transition: transform 0.4s ease;

    .empty-conversations-message {
      margin-top: 2em;
      text-align: center;
    }

    h1 {
      font-size: calc(var(--size) * 3.14);
      font-weight: bold;
      margin-top: 4px;
      transform: translateX(0);
      transition:
        transform 0.4s ease,
        opacity 0.4s ease;
    }

    &.is-conversation-sliding-in {
      // Set position to absolute to "detach" the conversations list from the conversation view
      position: absolute;
      left: 0;
      top: 0;
      pointer-events: none;
      transform: translateX(-30%);

      h1 {
        transform: translateX(50%);
        opacity: 0;
      }
    }

    &.is-modal-sliding-up {
      pointer-events: none;
      transform: scale(0.95) translateY(var(--gutter));
    }
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
      overflow: hidden;

      label {
        cursor: pointer;
      }

      .avatar {
        flex-shrink: 0;
      }

      .text-container {
        flex-grow: 1;
        border-top: 1px solid #222;
        padding-top: 8px;
        padding-bottom: 8px;
        min-width: 0;

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
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}

.actions-bar {
  display: flex;
  flex-direction: row;
  color: var(--cta-foreground-color);
  justify-content: space-between;
  user-select: none;
  padding-top: calc(var(--gutter) + 6px);
  padding-bottom: 12px;

  .edit,
  .back-button,
  .new-message-button {
    cursor: pointer;
  }

  .new-message-button {
    --button-size: calc(var(--size) * 2.2);
    width: var(--button-size);
    height: var(--button-size);
    position: relative;

    /* Square (notepad) */
    &:before {
      content: '';
      position: absolute;
      border: 1px solid var(--cta-foreground-color);
      border-radius: 2px;
      bottom: 0;
      left: 0;
      width: calc(var(--button-size) * 0.75);
      height: calc(var(--button-size) * 0.75);
    }

    /* Pencil */
    &:after {
      content: '';
      position: absolute;
      border: 1px solid var(--cta-foreground-color);
      border-radius: 100%;
      top: 0;
      right: 0;
      width: 0px;
      height: calc(var(--button-size) * 0.65);
      transform: rotateZ(45deg);
      transform-origin: top left;
    }
  }
}

.new-message-modal {
  display: flex;
  flex-direction: column;
  flex: 1;

  .recipient-input-container {
    display: flex;
    z-index: 1;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid rgb(42, 42, 42);
    padding: 10px 10px;
    font-size: 0.9em;

    label {
      color: rgb(113, 113, 113);
      font-weight: bold;
      margin-right: 4px;
    }

    input {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      color: white;
      font-size: 1em;
    }
  }

  .new-chat {
    flex: 1;
    padding: 0 var(--size);

    ::v-deep(.reply-container) {
      --button-background-color: rgb(60, 60, 60);
    }
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease;

  ::v-deep(.actions-bar) {
    backdrop-filter: none !important;
  }
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-enter-to {
  transform: translateX(0);
}

.slide-leave-from {
  transform: translateX(0);
}

.slide-leave-to {
  transform: translateX(100%);
}
</style>
