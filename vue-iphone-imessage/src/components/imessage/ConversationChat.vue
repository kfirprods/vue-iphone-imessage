<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  messages: {
    type: Array as () => any[],
    required: true
  },
  submitDisabled: {
    type: Boolean,
    default: false
  }
})

const inputText = ref('')

const emit = defineEmits({
  'submit-message': (message: string) => true
})

function submitMessage() {
  emit('submit-message', inputText.value)
  inputText.value = ''
}
</script>

<template lang="pug">
.chat-container
  .messages-list
    .message-container(v-for="message, index in messages" :key="index")
      .text-container
        .title-line
          .timestamp {{ message.timestamp }}
        .text-lines(v-bind:class="{ 'sent-by-me': message.sentByMe }")
          label {{ message.text }}
  .reply-container
    .add-attachment-button
    .input-container
      input(type="text" placeholder="Text message" v-model="inputText" @keyup.enter="submitMessage")
      .submit-button(v-if="inputText" :class="{ disabled: submitDisabled }" @click="submitMessage")
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
