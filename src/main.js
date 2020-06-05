import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import store from './store.js'
import BootstrapVue from 'bootstrap-vue'
import '@/assets/css/bootstrap.min.css'
import Config from '@/Config.js'
import axios from 'axios'
import VueCookies from 'vue-cookies'
import Loading from '@/components/Common/Loading.vue'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(VueCookies)
Vue.prototype.$log = console.log
const loadingConstructor = Vue.extend(Loading)
const loadingInstance = new loadingConstructor()
Vue.prototype.$loading = loadingInstance

new Vue({
          router,
          store,
          render: h => h(App),
          mounted:  function() 
          {                  
            this.checkUserAuth();
          },
          methods:
          {
              checkUserAuth: function()
              {
                let self = this; 
                this.$loading.show({delay: 0})   //delay default is 300ms
                axios.get(Config.AUTH_USER_SERVICE,
                  { 
                    withCredentials: true 
                  }).then(res => 
                  {                     
                    if (res.data && res.data.userInfo != null)
                    {
                      self.$store.dispatch('auth/setUserAuthInfo', res.data.userInfo); 
                      // self.$loading.hide();  
                      this.$router.push("/topics");         
                      // console.log(res.data)            
                    }
                  })                  
              }
          }
}).$mount('#app')
