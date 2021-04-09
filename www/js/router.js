define(["backbone", "bootstrap", "mustache"], function() {
    $.ajaxSetup({
        beforeSend: function(response) {
        	
        },
        complete: function(response) {
        },
        error: function(statusCode, errorThrown) {
            checkConnection();
        }
    });

    $.ajaxPrefilter(function(options) {
    	var ajaxUrl = options.url;
    	if(ajaxUrl.indexOf("http://") !==  0 && ajaxUrl.indexOf("https://") !== 0) {
    		options.url = url + ajaxUrl;
    	}
        options.crossDomain = true;
        
        var token = LocalStorage.getAccessToken();
        if(token) {
          options.headers = {Cookie: "authentication-token="+ token};
        }
    });

    var Router = Backbone.Router.extend({

        currentView: null,

        initialize: function() {

        },
        routes: {
            "":"renderLogin",
            "forgotpassword" : "showForgotPassword",
            "audits" : "getAuditList",
            "audits/:id" : "showAuditDetails",
            "audits/:id/continue/:pos" : "startAudit",
            "audits/:id/products" : "showProducts",
            "audits/:id/products/:id" : "showNorms",
            "audits/:id/upload" : "onUploadAudit",
            "audits/upload/all" : "uploadAll",
            "register" : "showRegister"
        },

        renderLogin: function() {
            var that = this;

            var employeeId = LocalStorage.getEmployeeId();
            if(employeeId){
                router.navigate("/audits", {
                    trigger: true
                });
            }else{
                require(["login"], function(Register) {
                    var RegisterModel = new Register.Model({
                    });
                    var RegisterView = new Register.View({
                        model: RegisterModel
                    });
                    RegisterView.render();
                    that.appendView(RegisterView);
                });  
            }
            $(".timer_container").hide();
        },

        getAuditList: function(e){
            var that = this;

            var isAllStores = false;
            if(that.currentView && that.currentView.el){
                var temp = that.currentView.el.className.split(" ");
                var page = temp[0];
                if(page === "loginpage"){
                    isAllStores = true;
                }
            }
           
            require(["auditList"], function(Audit) {
                var AuditModel = new Audit.Model({
                   // "isAllStores":isAllStores
                });
                var AuditView = new Audit.View({
                    model: AuditModel
                });
                AuditView.render(isAllStores);

                that.appendView(AuditView);
            });
            $(".timer_container").hide();
        },

        uploadAll: function(){
            var that = this;

            require(["uploadAll"], function(UploadAll) {
                var UploadAllModel = new UploadAll.Model({
                });
                var UploadAllView = new UploadAll.View({
                    model: UploadAllModel
                });
                UploadAllView.render();

                that.appendView(UploadAllView);
            });
            $(".timer_container").hide();
        },

        showAuditDetails: function(mId){
            var that = this;

            require(["auditDetails"], function(AuditDetails) {
                var AuditDetailsModel = new AuditDetails.Model({
                    "mId":mId
                });
                var AuditDetailsView = new AuditDetails.View({
                    model: AuditDetailsModel
                });
                AuditDetailsView.showAuditDetails(mId);

                that.appendView(AuditDetailsView);
            });
             $(".timer_container").hide();
        },

        startAudit: function(mId, pos){
            var that = this;

            var time = inswit.getCurrentTime();


            LocalStorage.setServerTime(mId, time);

            var position = JSON.parse(pos);

            require(["initAudit"], function(InitAudit) {
                var InitAuditModel = new InitAudit.Model({
                    "mId":mId,
                    "pos": position
                });
                var InitAuditView = new InitAudit.View({
                    model: InitAuditModel
                });
                InitAuditView.startAudit(mId);

                that.appendView(InitAuditView);
            });


            /* require(["initAudit"], function(InitAudit) {
                var InitAuditModel = new InitAudit.Model({
                    "mId":mId
                });
                var InitAuditView = new InitAudit.View({
                    model: InitAuditModel
                });
                InitAuditView.startAudit(mId);

                that.appendView(InitAuditView);
            });*/


        },

        showProducts: function(mId){
            var that = this;

            require(["product"], function(Product) {
                var ProductModel = new Product.Model({
                    "mId":mId
                });
                var ProductView = new Product.View({model: ProductModel});

                ProductView.showProducts(mId);
                that.appendView(ProductView);
            });
        },

        showForgotPassword: function() {
            var that = this;
            require(["forgotpassword"], function(ForgotPassword){
                var forgotpasswordModel = new ForgotPassword.model();
                var forgotpasswordView = new ForgotPassword.view({model:forgotpasswordModel});

                forgotpasswordView.render();
                that.appendView(forgotpasswordView);
            });
            $(".timer_container").hide();
        },

        showNorms: function(mId, pId){
            var that = this;

            //Getting hotspot execution brand id to disable all the norms(Audit time)
            var hotspotPid = $(this.currentView.$el.find(".product")[0]).attr("id");
            var isVerify = false;

            //Getting hotspot execution brand id to disable all the norms(verify time)
            if(!hotspotPid){
                hotspotPid = $(this.currentView.$el.find(".p_header")[0]).attr("id");
                isVerify = true;
            }
            
            setTimeout(function(){
                var callback = function(product){
                    require(["norm"], function(Norm) {

                        var priority = product.priority;
                        var isHotspot = false;
                        if(priority == "10"){
                            isHotspot = true;
                        }
                        var NormModel = new Norm.Model({
                            "mId":mId,
                            "hotspotPid": hotspotPid,
                            "isHotspot": isHotspot,
                            "isVerify":isVerify
                        });
                        var NormView = new Norm.View({
                            model: NormModel
                        });
                        NormView.showNorms(mId, pId, product, hotspotPid);

                        that.appendView(NormView);

                    });
                }

                getProductName(db, mId, pId, callback);
            }, 350)
        },

        onUploadAudit: function(mId) {
            var that = this;

            require(["upload"], function(Upload) {
                var UploadModel = new Upload.Model({
                    "mId":mId
                });
                var UploadView = new Upload.View({model: UploadModel});

                UploadView.onUploadAudit(mId);
                that.appendView(UploadView);
            });
            $(".timer_container").hide();
        },

        appendView: function(view) {
            if(this.currentView) {
                this.currentView.remove();
                this.currentView = null;
            }

            $("#content").empty().append(view.$el);
            this.currentView = view;
        },

        showRegister: function() {
            var that = this;
            require(["register"], function(RegisterUniqueId){
                var registerModel = new RegisterUniqueId.Model({});
                var registerView = new RegisterUniqueId.View({model:registerModel});

                registerView.render();
                that.appendView(registerView);
            });
        }

    });
    return Router;
});