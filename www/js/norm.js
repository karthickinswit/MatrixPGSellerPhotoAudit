define([
	"backbone",
	"mustache",
	"select2"
], function(Backbone, Mustache) {
	var Norm = {};
	Norm.Model = Backbone.Model.extend({
		
		initialize: function() {}                             
	});

	Norm.View = Backbone.View.extend({

		className: "audits",

		events:{
			"click .take_product_photo": "takeProductPicture",
			"click .retake_product_photo": "takeProductPicture",
			"click .take_second_product_photo": "takeSecondProductPicture",
			"click .retake_second_product_photo": "takeSecondProductPicture",
			"click .product_done": "done",
			"click .back": "back",
			"change .execution_checkbox": "nonExecutionBrand",
			"click .scan_qr": "scanQR"
		},

		showNorms: function(mId, pId, product, hotspotPid){
			var that = this;

			this.getStoreName(mId);

			var id = mId.split("-");
            var auditId = id[0];
            var storeId = id[1];
            var channelId = id[2];

            var productName = product.product_name;

            this.model.set({
            	"pId":pId,
            	"productName":productName
            });

            var priority = product.priority;

            var hotspotExecution = false;
            if(priority == 10){
            	hotspotExecution = true;
            }

            var isFrontage = false;
            if(product.is_frontage == "true" || product.priority == 6){
            	isFrontage = true;
            }

			//Show completed norms(With user modified values)
			var fn = function(results){
				if(results.length > 0){
					require(['templates/t_audit_questions'], function(template){

						selectProduct(db, pId, channelId, function(product){

							var isImage = false;
							var imageURI = results[0].imageURI || "";
							if(imageURI){
								isImage = true;
							}

							var isOptImage = false;
							if(priority == 10){
								var optImageURI = results[0].optImageURI || "";
								if(optImageURI){
									isOptImage = true;
								}
							}
							
							var takePhoto = false;
							if(!imageURI && priority == 6){
								takePhoto = true;
							}

							if(!imageURI && priority == 10){
								takePhoto = true;
							}

							takeOptionalPhoto = false;
							if(!optImageURI && priority == 10){
								takeOptionalPhoto = true;
							}

							var html = Mustache.to_html(
								template,
								{
									"mId":mId, 
									"productName":productName,
									"productId":pId,
									"name":that.storeName,
									"imageURI":imageURI,
									"isImage":isImage,
									"optImageURI":optImageURI,
									"isOptImage":isOptImage,
									"takePhoto":takePhoto,
									"takeOptionalPhoto":takeOptionalPhoto,
									"isHotspot": that.model.get("isHotspot") || false,
									"priority": priority,
									"nonExecution": (results[0].nonExecution == "true")? true:false,
									"qrCode": results[0].qrCode

								}
							);

							that.$el.empty().append(html);

							var nonExecution = results[0].nonExecution;
                            var isChecked = (nonExecution == "true")? true:false;
                            if(isChecked) {
                                that.$el.find(".execution_checkbox").attr("checked", true);
                                that.$el.find(".take_product_photo, .take_second_product_photo").prop('disabled', true);
                            }else if(!isChecked && isImage) {
                                that.$el.find(".execution_checkbox").attr("disabled", true);
                            }

							that.$el.find("#frontage_applicable").trigger("change");
							
							that.refreshScroll("wrapper_norms");

							that.findQrCode(storeId, pId);

							return that;
						});
						
						return that;
					});
				}else{

					selectProduct(db, pId, channelId, function(product){
						require(['templates/t_audit_questions'], function(template){
							var takePhoto = false;
							takeOptionalPhoto = false;
							if(product.priority == 6){
								takePhoto = true;
							}

							if(priority == 10){
								takePhoto = true;
								takeOptionalPhoto = true;
							}

							var html = Mustache.to_html(
								template,
								{
									"mId":mId,
									"productName":productName,
									"productId":pId, 
									"name":that.storeName,
									"takePhoto": takePhoto,
									"takeOptionalPhoto":takeOptionalPhoto,
									"isHotspot": that.model.get("isHotspot") || false,
									"element":"retake_product_photo",
									"priority": priority
								}
							);
							that.$el.empty().append(html);
							that.refreshScroll("wrapper_norms");

							that.findQrCode(storeId, pId);
			
							return that;
						});
					});
				}
			}
			
			selectProductsToVerify(db, auditId, storeId, pId, fn);
		},

		findQrCode: function(storeId, pId) {
		    var that = this;
            findQrCodeAvailable(db, storeId, pId, function(result) {
                that.previousQRcode = result.qr_code || "";
               // that.$el.find(".qrcode_text").val(that.previousQRcode);
            });
		},

		takeProductPicture:function(event){
			var that = this;

			var mId = $(".product_done").attr("href");
			//var time = LocalStorage.getServerTime(mId);

			var time = inswit.getCurrentTime();
            time = inswit.getFormattedDateTime(time);

			var id = mId.split("-");
            var auditId = id[0];
            var storeId = id[1];
			var channelId = id[2];
			
			selectCompletedAudit(db, mId, function(data){
				var auditData = data[0];
				var lat = auditData.lat;
				var lng = auditData.lng;

				getStoreCode(db, storeId, function(storeCode){
					var callback = function(imageURI){
						that.refreshScroll("wrapper_norms");
					}
					
					var takeEl = "take_product_photo";
					var retakeEl = "retake_product_photo";

					storeCode = storeCode + "Z" + "Lat: "+ lat + "Z" + "Lng: "+lng;
					inswit.takePicture(callback, takeEl, retakeEl, storeCode, time);
				});
			});
		},

		takeSecondProductPicture: function(event){
			var that = this;

			var mId = $(".product_done").attr("href");

			var time = inswit.getCurrentTime();
            time = inswit.getFormattedDateTime(time);

			var id = mId.split("-");
            var auditId = id[0];
            var storeId = id[1];
			var channelId = id[2];
			
			selectCompletedAudit(db, mId, function(data){
				var auditData = data[0];
				var lat = auditData.lat;
				var lng = auditData.lng;

				getStoreCode(db, storeId, function(storeCode){
					var callback = function(imageURI){
						that.refreshScroll("wrapper_norms");
					}

					var priority = $(event.currentTarget).parents(".norms").attr("href");
					
					var takeEl = "take_second_product_photo";
					var retakeEl = "retake_second_product_photo";
					var appendEl = "opt_photo_block";

					storeCode = storeCode + "Z" + "Lat: "+ lat + "Z" + "Lng: "+lng;
					inswit.takePicture(callback, takeEl, retakeEl, storeCode, time, appendEl, priority);
				});
			});
		},

		//Store the product details in client side DB temporarly.
		update: function(mId, auditId, storeId, channelId){
			var that = this;
			var nonExecution;

			var takePhoto = "no";
			var ele = that.$el.find(".norms");
			var priority = ele.attr("href");
			
			if(priority == 10 || priority == 6){
				takePhoto = "yes"
			}

			if(that.$el.find("#frontage_applicable").val()){
				takePhoto = that.$el.find("#frontage_applicable").val().toLowerCase() || "no";
			}

			getDistributor(db, auditId, storeId, function(distributor){

				var image = $(".photo_block img").attr("src") || "";
				var optImage = $(".opt_photo_block img").attr("src") || "";

                var isHotspot = that.model.get("isHotspot");

                if(isHotspot) {
                    if(image.length > 0 && optImage.length == 0) {
                        inswit.alert(inswit.ErrorMessages.hotspotCloseup);
                        return;
                    }else if (image.length == 0 && optImage.length > 0) {
                        inswit.alert(inswit.ErrorMessages.hotspotLongShot);
                        return;
                    }
                }

				if(takePhoto == "no"){
					image = "";
				}

                var isChecked = that.$el.find(".execution_checkbox").is(':checked')
				if(image.length == 0 && !isChecked) {
                    inswit.alert(inswit.ErrorMessages.checkProceed);
                    return;
				}

				var pId = that.model.get("pId");
                var productName = that.model.get("productName");
                var qrCode = that.$el.find(".qrcode_text").val();




                var product = {};
                product.storeId = storeId;
                product.auditId = auditId;
                product.storeName = that.storeName;
                product.isContinued = true;
                product.isCompleted = false;
                product.image = "";
                product.imageId = "";
                product.imageURI = image || "";
                product.optImageId = "";
                product.optImageURI = optImage || "";
                product.priority = priority;
                product.pId = pId;
                product.productName = productName;
                product.nonExecution = isChecked;
                product.qrCode = qrCode;

                var callback = function(){

                    window.history.back();
                }
                if(isChecked) {
                    inswit.confirm(inswit.alertMessages.no_execution, function onConfirm(buttonIndex) {
                        if(buttonIndex == 2) {
                            return;
                        }else if(buttonIndex == 1) {
                            if(inswit.TIMER != 0) {
                                populateCompProductTable(db, product, callback);
                            }
                        }
                    }, "Confirm", ["Yes", "No"]);
                }else {
                    populateCompProductTable(db, product, callback);
                }


	 		}, function(){

	 		});
		},

		done: function(event){
			var that = this;

			var mId = $(event.currentTarget).attr("href");
			var id = mId.split("-");
            var auditId = id[0];
            var storeId = id[1];
            var channelId = id[2];

			that.update(mId, auditId, storeId, channelId, id);
		},

		getStoreName: function(mId){
			var that = this;

			fetchStoreName(db, mId, function(result){
				that.storeName = result.storeName;
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

		nonExecutionBrand: function() {
		    var element = this.$el.find(".execution_checkbox");
		    if(element.is(':checked')) {
		       this.$el.find(".take_product_photo, .take_second_product_photo, .scan_qr").prop('disabled', true);
		    }else {
		        this.$el.find(".take_product_photo, .take_second_product_photo, .scan_qr").prop('disabled', false);
		    }

		},

		scanQR: function() {
		     var that = this;
		     $(".qrcode_text").val("");
		     cordova.plugins.barcodeScanner.scan(
                   function (result) {
                          var qrCode = result.text;
                          if(that.previousQRcode && qrCode != that.previousQRcode) {
                                alert("QR code in the masters and asset are different");
                          }
                          $(".qrcode_text").val(result.text);

                   },
                   function (error) {
                       alert("Scanning failed: " + error);
                   }
            );
		}

	});

	return Norm;
});