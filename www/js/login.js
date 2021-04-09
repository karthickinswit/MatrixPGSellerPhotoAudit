define([
	"backbone", 
	"mustache",
	"templates/t_login"
], function(Backbone, Mustache, template) {
	var Register = {};
	Register.Model = Backbone.Model.extend({
		
		defaults: function() {
			
			return {
				email: inswit.TEST_ACCOUNT.email,
				password: inswit.TEST_ACCOUNT.password
			}
		},
		
		initialize: function () { 

	    }                                
	});

	Register.View = Backbone.View.extend({

		className: "loginpage cover home_bg",//Don't change this order
		
		initialize: function(){
			this.template = template;
		},

		events:{
			"click #login-btn" : "login",
			"click #scan-btn": "scan"
		},

		render: function() {
			var that = this;
			var html = Mustache.to_html(that.template, that.model.toJSON());
			that.$el.html(html);

			return that;
		},

		scan: function() {
		    cordova.plugins.barcodeScanner.scan(
              function (result) {
                  alert("We got a barcode\n" +
                        "Result: " + result.text + "\n" +
                        "Format: " + result.format + "\n" +
                        "Cancelled: " + result.cancelled);
              },
              function (error) {
                  alert("Scanning failed: " + error);
              }
           );
		},

		login: function() {
			var that = this;

			var userName = this.$el.find("#name").val().trim();
			var password = this.$el.find("#password").val().trim();

			var deviceInfo = {
                "model": device.model,
                "platform": device.platform,
                "version": device.version,
                "manufacturer": device.manufacturer
            };
	
			inswit.showLoaderEl("Logging in to Matrix.. Please wait");

			if(this.loginTimeout){
				clearTimeout(this.timeOut);
				this.timeOut = null;
			}

			this.loginTimeout = setTimeout(function(){
				inswit.hideLoaderEl();
			}, 30000);

			try{

				var loginToMatrix = function(imei){
					//imei = "867274026348691"; //Sample IMEI number for testing
					var uuid = device.uuid;
					var processVariables = {
						"projectId":inswit.LOGIN_PROCESS.projectId,
						"workflowId":inswit.LOGIN_PROCESS.workflowId,
						"processId":inswit.LOGIN_PROCESS.processId,
						"ProcessVariables":{
							"isSellerAudit": inswit.ISSELLERAUDIT,
							"email":userName,
							"password":password, 
							"UUID": uuid,
							"version": inswit.VERSION,
							"deviceInfo": JSON.stringify(deviceInfo)
						}
					};
					
					inswit.executeProcess(processVariables, {
						success: function(response){
							
							if(response.ProcessVariables.status){

								var lastEmployeeEmail = LocalStorage.getEmployeeEmail();
								
								//Set new employee id
								var empId = response.ProcessVariables.empId;
								LocalStorage.setEmployeeId(empId);

								if(lastEmployeeEmail === userName){
									//Don't clear the master for old user
									inswit.hideLoaderEl();
									router.navigate("/audits", {
					                    trigger: true,
					                    replace:true
					                });
								}else{
									//Clear the master data and create new master for new user
									clearData(db, function(){

										//Clearing the cache files
										// var home = cordova.require("cordova/plugin/home");
										// if(home){
										// 	home.clearCache(function(){},function(){});
										// }

										//Set new employee email
										LocalStorage.setEmployeeEmail(userName);
										
										//Create and populate all master tables
										db.transaction(function(tx){

											//Init all the tables 
					                        createAllStoreTable(
					                        	tx,
					                        	function(a, e){
					                        		//console.log(e);
					                        	}, 
					                        	function(error, info){
					                        		console.log(info);

					                        		var desc = {
					                        			value: info.message,
					                        			table: "mxpg_store"
					                        		};
					                        		var pVariables = {
													    "projectId":inswit.ERROR_LOG.projectId,
													    "workflowId":inswit.ERROR_LOG.workflowId,
													    "processId":inswit.ERROR_LOG.processId,
													    "ProcessVariables":{
													    	"errorType": inswit.ERROR_LOG_TYPES.DB_CREATION,
													    	"empId":empId,
													    	"issueDate":new Date(),
													    	"issueDescription": JSON.stringify(desc),
													    	"version": inswit.VERSION
													    }
													};
									
													inswit.executeProcess(pVariables, {
													    success: function(response){
													    	
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
					                        );

					                        createProductTable(
					                        	tx, 
					                        	function(){}, 
					                        	function(error, info){

					                        		var desc = {
					                        			value: info.message,
					                        			table: "mxpg_product"
					                        		};

					                        		var pVariables = {
													    "projectId":inswit.ERROR_LOG.projectId,
													    "workflowId":inswit.ERROR_LOG.workflowId,
													    "processId":inswit.ERROR_LOG.processId,
													    "ProcessVariables":{
													    	"errorType": inswit.ERROR_LOG_TYPES.DB_CREATION,
													    	"empId":empId,
													    	"issueDate":new Date(),
													    	"issueDescription": JSON.stringify(desc),
													    	"version": inswit.VERSION
													    }
													};
									
													inswit.executeProcess(pVariables, {
													    success: function(response){
													    	
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
					                        );

					                        createCompAuditTable(
					                        	tx, 
					                        	function(){}, 
					                        	function(error, info){

					                        		var desc = {
					                        			value: info.message,
					                        			table: "mxpg_comp_audits"
					                        		};

					                        		var pVariables = {
													    "projectId":inswit.ERROR_LOG.projectId,
													    "workflowId":inswit.ERROR_LOG.workflowId,
													    "processId":inswit.ERROR_LOG.processId,
													    "ProcessVariables":{
													    	"errorType": inswit.ERROR_LOG_TYPES.DB_CREATION,
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
					                        	}
					                        );

					                        createCompProductTable(
					                        	tx, 
					                        	function(){}, 
					                        	function(error, info){

					                        		var desc = {
					                        			value: info.message,
					                        			table: "mxpg_comp_products"
					                        		};

					                        		var pVariables = {
													    "projectId":inswit.ERROR_LOG.projectId,
													    "workflowId":inswit.ERROR_LOG.workflowId,
													    "processId":inswit.ERROR_LOG.processId,
													    "ProcessVariables":{
													    	"errorType": inswit.ERROR_LOG_TYPES.DB_CREATION,
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
					                        	}
					                        );

					                        createStoreStatus(
					                        	tx, 
					                        	function(){}, 
					                        	function(error, info){
					                        		var desc = {
					                        			value: info.message,
					                        			table: "mxpg_store_status"
					                        		};
					                        		var pVariables = {
													    "projectId":inswit.ERROR_LOG.projectId,
													    "workflowId":inswit.ERROR_LOG.workflowId,
													    "processId":inswit.ERROR_LOG.processId,
													    "ProcessVariables":{
													    	"errorType": inswit.ERROR_LOG_TYPES.DB_CREATION,
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
					                        	}
					                        );

											createChannelTable(
					                        	tx, 
					                        	function(){}, 
					                        	function(error, info){
					                        		var desc = {
					                        			value: info.message,
					                        			table: "mxpg_channel"
					                        		};
					                        		var pVariables = {
													    "projectId":inswit.ERROR_LOG.projectId,
													    "workflowId":inswit.ERROR_LOG.workflowId,
													    "processId":inswit.ERROR_LOG.processId,
													    "ProcessVariables":{
													    	"errorType": inswit.ERROR_LOG_TYPES.DB_CREATION,
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
					                        	}
					                        );

					                        createDistBranchLocationTable(
					                        	tx, 
					                        	function(){

					                        	}, 
					                        	function(error, info){

					                        		var desc = {
					                        			value: info.message,
					                        			table: "mxpg_dist_brch_loc"
					                        		};

					                        		var pVariables = {
													    "projectId":inswit.ERROR_LOG.projectId,
													    "workflowId":inswit.ERROR_LOG.workflowId,
													    "processId":inswit.ERROR_LOG.processId,
													    "ProcessVariables":{
													    	"errorType": inswit.ERROR_LOG_TYPES.DB_CREATION,
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
					                        	}
					                        );

					                        createAuditHistoryTable(
					                        	tx, 
					                        	function(){}, 
					                        	function(error, info){

					                        		var desc = {
					                        			value: info.message,
					                        			table: "mxpg_audit_history"
					                        		};

					                        		var pVariables = {
													    "projectId":inswit.ERROR_LOG.projectId,
													    "workflowId":inswit.ERROR_LOG.workflowId,
													    "processId":inswit.ERROR_LOG.processId,
													    "ProcessVariables":{
													    	"errorType": inswit.ERROR_LOG_TYPES.DB_CREATION,
													    	"empId":empId,
													    	"issueDate":new Date(),
													    	"issueDescription": JSON.stringify(desc),
													    	"version": inswit.VERSION
													    }
													};
									
													inswit.executeProcess(pVariables, {
													    success: function(response){
													    	
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
											);
											
											createErrorLogTable(
												tx,
												function(){},
												function(error, info){
													console.log("createErrorLogTable"+error);
												}
											);

					                        createQrCodePnMap(
					                            tx,
                                                function(){},
                                                function(error, info){

                                                    var desc = {
                                                        value: info.message,
                                                        table: "mxpg_qr_map"
                                                    };

                                                    var pVariables = {
                                                        "projectId":inswit.ERROR_LOG.projectId,
                                                        "workflowId":inswit.ERROR_LOG.workflowId,
                                                        "processId":inswit.ERROR_LOG.processId,
                                                        "ProcessVariables":{
                                                            "errorType": inswit.ERROR_LOG_TYPES.DB_CREATION,
                                                            "empId":empId,
                                                            "issueDate":new Date(),
                                                            "issueDescription": JSON.stringify(desc),
                                                            "version": inswit.VERSION
                                                        }
                                                    };

                                                    inswit.executeProcess(pVariables, {
                                                        success: function(response){

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
					                        );

					                    	var processVariables = {
												"projectId":inswit.INIT_PROCESS.projectId,
												"workflowId":inswit.INIT_PROCESS.workflowId,
												"processId":inswit.INIT_PROCESS.processId,
												"ProcessVariables":{
											    	"isUpdate":false,
											    	"isSellerAudit": inswit.ISSELLERAUDIT,
											    	"date":"",
											    	"empId":empId,
											    }
											};
									
											inswit.executeProcess(processVariables, {
												success: function(response){
													if(response.Error == "0"){
														var processVariables = response.ProcessVariables;
														LocalStorage.setLastUpdatedDate(processVariables.updatedDate);
														var products = processVariables.brandChanMap;
														var distributors = processVariables.DistributorBranch;
														var storeStatus = processVariables.StoreStatus;
														var channels = processVariables.channelList;

														//Populate all the tables
														populateProductTable(
															db, 
															products, 
															function(){}, 
															function(error, info){

																var desc = {
								                        			value: products,
								                        			table: "mxpg_product"
								                        		};

																var pVariables = {
																    "projectId":inswit.ERROR_LOG.projectId,
																    "workflowId":inswit.ERROR_LOG.workflowId,
																    "processId":inswit.ERROR_LOG.processId,
																    "ProcessVariables":{
																    	"errorType": inswit.ERROR_LOG_TYPES.DB_UPDATION,
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
															}
														);

														populateDistBranchLocationTable(
															db, 
															distributors, 
															function(){}, 
															function(error, info){
																var desc = {
								                        			value: distributors,
								                        			table: "mxpg_dist_brch_loc"
								                        		};

																var pVariables = {
																    "projectId":inswit.ERROR_LOG.projectId,
																    "workflowId":inswit.ERROR_LOG.workflowId,
																    "processId":inswit.ERROR_LOG.processId,
																    "ProcessVariables":{
																    	"errorType": inswit.ERROR_LOG_TYPES.DB_UPDATION,
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
															}
														);

														populateStoreStatusTable(
															db, 
															storeStatus, 
															function(){}, 
															function(error, info){
									
																var desc = {
								                        			value: storeStatus,
								                        			table: "mxpg_store_status"
								                        		};

																var pVariables = {
																    "projectId":inswit.ERROR_LOG.projectId,
																    "workflowId":inswit.ERROR_LOG.workflowId,
																    "processId":inswit.ERROR_LOG.processId,
																    "ProcessVariables":{
																    	"errorType": inswit.ERROR_LOG_TYPES.DB_UPDATION,
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
															}
														);


														
														populateChannelTable(
															db, 
															channels, 
															function(){}, 
															function(error, info){
									
																var desc = {
								                        			value: channels,
								                        			table: "mxpg_channel"
								                        		};

																var pVariables = {
																    "projectId":inswit.ERROR_LOG.projectId,
																    "workflowId":inswit.ERROR_LOG.workflowId,
																    "processId":inswit.ERROR_LOG.processId,
																    "ProcessVariables":{
																    	"errorType": inswit.ERROR_LOG_TYPES.DB_UPDATION,
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
															}
														);

														router.navigate("/audits", {
										                    trigger: true,
										                    replace:true
										                });									              
										
													}else{
														console.error("Load Error");
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
								                			inswit.alert("Login Failed.Try Again!", "Error");
								                			break;
								                		}
								                	}
												}
											});
										});
									}, function(e, a){
										console.log(a);
									});
								}
							}else{
								inswit.hideLoaderEl();
								var error = response.ProcessVariables.response;
								inswit.alert(error);
	
								var pVariables = {
								    "projectId":inswit.ERROR_LOG.projectId,
								    "workflowId":inswit.ERROR_LOG.workflowId,
								    "processId":inswit.ERROR_LOG.processId,
								    "ProcessVariables":{
								    	"isSellerAudit": inswit.ISSELLERAUDIT,
								    	"errorType": inswit.ERROR_LOG_TYPES.LOGIN_FAILED,
								    	"issueDate":new Date(),
								    	"issueDescription": JSON.stringify(processVariables.ProcessVariables),
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
							}
						}
					});
				}

				inswit.loginInToAppiyo(loginToMatrix);

			}catch(err){
				inswit.alert(err.message);
			}
		}
	});
	
	return Register;
});