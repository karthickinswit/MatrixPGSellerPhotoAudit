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
            $(".android").unmask();
			
			

			var pos = this.model.get("pos");
			console.log("position"+pos.lat);

			var id = mId.split("-");
            var auditId = id[0];
            var storeId = id[1];
            var channelId = id[2];

			that.getStoreName(mId);
			var storeName=that.getStoreName(mId);
			
            var ele = that.$el;
           // selectCompletedAudit(db, mId, function(audit){
            	require(['templates/t_loc_confirmation'], function(template){
            		
					fetchStoreName(db, mId, function(result){
						that.storeName = result.storeName;
					
	            		var html = Mustache.to_html(template, {
	            			"mId":mId,
	            			"name":that.storeName
	            		});
						ele.append(html);
					});
						//ele.find(".center_content").text(that.storeName)
                        
                        //that.refreshScroll("continue_audit_wrapper");
						
						
						// Audit not started yet
						//that.resetAuditStatus(storeId, auditId);       
                   // that.refreshScroll("continue_audit_wrapper");
				});
                
          //  });
		
			// inswit.showLoaderEl("Fetching Location in to Matrix.. Please wait");

			// if(ele.find(".photo_block").empty()){console.log("Image is here")}
			// if(this.loginTimeout){
			// 	clearTimeout(this.timeOut);
			// 	this.timeOut = null;
			// }

			// this.loginTimeout = setTimeout(function(){
			// 	inswit.hideLoaderEl();
			// }, 30000);
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
                var mId = $(event.currentTarget).attr("href");
                var id = mId.split("-");
                var auditId = id[0];
                var storeId = id[1];
				var channelId = id[2];
				var position = this.model.get("pos");
                findStore(db, auditId, storeId, function(result){
                var image = $(".photo_block img").attr("src");
                 //For certain distributor photo is not mandatory
                    if(!image){
                        inswit.alert("Please take a photo!");
                        return;
                    }
                    var audit = {};
                    audit.storeId = storeId;
                    audit.auditId = auditId;
                    audit.id = result.id;
                    
                    audit.locPreviewImage = image;
					var infoObject={"Device":device,
									"NetworkInfo":navigator.network.connection.type,
									"isOnline":navigator.onLine,
									"userAgent":navigator.userAgent}
					audit.auditInfo=JSON.stringify(infoObject)
                    

                
                    populatLocPreviewTable(db, audit, function(){

                    setTimeout(function(){
                        
                        var pos=that.model.get("pos");
        
                            var route = "#audits/" + mId + "/continue/" + 
					            JSON.stringify(pos);
					            router.navigate(route, {
						            trigger: true
					            });
                        
                        },
                     0);
                    }, function(a, e){
                        //Error callback of populateCompAuditTable function.
                    });
                });

                



                
			
			
//            });
//	            }
//	        }, function onGPSError(e) {
//	            inswit.alert("Error : " + e);
//	        });
		},

		

		//Get latitude and longitude position of the device
		setGeoLocation: function(auditId, storeId,mId,gpsRetry, fn){
			$(".android").mask("Capturing Geolocation... Please wait...", 100);
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
		    	maximumAge:inswit.MAXIMUM_AGE,
		    	timeout:inswit.TIMEOUT,
		    	enableHighAccuracy:true
			};
			inswit.getLatLng(callback, options, false, storeId,auditId,mId,gpsRetry);

		},

		takeStorePicture:function(event){
			var that = this;
			var mId = $(event.currentTarget).attr("href");
			
			
			var mId = $(".continue_audit").attr("href");
			var time = inswit.getCurrentTime();
            time = inswit.getFormattedDateTime(time);
			var id = mId.split("-");
            var auditId = id[0];
            var storeId = id[1];
			var channelId = id[2];
			var position = this.model.get("pos");


			var gpsRetry=true;
			that.setGeoLocation(auditId, storeId,mId,gpsRetry, function(pos){
				//var auditData = data[0];
				var lat = pos.lat;
				var lng = pos.lng;
                that.model.set("pos",pos);
				getStoreCode(db, storeId, function(storeCode){
					var callback = function(imageURI){
						that.refreshScroll("continue_audit_wrapper");
					}
	
					var takeEl = "take_store_photo";
					var retakeEl = "retake_store_photo";
					storeCode = storeCode + "Z" + "Lat: "+ lat + "Z" + "Lng: "+lng;
					inswit.takePicture(callback, takeEl, retakeEl, storeCode, time);
				});
            })
		
		},

		back: function(){
			//window.history.back();
		},

		getStoreName: function(mId){
			var that = this;

			fetchStoreName(db, mId, function(result){
				that.storeName = result.storeName;
			});
			return that.storeName;
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