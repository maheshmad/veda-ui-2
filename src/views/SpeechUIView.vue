<template>
  <div>
    <div>
      <div class="banner-style-2">Welcome</div>
      <SpeechRecog />      
    </div>
  </div>
</template>

<script>

  import SpeechRecog from '@/components/SpeechRecog/SpeechRecog'

  export default 
  {
    name: 'SpeechUIView',
    components:{
      SpeechRecog
    }  
  }
</script>

<style>  
  div.banner-style-1 {
    font-size: 70px !important;
    font-weight: 900 !important;
    color:white
  }
  div.banner-style-2 {
    font-size: 70px !important;
    font-weight: 900 !important;
    color:aqua;
  }
</style>
