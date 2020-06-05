var base_textext_url = "" // for real env use 
var base_facerecog_url = "" // for real env use 

if (window.location.host.indexOf("localhost") > 0)
{
//    base_facerecog_url = "http://localhost:5008" // for local dev use
   base_facerecog_url = "https://rnd.intellectseecapps.com" // for using hosted dev service
}

export default class Config
{    						
    /*
    * services
    *  
    */
    static get SOCKET_SERVICE() {return this.getApiUrl('/io/')}
    static get SPRING_SOCKET_SERVICE() {return this.getApiUrl('/hello/')}
    static get EVENT_SESSION_SOCKET_SERVER() {return this.getApiUrl('/veda-eventsession-wsocket')}
    static get EVENT_SESSION_START_API() {return this.getApiUrl('/veda/api/eventsessions/start')}
    static get EVENT_SESSION_JOIN_API() {return this.getApiUrl('/veda/api/eventsessions/join')}
    static get EVENT_SESSION_FULL_DETAILS() {return this.getApiUrl('/veda/api/eventsessions/details/')}
    /* 
    * security 
    */
    static get AUTH_SERVICE() {return this.getApiUrl('/veda/api/auth/login')}
    static get AUTH_FORGOT_PASSWORD_SERVICE() {return this.getApiUrl('/veda/api/auth/forgotpassword')}
    static get AUTH_USER_SERVICE() {return this.getApiUrl('/veda/api/auth/user')}
    static get AUTH_USER_LOGOUT() {return this.getApiUrl('/veda/api/auth/logoff')}
        
    /*
    * course
    */
    static get COURSE_SEARCH() {return this.getApiUrl('/veda/api/course/search')}
    static get COURSE_API() {return this.getApiUrl('/veda/api/course/')}
    static get CHAPTERS_SEARCH() {return this.getApiUrl('/veda/api/chapter/search')}
    static get CHAPTER_API() {return this.getApiUrl('/veda/api/chapter/')}
    static get TOPIC_API() {return this.getApiUrl('/veda/api/topic/')}
    static get TOPICS_SEARCH() {return this.getApiUrl('/veda/api/topic/search')}
    /*
    * slides
    */
    static get SLIDES_LIST_SEARCH_BY_TOPIC() {return this.getApiUrl('/veda/api/slides/topic/')}
    static get SLIDE_IMAGE_THUMB() {return this.getApiUrl('/veda/api/slides/image/thumb/')}
    static get SLIDE_IMAGE_LARGE() {return this.getApiUrl('/veda/api/slides/image/large/')}
    static get SLIDE_CONTENT_UPLOAD() {return this.getApiUrl('uploadslides')}
    static get SLIDE_GENERATE() {return this.getApiUrl('/veda/api/slides/generate/{topicid}/{uploadedfileid}')}
    /*
    * config
    */
    static get CONFIG_SECTIONS() {return this.getApiUrl('/veda/api/config')}
    static get CONFIG_UPDATE_SERVICE() {return this.getApiUrl('/veda/api/config')}
    static get CONFIG_SECTIONS_KEYVAL() {return this.getApiUrl('/veda/api/config/keyval')}
    /*
    * users
    */
    static get USER_SEARCH_SERVICE() {return this.getApiUrl('/veda/api/user/search')}
    static get USER_SERVICE() {return this.getApiUrl('/veda/api/user')}
    static get CHG_PASSWORD_SERVICE() {return this.getApiUrl('/veda/api/auth/updatepassword')}
    static get UPLOAD_PROFILE_IMAGE_SERVICE() {return this.getApiUrl('upload_profile_image')}
    static get PROFILE_IMAGE_THUMB_SERVICE() {return this.getApiUrl('/veda/api/user/image/large/')}
    static get ALLOWED_ACTIONS_API() {return this.getApiUrl('/veda/api/user/allowedactions/{recordType}/{recordId}')}
    /*
    *classroom 
    */
    static get CLASSROOM_API() {return this.getApiUrl('/veda/api/classroom/')}
    static get CLASSROOM_SEARCH() {return this.getApiUrl('/veda/api/classroom/search')}
    /*
    * enrollment
    */
    static get ENROLLMENT_API() {return this.getApiUrl('/veda/api/enrollment/')}
    static get CLASSROOM_ENROLLED_STUDENTS_SEARCH() {return this.getApiUrl('/veda/api/enrollment/search')}
    static get STUDENT_ENROLLED_CLASSES_SEARCH() {return this.getApiUrl('/veda/api/enrollment/search')}
    /*
    * event/class schedule
    */
    static get EVENT_SCHEDULE_API() {return this.getApiUrl('/veda/api/eventschedule')}
    static get CLASSROOM_SCHEDULE_SEARCH() {return this.getApiUrl('/veda/api/eventschedule/search')}
    static get STUDENT_SCHEDULE_SEARCH() {return this.getApiUrl('/veda/api/eventschedule/search')}
    static get EVENT_SESSION_SCHEDULE_DETAILS() {return this.getApiUrl('/veda/api/eventschedule/session/')}
    
    static get AUTH_API() {return this.getApiUrl("/nxt-gen-portal/api/userauth/login")}
    static get USER_AUTH_INFO_API() {return this.getApiUrl("/nxt-gen-portal/api/userauth")}
    static get FACE_RECOG_API() {return this.getApiUrl(base_facerecog_url+"/nxt-gen-ai-services/security/face-recog/login/auth")}
    static get FACE_RECOG_PROFILE_PIC_API() {return this.getApiUrl(base_facerecog_url+"/nxt-gen-ai-services/security/face-recog/profile-pic/{id}")}
    /*
    * textextraction api     
    */    
    static get TEXTEXT_FILES_LIST_API() {return this.getApiUrl(base_textext_url+"/nxt-gen-ai-services/textext/v2/files/tree")}
    static get TEXTEXT_VIEW_ORIG_IMG_API() {return this.getApiUrl(base_textext_url+"/nxt-gen-ai-services/textext/view/{fid}/page/{pgid}")}
    static get TEXTEXT_VIEW_EXRT_FILE_API() {return this.getApiUrl(base_textext_url+"/nxt-gen-ai-services/textext/file/{fid}/page/{pgid}")}
    static get TEXTEXT_VIEW_EXRT_TYP2_FILE_API() {return this.getApiUrl(base_textext_url+"/nxt-gen-ai-services/textext/file/type2/{fid}/page/{pgid}")}
    static get TEXTEXT_FILE_UPLOAD_API() {return this.getApiUrl(base_textext_url+"/nxt-gen-ai-services/textext/upload")}
    /*
    * builds and returns the restful service's url
    */
    static getApiUrl(serv)
    {									
        if (!serv)
            return "";
        
        var protocol = window.location.protocol.indexOf("https:")=== 0?"https":"http";
        /*
            * for socket service the protocol will 
            */
        if (serv.indexOf('/io') > -1)			
            protocol = window.location.protocol.indexOf("https:")=== 0?"wss":"ws";
        
        
        if (serv.indexOf("https://") > -1 || serv.indexOf("http://") > -1 || serv.indexOf("ws://") > -1 || serv.indexOf("wss://") > -1)
            return serv;
        else if (serv.indexOf(".com") > -1)
            return protocol+"://"+serv;
        else if (serv.indexOf("~") > -1)
            return protocol+"://"+window.location.host+serv.replace('~');
        else				
            return protocol+"://"+window.location.host+serv;
    }

    /**
     * 
     */
    static getAppConfigs()
    {
        return this.appConfigs;
    }
    
    /**
     * 
     */
    static setAppConfigs(cfgs)
    {
        this.appConfigs = acfg;
    }
    
    /**
     * The server config is loaded using this 
     * function
     */
    static loadAppConfigs()
    {
        console.log("loading app configs"); 
        var me = this;	
        var authUrl = Xedu.Config.getUrl(Xedu.Config.CONFIG_SECTIONS_KEYVAL);       	
        Ext.Ajax.request(
                {
                    url:authUrl ,
                    method: 'GET',	                
                    scope:this,	               
                    callback: function(response,success,operation)
                    {	                		                	
                        var respObj = null;
                        if (operation.responseText && operation.responseText != "" && operation.responseText.indexOf("<html>") == -1)
                        {
                            try
                            {
                                respObj = Ext.JSON.decode(operation.responseText);
//		                			console.log("config value = "+ respObj["GENERAL_DOMAIN_ROOT"]); /* this is to test */
                            }
                            catch(e)
                            {
                                /* ignore the error */
                                console.log(e);	                			
                            }
                        }
                        
                        if (respObj !=null)
                        {
                            me.setAppConfigs(respObj);
                        }
                        
                    }
                    
                });   
    }		
    
    /**
     * get the config value 
     */
    static getConfigValue(key)
    {
        var configs = this.getAppConfigs();						
        return configs[key];
    }

}