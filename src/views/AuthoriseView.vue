<template>
  <div class="authorise">
    <h1 class="authorise__heading">PlayThing</h1>

    <p class="authorise__copy">
      PlayThing is a simple Spotify 'Now Playing' screen designed for the
      Raspberry Pi. Login with Spotify below and start playing some music!
    </p>

    <button class="authorise__button button button--authorise" @click="authenticate()">
      Login with Spotify
    </button>

    <p class="authorise__credit">
      <a href="https://github.com/jaredzimmerman/PlayThing">View on GitHub</a>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { useSpotifyStore } from '@/stores/spotify';

const spotifyStore = useSpotifyStore();

const { authenticate } = spotifyStore



</script>

<style src="@/styles/components/authorise.scss" lang="scss" scoped></style>
