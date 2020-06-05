<template>
  
  <div> 
    <!--<button @click="getNewIntent" :class="{ disabled: uiState === 'listening' }"></button>-->
  </div>
</template>

<script> 
export default { 
  props: {
    name: { type: String },
    aborted: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  computed: { 
    uiState() {
      return this.$store.state.speech.uiState
    }
  },
  mounted() {
   this.$store.dispatch('speech/getSpeech')
   this.$emit('isaborted', false) 
  },
  methods: {
    getNewIntent() {
      this.$store.dispatch('speech/getSpeech')
      this.$emit('isaborted', false)
    }
  }
}
</script>

<style scoped>
button {
  border-radius: 1000px;
  background: red;
  width: 80px;
  height: 80px;
  border: none;
  outline: 0;
  cursor: pointer;
  margin-top: 10px;
  transition: 0.3s all ease-out;
  position: fixed;
  left: 49.5%;
  top: 80%
}

button.disabled {
  background: #ccc;
  cursor: none;
  display: none;
}
</style>