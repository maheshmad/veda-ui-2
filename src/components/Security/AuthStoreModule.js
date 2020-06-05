import axios from 'axios'
import router from '../../router';
import Config from '@/Config.js'

const qs = require('querystring');

const state =
{
  userAuthInfo: null,
  loggingIn: false,
  loginError: null
}

const mutations =
{
  loginStart: state => state.loggingIn = true,
  loginStop: (state, errorMessage) => {
    state.loggingIn = false;
    state.loginError = errorMessage;
  },
  updateUserAuthInfo: (state, userauth) => {
    state.userAuthInfo = userauth;
  },
  logout: (state) => {
    state.userAuthInfo = null;
  }
}

const actions = 
{
  setUserAuthInfo({ commit }, userAuthInfo) 
  {
    commit('updateUserAuthInfo', userAuthInfo);        
  },

  doLogin({ commit }, loginData) 
  {
    commit('loginStart');
    return new Promise(( resolve, reject ) => {

          axios.post(Config.AUTH_SERVICE, 
                        qs.stringify(loginData), {headers: 
                        {
                          'content-Type': 'application/x-www-form-urlencoded'
                        }}).then(response => 
                            {
                              commit('loginStop', null);
                              if (response.data.errorInfo)
                                reject(response.data.errorInfo.errors[0].errorMsg);
                              else
                              {
                                commit('updateUserAuthInfo', response.data.UserAuthInfo);                              
                                resolve(response);
                              }
                            })
                            .catch(error => {
                              // commit('loginStop', error.response.data.error);
                              // commit('updateUserAuthInfo', null);
                              reject(error);
                            })
                          });
  },  
  logout({ commit }) 
  {
    commit('logout');
    router.push('/login');
  }
}

export default {
  namespaced: true,
  state,
  // getters,
  actions,
  mutations
}
  