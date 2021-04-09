define(["jquery"], function() {
    var Setup =  {

        configureDB: function() {
            var deferredObject = $.Deferred();
            var db = openSqliteDb();

            var M = new this.Migrator(db, deferredObject);
            M.migration(1, function(tx){
                addBrandExecutionFlag(tx);
            });
            M.migration(2, function(tx){
                createQrCodePnMap(tx);
                addQrCode(tx);
            });
             M.doIt();
        },

   		Migrator: function(db, deferredObject) {
            var migrations = [];
            this.migration = function(number, func){
                migrations[number] = func;
            };
            var doMigration = function(number){
                var initialVersion = parseInt(db.version) || 0;
                if(initialVersion != number && migrations[number]){
                  db.changeVersion(db.version, String(number), function(t){
                    migrations[number](t);
                  }, function(err){
                    if(console.error) console.error("Error!: %o", err);
                  }, function(){
                    doMigration(number+1);
                  });
                }

                // If migration is not available for a version(All migrations are ran)
                if(!migrations[number]) {
                    deferredObject.resolve();
                }
            };
            this.doIt = function(){
                var initialVersion = parseInt(db.version) || 0;
                try {
                  doMigration(initialVersion+1);
                } catch(e) {
                  if(console.error) console.error(e);

                  //ToDo: what to do on failure???
                  deferredObject.resolve();
                }
            }
        }
    };
    return Setup;
});