import Vue from 'vue'
import Vuex from 'vuex'
import authstore from './components/Security/AuthStoreModule.js'
import speechStore from './components/SpeechRecog/SpeechDataStoreModule.js'
// import createLogger from '../../../src/plugins/logger'


Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules:{
    auth: authstore,
    speech: speechStore
  },
  strict: debug,
  // plugins: debug ? [createLogger()]: []
})
