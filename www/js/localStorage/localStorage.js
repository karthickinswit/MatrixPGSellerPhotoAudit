var LocalStorage = {

    //Getter Setter for Access Token
    setAccessToken: function(accessToken) {
      localStorage.setItem("token", accessToken);
    },

    getAccessToken: function() {
      var accessToken = localStorage.getItem("token");
      return accessToken;
    },

    removeAccessToken: function() {
      localStorage.removeItem("token");
    },

    setAuditFilter: function(filter) {
      localStorage.setItem("filter", filter);
    },

    setServerTime: function(id, time) {
      localStorage.setItem(id, time);
    },

    getServerTime: function(id) {
      var time = localStorage.getItem(id);
      return time;
    },
    removeServerTime: function(id) {
        localStorage.removeItem(id)
    },
    getAuditFilter: function() {
      var filter = localStorage.getItem("filter") || "";
      return filter;
    },

    resetAuditFilter: function() {

      var filter = {
          branchId : "",
          distId : "",
          locationId : ""
      };
      LocalStorage.setAuditFilter(JSON.stringify(filter));
    },

    //Getter Setter for Employee Id
    setEmployeeId: function(empId) {
      localStorage.setItem("empId", empId);
    },

    getEmployeeId: function() {
      var empId = localStorage.getItem("empId");
      return empId;
    },

    removeEmployeeId: function() {
      localStorage.removeItem("empId");
    },

    //Getter Setter for Employee Id
    setEmployeeEmail: function(email) {
      localStorage.setItem("email", email);
    },

    getEmployeeEmail: function() {
      var email = localStorage.getItem("email");
      return email;
    },

    removeEmployeeEmail: function() {
      localStorage.removeItem("email");
    },

    //Getter Setter for user password
    setResetPasswordDetails: function(values) {
      localStorage.setItem("resetValues", JSON.stringify(values));
    },

    getResetPasswordDetails: function() {
      return JSON.parse(localStorage.getItem("resetValues"));
    },

    //Getter Setter for date
    setLastUpdatedDate: function(date) {
      localStorage.setItem("lastUpdated", date);
    },

    getLastUpdatedDate: function() {
      return localStorage.getItem("lastUpdated");
    },

    //Getter Setter for store audit status
    setAuditStatus: function(obj) {
      localStorage.setItem("auditStatus", JSON.stringify(obj));
    },

    getAuditStatus: function() {
      return JSON.parse(localStorage.getItem("auditStatus"));
    },

    setAuditTimeLimit: function(minutes) {
        localStorage.setItem("auditTimeLimit", minutes);
    },

    getAuditTimeLimit: function() {
        return localStorage.getItem("auditTimeLimit");
    },

    removeAuditTime: function(mId) {
        localStorage.removeItem(mId);
    },

    setGpsTimeOut: function(time) {
         localStorage.setItem("gpsTimeout", time);
    },

    getGpsTimeOut: function() {
        return parseInt(localStorage.getItem("gpsTimeout"));
    },

    setNetworkGpsTimeout: function(time) {
        localStorage.setItem("gpsNetworkTimeout", time);
    },

    getNetworkGpsTimeout: function() {
        return parseInt(localStorage.getItem("gpsNetworkTimeout"));
    },
    setCurrentTime:function(timeStamp)
    {
      localStorage.setItem("currentTime", timeStamp);
    },
    getCurrentTime:function()
    {
      return localStorage.getItem("currentTime");
    },
    removeCurrentTime:function()
    {
      localStorage.setItem("currentTime","");
    },
    setLocArray:function(obj)
    {
      localStorage.setItem("locArray",JSON.stringify(obj));
    },
    getLocArray:function()
    {
      return JSON.parse(localStorage.getItem("locArray"));
    },
    setLocalPosition:function(pos)
    {
      localStorage.setItem("position",pos);
    },
    getLocalPosition:function()
    {
      // localStorage.setItem("position",pos);
      return localStorage.getItem("position");
    },
    removeLocalPosition:function()
    {
      localStorage.setItem("position","");
    },

    setAuditReasons:function(auditreasons)
    {
      localStorage.setItem("auditReasons",JSON.stringify(auditreasons));
    },
    getAuditReasons:function()
    {
      return JSON.parse(localStorage.getItem("auditReasons"));
    },
    setDeviceTypes:function(deviceTypes)
    {
      localStorage.setItem("deviceTypes",JSON.stringify(deviceTypes));
    },
    getDeviceTypes:function()
    {
      return JSON.parse(localStorage.getItem("deviceTypes"));
    }

};