# vue-iphone-imessage

A set of Vue 3 components that mimic the look and feel of a physical iPhone, including the default Messages app.

There is no real purpose to this project, it was mostly a fun CSS challenge, but can be used to create beautiful mockups.

## Installation

```bash
npm install vue-iphone-imessage
```

Then, import styles in your `main.js` file:

```js
import 'vue-iphone-imessage/dist/style.css'
```

You can use the components in your Vue 3 like this:

```vue
<script setup>
import { iPhoneComponent, iMessageAppComponent } from 'vue-iphone-imessage'

const conversations = [
  {
    sender: '+1 123 456 7890',
    messages: [
      {
        timestamp: 'Yesterday',
        text: "Hey, what's up?",
        sentByMe: false
      }
    ]
  }
]
</script>

<template>
  <iPhoneComponent>
    <iMessageAppComponent :conversations="conversations" />
  </iPhoneComponent>
</template>
```

You can, in theory, inject any component instead of `iMessageAppComponent`, but that hasn't been tested yet.

## Screenshots

![Screenshot1](https://i.imgur.com/uesrYv1.png)
![Screenshot2](https://i.imgur.com/ymMsI7L.png)
![Screenshot3](https://i.imgur.com/3lleV9Z.png)

## TypeScript

This project is written in TypeScript and so it ships with built-in types. You shouldn't have to do anything special to use them.
