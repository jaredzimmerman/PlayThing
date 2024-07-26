<template>
  <div class="container">
    <div class="foreground">
      <div class="top">
        <div class="rule-container">
          <SwipeMarker />
          <p class="rule">SWIPE DOWN FOR RECENTS</p>
        </div>
      </div>

      <div class="bottom">
        <div class="rule-container">
          <SwipeMarker />
          <p class="rule">SWIPE UP FOR PLAYBACK CONTROLS</p>
        </div>
      </div>

      <div class="right">
        <div class="rule-container">
          <SwipeMarker />
          <p class="rule">SWIPE FOR NEXT TRACK</p>
        </div>
      </div>

      <div class="left">
        <div class="rule-container">
          <SwipeMarker />
          <p class="rule">SWIPE FOR PREVIOUS TRACK</p>
        </div>
      </div>
    </div>
    <div class="background">
      <div>
        <ExampleImage />
        <div class="track-details">
          <h2>Song Title</h2>
          <h3>Artist</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SwipeMarker from '@/assets/swipe-marker.svg?component';
import ExampleImage from '@/assets/example-image.svg'
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: #000;
  width: 100%;
  height: 100vh;
  //height: 59.25925925925925vh;
  //width: 77.08333333333334vw;
  overflow: hidden;
}

.foreground {
  position: absolute;
  //width: 100%;
  //height: 100vh;
  z-index: 3;
  height: 90%;
  width: 90%;
  //background-color: red;
  //background-color: red;
}

.background {
  position: absolute;
  width: 100%;
  height: 100vh;
  z-index: 1;
}

.background svg {
  position: absolute;
  left: 220px;
  top: 220px;
}

.background .track-details {
  position: absolute;
  width: 616px;
  height: 311px;
  top: 385px;
  left: 970px;
  font-family: Inter;
  font-size: 109px;
  font-weight: 699;
  line-height: 149px;
  letter-spacing: -1.07em;
  text-align: left;
}

.background .track-details h2 {
  margin: 0;
  white-space: nowrap;
  color: #fff;

  font-family: Inter;
  font-size: 110px;
  font-weight: 700;
  line-height: 150px;
  letter-spacing: 0.07em;
  text-align: left;
}

.background .track-details h3 {
  margin: 0;
  color: #fff;
  opacity: 0.5;

  font-family: Inter;
  font-size: 80px;
  font-weight: 500;
  line-height: 150px;
  letter-spacing: 0.07em;
  text-align: left;
}

.background::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.6;
  z-index: 2;
  pointer-events: none;
}

.rule {
  text-shadow: 0px 0px 20px #000000;
}

.top {
  position: absolute;
  width: 100%;
  top: 0;
  display: flex;
  justify-content: center;
}

.rule-container {
  position: relative;
}

.top .rule {
  font-family: Inter;
  font-size: 50px;
  font-weight: 700;
  line-height: 60.51px;
  letter-spacing: 0.07em;
  text-align: center;
  color: #00a3ff;
  position: absolute;
  white-space: nowrap;
  top: 30%;
  left: -155%;
}

.bottom {
  position: absolute;
  width: 100%;
  //bottom: -43px;
  bottom: 0px;
  display: flex;
  justify-content: center;
}

.bottom svg {
  transform: rotate(180deg);
}

.bottom .rule {
  font-family: Inter;
  font-size: 50px;
  font-weight: 700;
  line-height: 60.51px;
  letter-spacing: 0.07em;
  text-align: center;
  color: #00a3ff;
  position: absolute;
  white-space: nowrap;
  top: 0%;
  left: -225%;
}

.left {
  position: absolute;
  //left: 17px;
  left: 2%;
  display: flex;
  align-items: center;
  height: 100vh;
}

.left svg {
  transform: rotate(-90deg);
}

.left .rule {
  font-family: Inter;
  font-size: 50px;
  font-weight: 700;
  line-height: 60.51px;
  letter-spacing: 0.07em;
  text-align: center;
  color: #00a3ff;
  position: absolute;
  top: 4%;
  left: 23%;
  width: 279%;
}

.right {
  position: absolute;
  //right: 27px;
  right: 2%;
  display: flex;
  align-items: center;
  height: 100vh;
}

.right svg {
  transform: rotate(90deg);
}

.right .rule {
  font-family: Inter;
  font-size: 50px;
  font-weight: 700;
  line-height: 60.51px;
  letter-spacing: 0.07em;
  text-align: center;
  color: #00a3ff;
  position: absolute;
  top: 4%;
  right: 25%;
  width: 210%;
}
</style>
