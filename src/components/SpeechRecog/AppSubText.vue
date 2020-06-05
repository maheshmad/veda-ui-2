<template>
    <span class="typeDisplay">
        <vue-typer v-bind:text='utterance' :repeat='0'></vue-typer>
    </span>
</template>
<script src="../assets/js/vue-typer.min.js"></script>
<script>
import { VueTyper } from 'vue-typer'

export default {
    components: {
        VueTyper
    },
    computed: {
        utterance() {
            // console.log(">>>"+this.$store.speech.state.utterance)
            if (this.$store.state.speech.utterance == "")
              return "HI.."
            return this.$store.state.speech.utterance
        }
  }
}  
</script>
<style lang="scss">
.typeDisplay{
   position: absolute;;
   bottom:3%;
   left:40%;
   width: 700px;
}
.vue-typer {
 font-family: monospace;
 font-size: 32px;   
}
.vue-typer .custom.char.typed {
 color: white;
}
.vue-typer .custom.char.selected {
 color: white;
 background-color: transparent;
}
.vue-typer .custom.caret {
 display: none;
}
</style>