<script setup lang="ts">
import { onMounted } from 'vue'

// Tiny bit of JS to ensure that the notch doesn't move about when you resize the screen
const delay = 300
let afterResize: any

function getClockTime() {
  function padTimeComponent(timeComponent: number) {
    if (timeComponent < 10) {
      return '0' + timeComponent
    }
    return timeComponent.toString()
  }

  var today = new Date()
  var hh = padTimeComponent(today.getHours())
  var mm = padTimeComponent(today.getMinutes())
  return hh + ':' + mm
}

function updateClockText() {
  const clockDiv = document.getElementsByClassName('clock')[0] as any
  clockDiv.innerText = getClockTime()
}

onMounted(() => {
  window.onresize = function () {
    document.body.classList.add('is-resizing')
    clearTimeout(afterResize)
    afterResize = setTimeout(() => document.body.classList.remove('is-resizing'), delay)
  }

  // Update clock
  setInterval(updateClockText, 1000)
  updateClockText()
})
</script>

<template lang="pug">
.scene
	.phone-con
		.phone
			.buttons
				.left
					.button
					.button
					.button
				.right
					.button
			.camera
			.screen-container
				.bg
					.space-black
						.section
							.glow
						.section
							.glow
				
				.top-status-indicators
					.left
						.clock 18:10
					.right
						.network 5G
						.battery
					
				.notch-container(tabIndex="0")
						.notch
							.content
								.left
									.tile
									.text
								.right
								.bar
									.duration
				.notch-blur
				.screen
					.imessage-container
						.actions-bar
							.edit Edit
							.new-message-button New
						h1 Messages
						.search-box
							.search-icon
							div Search
						.messages-list
							.message-container
								// TODO: use actual avatar icon
								.avatar
								.text-container
									.title-line
										.sender +1 (514) 469-0450
										.timestamp 1:10
										.right-chevron >
									.text-lines
										label Don't buy snacks

							.message-container
								.avatar
								.text-container
									.title-line
										.sender +972 54-8363203
										.timestamp Thursday
										.right-chevron >
									.text-lines
										label Buy protein snacks!

</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap');

* {
  box-sizing: border-box;
  font-smooth: always;
}

:root {
  --size: max(5px, 1vmin);
  --height: 80em;
  --pad: 1.25em;
  --border-radius: 6.666em;
  --gutter: calc(var(--pad) * 2);
  --scene-pad: 5vmin;
  --bg-blur: 0.333em;

  --button-width: 0.333em;

  --notch-height: 3.33em;
  --notch-width: 33.3%;
  --notch-radius: calc(var(--border-radius) - calc(var(--pad) * 2));
  --notch-duration: 0.333s;

  --ease: cubic-bezier(0.666, 0, 0.4, 1);
  --ease-spring: cubic-bezier(0.666, 0, 0.4, 1.2);
  --ease-out: cubic-bezier(0.15, 0, 0.333, 1);

  --border-width: 0.4em;

  --deep-purple: 284;
  --gold: 22.5;
  --space-black: 215;
  --silver: 254;

  --c-h: var(--deep-purple);
  --c-s: 100%;
  --c-l: 50%;
}

// Squircle effect
@function round-off() {
  @return url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1'><defs><filter id='round'><feGaussianBlur in='SourceGraphic' stdDeviation='5' result='blur' /><feColorMatrix in='blur' mode='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9' result='goo'/><feComposite in='SourceGraphic' in2='goo' operator='atop'/></filter></defs></svg>#round");
}

// Smoother gradients
@function scrim-gradient(
  $startColor,
  $direction: 'to bottom',
  $from: 0,
  $to: 100,
  $type: linear,
  $reverse: false,
  $debug: false
) {
  $scrimCoordinates: (
    0: 1,
    19: 0.738,
    34: 0.541,
    47: 0.382,
    56.5: 0.278,
    65: 0.194,
    73: 0.126,
    80.2: 0.075,
    86.1: 0.042,
    91: 0.021,
    95.2: 0.008,
    98.2: 0.002,
    100: 0
  );

  $hsl: '';

  @if type-of($startColor) == 'list' {
    $hsl: $startColor;
  } @else {
    $hue: hue($startColor);
    $saturation: saturation($startColor);
    $lightness: lightness($startColor);
    $hsl:
      #{$hue},
      #{$saturation},
      #{$lightness};
  }

  $stops: ();

  @each $colorStop, $alpha in $scrimCoordinates {
    $stop: unquote('hsla(#{$hsl}, #{if($reverse, 1 - $alpha, $alpha)})')
      $from +
      ($colorStop/($to/(100 - $from))) *
      1%;
    $stops: append($stops, $stop, comma);
  }

  @if $debug {
    @return '$startColor: #{$startColor},$direction: #{$direction}, $from: #{$from}, $to: #{$to}, $type: #{$type}, $reverse: #{$reverse}';
  } @else {
    @return #{$type}-gradient(unquote($direction), $stops);
  }
}

@keyframes appear {
  to {
    transform: scale3d(1, 1, 1);
    opacity: 1;
  }
}

.scene {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  font-family: Inter;
  font-size: var(--size);
  padding: var(--scene-pad);
  box-sizing: border-box;
  user-select: none;
}

.phone-con {
  display: flex;
  justify-content: center;
}

.phone {
  position: relative;
  z-index: 1;
  max-width: 350px;
  min-width: 290px;
  min-height: 590px;
  aspect-ratio: 37/76;
  background: black;
  height: var(--height);
  border-radius: var(--border-radius);
  box-shadow:
    0 0 0.1em 0.25em hsl(var(--c-h), 20%, 25%),
    0 0 0 var(--border-width) hsl(var(--c-h), 30%, 85%);
  box-sizing: border-box;

  opacity: 0;
  transform: scale3d(1.1, 1.1, 1);
  animation: appear 1s var(--ease-out) forwards;
  webkit-backface-visibility: hidden;

  &:before {
    content: '';
    position: absolute;
    top: var(--border-radius);
    right: calc(var(--border-width) * -1);
    bottom: var(--border-radius);
    left: calc(var(--border-width) * -1);
    border: 0.5em solid hsl(var(--c-h), 20%, 30%);
    border-left-width: 0;
    border-right-width: 0;
  }
}

.buttons {
  position: absolute;
  inset: calc(var(--border-width) * -1);
  pointer-events: none;

  .left,
  .right {
    position: absolute;
    width: var(--button-width);
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1.5em;
  }

  .left {
    right: 100%;
    top: calc(var(--border-radius) * 2);

    .button {
      &:nth-child(1) {
        height: 3em;
        margin-bottom: 0.5em;
      }
    }
  }

  .right {
    left: 100%;
    transform: scale3d(-1, 1, 1);
    top: calc(var(--border-radius) * 3);

    .button {
      height: 9.5em;
    }
  }

  .button {
    background: hsl(var(--c-h), 20%, 95%);
    height: 6em;
    box-shadow:
      inset -0.15em 0 0.1em black,
      inset 0 0 0.1em hsl(var(--c-h), 30%, 90%),
      inset 0 0.2em 0.1em hsl(var(--c-h), 30%, 90%),
      inset 0 -0.2em 0.1em hsl(var(--c-h), 30%, 90%),
      inset -0.1em 0.333em 0.1em rgba(black, 0.5),
      inset -0.1em -0.333em 0.1em rgba(black, 0.5);

    border-top-left-radius: 0.2em;
    border-bottom-left-radius: 0.2em;
  }
}

.screen-container {
  position: absolute;
  // overflow: hidden;
  inset: 0;

  border-radius: var(--border-radius);
  border: var(--pad) solid black;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(var(--pad) * 2);

  // Bottom thingy
  &:before {
    content: '';
    position: absolute;
    z-index: 2;
    background: white;
    width: 36.6%;
    bottom: calc(var(--pad) * 0.75);
    height: calc(var(--pad) * 0.5);
    border-radius: calc(var(--pad) * 0.25);
    filter: drop-shadow(0 0.1em 0.25em rgba(black, 0.1));
  }
}

.bg {
  position: absolute;
  inset: 0;
  background: black;
  border-radius: calc(var(--border-radius) - var(--pad));
  overflow: hidden;
  // filter: round-off();
  transform: translateZ(0);

  > * {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    opacity: 0;
    transition: opacity 1s var(--ease-out) 0.5s;
    background: black;
  }

  .section {
    --g-h: var(--c-h);
    --g-s: var(--c-s);
    --g-l: var(--c-l);

    flex-grow: 1;
    position: relative;
    overflow: hidden;

    border-radius: calc(var(--border-radius) - var(--pad));
    border-bottom-left-radius: 20em;
    border-bottom-right-radius: 20em;

    &:before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;

      background: scrim-gradient(black, '120% 110% at 50% 92.5%', $from: 33.3, $type: radial),
        scrim-gradient(
          (calc(var(--g-h) - var(--g-hue-adjust-2, var(--g-hue-adjust))), 100%, 50%),
          '100% 66.6% at 110% var(--g-hue-adjust-2-y, 100%)',
          $from: 33.3,
          $type: radial
        ),
        scrim-gradient(
          (calc(var(--g-h) - var(--g-hue-adjust-2, var(--g-hue-adjust))), 100%, 50%),
          '100% 66.6% at -10% var(--g-hue-adjust-2-y, 100%)',
          $from: 33.3,
          $type: radial
        ),
        scrim-gradient(
          (calc(var(--g-h) + 33.3), 100%, var(--g-lightness, 82.5%)),
          '150% 100% at 50% 80%',
          $from: 35,
          $type: radial,
          $reverse: true
        );

      background-color: hsl(var(--g-h), var(--g-s), var(--g-l));

      transform: scale3d(1.1, 1.25, 1);
      transform-origin: bottom;
      transition: transform 1s var(--ease-out) 0.5s;
    }

    &:after {
      content: '';
      position: absolute;
      inset: 0;
      border: var(--border-width) solid rgba(white, 0.8);
      border-radius: inherit;
      filter: blur(0.05em);
      // backdrop-filter: blur(0.75em);

      mask-image: radial-gradient(100% 100% at 50% 70%, black 30%, transparent 50%);
      transform: translatez(2px);
    }

    .glow {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      mix-blend-mode: overlay;
      z-index: 1;
      background: radial-gradient(
        80% 150% at 50% 100%,
        hsl(var(--g-h), 100%, var(--g-l)),
        transparent 70%
      );
    }
  }

  // Bottom bg section
  .section:last-of-type {
    --g-h: calc(var(--c-h) - var(--g-hue-adjust, 0));
    --g-l: calc(var(--c-l) + 40%);
    --g-lightness: 95%;

    transform: scale3d(1, -1, 1) translateZ(1px);
  }
}

.notch-container {
  position: absolute;
  z-index: 3;
  top: var(--pad);
  right: var(--pad);
  left: var(--pad);
  display: flex;
  justify-content: center;

  height: 100%;
  max-height: calc(var(--notch-radius) * 2);

  pointer-events: none;
  outline: none;

  transition: var(--notch-duration) var(--ease);
  transition-property: max-height, max-width, filter, transform;
  will-change: max-width, max-height, filter;

  // Stop transitions when resizing screen or zooming
  .is-resizing &,
  .is-resizing & * {
    transition: none;
  }

  &:hover,
  &:focus-within {
    --shadow-opacity: 0.5;
    transition-timing-function: var(--ease-spring);

    .content {
      --content-padding: 2em;

      .text {
        opacity: 1;
      }
    }

    .notch {
      max-width: 100%;
      max-height: 100%;
      pointer-events: all;
      transform: scale3d(1, 1, 1);
    }

    ~ .notch-blur {
      opacity: 1;
      max-height: calc(var(--notch-radius) * 3.333 + var(--pad));
    }
  }

  &:focus-within {
    max-height: calc(var(--notch-radius) * 3);

    --bar-height: 1em;
    --bar-opacity: 1;

    .left,
    .right {
      max-height: calc(100% - var(--bar-height, 0%) - var(--content-gap));
    }

    ~ .notch-blur {
      max-height: calc(var(--notch-radius) * 5);
      opacity: 1;
    }
  }
}

.top-status-indicators {
  position: absolute;
  top: calc(var(--pad) * 1.5);
  left: calc(var(--pad) + 2px);
  right: calc(var(--pad) + 2px);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: 10px;

  .clock {
    color: white;
    font-size: 12px;
  }

  .right {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
  }

  .battery {
    --battery-width: 25px;
    --battery-height: 12px;
    --battery-percentage: 50;
    --battery-border-color: #444;
    --battery-border-radius: 4px;
    position: relative;
    width: var(--battery-width);
    height: var(--battery-height);
    border: 1px solid var(--battery-border-color);
    border-radius: var(--battery-border-radius);

    /* Battery fill */
    &:before {
      content: '';
      position: absolute;
      top: 1px;
      bottom: 1px;
      left: 1px;
      width: calc(var(--battery-width) * (var(--battery-percentage) / 100));
      background: #ccc;
      border-radius: 3px;
    }

    /* Battery nub */
    &:after {
      --battery-nub-height: 5px;
      content: '';
      position: absolute;
      top: calc((var(--battery-height) / 2) - var(--battery-nub-height) / 2);
      right: -3px;
      width: 2px;
      border-radius: 5px;
      height: var(--battery-nub-height);
      background: var(--battery-border-color);
    }
  }
}

// Blurred drop-shadow
.notch-blur {
  position: absolute;
  z-index: 2;
  top: calc(var(--pad) - 3px);
  right: calc(var(--pad) - 3px);
  left: calc(var(--pad) - 3px);
  height: 100%;
  max-height: calc(var(--notch-radius) * 1.5);
  backdrop-filter: blur(0.2em);
  mask-image: scrim-gradient(black, $from: 60);
  opacity: 0;

  border-radius: calc(var(--border-radius) - var(--pad));

  transition: var(--notch-duration) var(--ease);
  transition-property: max-height, max-width, opacity, transform;
  will-change: max-width, max-height;
}

.notch {
  position: relative;
  border-radius: var(--notch-radius);
  pointer-events: all;
  overflow: hidden;
  color: white;
  border: 1px solid #555;
  box-shadow: 0 0 1px transparent; /*anti-aliasing*/

  display: flex;

  cursor: pointer;

  width: 100%;
  transition: inherit;
  transition-property: inherit;
  will-change: inherit;

  filter: drop-shadow(0 1em 2em hsla(0 0% 0% / var(--shadow-opacity, 0)));

  transform: scale3d(0.375, 0.4, 1);
  transform-origin: top;

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: black;
    filter: round-off();
    border-radius: inherit;
  }
}

.content {
  --content-padding: 1.75em;
  --duration-height: 0.5em;
  --content-gap: 1em;

  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: stretch;
  padding: var(--content-padding);
  gap: var(--content-gap);
  font-size: 125%;

  transition-property: padding;
  will-change: padding;

  position: relative;

  .left,
  .right {
    height: 100%;
    max-height: calc(100% - var(--bar-height, 0%));

    display: flex;
    align-items: center;
    gap: 1em;
  }

  &,
  .left,
  .right,
  .bar,
  .text {
    transition: var(--notch-duration) var(--ease-out);
  }

  .left,
  .right,
  .bar {
    transition-property: max-height, opacity;
    will-change: max-height;
  }

  .left {
    flex-grow: 2;
    // background: red;
  }

  .text {
    display: flex;
    flex-direction: column;
    gap: 0.333em;
    transition-property: opacity;

    opacity: var(--bar-opacity, 0);

    &:before {
      content: "Del Puente Pa' Alla";
      order: 1;
      font-weight: bold;
    }

    &:after {
      order: 2;
      content: 'Luisito Carrion';
      opacity: 0.5;
    }
  }

  .right {
    flex-grow: 1;
    // background: blue;
  }

  .tile {
    background: #{desaturate(darken(blue, 10), 25%)};
    height: 100%;
    aspect-ratio: 1;
    border-radius: 33.3%;
    position: relative;

    &:before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;

      background: radial-gradient(
          50% 50% at 55% 40%,
          desaturate(darken(blue, 20), 25%),
          #cd1385 75%,
          transparent
        )
        center / 133.3% 133.3%;
      background-color: yellow;
      filter: blur(0.05em);
    }
  }

  .bar {
    display: flex;
    align-items: center;
    gap: 1em;
    flex-basis: 100%;
    height: 100%;
    max-height: var(--bar-height, 0%);
    color: rgba(white, 0.5);

    opacity: var(--bar-opacity, 0);

    .duration {
      position: relative;
      height: var(--duration-height);
      background: rgba(white, 0.25);
      border-radius: calc(var(--duration-height) * 0.5);
      overflow: hidden;
      flex-grow: 1;

      &:before {
        content: '';
        height: 100%;
        background: white;
        width: 25%;
        position: absolute;
      }
    }

    &:before {
      content: '1:20';
    }

    &:after {
      content: '-1:48';
    }
  }
}

.camera {
  display: flex;
  justify-content: center;
  align-items: center;
  height: var(--notch-height);
  aspect-ratio: 1/1;
  border-radius: 50%;
  pointer-events: none;

  position: absolute;
  z-index: 4;
  top: calc(var(--pad) * 2);
  right: calc(50% - calc(var(--notch-width) * 0.5));
  margin-right: calc(var(--pad) * 0.333);

  &:before {
    content: '';
    height: 33.3%;
    aspect-ratio: 1;
    border-radius: inherit;
    box-shadow: inset 0 0 0.25em #4c4da3;
    background:
      radial-gradient(#6667ac, transparent 50%) no-repeat 33.3% 10% / 75% 50%,
      radial-gradient(darken(#6667ac, 15), transparent 50%) no-repeat 60% 85% / 50% 50%;
    background-color: #080928;
  }
}

.screen {
  // opacity: 0;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  flex-grow: 1;

  box-sizing: border-box;
  width: 100%;
  position: relative;
  overflow: hidden;
  z-index: 1;

  padding-top: calc(var(--gutter) * 2);
  border-radius: calc(var(--border-radius) - var(--pad));

  transition: opacity 1s var(--ease-out) 0.25s;
}

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

  .messages-list {
    display: flex;
    flex-direction: column;

    .message-container {
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
}

.pallette {
  position: relative;
  z-index: 1;

  order: 1;
  display: flex;
  gap: 2em;
  margin-right: 2.25em;
  margin-bottom: -0.25em;

  &:hover ~ .phone-con .screen {
    transition-delay: 0.5s;
    opacity: 0;
  }
}
</style>
