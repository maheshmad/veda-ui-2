
/**
 * NGP Communications Back Bone Module
 * This module is responsible in handling all communications between the client and the server. 
 * @returns
 */

/*
 * config
 */
class Config
{	
	static sockchannelpipeUrl = "./core/v1/sockjschannelpipe.js";
	static sockjslibUrl = "./jslib/sockjs.min.js";
	static stomplibUrl = "./jslib/stomp.min.js";
	static clientJslibUrl = "./jslib/clientjs.min.js";
	static stompSocketService = "/nxt-gen-portal/io";
}
/*
 * user action data packet
 */
class CommDataPckt
{
	constructor(args)
	{	
		this.sid = args['sid'];
	    this.commTyp = args['evtTyp'];            
	    this.commLbl = args['evtLbl'];
	    this.commVal = args['evtVal'];            
	    this.trid = args['trid'];
	    this.appid = args['appid'];
	    this.commData = args['commData']; 
	}
}

/*
 * user session model
 */
class ClientInfoModel
{
	constructor(args)
	{	
		this.sid = args['sid'];
        this.usrAgt = args['usrAgt'];
        this.bwsrNm = args['bwsrNm'];
        this.bwsrVer = args['bwsrVer'];
        this.ip = args['ip'];
        this.lat = args['lat'];
        this.ln = args['ln'];
        this.lng = args['lng'];             
        this.os = args['os'];
        this.scrW = args['scrW'];
        this.scrH = args['scrH'];             
		this.uid = args['uid'];
		this.fpid=args['fpid'];
		this.osver=args['osver'];
		this.scrW=args['scrW'];
		this.scrH=args['scrH'];
		this.scrAvailRes=args['scrAvailRes'];
		this.scrRes=args['scrRes'];
		// this.cnvas=args['cnvas'];
		this.coldepth=args['coldepth'];
		this.cpu=args['cpu'];
		this.device=args['device'];
		this.devicetype=args['devicetype'];
		this.devicevendor=args['devicevendor'];
		this.devicexdpi=args['devicexdpi'];
		this.deviceydpi=args['deviceydpi'];
		this.flashversion=args['flashversion'];
		this.fonts=args['fonts'];
		this.javaver=args['javaver'];
		this.ln=args['ln'];
		this.mimetypes=args['mimetypes'];
		this.plugins=args['plugins'];
		// this.scrprint=args['scrprint'];
		this.silverlightver=args['silverlightver'];
		this.sysln=args['sysln'];
		this.tmzone=args['tmzone'];				
	}

}


class NxpCommBackBone
{		
	clientDeviceData = null;
	uid = null;
	sid = null;
	appid = null;
	fpid = null;
	socket = null;
	
	/**
	 * 
	 */
	constructor(args)
	{
		console.log("Construction NxpCommBackBone with args = "+args);
		var me = this;
		
		if (args['appid'] == null || args['appid'] == '')
			throw "new NxpCommBackBone instance requires appid (application id) field to be present. Please refer to documentation";

		this.appid = args['appid'];
		
		if (args['callback'])
			this.callbackFn = args['callback'];
		
		var clientjsscript = document.createElement('script');
		clientjsscript.src = Config.clientJslibUrl; 
		clientjsscript.id = 'clientjslib'; 
		document.body.appendChild(clientjsscript);	    
		clientjsscript.onload = clientjsscript.onreadystatechange = function() 
		{
				console.log("clientjsscript lib loaded!!");		
				var clientData = me.getClientDeviceData();
				me.fpid = clientData.clientjs.getFingerprint();				
		};
		
		
		/*
		 * setup socket connection, if an external socket instance is passed in 
		 * then it should be used.
		 */	
		var script = document.createElement('script');
		script.src = Config.sockchannelpipeUrl; 
		script.id = 'sockjschannelpipelib'; 
		document.body.appendChild(script);	    
		
		script.onload =  script.onreadystatechange = function() 
		{
				console.log("sockjschannelpipe lib loaded!!");
				me.socket = new SocketChannelPipe({'ws':args['ws']});	
				
				/*
				* send the app launch data packet 
				*/
				me.sendCommDataPckt(new CommDataPckt({
					commTyp:"launch",            
					commLbl:"fpid",
					commVal:me.fpid,            
					trid:""
				}));
		};
								
		this.sid = this._uuidv4();

	}
	
	_uuidv4() 
	{
		  return 'xxxx-xxxx-yxxx-xxxxxxx'.replace(/[xy]/g, function(c) {
		    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		    return v.toString(16);
		  });
	}

	/**
	 * 
	 * @param commDataPckt
	 * @returns
	 */
	sendCommDataPckt(commDataPckt)
	{
		if (!(commDataPckt instanceof CommDataPckt))
			throw "The logUserActionEvent requires a param of type CommDataPckt class, Please refer to documentation";
				
		commDataPckt.appid = this.appid;
		/*
		 * set the random generated session id, this id will be refresh for 
		 * every page refresh.
		 */
		commDataPckt.sid = this.sid;
		/*
		 * the session information is captured during the launch time
		 * The ip address should be directly extracted on the server instead
		 * of being sent from the client.
		 */
		if (commDataPckt.evtTyp == "login")
		{
			/*
			 * Capture the user full device and session details on a app page launch event			 
			 */			
			var userclientdata = this.getClientDeviceData();
			var client = userclientdata.clientjs;

			if (commDataPckt.evtLbl == "uid")
				this.uid = commDataPckt.evtVal;
        	/*
        	 * record session info at login 
        	 */			
			var clientInfo = new ClientInfoModel({
						"sid":this.sid,
						"bwsrNm":userclientdata.browserName,	    
						"bwsrVer":userclientdata.version,
						"usrAgt":userclientdata.userAgent,
						"cid":"",
						"did":"",
						"ip":'',
						"lat":userclientdata.geoLat,	        	
						"lng":userclientdata.geoLng,	        		        	
						"uid":this.uid,
						"fpid":client.getFingerprint(),
						'os':client.getOS(),
						'osver':  client.getOSVersion(),
						"scrW":userclientdata.width,
	        			"scrH":userclientdata.height,						
						'scrAvailRes':  client.getAvailableResolution(),
						'scrRes':  client.getCurrentResolution(),
						'cnvas':  client.getCanvasPrint(),
						'coldepth':  client.getColorDepth(),
						'cpu':  client.getCPU(),						
						'device':  client.getDevice(),
						'devicetype':  client.getDeviceType(),
						'devicevendor':  client.getDeviceVendor(),
						'devicexdpi':  client.getDeviceXDPI(),
						'deviceydpi':  client.getDeviceYDPI(),
						'flashversion':  client.getFlashVersion(),
						'fonts':  client.getFonts(),
						'javaver':  client.getJavaVersion(),
						'ln':  client.getLanguage(),
						'mimetypes':  client.getMimeTypes(),						
						'plugins':  client.getPlugins(),
						'scrprint':  client.getScreenPrint(),
						'silverlightver':  client.getSilverlightVersion(),
						'sysln':  client.getSystemLanguage(),
						'tmzone':  client.getTimeZone(),

			})
						
			commDataPckt.commData = clientInfo;
		}
		
		
		this.socket.sendSocketEvent("","NXP_COMM", commDataPckt, "/app/nxp/comm");
	}
	
	/**
	 * echo for testing the connection
	 */
	echoEvent(commDataPckt)
	{
		this.socket.sendSocketEvent("","NXP_COMM", commDataPckt, "/app/test/echo");
	}
	
	
	/**
	 * return device data
	 */
	getClientDeviceData()
	{    	
		if (this.clientDeviceData != null)
			return this.clientDeviceData;
		
		this.clientDeviceData = {};
		var nVer = navigator.appVersion;
		var nAgt = navigator.userAgent;
		var browserName  = navigator.appName;
		var fullVersion  = ''+parseFloat(navigator.appVersion); 
		var majorVersion = parseInt(navigator.appVersion,10);
		var nameOffset,verOffset,ix;

		this.clientDeviceData.clientjs = new ClientJS();

		// In Opera, the true version is after "Opera" or after "Version"
		if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
		 browserName = "Opera";
		 fullVersion = nAgt.substring(verOffset+6);
		 if ((verOffset=nAgt.indexOf("Version"))!=-1) 
		   fullVersion = nAgt.substring(verOffset+8);
		}
		// In MSIE, the true version is after "MSIE" in userAgent
		else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
		 browserName = "Microsoft Internet Explorer";
		 fullVersion = nAgt.substring(verOffset+5);
		}
		// In Chrome, the true version is after "Chrome" 
		else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
		 browserName = "Chrome";
		 fullVersion = nAgt.substring(verOffset+7);
		}
		// In Safari, the true version is after "Safari" or after "Version" 
		else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
		 browserName = "Safari";
		 fullVersion = nAgt.substring(verOffset+7);
		 if ((verOffset=nAgt.indexOf("Version"))!=-1) 
		   fullVersion = nAgt.substring(verOffset+8);
		}
		// In Firefox, the true version is after "Firefox" 
		else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
		 browserName = "Firefox";
		 fullVersion = nAgt.substring(verOffset+8);
		}
		// In most other browsers, "name/version" is at the end of userAgent 
		else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < 
		          (verOffset=nAgt.lastIndexOf('/')) ) 
		{
		 browserName = nAgt.substring(nameOffset,verOffset);
		 fullVersion = nAgt.substring(verOffset+1);
		 if (browserName.toLowerCase()==browserName.toUpperCase()) {
		  browserName = navigator.appName;
		 }
		}
		// trim the fullVersion string at semicolon/space if present
		if ((ix=fullVersion.indexOf(";"))!=-1)
		   fullVersion=fullVersion.substring(0,ix);
		if ((ix=fullVersion.indexOf(" "))!=-1)
		   fullVersion=fullVersion.substring(0,ix);

		majorVersion = parseInt(''+fullVersion,10);
		if (isNaN(majorVersion)) {
		 fullVersion  = ''+parseFloat(navigator.appVersion); 
		 majorVersion = parseInt(navigator.appVersion,10);
		}
		var OSName="Unknown OS";
		if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
		if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
		if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
		if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";
		

		this.clientDeviceData.browserName = browserName;
		this.clientDeviceData.version  = fullVersion;
		this.clientDeviceData.majorVersion = majorVersion;
		this.clientDeviceData.appname = navigator.appName;
		this.clientDeviceData.userAgent = nAgt;    	    	
		this.clientDeviceData.width = window.innerWidth;
		this.clientDeviceData.height = window.innerHeight;
		this.clientDeviceData.os = OSName;
				
		if (navigator.geolocation) 
		{
			console.log("asking user geo location tracking permission!");
			var me = this;
			navigator.geolocation.getCurrentPosition(function(position)
			{
				me.clientDeviceData.geoLat = position.coords.latitude;
				me.clientDeviceData.geoLng = position.coords.longitude;
			});
		}
		
		return this.clientDeviceData;
	}
	
	

}

window.nxpCommBackBone = new NxpCommBackBone({"appid":"NXTGEN"});
