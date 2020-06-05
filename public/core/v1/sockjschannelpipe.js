class SocketEventModel
{
	constructor(args)
	{
		this.id = args['id'];
		this.key = args['key'];
		this.msg = args['msg'];
		this.type = args['type'];
		this.to = args['to'];
		this.from = args['from'];
		this.data = args['data'];
	}
}

class SocketChannelPipe
{
	connected = false;
	uid = null;
	event_queue = [];
	stompclient = null;
	fpid = null;
	
	constructor(args)
	{
		this.sockjs = null;	
		/*
		 * the below code will dynamically load the library 
		 * script and initiate the connection.
		 */
		var sockjsscript = document.createElement('script');
	    sockjsscript.src =  Config.sockjslibUrl;  
	    sockjsscript.id = 'sockjslib'; 
	    document.body.appendChild(sockjsscript);
	    var me = this;
	    sockjsscript.onload = sockjsscript.onreadystatechange = function() 
	    {
			console.log("sockjs lib loaded!!");
			var stompscript = document.createElement('script');
			stompscript.src =  Config.stomplibUrl; 
			stompscript.id = 'stomplib'; 
			document.body.appendChild(stompscript);
			stompscript.onload = stompscript.onreadystatechange = function() 
			{
				console.log("stomp library is loaded...!");
				me.establishConnection();
			};
	    };
	}
	
	initiate()
	{
		
		/*
		 * on open is the main callback on a
		 * successful connection
		 */
//		this.sockjs.onopen = function() 	
//		{        
//			console.log(this,"sockjs connection opened");
//			me.connected = true;
//			
//			/*
//            * If the event queue is not empty, then process all
//            * the pending events.
//            */
//		   var eventQ = me.event_queue;
//           if (eventQ && eventQ.length)
//           {
//        	   for (var i=0;i<eventQ.length;i++)
//        	   {
//	    			if (eventQ[i])
//	    			{
//	   	        		console.log(this,"sending event["+i+"] from queue "); 
//	   	        		me.ws.send(JSON.stringify(eventQ[i]));
//		    			eventQ.splice(i, 1); /* removing the event after its processed */
//	    			}		    	    			
//		    	}
//	   		}
//		};
//	
//		this.sockjs.onmessage = function(e) 
//		{
//			console.log(this,"recieved message = "+e.data);			
//		};
//	
//		this.sockjs.onclose = function() 
//		{        
//			console.log(this,"websocket closed!!!");
//			me.connected = false;
//		};
//	
		// this.sockjs.onerror = function() 
		// {        
		// 	console.error(this,"an error occured while connecting to websocket connection!! ");  
		// 	me.connected = false;
		// };
		
	}

	/**
	 * establish stomp connection
	 */
	establishConnection()
	{
		
		/*
		 * setting up websockets
		 */
		var me = this;
		var websocket_service =  Config.stompSocketService;
		console.log("connecting to sockjs service ...."+websocket_service);
		this.sockjs = new SockJS(websocket_service);
		
		console.log("about to establish stomp connection....!!");
		
		var error_callback = function(error) 
		{ 	
			me.connected = false;

			setTimeout(function()
			{
				console.log("Lost connection to User Analytics! Reconnecting in 3 secs!!!!!");
				me.stompclient = Stomp.over(me.sockjs);    	
				me.establishConnection();
			}, 3000);			    
		};
	
		var connect_callback = function() 
		{
			console.log("stomp connect callback success!!!!!!");
			me.connected = true;
			me.stompclient.reconnect_delay = 3000;

			/*
			* If the event queue is not empty, then process all
			* the pending events.
			*/
			me._processEventQueue();
			
			/*
			* register call back subscriptions
			*/
			me.stompclient.subscribe('/user/queue/echo', function (echoMsg)
			{
					console.log("***************************** ECHO ***********");
					console.log(echoMsg);
					console.log("***************************** ECHO ***********");
			});
			
			/*
			* register call back subscriptions to get back any server side errors
			*/
			me.stompclient.subscribe('/user/queue/errors', function (echoMsg)
			{
					console.error("***************************** ERROR ***********");
					console.error(echoMsg.body	);
					console.error("***************************** ECHO ***********");
			});
			
		};
		
		me.stompclient = Stomp.over(this.sockjs);    	
		me.stompclient.connect({}, connect_callback, error_callback); 

	}


	_processEventQueue()
	{
		var eventQ = this.event_queue;
		if (eventQ && eventQ.length)
		{
			for (var i=0;i<eventQ.length;i++)
			{
				if (eventQ[i])
				{
					console.log(this,"sending event["+i+"] from queue "); 
					this.stompclient.send(eventQ[i].to, this.buildConnectionHeader(eventQ[i]) ,JSON.stringify(eventQ[i]));
					eventQ.splice(i, 1); /* removing the event after its processed */
				}		    	    			
			}
		}
	}
	
	/*
	* @private function
	*/
	_pushEventToSendQueue(evt)
	{
		console.log("pended the event into send queue...");
		this.event_queue.push(evt);
	}
	
	/**
	 * 
	 */
	sendSocketEvent(id, key, eventMsg, destination)
	{				
		var event = new SocketEventModel({'to':destination,'id':id, 'key':key, 'msg':eventMsg, 'pr':"LOW"});
		var headers = {};
		this._pushEventToSendQueue(event);
		
		if (this.stompclient == null || !this.connected)
		{			
			// this.initiate();
			return;
		}		
				
		this._processEventQueue();
	}
	
	/**
	 * This is a common module to build the stomp headers
	 * Usually when a client logins, the uid key captures the userid,
	 * this will be passed in as simpHeader in stomp, so that the session
	 * can establish that as a user principal. 
	 * 
	 * Here we are not caring about the security as such and believe the client to send 
	 * the valid and accurate information.
	 */
	buildConnectionHeader(event)
	{
		var headers = {};
		
		if (event.msg && event.msg['evtLbl'] == "fpid")
		{
			headers['fpid'] = event.msg['evtVal'];
			/*
			 * save the browser fingerprint id so that it could uniquely identify the user.
			 * This id is useful in identifying a user who is not logged in.
			 */
			this.fpid = event.msg['evtVal']; 
		}
		
		if (this.fpid != null)
			headers['fpid'] = this.fpid;
			
		return headers;
	}
	
	
	
}
