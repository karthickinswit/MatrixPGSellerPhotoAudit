define([
	"backbone",
	"mustache",
	"select2"
], function(Backbone, Mustache) {
	var Upload = {};
	Upload.Model = Backbone.Model.extend({
		
		initialize: function() {}                             
	});

	Upload.View = Backbone.View.extend({

		className: "audits",

		events:{
			"click .upload_audit": "upload"
		},

		onUploadAudit: function(mId) {
			var that = this;
			
			require(["templates/t_audits_upload"], function(template){
				
				fetchStoreName(db, mId, function(result){
					that.storeName = result.storeName;

					var html = Mustache.to_html(template, {"mId": mId, "name": that.storeName});
	            	that.$el.html(html);
				});
            });
		},

		upload: function(event){
			var that = this;

			if(that.$el.find(".upload_audit").hasClass("clicked")){
				return;
			}

			that.$el.find(".upload_audit").addClass("clicked");
			inswit.showLoaderEl("Preparing data... Please wait...");

			var mId = $(event.currentTarget).attr("href");
			
			var id = mId.split("-");
            that.auditId = id[0];
            that.storeId = id[1];
            that.channelId = id[2];
           
            that.retry = 0;

			selectCompletedAudit(db, mId, function(audit){
			
				if(audit.length > 0){
					
					var storeImage = audit.item(0).store_image;
					var signImage = audit.item(0).sign_image;
					var storeImageId = audit.item(0).store_image_id;
					var signImageId = audit.item(0).sign_image_id;

					var imageList = [];
					imageList.push({
						"auditId":that.auditId,
						"storeId":that.storeId,
						"productId":"storeImage",
						"productName":"Store",
						"imageURI":storeImage,
						"image":storeImageId
					});

					var completed = audit.item(0).comp_audit;

					var audited = audit.item(0).audited;

					if(completed == "true" && audited == "true"){
						imageList.push({
							"auditId":that.auditId,
							"storeId":that.storeId,
							"productId":"signImage",
							"productName":"Sign",
							"imageURI":signImage,
							"image":signImageId
						});

						selectAllCompProducts(db, that.auditId, that.storeId, function(products){
							
							that.products = products;
							//Get unique product, image list
							selectCompProducts(db, that.auditId, that.storeId, function(productList){
							
								for(var i = 0; i < productList.length; i++){
									var p = productList[i];
									/**
									 * Priority 8 means hotspot brands
									 * Hotspot brands should not have images thats why i restricted based on priority
									 * Sometimes hotspot and Frontage brand also doesn't had image, thats why i am checking image_uri
									 */
									if(p.priority != 8 && p.image_uri){
										imageList.push({
											"auditId":that.auditId,
											"storeId":that.storeId,
											"productId":p.product_id,
											"productName":p.product_name,
											"imageURI":p.image_uri,
											"image":p.image_id
										});

										if(p.priority == 10 && p.opt_image_uri){
											
											imageList.push({
												"auditId":that.auditId,
												"storeId":that.storeId,
												"productId":p.product_id,
												"productName":p.product_name,
												"imageURI":p.opt_image_uri,
												"image":p.opt_image_id,
												"isHotspotSecond":true
											});
										}
									}
								}

								that.$(".upload_container").hide();
								that.uploadPhoto(imageList, 0, imageList.length);
							});
						});
					}else{
						that.uploadPhoto(imageList, 0, imageList.length);
					}
                }else{
                	inswit.hideLoaderEl();
                	that.$el.find(".upload_audit").removeClass("clicked");
                	
                }
			}, function(a, e){
				inswit.hideLoaderEl();
				that.$el.find(".upload_audit").removeClass("clicked");
			});
		},

		//Upload images one by one to the Alfresco Server
		uploadPhoto: function(imageList, index, length, isRetry){
			var that = this;

			var success = checkConnection();
		   	if(!success) {

		   		inswit.alert("No Internet Connection!", "Alert");
		   		inswit.hideLoaderEl();
		   		that.$el.find(".upload_audit").removeClass("clicked");
		   		return;
		   	}

			//Call upload audit function once all images are uploaded successfully
			if(length == 0){
				that.uploadAudit(imageList);
				that.$el.find(".upload_audit").removeClass("clicked");
				return;
			}

			//Retry happen twice per image
			if(isRetry){
				that.retry = that.retry + 1;
				if(that.retry >= 2){
					inswit.hideLoaderEl();
					inswit.alert("Image upload failed! Try again later!");
					that.imageUploadFailure(imageList, index);
					that.$el.find(".upload_audit").removeClass("clicked");
					return;
				}
			}else{
				that.retry = 0;
			}

			//IF ImageURI is undefined just skip that image and going to next.
			var imageURI = imageList[index].imageURI;
			if(!imageURI || imageURI == "undefined"){
				that.uploadPhoto(imageList, index+1, length-1);
				return;
			}

			//IF imageId is there means is already uploaded,
			var imageId = imageList[index].image;
			if(imageId){
				that.uploadPhoto(imageList, index+1, length-1);
				return;
			}

			var date = new Date().toJSON();
			var fileName = LocalStorage.getEmployeeId() + "_" + imageList[index].auditId + "_" + imageList[index].storeId + "_"+ imageList[index].productId + "_" + date.replace(/([.:])/g, "-");

			var options = new FileUploadOptions();
		    options.fileKey = "file"; //depends on the api
		    options.fileName = fileName + ".jpg";
		    options.mimeType = "image/jpeg";
		    options.headers = {"X-Requested-With":"XMLHttpRequest"};
		    options.fileName.replace("." , ":");

            //inswit.errorLog({"Info": "Photo Upload Initiated"});
		    //Success fallback function for image upload
		    inswit.showLoaderEl("Uploading " + imageList[index].productName + " picture");
		    var onSuccess = function(response){
		    	var result = JSON.parse(response.response);
		    	if(response.responseCode == 200 && result.ok){

		    	//inswit.errorLog({"Info": "Photo Upload Completed"});
		    		var auditId = imageList[index].auditId;
		    		var storeId = imageList[index].storeId;
		    		var productId = imageList[index].productId;

					if(!result.info.id){
						//Retry the same image
						that.uploadPhoto(imageList, index, length, true);
						return;
					}
					var image = result.info.id;
					imageList[index].image = image;

					if(productId == "storeImage"){
						updateStoreImageId(db, auditId, storeId, image, function(){
							that.uploadPhoto(imageList, index+1, length-1);
							return;
							
						}, function(a, e){
							that.uploadPhoto(imageList, index, length);
							return;

						});
					}else{

						if(imageList[index].isHotspotSecond == true){
							updateSecondProductImageId(db, auditId, storeId, productId, image, function(){

								that.uploadPhoto(imageList, index+1, length-1);
								return;

							}, function(a, e){
								that.uploadPhoto(imageList, index, length);
								return;
							});
						}else{
							updateProductImageId(db, auditId, storeId, productId, image, function(){

								that.uploadPhoto(imageList, index+1, length-1);
								return;

							}, function(a, e){
								that.uploadPhoto(imageList, index, length);
								return;
							});
						}
					}
		    	}else{
		    		that.uploadPhoto(imageList, index, length, true);
		    	}
		    }

		    //Failure fallback function for image upload
		    var onFail = function(e){
		    	/**
		    	 * If file is not found in STORAGE
		    	 * Mark as not found and SKIP that file
		    	 * else
		    	 * Retry the same file to upload once again
		    	 */ 
		    	//inswit.errorLog({"Info": "Photo Upload failed"});

		    	if(e.code == FileTransferError.FILE_NOT_FOUND_ERR) {
		    		console.log("Image not found!");
		    		that.imageUploadFailure(imageList, index, e);
	
					//This is not retry, skip current image and start upload next
					that.uploadPhoto(imageList, index+1, length-1);
					return;

		    	}else{ 

		    		if(that.retry < 2){
			    		//Retry the same image
			    		that.uploadPhoto(imageList, index, length, true);
			    		return;
			    	}else{
			    		inswit.hideLoaderEl();
			    		that.$(".upload_container").show();
			    		inswit.alert("Image upload failed! Try again later!");
			    		that.$el.find(".upload_audit").removeClass("clicked");
			    		return;
			    	}
		    	}
		    }

		    //Upload a image using File Transfer plugin
		    var ft = new FileTransfer();
    		ft.upload(
    			imageURI,
    			encodeURI(inswit.URI + "ProcessStore/d/drive/upload"),
    			onSuccess,
    			onFail,
    			options
    		);
		},

		imageUploadFailure: function(imageList, index, error) {
			this.$(".upload_container").show();
			inswit.hideLoaderEl();

			if(error){
				imageList[index].error = error;
			}
			var pVariables = {
			    "projectId":inswit.ERROR_LOG.projectId,
			    "workflowId":inswit.ERROR_LOG.workflowId,
			    "processId":inswit.ERROR_LOG.processId,
			    "ProcessVariables":{
			    	"isSellerAudit": inswit.ISSELLERAUDIT,
			    	"errorType": inswit.ERROR_LOG_TYPES.IMAGE_UPLOAD,
			    	"auditId": imageList[index].auditId, 
			    	"storeId": imageList[index].storeId,
			    	"empId":LocalStorage.getEmployeeId(),
			    	"issueDate":new Date(),
			    	"issueDescription": JSON.stringify(imageList[index]),
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
		},

		uploadAudit: function(imageList) {
			var that = this;

			var success = checkConnection();
		   	if(!success) {
		   		inswit.hideLoaderEl();
		   		inswit.alert("No Internet Connection!", "Alert");
		   		return;
		   	}

		   	selectAllCompProducts(db, that.auditId, that.storeId, function(products){

		   		var auditDetails = [];
				var length = 0;
				if(products){
					length = products.length;
				}
				
				for(var j = 0; j < length; j++){
					var product  = products[j];
					var productId = product.product_id;
					var priority = product.priority;
					var qrCode = product.qr_code;

					var optPhotoId = "";
					if(priority == 10){
						if(product.opt_image_id){
							optPhotoId = inswit.URI + "d/drive/docs/" + product.opt_image_id;
						}
					}

					var photoId = "";
					if(product.image_id){
						photoId = inswit.URI + "d/drive/docs/" + product.image_id;
					}
					
					var detail = {
						brandId:productId,
						photoId:photoId,
						optionalPhotoId:optPhotoId,
						nonExecution: executionStatus,
						qrCode: qrCode
					}

					auditDetails.push(detail);
				}

				var storeImage = "";
				if(imageList[0] && imageList[0].image){
					storeImage = inswit.URI + "d/drive/docs/" + imageList[0].image;
				}
				
				findStore(db, that.auditId, that.storeId, function(result){

			   		var lat = result.lat;
			   		var lng = result.lng;

			   		var updateStorePosition = false;
			   		if(lat == "" || lng == ""){
			   			updateStorePosition = true;
			   		}

			   		//Query audit details from the database
			   		var mId = that.auditId + "-" + that.storeId + "-" + that.channelId;
			   		selectCompletedAudit(db, mId, function(audit){

						if(audit.length > 0){
							var auditStatus = audit.item(0).option_id;		
							var id = audit.item(0).id;
							var latitude = audit.item(0).lat;
							var longitude = audit.item(0).lng;

							var processVariables = {
								"projectId":inswit.UPLOAD_PROCESS.projectId,
								"workflowId":inswit.UPLOAD_PROCESS.workflowId,
								"processId":inswit.UPLOAD_PROCESS.processId,
								"ProcessVariables":{
									"isSellerAudit":inswit.ISSELLERAUDIT,
									"photoAuditDetails":auditDetails,
									"auditId":that.auditId,
									"id":id,
									"auditor":LocalStorage.getEmployeeId(),
									"storeId":that.storeId,
									"option": auditStatus,
									"latitude": latitude,
									"longitude": longitude,
									"storeImage":storeImage,
									"updateStorePosition": updateStorePosition,
									"version":inswit.VERSION
								}
							};

							//Upload the Store details to the Appiyo server
							inswit.executeProcess(processVariables, {
								success: function(response){
									if(response.Error == "0"){
										if(response.ProcessVariables.status == "10"){
											inswit.alert(response.ProcessVariables.message);
											
											router.navigate("/audits", {
						                        trigger: true
						                    });
											return;
										}

										inswit.clearPhoto(imageList);

										var template = "<div class='success_container'>\
												<img src='images/matrix_icons/success_48.png' align='middle'>\
												<p class='alert_msg'>Store details for <br/><b>{{name}}</b><br/>has been updated successfully</p>\
												<a class='go_audit_list btn btn-success' href='#audits'>Go to Store List</a>\
											</div>";

										var html = Mustache.to_html(template, {"name":that.storeName});
										inswit.hideLoaderEl();
										that.$el.empty().append(html);

										var auditDetails = {
											"auditId": that.auditId,
											"storeId": that.storeId,
											"date": new Date(),
										}
										populateAuditHistoryTable(db, auditDetails);

										removeAuditEntries(db, that.auditId, that.storeId);

									}else{
										
										if(response.ProcessVariables.status == "10"){
											inswit.alert(response.ProcessVariables.message);
										}else{
											//inswit.alert("Server Error. Try Again Later!", "Error");
										}

										var pVariables = {
										    "projectId":inswit.ERROR_LOG.projectId,
										    "workflowId":inswit.ERROR_LOG.workflowId,
										    "processId":inswit.ERROR_LOG.processId,
										    "ProcessVariables":{
										    	"errorType": inswit.ERROR_LOG_TYPES.UPLOAD_AUDIT,
										    	"isSellerAudit": inswit.ISSELLERAUDIT,
										    	"auditId": that.auditId, 
										    	"storeId": that.storeId,
										    	"empId":LocalStorage.getEmployeeId(),
										    	"issueDate":new Date(),
										    	"issueDescription": JSON.stringify(processVariables.ProcessVariables),
										    	"version": inswit.VERSION
										    }
										};
						
										inswit.executeProcess(pVariables, {
										    success: function(response){
										    	inswit.hideLoaderEl();
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
				                			//inswit.alert("Server Error. Try Again Later!", "Error");
				                			break;
				                		}
				                	}
								}
							});
						}
					});
			   	});
		   	});
		}
	});
	
	return Upload;
});