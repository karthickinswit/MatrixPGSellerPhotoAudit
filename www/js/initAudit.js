define([
	"backbone",
	"mustache",
	"select2"
], function(Backbone, Mustache) {
	var InitAudit = {};
	InitAudit.Model = Backbone.Model.extend({

		initialize: function() {}                             
	});

	InitAudit.View = Backbone.View.extend({

		className: "audits",

		events:{
			"click .continue_audit": "continueAudit",
			"click .finish_audit" : "finishAudit",
			"click .take_store_photo": "takeStorePicture",
			"click .retake_store_photo": "takeStorePicture",
			"change .aud_confirmation" : "toggleConfirmationBlock",
			"click .back": "back"
		},

		startAudit: function(mId){
			var that = this;

			var pos = this.model.get("pos");
			console.log("position"+pos.lat);

			var id = mId.split("-");
            var auditId = id[0];
            var storeId = id[1];
            var channelId = id[2];

			that.getStoreName(mId);
			
            var ele = that.$el;
            selectCompletedAudit(db, mId, function(audit){
            	require(['templates/t_audit_confirmation'], function(template){
            		selectStoreStatus(db, function(response){

            			var yesStoreOptions = [],
            				noStoreOptions = [],
            				storeStatus = [],
            				len = response.length;

            			for(var i = 0; i < len; i++) {
            			    var obj = response.item(i);
            			    storeStatus.push(obj);
            			    if(obj.status_name !== "audited") {
            			        noStoreOptions.push(obj);
            			    }else {
            			    	yesStoreOptions.push(obj);
            			    }
            			}
            			LocalStorage.setAuditStatus(storeStatus);

	            		var html = Mustache.to_html(template, {
	            			"mId":mId,
	            			"name":that.storeName,
	            			"yesStoreOptions": yesStoreOptions,
	            			"noStoreOptions" : noStoreOptions
	            		});
						ele.append(html);

						if(audit.length > 0){
							audit = audit.item(0);
		            		var imageURI = audit.store_image;

		            		if(audit.audited == "false"){
		            			ele.find("#no").trigger("change").attr("checked", true);
		            			ele.find(".audit_no").val(audit.option_id);
		            		}

		            		if(imageURI){
		            			var imgTemplate = "<img src='{{imageURI}}' width='100%' height='300'><a class='retake_store_photo retake_photo'>Retake</a>";
								var html = Mustache.to_html(imgTemplate, {"imageURI":imageURI});

								ele.find(".take_store_photo").remove();
								ele.find(".photo_block").empty().append(html);
		            		}
						}
						
						// Audit not started yet
						//that.resetAuditStatus(storeId, auditId);

		                that.refreshScroll("continue_audit_wrapper");
            		});
				});
            });
		},

		resetAuditStatus: function(storeId, auditId) {
			var audit = {};
			audit.storeId = storeId;
			audit.auditId = auditId;
			audit.isContinued = false;					
			updateAuditStatus(db, audit);
		},

		continueAudit: function(event){
			var that = this;

//			var gpsDetect = cordova.require('cordova/plugin/gpsDetectionPlugin');
//	        gpsDetect.checkGPS(function onGPSSuccess(on) {
	        	//Check: GPS is enabled or not
	           /* if(!on){
	            	//GPS is OFF
	            	inswit.confirm("GPS/Location is switched off. Please enable the same to continue audit. \n\n Do you want to enable GPS?", function onConfirm(buttonIndex) {
				        if(buttonIndex == 1) {
				            gpsDetect.switchToLocationSettings(function onSwitchToLocationSettingsSuccess() {

	        				}, function onSwitchToLocationSettingsError(e) {
					            //inswit.alert("Error to switch GPS location: " + e);
					        });
				        }
				    }, "confirm", ["YES", "NO"]);
	            }else{*/
//            setTimeout(function(){

                var mId = $(event.currentTarget).attr("href");
                var id = mId.split("-");
                var auditId = id[0];
                var storeId = id[1];
				var channelId = id[2];
				var position = this.model.get("pos");


                var dist = getDistributor(db, auditId, storeId, function(distributor){

                    var image = $(".photo_block img").attr("src");
                    if(distributor != inswit.DISTRIBUTOR){ //For certain distributor photo is not mandatory
                        if(!image){
                            inswit.alert("Please take a store photo!");
                            return;
                        }
                    }

                    findStore(db, auditId, storeId, function(result){
                        //Store basic audit details
                        var auditStatus = that.$el.find(".audit_yes option:selected").val();

                        if(!auditStatus){
                            var optionName = that.$el.find(".audit_yes option:selected").text();

                            var storeStatusArr = LocalStorage.getAuditStatus();

                            for(var i = 0; i < storeStatusArr.length; i++){
                                var status = storeStatusArr[i];

                                if(status.status_name == optionName){
                                    auditStatus = status.status_id.toString();
                                }
                            }
                        }

                        var audit = {};
                        audit.storeId = storeId;
                        audit.auditId = auditId;
                        audit.id = result.id;
                        audit.isContinued = true;
                        audit.isCompleted = false;
                        audit.optionId = auditStatus;
                        audit.signImage = "";
                        audit.storeImage = image;
                        audit.lat = position.lat;
                        audit.lng = position.lng;
                        audit.storeImageId = "";
						audit.signImageId = "";
						audit.accuracy = position.accuracy;

                        /**
                         * Geolocation exists check done here because,
                         * There could be a possibility of multiple time revisit this page. So
                         * No need to capture every time if Geolocation is already captured.
                         */
                        selectCompletedAudit(db, mId, function(auditDetails){
                            if(auditDetails && auditDetails.length > 0 && auditDetails.item(0).lat){

                                if(auditDetails.item(0).comp_audit == "true" && auditDetails.item(0).audited == "false" && auditStatus == 8){
                                    audit.isCompleted = false;
								}else{
                                    audit.isCompleted = true;
                                }

                                populateCompAuditTable(db, audit, function(){
                                    var route = "#audits/" + mId + "/products";
                                    router.navigate(route, {
                                        trigger: true
                                    });

                                }, function(a, e){
                                    //Error callback of populateCompAuditTable function.
                                });

                            }else{
                                populateCompAuditTable(db, audit, function(){
									var route = "#audits/" + mId + "/products";
									router.navigate(route, {
										trigger: true
									});
                                   // that.setGeoLocation(auditId, storeId, getBack);
                                  //  $(".android").mask("Capturing Geolocation... Please wait...", 100);

                                }, function(a, e){
                                    //Error callback of populateCompAuditTable function.
                                });
                            }
                        }, function(a, e){
                            //Error callback of selectCompletedAudit function.
                        });
                    });
                }, function(a, e){
                    console.log(e);
                });
//            });
//	            }
//	        }, function onGPSError(e) {
//	            inswit.alert("Error : " + e);
//	        });
		},

		finishAudit: function(event){
			var that = this;

			if($(event.currentTarget).hasClass("clicked")){
				return;
			}
			$(event.currentTarget).addClass("clicked");
			var mId = $(event.currentTarget).attr("href");
			
			var id = mId.split("-");
            var auditId = id[0];
            var storeId = id[1];
			var channelId = id[2];
			var position = this.model.get("pos");


            that.auditId = auditId;
            that.storeId = storeId;

            getDistributor(db, auditId, storeId, function(distributor){

				var image = $(".photo_block img").attr("src");
	 			if(distributor != inswit.DISTRIBUTOR){//For certain distributor photo is not mandatory
					if(!image){
						inswit.alert("Please take a store photo!");
						$(event.currentTarget).removeClass("clicked");
						return;
					}
			    }

				var callback = function(isYes){
					$(event.currentTarget).removeClass("clicked");
					if(isYes == 1){

						findStore(db, auditId, storeId, function(result){
							var auditStatus = that.$el.find(".audit_no option:selected").val();
							
							if(!auditStatus){
								var optionName = that.$el.find(".audit_no option:selected").text();

								var storeStatusArr = LocalStorage.getAuditStatus();

								for(var i = 0; i < storeStatusArr.length; i++){
									var status = storeStatusArr[i];

									if(status.status_name == optionName){
										auditStatus = status.status_id.toString();
									}
								}
							}
							
							var audit = {};
							audit.storeId = storeId;
							audit.auditId = auditId;
							audit.id = result.id;
							audit.isContinued = false;
							audit.isCompleted = true;
							audit.optionId = auditStatus;
							audit.storeImage = image || "";
							audit.signImage = "";
							audit.lat = position.lat;
							audit.lng = position.lng;
							audit.storeImageId = "";
							audit.signImageId = "";
							audit.accuracy = position.accuracy;

							//Completed products need to cleared for audit status changed from 'YES' to 'NO'.
							clearCompProducts(db, auditId, storeId, function(){

								/**
								 * Geolocation exists check done here because, 
								 * There could be a possibility of multiple time revisit this page. So
								 * No need to capture every time if Geolocation is already captured.
								 */
								selectCompletedAudit(db, mId, function(auditDetails){
									if(auditDetails && auditDetails.length > 0 && auditDetails.item(0).lat){

										populateCompAuditTable(db, audit, function(){
											router.navigate("/audits/"+ mId + "/upload", {
					                        	trigger: true,
					                        	replace: true
					                    	});

										}, function(a, e){
											// Error callback of populateCompAuditTable function
										});

									}else{
										populateCompAuditTable(db, audit, function(){
												$(".android").unmask();
												router.navigate("/audits/"+ mId + "/upload", {
							                        trigger: true,
							                        replace: true
							                    });
										
											//that.setGeoLocation(auditId, storeId, getBack);
											//$(".android").mask("Capturing Geolocation... Please wait...", 100);

										}, function(a, e){
											// Error callback of populateCompAuditTable function
										});
									}

								}, function(a, e){
									// Error callback of selectCompletedAudit table
								});
								
							})
						});
						inswit.exitTimer();
                        LocalStorage.removeServerTime(mId);
					}
				}

				/*var gpsDetect = cordova.require('cordova/plugin/gpsDetectionPlugin');
		        gpsDetect.checkGPS(function onGPSSuccess(on) {
		        	
		        	//Check: GPS is enabled or not
		            if(!on){
		            	//GPS is OFF
		            
		            	$(event.currentTarget).removeClass("clicked");
		            	inswit.confirm("GPS/Location is switched off. Please enable the same to continue audit. \n\n Do you want to enable GPS?", function onConfirm(buttonIndex) {
					        if(buttonIndex == 1) {
					            gpsDetect.switchToLocationSettings(function onSwitchToLocationSettingsSuccess() {

		        				}, function onSwitchToLocationSettingsError(e) {
						            //alert("Error: " + e);
						        });
					        }
					    }, "confirm", ["YES", "NO"]);
		            }else{*/
		            	callback(1);
		          /*  }
		        }, function onGPSError(e) {
		            alert("Error : " + e);
		        });*/
            }, function(){

            });
		},

		//Get latitude and longitude position of the device
		setGeoLocation: function(auditId, storeId, fn){
			var pos = {
                lat: "",
                lng: ""
            };
			var that = this;

			var callback = function(pos, retry){
				if(retry){
					inswit.errorLog({
						"error":"GPS signal is weak, Not able to capture LAT/LNG", 
						"auditId":auditId, 
						"storeId":storeId
					});

					that.setGeoLocation(auditId, storeId, fn);
					return;
				}

				if(pos.lat){
					updateGeoLocation(db, auditId, storeId, pos);
					if(fn){
						fn();
					}
				}else{
					console.log("GPS error"+ pos);
					inswit.alert(""+pos.message);
					inswit.errorLog({
						"error":"GPS signal is weak, Not able to capture LAT/LNG", 
						"auditId":auditId, 
						"storeId":storeId
					});
					$(".android").unmask();
					if(fn){
                    	fn();
                    }
				}
			};

			var options = {
		    	maximumAge:inswit.MAXIMUM_AGE,
		    	timeout:inswit.TIMEOUT,
		    	enableHighAccuracy:true
			};
			inswit.getLatLng(callback, options, false);

		},

		takeStorePicture:function(event){
			var that = this;

			var mId = $(".continue_audit").attr("href");
			var time = inswit.getCurrentTime();
            time = inswit.getFormattedDateTime(time);
			var id = mId.split("-");
            var auditId = id[0];
            var storeId = id[1];
			var channelId = id[2];
			var position = this.model.get("pos");


			
			selectCompletedAudit(db, mId, function(data){
				var auditData = data[0];
				var lat = position.lat;
				var lng = position.lng;
				getStoreCode(db, storeId, function(storeCode){
					var callback = function(imageURI){
						that.refreshScroll("continue_audit_wrapper");
					}
	
					var takeEl = "take_store_photo";
					var retakeEl = "retake_store_photo";
					storeCode = storeCode + "Z" + "Lat: "+ lat + "Z" + "Lng: "+lng;
					inswit.takePicture(callback, takeEl, retakeEl, storeCode, time);
				});
			});
		},

		toggleConfirmationBlock: function(event) {
			if($(event.target).val() == 1){
			    this.$el.find(".continue_audit").css({"display":"block"});
			    this.$el.find(".audit_no_block, .finish_audit").css({"display":"none"});
			}else{
				this.$el.find(".continue_audit").css({"display":"none"});
			    this.$el.find(".audit_no_block, .finish_audit").css({"display":"block"});
			}
			this.refreshScroll("continue_audit_wrapper");
		},

		back: function(){
			//window.history.back();
		},

		getStoreName: function(mId){
			var that = this;

			fetchStoreName(db, mId, function(result){
				that.storeName = result.storeName;
			});
		},

		refreshScroll: function(wrapperEle) {
			if(!this.scrollView) {
				this.scrollView = new iScroll(wrapperEle);
			}
			this.scrollView.refresh();
		}

	});

	return InitAudit;
});