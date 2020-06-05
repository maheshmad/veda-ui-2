<template>
  <div class="login-view">          
      <FaceLogin/>      
  </div>
</template>

<script>
// @ is an alias to /src
import FaceLogin from '@/components/Security/FaceLogin.vue'

export default 
{
  name: 'loginview',
  components: 
  {
     FaceLogin
  }  
}
</script>

<style> 
  div.login-view {
      align-self: center;
      display: flex;
      align-content: center;
      height: 100%;
      flex:1;
  }
  div.banner-style-2 {
    font-size: 70px !important;
    font-weight: 900 !important;
    color:aqua;
  }
</style>
