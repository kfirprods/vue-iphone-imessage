<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { type AttachmentFile, MessageDeliveryStatus } from '@/types';

const props = defineProps({
  messages: {
    type: Array as () => any[],
    required: true
  },
  submitDisabled: {
    type: Boolean,
    default: false
  }
});

const inputText = ref('');
const attachments = ref<AttachmentFile[]>([]);

const emit = defineEmits({
  'submit-message': ({
    message,
    attachments
  }: {
    message: string;
    attachments: AttachmentFile[];
  }) => true
});

function submitMessage() {
  if (props.submitDisabled) return;
  if (!inputText.value && attachments.value.length === 0) return;

  emit('submit-message', { message: inputText.value, attachments: attachments.value });
  inputText.value = '';
  attachments.value = [];
}

function addAttachmentFiles(event: Event) {
  const files = (event.target as HTMLInputElement).files;
  if (!files) return;

  attachments.value = Array.from(files).map((file) => {
    const url = URL.createObjectURL(file);
    return { id: url, file, url };
  });
}

function convertStatusToText(status: MessageDeliveryStatus) {
  switch (status) {
    case MessageDeliveryStatus.SENT:
      return 'Sent';
    case MessageDeliveryStatus.DELIVERED:
      return 'Delivered';
    case MessageDeliveryStatus.READ:
      return 'Read';
    case MessageDeliveryStatus.FAILED:
      return 'Not Delivered ';
  }
}

watch(
  () => props.messages,
  () => {
    nextTick(() => {
      const messages = document.querySelectorAll('.messages-list .message-container');
      const lastMessage = messages[messages.length - 1];
      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
);
</script>

<template lang="pug">
.chat-container
  .messages-list
    .message-container(v-for="message, index in messages" :key="index" :class="{ 'sent-by-me': message.sentByMe }")
      .text-container
        .title-line
          .timestamp {{ message.timestamp }}
        .attachments(v-if="message.attachments && message.attachments.length")
          img(v-for="attachment in message.attachments" :key="attachment.id" :src="attachment.url" width="40" height="40" alt="Attachment")
        .text-lines(v-if="message.text")
          label {{ message.text }}
        .status-line(v-if="message.status" :class="{ 'failed': message.status === MessageDeliveryStatus.FAILED }")
          label {{ convertStatusToText(message.status) }}
  .reply-container
    .add-attachment-button(@click="$refs.fileInput.click()")
      input(ref="fileInput" type="file" multiple accept="image/*, video/*" @change="addAttachmentFiles" style="display: none")
    .input-container
      .attachments-row(v-if="attachments.length")
        img(v-for="attachment in attachments" :key="attachment.id" :src="attachment.url" width="40" height="40" alt="Attachment")
      .text-row
        input(type="text" placeholder="Text message" v-model="inputText" @keyup.enter="submitMessage")
        .submit-button(v-if="inputText || attachments.length > 0" :class="{ disabled: submitDisabled }" @click="submitMessage")
</template>

<style scoped lang="scss">
.chat-container {
  display: flex;
  flex-direction: column;

  // A hack to allow the chat to appear under blur backdrops such as the top bar
  --offset: calc(-1 * (var(--gutter) * 2));
  margin-top: var(--offset);

  .messages-list {
    display: flex;
    flex-direction: column;
    gap: calc(var(--size) * 1.5);
    flex: 1;
    overflow-y: auto;
    padding: 6px 4px;
    // By applying this padding we compensate for margin-top hack above (+6px for the normal padding above)
    padding-top: calc(-1 * var(--offset) + 6px);
  }
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

    .title-line {
      align-self: center;
      font-size: calc(var(--size) * 1.3);
      color: rgb(113, 113, 113);
      font-weight: bold;
      margin-bottom: 4px;
    }
  }

  .attachments {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    padding: 2px;
    flex-wrap: wrap;
    margin-bottom: 4px;

    img {
      border-radius: 8px;
    }
  }

  .text-lines {
    background: rgb(38, 38, 40);
    border-radius: 12px;
    padding: calc(var(--size) - 1px) calc(var(--size) + 1px);
    overflow-wrap: anywhere;
  }

  .status-line {
    align-self: flex-end;
    font-size: calc(var(--size) * 1.3);
    color: rgb(113, 113, 113);
    font-weight: bold;
    margin-top: 2px;

    &.failed {
      color: rgb(255, 69, 58);
    }
  }

  &.sent-by-me {
    .text-lines {
      background: rgb(49, 208, 89);
      color: rgb(236, 255, 232);
      align-self: flex-end;
    }

    .attachments {
      align-self: flex-end;
    }
  }
}

.reply-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  --button-background-color: rgb(31, 31, 31);

  .add-attachment-button {
    --button-size: calc(var(--size) * 3.4);
    width: var(--button-size);
    height: var(--button-size);
    border-radius: 50%;
    background: var(--button-background-color);
    color: rgb(167, 167, 167);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    cursor: pointer;
    flex-shrink: 0;

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
    flex-direction: column;
    flex-grow: 1;
    background: black;
    border: 1px solid rgb(20, 20, 20);
    border-radius: 12px;
    padding: 2px;

    input[type='text'] {
      flex: 1;
      background: none;
      border: none;
      font-size: calc(var(--size) * 1.7);
      outline: none;
      color: white;
      padding: 4px 6px;
    }

    .text-row {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .attachments-row {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 4px;
      padding: 2px;
      flex-wrap: wrap;

      img {
        border-radius: 8px;
      }
    }
  }

  .submit-button {
    --cta-background-color: rgb(58, 199, 84);
    --cta-foreground-color: white;
    background: var(--cta-background-color);
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
      border-top: 2px solid var(--cta-foreground-color);
      border-right: 2px solid var(--cta-foreground-color);
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
      background: var(--cta-foreground-color);
    }

    &.disabled {
      cursor: default;
      --cta-background-color: rgb(60, 60, 60);
      --cta-foreground-color: black;
    }
  }
}
</style>
