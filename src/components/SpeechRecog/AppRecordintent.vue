<template>
    <app-recordinglogic />
</template>

<script>
import AppRecordinglogic from './AppRecordinglogic.vue'
import AppButtonrecord from './AppButtonrecord.vue'

export default {
  components: {
    AppRecordinglogic,
    // AppButtonrecord
  },
  computed: {
    uiState() {
      return this.$store.state.speech.uiState
    }
  }
}
</script>

<style scoped>


h1 {
  color: rgb(245, 245, 245);
}

p.big {
  font-size: 20px;
  line-height: 1.5;
}

span {
  color: rgb(168, 167, 167);
}
</style>