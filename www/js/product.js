define([
	"backbone",
	"mustache",
	"select2"
], function(Backbone, Mustache) {
	var Product = {};
	Product.Model = Backbone.Model.extend({
		
		initialize: function() {}                             
	});

	Product.View = Backbone.View.extend({

		className: "audits",

		events:{
			"click .verify_audit": "verify",
			"click .complete_audit": "completeAudit",
			"click .back": "back",
			"click .restart_audit": "restartAudit"
		},

		showProducts: function(mId){
			var that = this;

			this.getStoreName(mId);
			this.model.set("mId", mId);

			setTimeout(function(){
				var id = mId.split("-");
	            var auditId = id[0];
	            var storeId = id[1];
	            var channelId = id[2];
	            if(inswit.TIMER == 0) {
	                that.startTimer(storeId);
	            }

				var callback = function(products){
					require(['templates/t_audit_products'], function(template){

						var fn = function(completedProducts){
							var cLength = completedProducts.length;
							var length = products.products.length;

							for(var i = 0; i < cLength; i++){
								var cProduct = completedProducts[i];
								for(var j = 0; j < length; j++){
									var product = products.products[j];
									if(product.product_id == cProduct.product_id){
										product.done = true;
										break;
									}
								}
							}
							products.mId = mId;
							products.name = that.storeName;

							var html = Mustache.to_html(template, products);
							that.$el.empty().append(html);

							if(cLength == length){
								that.$el.find(".complete_audit").attr("disabled", false);
							}
							
							that.refreshScroll("wrapper_products");
							return that;
						}
						selectCompProducts(db, auditId, storeId, fn);
					});
				};
				
				var er = function(a, e){
					console.log(e);
				};

				selectProducts(db, auditId, storeId, channelId, callback, er);
			}, 350);
		},

		completeAudit: function(event){
			var that = this;

            inswit.exitTimer();

			if($(event.currentTarget).hasClass("clicked")){
				return;
			}

			$(event.currentTarget).addClass("clicked");

			var mId = $(event.currentTarget).attr("href");
			var id = mId.split("-");
            var auditId = id[0];
            var storeId = id[1];
            var channelId = id[2];

			getDistributor(db, auditId, storeId, function(distributor){

	 			var callback = function(isYes){
					$(event.currentTarget).removeClass("clicked");
					if(isYes == 1){

		   	           updateAuditStatus(db, auditId, storeId);

		   	            var route = "#audits/" + mId + "/upload";
		   				router.navigate(route, {
		   	                trigger: true,
		   	                replace:true
		   	            });
					}
				}
				callback(1);

	 		}, function(a, e){
	 			console.log(e);
	 		});
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
		},

		restartAudit: function() {
		var that = this;
		     inswit.confirm(inswit.alertMessages.restartAudit, function onConfirm(buttonIndex) {
                 if(buttonIndex == 1) {
                    inswit.showLoaderEl("Clearing photo(s) ! Please wait...");
                    var el = "timer";
                    var mId = that.model.get("mId");
                    inswit.stopTimer(el);
                    inswit.exitTimer();
                    setTimeout(function(){
                        LocalStorage.removeAuditTime(mId);
                        inswit.hideLoaderEl();
                        router.navigate("/audits", {
                               trigger: true
                        });
                    }, 2000);
                 }
            }, "Confirm", ["Yes", "No"]);
		},


		 startTimer: function(storeId) {
            if(inswit.TIMER) {
                return;
            }else  {
                var ele = $(".timer_container").show();
                var el = "timer";
                var minutes = LocalStorage.getAuditTimeLimit();
                var seconds = 0;
                inswit.setTimer(el, minutes, seconds, storeId);
            }
        }

	});

	return Product;
});