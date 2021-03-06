define([
	"backbone",
	"mustache",
	"select2"
], function(Backbone, Mustache) {
	var AuditDetails = {};
	AuditDetails.Model = Backbone.Model.extend({
		
		initialize: function() {}                             
	});

	AuditDetails.View = Backbone.View.extend({

		className: "audits",

		events:{
			"click .back": "back",
			"click .start_audit": "startAudit"
		},

		showAuditDetails: function(mId){
			var that = this;

			requestLocationAccuracy();

			var id = mId.split("-");
            var auditId = id[0];
            var storeId = id[1];
            var channelId = id[2];
			try{
				inswit.showLoaderEl("Fetching Audit Details");
				require(['templates/t_audit_details'], function(template){
					try{
						findStore(db, auditId, storeId, function(result){
							inswit.hideLoaderEl();
							var date = new Date();
			            	var formattedDate = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
			            	
			            	that.auditDetails = {
								name: result.store_name,
								storeId: result.store_id,
								id: result.id,
								storeCode: result.store_code,
								auditId: result.audit_id,
								distName: result.dbtr_name,
								location: result.loc_name,
								channelId: result.chl_id,
								channelName: result.chl_name,
								marketId: result.mkt_id,
								branchName: result.brch_name,
								address: result.addr,
								auditorName: result.adtr_name,
								auditorCode: result.adtr_code,
								date: formattedDate,
								lat:result.lat,
								lng:result.lng,
								mId:mId
							};
				 
							var html = Mustache.to_html(template, that.auditDetails);
							that.$el.empty().append(html);

							if(!window.reload){
								window.url = "async!http://maps.google.com/maps/api/js?sensor=false";//"https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&callback=initMap&v=weekly&channel=2";
							}
							
						var callback=function(pos,retry){	
							var position=pos;
							var element = document.getElementById("map");
							require([url], function(){
								
								var success = checkConnection();
							   	if(success && window.google) {
								   	/*
									* 1.Second time onwards there is a latitude and longitude.
									* 2.Creating map and marker based on that co-ordinates.
									*/
									
									
									if(result.lat != "" || result.lng != ""){
										var myLatLng = new google.maps.LatLng(result.lat, result.lng);
										var myOptions = {
											zoom: 16,
											center: myLatLng,
											mapTypeId: google.maps.MapTypeId.ROADMAP
									    };
										if(position.lat != "" || position.lng != ""){
											var myLatLng1 = new google.maps.LatLng(position.lat, position.lng);
											var myOptions1 = {
												zoom: 16,
												center: myLatLng1,
												mapTypeId: google.maps.MapTypeId.ROADMAP
											};

									    
									    var map = new google.maps.Map(element, myOptions);
										//var map1 = new google.maps.Map(element, myOptions1);

									    var marker = new google.maps.Marker({
									    	position: myLatLng,
									    	map: map,
									    	animation: google.maps.Animation.BOUNCE,
									    	title: result.store_name
									  	});
										  var marker1 = new google.maps.Marker({
									    	position: myLatLng1,
									    	map: map,
									    	animation: google.maps.Animation.DROP,
									    	title: result.store_name
									  	});


									}else{
										/*
										* 1.First time there is no latitude and longitude.
										* 2.I am using Geocoder service to get the latitude and longitude of the store address
										*   and creating marker based on that co-ordinates.
										*/
										
										var geocoder = new google.maps.Geocoder();
										geocoder.geocode({"address": result.addr}, function(results, status) {
										 	// If the Geocoding was successful
											if(status == google.maps.GeocoderStatus.OK) {
											    // Create a Google Map at the latitude/longitude returned by the Geocoder.
											    that.renderMap(results[0].geometry.location, result.store_name);
												
											}else{
												/*
												* 1.If store address is invalid, I am just showing auditor current position
												*/
												var isCalled = false;
												var callback = function(pos){
													isCalled = true;
													if(pos != ""){
														that.renderMap(pos ,result.store_name);
													}else{
														$(".map_error_info").text("There was an error loading location map! Network error/ Lat-Long not available");
													}
												};

												var options = {
											    	maximumAge:inswit.MAXIMUM_AGE,
		    										timeout:inswit.TIMEOUT,
											    	enableHighAccuracy:true
												};
												inswit.getLatLng(callback, options, false);

												if(that.tmr){
													clearTimeout(timer);
													timer = null;
												}

												that.tmr = setTimeout(function(){
													if(!isCalled){
														$(".map_error_info").text("There was an error loading location map! Network error/ Lat-Long not available");
													}
												}, 10000);
										  	}
										});
									}
									
							   	}else{

							   		window.reload = true;
							   		var timestamp = new Date().getTime();
									window.url = "async!http://maps.google.com/maps/api/js?sensor=false&t="+timestamp;

							   		$(".map_error_info").text("There was an error loading location map! Network error/Lat-Long not available");
							   	}
							}
						}, function(){

								window.reload = true;
								var timestamp = new Date().getTime();
								window.url = "async!http://maps.google.com/maps/api/js?sensor=false&t="+timestamp;
								
								$(".map_error_info").text("There was an error loading location map! Network error/Lat-Long not available");
							});
						
						}
					
						var options = {
							maximumAge:inswit.MAXIMUM_AGE_SECOND,
							timeout:inswit.TIMEOUT_SECOND,
							enableHighAccuracy:inswit.IS_HIGH_ACCURACY_SECOND
						};
						inswit.getLatLng(callback, options, false,true);  //LOCATION SECOND ATTEMPT


							that.refreshScroll("wrapper_audit_details");
						
							return that;

						}, function(error, w){
							var error = "Fetch Error: " + error;

							inswit.alert(error);
							inswit.alert(w);

						});
					}catch(e){
						var error = "Database Error: " + e;
						inswit.alert(error);
					}
				});
			}catch(e){
				var error = "Loading Error: " + e;
				inswit.alert(error);
			}
		},

		renderMap: function(pos, storeName){
			// Create a Google Map at the latitude/longitude returned by the Geocoder.
		    var myOptions = {
				zoom: 16,
				center: pos,
				mapTypeId: google.maps.MapTypeId.ROADMAP
		    };

		    var element = document.getElementById("map");
		    var map = new google.maps.Map(element, myOptions);

		    var marker = new google.maps.Marker({
		    	position: pos,
		    	map: map,
		    	animation: google.maps.Animation.BOUNCE,
		    	title: storeName
		  	});
		},

		back: function(){
			window.history.back();
		},

		refreshScroll: function(wrapperEle) {
			if(!this.scrollView) {
				this.scrollView = new iScroll(wrapperEle);
			}
			this.scrollView.refresh();
		},

		startAudit: function(event) {
			var that = this;
			var mId = $(event.currentTarget).attr("href");
			LocalStorage.setLocArray([]);
			
			var id = mId.split("-");
            var auditId = id[0];
            var storeId = id[1];
			var channelId = id[2];

			$(".android").mask("Capturing Geolocation... Please wait...", 100);
			
			
				var providerType="network";//inswit.provider_type;
				
					//that.advLatLng(storeId,auditId);

					if(inswit.watchPositionMethod)
					{
						var callback = function(GPSInfo){
							if(GPSInfo){
						var pos=JSON.parse(LocalStorage.getLocalPosition());
				//var	pos=j.length==0?"":j;
					if(pos.hasOwnProperty('lat'))
					{
						var storeLoc={}; 
					
						findStoreLatLng(db, auditId, storeId,function(result){
							storeLoc["lat"]=result.lat;
							storeLoc["lng"]=result.lng;
						var dis=storeLoc['lat']?(inswit.calculateDistance(storeLoc.lat,storeLoc.lng,pos.lat,pos.lng)):"No Master Data";
						var watchPositionParams=JSON.stringify(
							{				
								maximumAge: inswit.maximumAge,
								timeout: inswit.timeout,
								enableHighAccuracy: inswit.enableHighAccuracy,
								priority: inswit.priority,
								interval: inswit.interval,
								fastInterval: inswit.fastInterval
							}
						)
						var errInfo={"Location-Captured by Watch Position": storeId+' '+auditId+' '+JSON.stringify(pos)+" Distance : "+dis+" WatchPositionParams : "+watchPositionParams};
						inswit.logGPSError(auditId, storeId, errInfo);
						inswit.errorLog(errInfo);
						
						if(storeLoc&&storeLoc.lat!="")
						{
							var distance1=inswit.calculateDistance(storeLoc.lat,storeLoc.lng,pos.lat,pos.lng);
							console.log(distance1);
							if(distance1>inswit.DISTANCE_LOWER_LIMIT&&distance1<inswit.DISTANCE_HIGHER_LIMIT)
							{

								pos.lat=inswit.replaceLatLng(storeLoc.lat);
								pos.lng=inswit.replaceLatLng(storeLoc.lng);
								pos.isOverwrite=true;

							}

						$(".android").unmask();
						var route = "#audits/" + mId + "/continue/" + 
						JSON.stringify(pos);
						$(".android").unmask();
						LocalStorage.removeLocalPosition();
						router.navigate(route, {
							trigger: true
							});
						}
						else 
						{
							$(".android").unmask();
						var route = "#audits/" + mId + "/continue/" + 
						JSON.stringify(pos);
						$(".android").unmask();
						LocalStorage.removeLocalPosition();
						router.navigate(route, {
							trigger: true
							});

						}

						

						});

						
				
					}else 
					{
						$(".android").unmask();
					console.log("GPS error"+ pos);
					//populateErrorLogTable(db, auditId, storeId, JSON.stringify(pos));
					inswit.alert(""+pos.message);
					inswit.clearWatch();
					inswit.watchPosition();
					//Log GPS error in appiyo
					inswit.logGPSError(auditId, storeId, pos);
					
					$(".android").unmask();

					}

				}
				else 
				{
					$(".android").unmask();
					inswit.alert("GPS is Disabled On this Device");
					inswit.clearWatch();
					inswit.watchPosition();
					$(".android").unmask();
				}
				};
				inswit.isGPSInfo(callback);
				}
				else {
					setTimeout(function(){
					inswit.clearWatch();
				that.setGeoLocation(auditId, storeId, function(pos1){   //LOCATION FIRST ATTEMPT
					var storeLoc={}; 
					
					findStoreLatLng(db, auditId, storeId,function(result){
						storeLoc["lat"]=result.lat;
						storeLoc["lng"]=result.lng;
						
						var dis=storeLoc['lat']?(inswit.calculateDistance(storeLoc.lat,storeLoc.lng,pos1.lat,pos1.lng)):"No Master Data";
						var getPositionParams=JSON.stringify(
							{				
								maximumAge:inswit.MAXIMUM_AGE_FIRST,
								timeout:inswit.TIMEOUT_FIRST,
								enableHighAccuracy:inswit.IS_HIGH_ACCURACY_FIRST,
								priority: inswit.PRIORITY.PRIORITY_HIGH_ACCURACY,
								fastInterval: 1000
							}
						)
						var errInfo={"Location-Captured First Attempt": storeId+' '+auditId+' '+JSON.stringify(pos1)+" Distance : "+dis+" Params : "+getPositionParams};
					//populateErrorLogTable(db, auditId, storeId, JSON.stringify(errInfo));
						inswit.logGPSError(auditId, storeId, errInfo);
						inswit.errorLog(errInfo);
					
					
					
						if(storeLoc&&storeLoc.lat!="")
						{
							var distance1=inswit.calculateDistance(storeLoc.lat,storeLoc.lng,pos1.lat,pos1.lng);
							console.log(distance1);
							if(distance1<=inswit.DISTANCE_LOWER_LIMIT)
								{
									//pos1["advLatLng"]=posObject;
									var route = "#audits/" + mId + "/continue/" + 
									JSON.stringify(pos1);
									$(".android").unmask();
									router.navigate(route, {
													trigger: true
													});
							}
							else 
							{
								// var pos1=pos;
								 ///Second Attempt
								 setTimeout(function(){
									var callback = function(pos, retry){
										
										if(pos.lat){
											var dis1=(inswit.calculateDistance(storeLoc.lat,storeLoc.lng,pos1.lat,pos1.lng));
											var getPositionParams=JSON.stringify(
												{				
													maximumAge:inswit.MAXIMUM_AGE_SECOND,
													timeout:inswit.TIMEOUT_SECOND,
													enableHighAccuracy:inswit.IS_HIGH_ACCURACY_SECOND,
													priority: inswit.PRIORITY.PRIORITY_HIGH_ACCURACY,
													fastInterval: 1000
												}
											)
											var errInfo={"Location-Captured Second Attempt": storeId+' '+auditId+' '+JSON.stringify(pos)+" Distance : "+dis1+" Params : "+getPositionParams};
											inswit.logGPSError(auditId, storeId, errInfo);
											inswit.errorLog(errInfo);
											var distance2=inswit.calculateDistance(storeLoc.lat,storeLoc.lng,pos.lat,pos.lng);
											console.log(distance2);
											var route = "#audits/" + mId + "/continue/" ; 
											if(distance1<=distance2)
											{
												if(distance1>inswit.DISTANCE_HIGHER_LIMIT)
												{
													//pos1["advLatLng"]=posObject;
													route+=JSON.stringify(pos1);
												}
												else 
												{
													//pos1["advLatLng"]=posObject;
													pos1.lat=inswit.replaceLatLng(storeLoc.lat);
													pos1.lng=inswit.replaceLatLng(storeLoc.lng);
													pos1.isOverwrite=true;
													route+=JSON.stringify(pos1);
													
												}
											}
											else
											{
												if(distance2>inswit.DISTANCE_HIGHER_LIMIT)
												{
													//pos["advLatLng"]=posObject;
													route+=JSON.stringify(pos);
												}
												else
												{
													//pos["advLatLng"]=posObject;
													pos.lat=inswit.replaceLatLng(storeLoc.lat);
													pos.lng=inswit.replaceLatLng(storeLoc.lng);
													pos.isOverwrite=true;
													route+=JSON.stringify(pos);
													
												}
											}
											$(".android").unmask();
											router.navigate(route, {
											trigger: true
											});
											$(".android").unmask();
										}else{
											console.log("GPS error"+ pos);	
											inswit.alert(""+pos.message);							
											//Log GPS error in appiyo
											inswit.logGPSError(auditId, storeId, pos);											
											$(".android").unmask();
										}
									};
									var options = {
										maximumAge:inswit.MAXIMUM_AGE_SECOND,
										timeout:inswit.TIMEOUT_SECOND,
										enableHighAccuracy:inswit.IS_HIGH_ACCURACY_SECOND,
										priority: inswit.PRIORITY.PRIORITY_HIGH_ACCURACY,
										fastInterval: 1000
									};
									inswit.getLatLng(callback, options, false,true);  //LOCATION SECOND ATTEMPT
								},3000);
								
								
							}
			
						}
						else 
						{

							var route = "#audits/" + mId + "/continue/" + 
							JSON.stringify(pos1);
							$(".android").unmask();
							router.navigate(route, {
								trigger: true
								});
						}
					});
					
				});
			},0);
			}
			
			
				
			
		
		

		},


		//Get latitude and longitude position of the device
		setGeoLocation: function(auditId, storeId, fn){
			
			var pos = {
                lat: "",
                lng: ""
            };
			var that = this;

			var callback = function(pos, retry){
				// if(retry){
				// 	inswit.errorLog({
				// 		"error":"GPS signal is weak, Not able to capture LAT/LNG", 
				// 		"auditId":auditId, 
				// 		"storeId":storeId
				// 	});

				// 	that.setGeoLocation(auditId, storeId, fn);
				// 	return;
				// }

				if(pos.lat){
					if(fn){
						fn(pos);
					}
					
				}else{
					console.log("GPS error"+ pos);
					//populateErrorLogTable(db, auditId, storeId, JSON.stringify(pos));
					inswit.alert(""+pos.message);
	
					//Log GPS error in appiyo
					inswit.logGPSError(auditId, storeId, pos);
					
					$(".android").unmask();
				}
			};

			var options = {
				maximumAge:inswit.MAXIMUM_AGE_FIRST,
				timeout:inswit.TIMEOUT_FIRST,
				enableHighAccuracy:inswit.IS_HIGH_ACCURACY_FIRST,
				priority: inswit.PRIORITY.PRIORITY_HIGH_ACCURACY,
				fastInterval: 1000
			};
			inswit.getLatLng(callback, options, false);

		},

		advLatLng:function(storeId,auditId)
		{
			var providerType="network";
			inswit.getLatLngAdvanced(providerType,function(posObject){//Get Advanced GeoLocation
				console.log(posObject);
				if(posObject.provider){
				var audit={};
				audit.storeId=storeId;
				audit.auditId=auditId;
				audit.lat=posObject.latitude;
				audit.lng=posObject.longitude;
				audit.timeStamp=JSON.stringify(posObject.timestamp);
				populateLocAuditTable(db,audit);
				}
				else
				{
					var audit={};
				audit.storeId=storeId;
				audit.auditId=auditId;
				audit.lat=posObject.latitude||"";
				audit.lng=posObject.longitude||"";
				audit.timeStamp=JSON.stringify(posObject.timestamp)||"";
				populateLocAuditTable(db,audit);
				}
			},
			function(error){});
		}
		
	});

	return AuditDetails;
});
