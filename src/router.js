import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import LoginView from './views/LoginView.vue'
import TopicsView from './views/TopicsView.vue'
import SpeechUIView from './views/SpeechUIView' 
import store from '@/store';
import TextextView from './views/TextextView'

Vue.use(Router)

let router =  new Router({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes: [
    {
      path: '/', 
      name: 'Default',      
      component: TopicsView,
      meta: { requiresLogin: true }

    },
    {
      path: '/home',      
      name: 'Home',      
      component: Home,
      meta: { requiresLogin: true }

    },
    {
      path: '/speech',      
      name: 'Speech',      
      component: SpeechUIView,
      meta: { requiresLogin: true }
    },
    {
      path: '/login',      
      name: 'LoginView',      
      component: LoginView
    },
    {
      path: '/textext',      
      name: 'TextextView',      
      component: TextextView,
      meta: { requiresLogin: true }
    },
    {
      path: '/topics',
      name: 'TopicsView',
      component: TopicsView,
      meta: { requiresLogin: true }
    },
    { path: '*', redirect: '/' }

  ]
});

let entryUrl = null;

const lStore = store;
router.beforeEach((to, from, next) => 
{
   
  if (!to.matched.some(record => record.meta.requiresLogin))
    return next(); // show without login
  
  // var authcookie = window.getCookie('user_auth_token');
  if (lStore.state.auth.userAuthInfo != null && lStore.state.auth.userAuthInfo.tokenId != "") 
  // if (authcookie != null && authcookie != '') 
  {
    if (entryUrl !=null) 
    {
      const url = entryUrl;
      entryUrl = null;
      return next(url); // goto authstored url
    } 
    else 
    {
      return next(); // all is fine
    }
  }
  else 
  {
    entryUrl = to.path; // authstore entry url before redirect
    next('/login');
  }

  // this.$store.dispatch('auth/doLogin', {}); 
  // we use await as this async request has to finish 
  // before we can be sure
  // if (authcookie != null && authcookie != '') 
  // {
  //   next();
  // } 
  // else 
  // {
  //   entryUrl = to.path; // authstore entry url before redirect
  //   next('/login');
  // }
});


export default router;
