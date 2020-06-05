<template>
    <div id="capture-window" class="card">
        <h5 class="card-title">Login</h5>
        <h5 class="card-title">{{msg}}</h5>
                 
        <!-- step two capture password from user -->
            
        <div class="card align-items-center">
            <img class="card-img-top" style="border-radius:50%;max-width:300px;max-height:300px" ref="user_profile_pic_card_ref"  :src="profile_pic_url" />
            
            <div class="card-body text-center">                        
                <form ref="login_form" v-on:submit.prevent="authenticate">                                
                        <label>Username:
                            <input v-model="username" ref="username" name="user" value="" />
                        </label><br>
                        <label>Password
                            <input type="password" ref="login_psswd" name="pwd" value="" /> 
                        </label><br>
                        
                </form> 
            </div>
            
            <div class="card-body text-center">
                <button v-on:click="authenticate" class="btn btn-primary" v-text="status" />
            </div>
        </div>
           
    </div>
</template>

<script>
    import axios from 'axios'
    // import Card from '@/components/Cards/Card.vue'
    import Config from '@/Config.js'

    export default {
        name: 'FaceLogin',
        components: {
            // Card
        },
        data() 
        {
            return {
                video: {},
                videoStream: null,
                canvas: {},
                captures: [],
                msg:"",
                status: "Login",
                loadingRing: "@/assets/images/loading-ring.gif",
                username:"",                
                faceLoginDisabled: true
            }
        },
        computed:
        {
           greeting()
           {
               return "Welcome "+this.username+"!"                     
           },
           profile_pic_url: function()
           {
               return Config.FACE_RECOG_PROFILE_PIC_API.replace("{id}", this.username)
           }
        },        
        mounted() 
        {             
            var current_user = this.$cookies.get("user_id");            
            this.username = current_user;
            if (this.username == "")
                this.$refs.login_psswd.focus();            
            else
                this.$refs.username.focus();      
            
            return;
            
        },
        
        beforeDestroy()
        {
        },      
        methods: 
        { 
            
            authenticate()
            {
                this.status = "Processing...";
                let self = this;
                const loginData = {
                    'user':this.username,
                    'pwd':this.$refs.login_psswd.value
                }
                this.$store.dispatch("auth/doLogin",loginData).then(function()
                    {
                        // console.log(response);        
                        location.reload();                                       
                        // self.$router.push('/home');                        
                    })
                    .catch(function (error) 
                    {
                        self.status = "Login!";
                        self.$refs.login_psswd.focus();
                        self.msg = "Login failed !"+error;
                        // alert("Login Failed :"+error)
                    })
                    .finally(() => self.isBusy = false);
            }

           
        }

    }
</script>

<style>

    #capture-window 
    {
        text-align: center;        
        /* width: 300px;
        height: 300px; */
        position: relative;
        top:0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        display: flex;
        justify-content: center;              
    }
    #video {
        border-radius: 50%;
        background-color: aliceblue;
        width: 300px;
        height: 300px; 
        position: relative;
        top:0px;
        left: 0px;        
    }
    #canvas {
        display: none;
    }
    li {
        display: inline;
        padding: 5px;
    }
    .loading-style
    {
        position: relative;
        display: block; 
        top:0px;
        left: 0px;
        width:300px;
        height:300px;
        clear:left;
        float:left;
    }
    
</style>