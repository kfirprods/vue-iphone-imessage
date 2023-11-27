<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  visible: {
    type: Boolean,
    default: false
  }
})
</script>

<template lang="pug">

transition(name="slide-up")
  .fullscreen-modal-container(v-show="visible")
    .modal-header
      .left
      .title {{ title }}
      .right(@click="$emit('cancel')") Cancel
    .modal-contents-container
      slot
</template>

<style scoped lang="scss">
.fullscreen-modal-container {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 2;
  height: calc(100% - var(--gutter) - var(--pad) * 1.2);
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: rgb(42, 42, 42);
  border-radius: 1em 1em 0 0;
  padding: calc(var(--size) * 3) 1em;
  z-index: 2;

  > * {
    flex: 1;
  }

  .title {
    flex: 2;
    text-align: center;
  }

  .right {
    text-align: right;
  }

  .left,
  .right {
    color: var(--cta-foreground-color);
    cursor: pointer;
  }
}

.modal-contents-container {
  display: flex;
  z-index: 1;
  flex: 1;
  background: rgb(30, 30, 30);
  padding-bottom: var(--gutter);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
