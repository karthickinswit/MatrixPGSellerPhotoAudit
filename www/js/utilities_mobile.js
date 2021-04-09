//var PROJECTID = "1c62737aae0d11e59d090050569cb68c";   //development
//var PROJECTID = "97677c1832bc11e5a9bb0050569ccb08"; //demo
var PROJECTID = "d27520ec813311e5a9bb0050569ccb08"; //process
//var PROJECTID = "c7806c3ef39a11e69d090050569cb68c" //production - photoAudit
var inswit = {

	URI: "https://www.appiyo.com/",
	DB: "mxphotoaudit",

	PRIORITY:{
		PRIORITY_HIGH_ACCURACY:100,
		PRIORITY_BALANCED_POWER_ACCURACY:102,
		PRIORITY_LOW_POWER:104,
		PRIORITY_NO_POWER:105
	},

	TEST_ACCOUNT: {
		email: "",
		password: "",
	},
	
	VERSION : "2.6",

	ISSELLERAUDIT: true,

	LOGIN_CREDENTIAL: {
		"email": "admin@matrixbsindia.com",
		"password": "admin@matrix123"
	},

	LOGIN_PROCESS: {
		"projectId":PROJECTID,
		"workflowId":"8f3f33568f4f11e59d090050569cb68c",
		"processId":"8fa75b988f4f11e59d090050569cb68c"
	},

	UPLOAD_PROCESS: {
		"projectId":PROJECTID,
		"workflowId":"1e2d4f5e8f7711e59d090050569cb68c",
		"processId":"1e9139e28f7711e59d090050569cb68c"
	},

	FORGOT_PROCESS: {
		"projectId":PROJECTID,
		"workflowId":"15099ffeb29f11e59d090050569cb68c",
		"processId":"155378f4b29f11e59d090050569cb68c"
	},

	RESET_PROCESS: {
		"projectId":PROJECTID,
		"workflowId":"15099ffeb29f11e59d090050569cb68c",
		"processId":"bca4a7dcb2a311e5a9bb0050569ccb08"
	},

	SERVER_TIME: {
		"projectId":PROJECTID,
		"workflowId":"369c6db4ecfe11e69d090050569cb68c",
		"processId":"e8521820fcd411e69d090050569cb68c"
	},

	GET_DETAILED_AUDIT_PROCESS: {
		"projectId":PROJECTID,
		"workflowId":"47e6ab168f6711e5a9bb0050569ccb08",
		"processId":"484eb7568f6711e5a9bb0050569ccb08"
	},

	GET_ASSIGNED_AUDIT_PROCESS: {
		"projectId":PROJECTID,
		"workflowId":"ffa187448f5311e59d090050569cb68c",
		"processId":"0005eb8a8f5411e59d090050569cb68c"
	},

	INIT_PROCESS: {
		"projectId":PROJECTID,
		"workflowId":"369c6db4ecfe11e69d090050569cb68c",
		"processId":"d163cccc9feb11e5a9bb0050569ccb08"
	},

	SYNC_PROCESS: {
		"projectId":PROJECTID,
		"workflowId":"ffa187448f5311e59d090050569cb68c",
		"processId":"b2a6b55e057711e79d090050569cb68c"
	},

	ERROR_LOG: {
		"projectId": PROJECTID,
		"workflowId":"16307c78314711e69d090050569cb68c",
		"processId":"16837428314711e69d090050569cb68c",
	},

	ERROR_LOG_UPLOAD: {
		"projectId":PROJECTID,
		"workflowId":"9e8b3fa899b711e6a9bc0050569ccb08",
		"processId":"9edc962899b711e6a9bc0050569ccb08"
	},

	REGISTER_PROCESS: {
		"projectId":PROJECTID,
		"workflowId":"7d9893cedaed11eaa360c282e0885855",
		"processId":"7dca5c38daed11eaa360c282e0885855"
	},


	//Don't change the order.
	COLORS:[
		"#FF0000",
		"#808000",
		"#800080",
		"#000080",
		"#008000",
		"#008080",
		"#800080",
		"#F5DEB3",
		"#FF6347",
		"#A0522D",
		"#FA8072",
		"#663399",
		"#EEE8AA",
		"#778899",
		"#ADFF2F",
		"#DAA520",
		"#808080",
		"#000000",
		"#800000",
		"#4B0082"
	],

	//To this distributor photo is not mandatory
	DISTRIBUTOR: 33,

	/*TIMEOUT: 60000,//1min(4*1min=4min)

	MAXIMUM_AGE: 10000,//10s

	GPS_TIMER : 60000,//1 min*/

	TIMEOUT: 10000, //1sec(4*10sec=40sec)

    MAXIMUM_AGE: 10000, //10s

    GPS_TIMER : 20000, //20 sec

	GEO_RETRY: 1,

	TIMER: 0,

	TIMER_MIN: 0,

	uploadRetryLimit: 5,

	alertMessages : {
		"logOut" : "Are you sure you want to logout?",

		"restartAudit": "Already taken photos for this store will be deleted. Do you want to proceed?",

		"no_execution" : "You have chosen NonExecution. Are you sure you want to continue?"
	},

	ErrorMessages: {

		"noNetwork" : "check your network settings!",

		"password" : "* Enter valid password",

		"emailError" : "* Enter email id",

		"inValidEmailId" : "Invalid email id",

		"timerExceed": "Taking photos for this store exceeded the time limit.\nYou can restart taking photos by selecting the store from store list.",

		"oldTimerExceed": "Already taken photos for this store are invalid as the time exceeds the limit.\nYou will be navigated to Start page.",

		"hotspotLongShot": "Please take Longshot photo to continue.",

		"hotspotCloseup": "Please take Closeup photo to continue",

		"UploadAllFail": "Due to some network issue, some store photos failed to upload, \n so please try after some time.",

		"invalidMobileTime": "Looks like mobile date&time settings are changed.\nYou can restart taking photos by selecting the store from store list.",

		"checkProceed": "Please check Device Not executed to proceed."


	},

	ERROR_LOG_TYPES: {
		LOGIN_FAILED: "LOGIN_FAILED",
		IMAGE_UPLOAD: "IMAGE_UPLOAD",
		DB_CREATION: "DB_CREATION",
		DB_UPDATION: "DB_UPDATION",
		UPLOAD_AUDIT: "UPLOAD_AUDIT",
		UPDATE_MASTER: "UPDATE_MASTER",
		BULK_UPLOAD_FAIL: "BULK_UPLOAD_FAIL",
		GPS_FAIL: "GPS_CAPTURE_FAIL"
	},

	alert: function(msg, title) {
	    navigator.notification.alert( msg, function(){}, title || 'Alert'  );
    },
    
    confirm: function (msg, OnConfirm, title, buttons) {
        navigator.notification.confirm(
            msg,
            OnConfirm,
            title || 'Confirmation Dialog',
            buttons || ["Ok", "Cancel"]
        );
    },

    showLoaderEl: function(message){
    	require(["jquery"], function($){
	    	$(".loader-container").mask(message || "", 100);
    	});
    },

    hideLoaderEl: function(){
    	require(["jquery"], function($){
    		$(".loader-container").unmask();
    	});
    },

   	clearAudits: function(allAudits, processedAudits, newAuditDetails, isConsider){

    	var currentDate = new Date();
    	var currentYear = currentDate.getFullYear();
    	var currentMonth = currentDate.getMonth() + 1;
    	var currentDay = currentDate.getDate();

	    var i = allAudits.length;
    	while(i--){
    		var audit = allAudits[i];
    		var auditId = audit.auditId;
    		var storeId = audit.id;

    		if(newAuditDetails && newAuditDetails.stores && newAuditDetails.stores.length > 0){

    			var newAudits = newAuditDetails.stores;
    			var newAuditId = newAuditDetails.auditId;

    			var isValid = false;
	    		for(var k = 0; k < newAudits.length; k++){

	    			var newAudit = newAudits[k];
	    			var newStoreId = newAudit.sId;

	    			if(storeId == newStoreId && auditId == newAuditId){
	    				isValid = true;
	    				break;
	    			}
	    		}

				if(!isValid){
					var removedButCompleted = false;
					for(var l = 0; l < processedAudits.length; l++){
		    			var prosAudit = processedAudits[l];
		    			var prosAuditId = prosAudit.audit_id;
		    			var prosStoreId = prosAudit.store_id;
		    			var prosComp = prosAudit.comp_audit;

		    			if(storeId == prosStoreId && auditId == prosAuditId && prosComp == "true"){
		    				removedButCompleted = true;
		    				break;
		    			}
		    		}
		    		if(!removedButCompleted){
			    		allAudits.splice(i, 1);
			    		removeAudit(db, auditId, storeId, function(){});
			    		removeAuditHistories(db, auditId, storeId, function(){});
			    	}
				}	    		
    		}else if(isConsider === true){
    			var removedButCompleted = false;
				for(var l = 0; l < processedAudits.length; l++){
	    			var prosAudit = processedAudits[l];
	    			var prosAuditId = prosAudit.audit_id;
	    			var prosStoreId = prosAudit.store_id;
	    			var prosComp = prosAudit.comp_audit;

	    			if(storeId == prosStoreId && auditId == prosAuditId && prosComp == "true"){
	    				removedButCompleted = true;
	    				break;
	    			}
	    		}
	    		if(!removedButCompleted){
		    		allAudits.splice(i, 1);
		    		removeAudit(db, auditId, storeId, function(){});
		    		removeAuditHistories(db, auditId, storeId, function(){});
		    	}
    		}

    		// var isProcessed = false;
    		// for(var j = 0; j < processedAudits.length; j++){
    		// 	var pAudit = processedAudits[j];
    		// 	var pAuditId = pAudit.audit_id;
    		// 	var pStoreId = pAudit.store_id;
    		// 	var pComp = pAudit.comp_audit;

    		// 	if(storeId == pStoreId && auditId == pAuditId && pComp == "true"){
    		// 		isProcessed = true;
    		// 		break;
    		// 	}
    		// }

    		// if(!isProcessed){
    		// 	var date = audit.endDate;

	    	// 	date = date.split("-");
		    // 	var day = parseInt(date[0]);
		    // 	var month = parseInt(date[1]);
		    // 	var year = parseInt(date[2]);

		    // 	var clear = false;
		    // 	if(year < currentYear){
		    // 		clear = true;
		    // 	}else if(month < currentMonth){
		    // 		clear = true;
		    // 	}

		    // 	if(clear){

		    // 		allAudits.splice(i, 1);
		    // 		removeAudit(db, auditId, storeId, function(){});
		    // 		removeAuditHistories(db, auditId, storeId, function(){});
		    // 	}
    		// }
    	}
    },
    
	makeRequest: function(method, url,  callbacks, data){
		var success = checkConnection();
	   	if(!success) {
	   		if(callbacks.failure){
	   			callbacks.failure(0);
	   			return;
	   		}

	   		inswit.alert("No Internet Connection!", "Error");
	   		return;
	   	}

		var that = this;
		
		$.ajax({
			url: url,
			type: method,
			data: data,
			timeout: 90000, //60 sec
			dataType: 'json',
			cache: false,
			success: function(response, textStatus, jqXHR){

				callbacks.success.call(callbacks.scope, response);
			},
			failure: function () {
				inswit.hideLoaderEl();

				if(callbacks.failure){
					callbacks.failure(1);
					return;
				}

                that.alert('Check your network settings!');
            },
			error: function(jqXHR, textStatus, errorThrown){
				inswit.hideLoaderEl();

				if(callbacks.failure){
					callbacks.failure(2);
					return;
				}

				if(textStatus === "timeout"){
					that.alert("Check your network settings!");
				}else {
					if(that.networkAvailable()) {
						that.alert('Server error.Try again!');
					}
				}
			}
		});
	},

	executeProcess: function(processVariables, callbacks){
		
		var success = checkConnection();
		if(!success) {
	   		if(callbacks.failure){
	   			callbacks.failure(0);
	   			return;
	   		}

	   		inswit.alert("No Internet Connection!", "Error");
	   		return;
	   	}

		var that = this;

		var projectId = processVariables.projectId;
		var workflowId = processVariables.workflowId;
		var url = this.URI + "ProcessStore/d/workflows/" + workflowId + "/execute?projectId=" + projectId;

		processVariables = {"processVariables": JSON.stringify(processVariables)}
		
		$.ajax({
			url: url,
			type: "PUT",
			data: processVariables,
			timeout: 90000, //60 sec
			dataType: 'json',
			cache: false,
			success: function(response, textStatus, jqXHR){

				if(response.Error === "0"){
					callbacks.success.call(callbacks.scope, response);
				}else{
					if(callbacks.failure){
						callbacks.failure(2, response);
						return;
					}else{
						//inswit.alert("Server Error. Try Again Later!", "Error");
					}
				}	
			},
			failure: function() {
				inswit.hideLoaderEl();
				if(callbacks.failure){
					callbacks.failure(1);
					return;
				}

                that.alert('Check your network settings!');
            },
			error: function(jqXHR, textStatus, errorThrown){
				inswit.hideLoaderEl();
				if(callbacks.failure){
					callbacks.failure(2);
					return;
				}

				if(textStatus === "timeout"){
					that.alert("Check your network settings!");
				}else {
					if(that.networkAvailable()) {
						//that.alert('Server error.Try again later!');
					}
				}
			}
		});
	},

	networkAvailable: function() {
		var networkState = navigator.connection.type;
		if(isDesktop()){
	        return true;
	    }
		if(Connection.NONE == networkState) {
			return false;
		}
		
		return true;
	},

	sessionOut: function(callback) {
		LocalStorage.removeAccessToken();
		LocalStorage.removeEmployeeId();
		LocalStorage.resetAuditFilter();
		
		router.navigate("/", {
			trigger: true
		});
  	},

  	isValidSession: function() {
  		var isValid = false;
		var token = LocalStorage.getAccessToken();

		if(token)
			isValid = true;

		return isValid;
  	},

  	clearPhoto: function(imageList){

		// simple error handler
		function onFailure(e) {
	        console.log('Error: Image file delete failed');
		};
		// delete the file
		function onSuccess(fileEntry){

			fileEntry.remove(function(){
				console.log("Image file deleted");
			}, function(){
				console.log("Image file delete failed");
			});
		};

		for(var i = 0; i < imageList.length; i++){
			var imageURI = imageList[i].imageURI;
			if(imageURI){
				window.resolveLocalFileSystemURL(imageURI, onSuccess, onFailure);
			}	
		}
	},

	loginInToAppiyo: function(callback){
		var that = this;

		var data = {
			"email": inswit.LOGIN_CREDENTIAL.email.trim(),
			"password": inswit.LOGIN_CREDENTIAL.password.trim(),
			"longTermToken": true
		}

		var url = inswit.URI + "ProcessStore/account/login";
		inswit.makeRequest("POST", url, {
            success: function(response){    
               if(response.token) {
               		LocalStorage.setAccessToken(response.token);
					   
					// cordova.plugins.IMEI(function (err, imei) {
					// 	console.log('imei', imei)
					// 	callback(imei);
					// });
					callback();
				}else {
					inswit.alert("Login Failed.Try Again!");
					inswit.hideLoaderEl();
				}
            }, failure: function(error){
            	switch(error){
            		case 0:{
            			inswit.alert("No Internet Connection!");
            			break;
            		}
            		case 1:{
            			inswit.alert("Check your network settings!");
            			break;
            		}
            		case 2:{
            			inswit.alert("Login Failed.Try Again!");
            			break;
            		}
            	}
            	
            	inswit.hideLoaderEl();
            }
        }, data);
	},

	/**
	 * Get Latitude and longitude using HTML5 geolocation
	 * Recursively it may try twice with 30 seconds timeout(totally 1 minute)
	 * @param  {Function} callback [description]
	 * @param  {[type]}   options  [description]
	 * @param  {[type]}   retry    [description]
	 * @return {[type]}   object   [description]
	 */
	getLatLng: function(callback, options, retry){
		var that = this;

		options = {
			enableHighAccuracy:true,
			maximumAge:inswit.MAXIMUM_AGE,
			timeout: LocalStorage.getGpsTimeOut(),
			priority: inswit.PRIORITY.PRIORITY_HIGH_ACCURACY,
			fastInterval: 1000
		};

		that.getLatLngUsingLocationServices(callback, options, false);

		return;

        if(!this.startTime)
            this.startTime = new Date().getTime();

		var options = {
            enableHighAccuracy:true,
            maximumAge:inswit.MAXIMUM_AGE,
            timeout: LocalStorage.getGpsTimeOut(),
            priority: inswit.PRIORITY.PRIORITY_HIGH_ACCURACY
        };


//        that.getMobileNetworkLatLng(callback, options, false);
		
	/*	var success = checkConnection();
	   	if(!success) {
	   		inswit.hideLoaderEl();
	   		inswit.alert("No Internet Connection!", "Alert");
	   		return;
	   	}*/

		if(navigator.geolocation) {
		    navigator.geolocation.getCurrentPosition(
		    	function(position) {
		    		var pos = {
						lat: position.coords.latitude || "",
						lng: position.coords.longitude || ""
					};
					callback(pos);
					return;

		    	}, function(error) {
		    	    var pos = "";
		    	    callback(pos);
			    	/*options = {
						enableHighAccuracy:false,
				    	maximumAge:inswit.MAXIMUM_AGE,
		    			timeout: LocalStorage.getGpsTimeOut(),
					};

					if(retry){

		    			options = {
		    				enableHighAccuracy:false,
					    	maximumAge:inswit.MAXIMUM_AGE,
		    				timeout: LocalStorage.getGpsTimeOut(),
					    	priority: inswit.PRIORITY.PRIORITY_HIGH_ACCURACY
						};

		    			that.getLatLngUsingLocationServices(callback, options, false);
		    			return;
		    		}

		    		that.getLatLng(callback, options, true);*/

			    }, options);
		}else{
			options = {
				enableHighAccuracy:true,
		    	maximumAge:inswit.MAXIMUM_AGE,
		    	timeout: LocalStorage.getGpsTimeOut(),
		    	priority: inswit.PRIORITY.PRIORITY_HIGH_ACCURACY
			};

			that.getLatLngUsingLocationServices(callback, options, false);
		}
	},

	/**
	 * Get Latitude and longitude using Location services plugin
	 * Recursively it may try twice with 30 seconds timeout(totally 1 minute)
	 * @param  {Function} callback [description]
	 * @param  {[type]}   options  [description]
	 * @param  {[type]}   retry    [description]
	 * @return {[type]}   object   [description]
	 */
	getLatLngUsingLocationServices: function(callback, options, retry){
		var that = this;

		cordova.plugins.locationServices.geolocation.getCurrentPosition(
			function(position) {
				var pos = {
					lat: position.coords.latitude || "",
					lng: position.coords.longitude || "",
					accuracy: position.coords.accuracy || ""
				};
				callback(pos);
				return;

			}, function(error) {
				callback(error);
				if(retry){
					
					/*inswit.confirm("GPS signal is weak. Not able to capture LAT/LNG", function onConfirm(buttonIndex) {
				        if(buttonIndex == 1) {
				        	callback("", true);
				            return;
				        }else{
				        	callback("", false);
							return;
				        }
				    }, "confirm", ["Retry", "Cancel"]);*/
				    var options = {
                        enableHighAccuracy:true,
                        maximumAge:inswit.MAXIMUM_AGE,
                        timeout: LocalStorage.getGpsTimeOut(),
                        priority: inswit.PRIORITY.PRIORITY_HIGH_ACCURACY
                    };
				    that.getMobileNetworkLatLng(callback, options, false);
					return;
				}
				/* Low accuracy GPS */
		    	// options = {
		    	// 	enableHighAccuracy:false,
			    // 	maximumAge:inswit.MAXIMUM_AGE,
		    	// 	timeout: LocalStorage.getGpsTimeOut(),
			    // 	priority: inswit.PRIORITY.PRIORITY_NO_POWER
				// };

				// that.getLatLngUsingLocationServices(callback, options, true);

		    }, options);
	},


	getMobileNetworkLatLng: function(callback, options, retry) {
	    var that = this;

	    inswit.GPS_TIMER = LocalStorage.getNetworkGpsTimeout();

        var interval = setInterval(function(){
            if(new Date().getTime() - inswit.startTime >= inswit.GPS_TIMER){
                clearInterval(interval);

                callback("");
                return;
            }else{
                cordova.plugins.locationServices.geolocation.mobileNetworkLocation(
                    function(position) {
                        var pos = {
                            lat: position.coords.latitude || "",
							lng: position.coords.longitude || "",
							accuracy: position.coords.accuracy || ""
                        };
                        console.log("latitude"+position.coords.latitude);

                        clearInterval(interval);

                        callback(pos);
                        return;
                    }, function(error) {
                        //clearInterval(interval);

                        that.getMobileNetworkLatLng(callback, options, retry);
                       /* inswit.confirm("GPS signal is weak. Not able to capture LAT/LNG", function onConfirm(buttonIndex) {
                            if(buttonIndex == 1) {
                                callback("", true);
                                return;
                            }else{
                                callback("", false);
                                return;
                            }
                        }, "confirm", ["Retry", "Cancel"]);*/
                }, options);
            }
        }, inswit.GPS_TIMER);
	},

	/**
	 * [setColorCode: It will set the color code for audlit list based on the channel type]
	 * @param {[type]}   auditList [description]
	 * @param {Function} fn        [description]
	 */
	setColorCode: function(auditList, fn){

		var length = auditList.length;
		selectChannels(db, function(channels){

			var channelLength = channels.length;
			for(var i = 0; i < length; i++){
				for(var j = 0; j < channelLength; j++){

					var channel = channels.item(j);
					if(channel.channel_id == auditList[i].channelId){
						var channelName = channel.channel_name;
						var matches = channelName.match(/\b(\w)/g);
						var channelCode = matches.join('');

						auditList[i].color = inswit.COLORS[j];
						auditList[i].channelCode = channelCode;
						break;
					}
				}
			}

			fn(auditList);
		});
	},

	errorLog: function(error) {
		inswit.hideLoaderEl();

		var pVariables = {
		    "projectId":inswit.ERROR_LOG_UPLOAD.projectId,
		    "workflowId":inswit.ERROR_LOG_UPLOAD.workflowId,
		    "processId":inswit.ERROR_LOG_UPLOAD.processId,
		    "ProcessVariables":{
		    	"isSellerAudit": inswit.ISSELLERAUDIT,
		    	"executing": JSON.stringify(error),
		    	"empId":LocalStorage.getEmployeeId(),
		    	"issueDate":new Date(),
		    	"version": inswit.VERSION
		    }
		};

		inswit.executeProcess(pVariables, {
		    success: function(response){
		    	if(response.ProcessVariables){
		    		
		    	}
            }, failure: function(error){
            	inswit.hideLoaderEl();
            	switch(error){
            		case 0:{
            		//	inswit.alert("No Internet Connection!");
            			break;
            		}
            		case 1:{
            		//	inswit.alert("Check your network settings!");
            			break;
            		}
            		case 2:{
            		//	inswit.alert("Server Busy.Try Again!");
            			break;
            		}
            	}
            }
        });
	},

	takePicture: function(callback, takeEl, retakeEl, superImposeText, date, appendEl, priority) {
		var that = this;

		if($("."+ takeEl + ", ." + retakeEl).hasClass("disable")) {
			return;
		}
		
		$("."+ takeEl + ", ." + retakeEl).addClass("disable");

		if (!navigator.camera) {
			inswit.alert("Camera API not supported", "Error");
			return;
		}

		if(!date){
			date = new Date();
			date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
		}

		var cameraOptions = {
			quality: 50,
			destinationType: Camera.DestinationType.FILE_URI,//0=DATA_URL, 1=FILE_URI      
			sourceType: Camera.PictureSourceType.CAMERA,  // 0=Photo Library, 1=Camera, 2=Saved Album
			encodingType: Camera.EncodingType.JPEG,// 0=JPEG 1=PNG,
			targetWidth: 728,
	        targetHeight: 1024,
	        correctOrientation: true,
	        inbuiltCamera: true,
	        superImposeTimeStamp: true,
	        superImposeText:  superImposeText || ""
	    };

	    var oldImageURI = $(".photo_block img").attr("src") || "";
	    if(priority && priority == "10"){
	    	oldImageURI = $(".opt_photo_block img").attr("src") || "";
	    }

		navigator.camera.getPicture(function(imageURI) {
			var template = "<img src='{{imageURI}}' width='100%' height='300'><a class='{{element}} retake_photo'>Retake</a>";
			var html = Mustache.to_html(template, {"imageURI":imageURI, "element":retakeEl});

			$("." + takeEl).remove();
			if(priority && priority == "10"){
				$("." + appendEl).empty().append(html);		
			}else{
				$(".photo_block").empty().append(html);
			}

			callback();

			var imageList = [{"imageURI":oldImageURI}];
			inswit.clearPhoto(imageList);
			
			$("."+ takeEl + ", ." + retakeEl).removeClass("disable");
            $(".execution_checkbox").attr("disabled", true);

		},function(err) {

			callback();
			$("."+ takeEl + ", ." + retakeEl).removeClass("disable");

		}, cameraOptions);	
	},

	getServerTime: function(fn){
		var that = this;

        this.getLocalTime(fn);
        return;

		var success = checkConnection();
	   	if(!success) {
	   		inswit.alert("No Internet Connection!", "Error");
	   		fn("", 1);
	   		return;
	   	}

		var processVariables = {
		    "projectId":inswit.SERVER_TIME.projectId,
		    "workflowId":inswit.SERVER_TIME.workflowId,
		    "processId":inswit.SERVER_TIME.processId,
		    "ProcessVariables":{
		    	"empId":LocalStorage.getEmployeeId(),
		    	"isSellerAudit": inswit.ISSELLERAUDIT,
		    	"date":LocalStorage.getLastUpdatedDate() || "",
		    	"version": inswit.VERSION
		    }
		};
		
		inswit.executeProcess(processVariables, {
		    success: function(response){
		    	if(response.ProcessVariables && response.Error == "0"){
		    		var date = new Date(response.ProcessVariables.time);

		    		date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
		    		fn(date);
		    	}

            }, failure: function(error){
            	fn("");
            }
        });
	},

	getCurrentTime: function() {
        return new Date();
	},

	getFormattedDateTime: function(date) {
	    var formatDate = date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        return formatDate;
	},

	updateMasterData: function(processVariables, callback){
		var that = this;

		db.transaction(function(tx){
			var products = processVariables.brandChanMap;
			var productNormMap = processVariables.brandNormMap;
			var norms = processVariables.normOptionRemarkMap;
			var options = processVariables.options;
			var remarks = processVariables.remarks;
			var distributors = processVariables.DistributorBranch;
			var empId = LocalStorage.getEmployeeId();
			var channels = processVariables.channelList;
			
			var modified = false;
			//Remove and populate the product table
			if(products && products.length > 0){
				modified = true;

				removeTable(db, "mxpg_product", function(){
					populateProductTable(db, products, function(){}, function(error, info){
						
						var desc = {
							value: products,
							table: "mxpg_product"
						};

						var pVariables = {
						    "projectId":inswit.ERROR_LOG.projectId,
						    "workflowId":inswit.ERROR_LOG.workflowId,
						    "processId":inswit.ERROR_LOG.processId,
						    "ProcessVariables":{
						    	"errorType": inswit.ERROR_LOG_TYPES.UPDATE_MASTER,
						    	"isSellerAudit": inswit.ISSELLERAUDIT,
						    	"empId":empId,
						    	"issueDate": new Date(),
						    	"issueDescription": JSON.stringify(desc),
						    	"version": inswit.VERSION
						    }
						};
		
						inswit.executeProcess(pVariables, {
						    success: function(response){
						    	if(response.ProcessVariables){
						    		
						    	}
			                }, failure: function(error){
			                	inswit.hideLoaderEl();
			                	switch(error){
			                		case 0:{
			                			inswit.alert("No Internet Connection!");
			                			break;
			                		}
			                		case 1:{
			                			inswit.alert("Check your network settings!");
			                			break;
			                		}
			                		case 2:{
			                			inswit.alert("Server Busy.Try Again!");
			                			break;
			                		}
			                	}
			                }
			            });
					});
				});
			}

			// Remove and populate the Channel table
			if(channels && channels.length > 0){
				modified = true;

				removeTable(db, "mxpg_channel", function(){
					populateChannelTable(db, channels, function(){}, function(error, info){
						var desc = {
							value: channels,
							table: "mxpg_channel"
						};
						var pVariables = {
						    "projectId":inswit.ERROR_LOG.projectId,
						    "workflowId":inswit.ERROR_LOG.workflowId,
						    "processId":inswit.ERROR_LOG.processId,
						    "ProcessVariables":{
						    	"errorType": inswit.ERROR_LOG_TYPES.UPDATE_MASTER,
						    	"isSellerAudit": inswit.ISSELLERAUDIT,
						    	"empId":empId,
						    	"issueDate":new Date(),
						    	"issueDescription": JSON.stringify(desc),
						    	"version": inswit.VERSION
						    }
						};
		
						inswit.executeProcess(pVariables, {
						    success: function(response){
						    	if(response.ProcessVariables){
						    		
						    	}
			                }, failure: function(error){
			                	inswit.hideLoaderEl();
			                	switch(error){
			                		case 0:{
			                			inswit.alert("No Internet Connection!");
			                			break;
			                		}
			                		case 1:{
			                			inswit.alert("Check your network settings!");
			                			break;
			                		}
			                		case 2:{
			                			inswit.alert("Server Busy.Try Again!");
			                			break;
			                		}
			                	}
			                }
			            });
					});
				});
			}
			
			//Remove and populate the DistributorBranchLocationMap table
			if(distributors && distributors.length > 0){
				modified = true;

				removeTable(db, "mxpg_dist_brch_loc", function(){
					populateDistBranchLocationTable(db, distributors, function(){}, function(error, info){
						
						var desc = {
							value: distributors,
							table: "mxpg_dist_brch_loc"
						};

						var pVariables = {
						    "projectId":inswit.ERROR_LOG.projectId,
						    "workflowId":inswit.ERROR_LOG.workflowId,
						    "processId":inswit.ERROR_LOG.processId,
						    "ProcessVariables":{
						    	"errorType": inswit.ERROR_LOG_TYPES.UPDATE_MASTER,
						    	"empId":empId,
						    	"isSellerAudit": inswit.ISSELLERAUDIT,
						    	"issueDate":new Date(),
						    	"issueDescription": JSON.stringify(desc),
						    	"version": inswit.VERSION
						    }
						};
		
						inswit.executeProcess(pVariables, {
						    success: function(response){
						    	if(response.ProcessVariables){
						    		
						    	}
			                }, failure: function(error){
			                	inswit.hideLoaderEl();
			                	switch(error){
			                		case 0:{
			                			inswit.alert("No Internet Connection!");
			                			break;
			                		}
			                		case 1:{
			                			inswit.alert("Check your network settings!");
			                			break;
			                		}
			                		case 2:{
			                			inswit.alert("Server Busy.Try Again!");
			                			break;
			                		}
			                	}
			                }
			            });
					});
				});
			}

			//Remove completed audits from the DB
			if(modified){
				selectAllCompletedAudit(db, function(audits){
					var imageList = [];
					var i;
					if(audits.length > 0){
						for(i = 0; i < audits.length; i++){
							(function(index){
								var auditId = audits[index].audit_id;
								var storeId = audits[index].store_id;

								if(audits[index].comp_audit == "false"){
									imageList.push({"imageURI":audits[index].store_image});
									if(audits[index].audited == "true"){
										
										selectCompProducts(db, auditId, storeId, function(products){
											for(var j = 0; j < products.length; j++){
												var product = products[j];

												if(product.image_uri){
													imageList.push({"imageURI":product.image_uri});
												}
											}
											
											//Remove unfinished audit from the DB
											removeAudit(db, auditId, storeId, function(){
												if(index + 1 == audits.length){
													callback();
													//Clear unwanted photo from mobile cache
													inswit.clearPhoto(imageList);
												}
											});
										});
									}else{
										removeAudit(db, auditId, storeId, function(){
											if(index + 1 == audits.length){
												callback();
												//Clear unwanted photo from mobile cache
												inswit.clearPhoto(imageList);
											}
										});
									}
								}

								if(index + 1 == audits.length){
									callback();
									//Clear unwanted photo from the mobile cache
									inswit.clearPhoto(imageList);
								}

							})(i);
						}
					}else{
						callback();
					}
				});
			}else{
				callback();
			}					              
		});
	},


   	setTimer: function(elementName, minutes, seconds, storeId) {
   	    var element, endTime, hours, mins, msLeft;

        function twoDigits( n )
        {
           return (n <= 9 ? "0" + n : n);
        }

        function updateTimer()
        {
           msLeft = endTime - (+new Date);
           if ( msLeft < 1000 ) {
              inswit.stopTimer(elementName);
              $(".timer").text("0:00");
              inswit.confirm(inswit.ErrorMessages.timerExceed, function onConfirm(buttonIndex) {
                    if(buttonIndex == 1) {
                       router.navigate("/audits", {
                              trigger: true
                       });
                        return;
                    }
              }, "Confirm", ["Ok"]);
           } else {
               element = $("."+ elementName);
               time = new Date( msLeft );
               hours = time.getUTCHours();
               mins = time.getUTCMinutes();
               element.html((hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds() ));
               inswit.TIMER = setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
           }
        }

        element = $("."+ elementName);
        element.data("storeId", storeId);
        endTime = (+new Date) + 1000 * (60*minutes + seconds) + 500;
        updateTimer();
   	},

   	stopTimer: function(elementName) {
        clearTimeout(inswit.TIMER);
        inswit.TIMER = 0;
        var storeId = $("."+elementName).data('storeId');
        console.log(storeId);
        inswit.clearPartialAudit(storeId);
   	},

   	exitTimer: function() {
   	      clearTimeout(inswit.TIMER);
          inswit.TIMER = 0;
          $(".timer").text("").data('storeId', null);
   	},

   	 clearPartialAudit: function(storeId) {

        getProdImage(db, storeId, function(response){

            var imageList = [];
            var result = response.rows;
            var length = response.rows.length;
            if(length > 0) {
               for(var i = 0; i < length; i++){
                   var storeImage = result.item(i).image_uri;
                   imageList.push({
                       "imageURI":storeImage
                   });
               }
               console.log(imageList);
               inswit.clearPhoto(imageList);
            }

        });

        getStoreImage(db, storeId, function(response){
            var imageList = [];
            imageList.push({
               "imageURI":response.store_image
            });
            console.log(imageList);
            inswit.clearPhoto(imageList);

        });

        removePartialAudit(db, storeId);
	 },

	logGPSError: function(auditId, storeId, gpsError) {
		//this.$(".upload_container").show();
		//inswit.hideLoaderEl();
		var that = this;

		this.auditId = auditId;
		this.storeId = storeId;
		this.errorDesc = gpsError;
		
		var pVariables = {
			"projectId":inswit.ERROR_LOG.projectId,
			"workflowId":inswit.ERROR_LOG.workflowId,
			"processId":inswit.ERROR_LOG.processId,
			"ProcessVariables":{
				"isSellerAudit": inswit.ISSELLERAUDIT,
				"errorType": inswit.ERROR_LOG_TYPES.GPS_FAIL,
				"auditId": this.auditId, 
				"storeId": this.storeId,
				"empId":LocalStorage.getEmployeeId(),
				"issueDate":new Date(),
				"issueDescription": JSON.stringify(this.errorDesc),
				"version": inswit.VERSION
			}
		};

		inswit.executeProcess(pVariables, {
			success: function(response){
				if(response.ProcessVariables){
					removeErrorLog(db, that.auditId, that.storeId);
				}
			}, failure: function(error){
				//inswit.hideLoaderEl();
				populateErrorLogTable(db, auditId, storeId, JSON.stringify(gpsError), function(result){
				}, function(error){
				});
				switch(error){
					case 0:{
						inswit.alert("No internet connection, please enable");
						break;
					}
					case 1:{
						inswit.alert("Check your network settings!");
						break;
					}
					case 2:{
						inswit.alert("Server Busy.Try Again!");
						break;
					}
				}
			}
		});
	},
	 


};
