<template>
  <div id="speech-recog">
      <app-recordintent v-if="intent === 'None'" />
      <app-sub-text />
  </div>
</template>

<script>
import AppRecordintent from './AppRecordintent.vue'
import AppSubText from './AppSubText.vue'

export default 
{
  name:"SpeechRecog",
  components: 
  {
      AppRecordintent,
      AppSubText
  }, 
  computed: 
  {
    intent() 
    {
      return this.$store.getters["speech/intentStr"]
    }
  }
}
</script>

<style lang="scss">
body {
  margin: 0;
  overflow: hidden;
  background-color: black;
  font-family: 'Josefin Sans', sans-serif;
  font-weight: 300;
  color: white;
  display: flex;
  justify-content: center;
  align-content: center;
}
canvas {
  width: 100%;
  height: 100%;
}
 
</style>