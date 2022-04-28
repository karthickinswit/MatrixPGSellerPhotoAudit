/**
 * This method create table to completed audit details.
 */
function createCompAuditTable(tx, success, error) {
    var createStatement = "CREATE TABLE IF NOT EXISTS mxpg_comp_audits(store_id TEXT, id TEXT, comp_audit BOOLEAN, audited BOOLEAN, option_id TEXT, audit_id TEXT, store_image TEXT, lat TEXT, lng TEXT, store_image_id TEXT, accuracy TEXT,fetched_lat TEXT,fetched_lng TEXT,loc_preview_image TEXT,loc_preview_image_id TEXT,audit_info TEXT,over_write TEXT,img_capture_time TEXT,timeStamp TEXT,startTime TEXT,advlat TEXT,advlng TEXT,advtimestamp TEXT,endTime TEXT)";
    tx.executeSql(createStatement, [], success, error);
    var createIndex = "CREATE UNIQUE INDEX compAuditIndex ON mxpg_comp_audits(audit_id, store_id)";
    tx.executeSql(createIndex);
}
function createAuditPreviewTable(tx, success, error) {
    var createStatement = "CREATE TABLE IF NOT EXISTS mxpg_audits_preview(store_id TEXT, id TEXT, audit_id TEXT, accuracy TEXT,fetched_lat TEXT,fetched_lng TEXT,loc_preview_image TEXT,loc_preview_image_id TEXT)";
    tx.executeSql(createStatement, [], success, error);
    var createIndex = "CREATE UNIQUE INDEX previewAuditIndex ON mxpg_audits_preview(audit_id, store_id)";
    tx.executeSql(createIndex);
}

function createLocAuditTable(tx, success, error) {
    var createStatement = "CREATE TABLE IF NOT EXISTS mxpg_audits_locaudit(store_id TEXT, id TEXT, audit_id TEXT, lat TEXT,lng TEXT,timestamp TEXT)";
    tx.executeSql(createStatement, [], success, error);
    var createIndex = "CREATE UNIQUE INDEX locAuditIndex ON mxpg_audits_locaudit(audit_id, store_id)";
    tx.executeSql(createIndex);
}


/**
 * This method create table to completed audit details.
 */
function createCompProductTable(tx, success, error) {
    var createStatement = "CREATE TABLE IF NOT EXISTS mxpg_comp_products(store_id TEXT, store_name TEXT, product_id TEXT, product_name TEXT, image TEXT, image_uri TEXT, opt_image_uri TEXT,audit_id TEXT, priority NUMBER, image_id, opt_image_id, non_execution TEXT, qr_code TEXT,image_capture_time TEXT,image_capture_time2 TEXT,reason TEXT,inst_device TEXT,space_photo_uri TEXT,space_photo_id TEXT,dev_type TEXT)";
    tx.executeSql(createStatement, [], success, error);
    var createIndex = "CREATE UNIQUE INDEX compProductIndex ON mxpg_comp_products(audit_id, store_id, product_id)";
    tx.executeSql(createIndex);
}

/**
 * This method Insert or Replace the record from Completed Product table of SQLite DB.
 * @param  {object} db
 * @param  {json} audit
 * @param  {function} callback function
 */

function populateCompAuditTable(db, audit, callback, error) {
    db.transaction(function(tx){
        tx.executeSql('INSERT OR replace INTO mxpg_comp_audits(store_id, id, comp_audit, audited, option_id, audit_id, store_image, lat, lng, store_image_id, accuracy,fetched_lat,fetched_lng,audit_info,over_write,img_capture_time,timeStamp,startTime,advlat,advlng,advtimestamp) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
            [audit.storeId, audit.id, audit.isCompleted, audit.isContinued, audit.optionId, audit.auditId, audit.storeImage, audit.lat, audit.lng, audit.storeImageId, audit.accuracy,audit.fetchedLat,audit.fetchedLng,audit.auditInfo,audit.isOverwrite,audit.imgCaptureTime,audit.timeStamp,audit.startTime,audit.advLat,audit.advLng,audit.advTimeStamp]
        , callback, error);
    });
}

function populateLocAuditTable(db, audit, callback, error) {
    db.transaction(function(tx){
        tx.executeSql('INSERT OR replace INTO mxpg_audits_locaudit(store_id, audit_id,lat,lng,timestamp) values (?,?,?,?,?) ',
            [audit.storeId,audit.auditId,audit.lat,audit.lng,audit.timeStamp ]
        , callback, error);
    });
}
function populatLocPreviewTable(db, audit, callback, error) {
    db.transaction(function(tx){
        tx.executeSql('INSERT OR replace INTO mxpg_audits_preview(store_id, id,audit_id,loc_preview_image) VALUES (?,?,?,?);',
            [audit.storeId, audit.id,  audit.auditId,audit.locPreviewImage ]
        , callback, error);
    });
}

/**
 * This method Insert or Replace the record from Completed Product table of SQLite DB.
 * @param  {object} db
 * @param  {json} store
 * @param  {function} callback function
 */

function populateCompProductTable(db, product, callback) {
    var obj = "";

    var storeId = product.storeId;
    var auditId = product.auditId;
    var storeName = product.storeName;
    var image = product.image;
    var imageId = product.imageId;
    var imageURI = product.imageURI;
    var optImageId = product.optImageId || "";
    var optImageURI = product.optImageURI || "";
    var priority = product.priority;
    var pId = product.pId;
    var productName = product.productName;
    var nonExecution = product.nonExecution || false;
    var qrCode = product.qrCode || "";
    var imgCaptureTime1=product.imgCaptureTime1||"";
    var imgCaptureTime2=product.imgCaptureTime2||"";
    var reason = product.reason||"";
    var installDevice = product.installDevice||"";
    var spacePhoto = product.space_photo_uri||"";
    var deviceType = product.deviceType||"";

    db.transaction(function(tx){

        tx.executeSql('INSERT OR replace INTO  mxpg_comp_products(store_id, store_name, product_id, product_name, image, image_uri, opt_image_uri, audit_id, priority, image_id, opt_image_id, non_execution, qr_code,image_capture_time,image_capture_time2,reason,inst_device,space_photo_uri,dev_type) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
            [storeId, storeName, pId, productName, image, imageURI, optImageURI, auditId, priority, imageId, optImageId, nonExecution, qrCode,imgCaptureTime1,imgCaptureTime2,reason,installDevice,spacePhoto,deviceType], function(){
                callback();
            }, function(a, e){
                console.log(e);
        });
    });
}
function selectAdvLatlng(db, auditId, storeId, fn) {

    var query = "select * from mxpg_audits_locaudit where audit_id='" + auditId + "' AND store_id='" + storeId + "'";
    
    db.transaction(function(tx){
        tx.executeSql(query , [], function(tx, response) {
            var results = [];
            var len = response.rows.length;

            for(var i = 0; i < len; i++){
                var obj = response.rows.item(i);
                results.push(obj);
            }
            
            fn(results);
        });
    });
}

/**
 * This method Select the all finished record from compProductTable
 * @param  {object} db
 * @param  {json} store
 */

function selectAllCompProducts(db, auditId, storeId, fn) {

    var query = "select * from mxpg_comp_products where audit_id='" + auditId + "' AND store_id='" + storeId + "'";
    
    db.transaction(function(tx){
        tx.executeSql(query , [], function(tx, response) {
            var results = [];
            var len = response.rows.length;

            for(var i = 0; i < len; i++){
                var obj = response.rows.item(i);
                results.push(obj);
            }
            
            fn(results);
        });
    });
}

/**
 * This method Select the all distinct record from compProductTable
 * @param  {object} db
 * @param  {json} store
 */

function selectCompProducts(db, auditId, storeId, fn) {

    var query = "select DISTINCT product_id, product_name, image_uri, opt_image_uri, priority, image_id, opt_image_id, qr_code,space_photo_uri,space_photo_id from mxpg_comp_products where audit_id='" + auditId + "' AND store_id='" + storeId + "'";
    
    db.transaction(function(tx){
        tx.executeSql(query , [], function(tx, response) {
            var results = [];
            var len = response.rows.length;

            for(var i = 0; i < len; i++){
                var obj = response.rows.item(i);
                results.push(obj);
            }
            
            fn(results);
        });
    });
}

/**
 * This method clear the unwanted products from compProductTable
 * @param  {object} db
 * @param  {json} store
 */

function clearCompProducts(db, auditId, storeId, fn) {
    db.transaction(function(tx){
        tx.executeSql('DELETE FROM mxpg_comp_products WHERE store_id=? AND audit_id=?;', [storeId, auditId], fn);
    });
}

/**
 * This method Select all the record from compProductTable
 * @param  {object} db
 * @param  {json} store
 */

function selectProductsToVerify(db, auditId, storeId, productId, fn) {

    var query = "select store_id as storeId, product_id as productId, product_name as productName, image, image_uri as imageURI, opt_image_uri as optImageURI, audit_id as auditId, priority, non_execution as nonExecution, qr_code as qrCode,reason,inst_device as installDevice,space_photo_uri as spaceImage,dev_type as deviceType from mxpg_comp_products where audit_id='" + auditId + "'";

    if(storeId){
        query += " AND store_id='" + storeId + "'";
    }
    if(productId){
        query += " AND product_id='" + productId + "'";
    }

    query += " ORDER BY priority DESC";
    
    db.transaction(function(tx){
        tx.executeSql(query , [], function(tx, response) {
            var results = [];
            var len = response.rows.length;

            for(var i = 0; i < len; i++){
                var obj = response.rows.item(i);
                results.push(obj);
            }
            
            fn(results);
        });
    });
}

/**
 * This method Select all completed record from Completed Audit table.
 * @param  {object} db
 * @param  {function} callback function
 */

function selectAllCompAuditWithJoin(db, callback) {
    var query = 'SELECT t1.id,t2.audit_id,t2.store_id,t2.store_code,t2.store_name,t2.chl_id as channelId,t2.due FROM mxpg_comp_audits t1 JOIN mxpg_store t2 ON t1.id=t2.id WHERE t1.comp_audit=?;';
    
    db.transaction(function(tx){
        tx.executeSql(query, ["true"], function(tx, response){

            var results = [];
            var len = response.rows.length;

            for(var i = 0; i < len; i++){
                var obj = response.rows.item(i);
                obj.mId = obj.audit_id + "-" + obj.store_id + "-" + obj.channelId;
                results.push(obj);
            }
            
            callback(results);
        },function(a, e){
            alert(e);
        });
    });
}

/**
 * This method Select all completed record from Completed Audit table.
 * @param  {object} db
 * @param  {function} callback function
 */
function selectAllCompletedAudit(db, callback) {
    var query = 'SELECT * FROM mxpg_comp_audits;';
    
    db.transaction(function(tx){
        tx.executeSql(query, [], function(tx, response){

            var results = [];
            var len = response.rows.length;

            for(var i = 0; i < len; i++){
                var obj = response.rows.item(i);
                results.push(obj);
            }
            
            callback(results);
        });
    });
}

/**
 * This method Select one record from Completed Audit table.
 * @param  {object} db
 * @param  {json} auditId
 * @param  {function} callback function
 */

function selectCompletedAudit(db, mId, callback, error) {
    var id = mId.split("-");
    var auditId = id[0];
    var storeId = id[1];
    var channelId = id[2];

    var query = 'SELECT a.*,b.loc_preview_image,b.loc_preview_image_id from mxpg_comp_audits a left join mxpg_audits_preview b on a.store_id=b.store_id where a.audit_id=? AND a.store_id=?';
    
    db.transaction(function(tx){
        tx.executeSql(query, [auditId, storeId], function(tx, response){
            callback(response.rows);
        }, function(a, e){
            if(error){
                error(a, e);
            }
        });
    });
}
function selectAllAudit(db, mId, callback, error) {
    var id = mId.split("-");
    var auditId = id[0];
    var storeId = id[1];
    var channelId = id[2];

    var query = 'SELECT  from mxpg_comp_audits';
    
    db.transaction(function(tx){
        tx.executeSql(query, [auditId, storeId], function(tx, response){
            callback(response.rows);
        }, function(a, e){
            if(error){
                error(a, e);
            }
        });
    });
}

function selectPreviewAudit(db, mId, callback, error) {
    var id = mId.split("-");
    var auditId = id[0];
    var storeId = id[1];
    var channelId = id[2];

    var query = 'SELECT * FROM mxpg_audits_preview WHERE audit_id=? AND store_id=?';
    
    db.transaction(function(tx){
        tx.executeSql(query, [auditId, storeId], function(tx, response){
            callback(response.rows);
        }, function(a, e){
            if(error){
                error(a, e);
            }
        });
    });
}

/**
 * This method update the status of Completed Audit.
 * @param  {object} db
 * @param  {json} auditId
 *  @param  {json} storeId
 * @param  {function} callback function
 */
function updateAuditStatus(db, auditId,auditEndTime, storeId, success, error){
    db.transaction(function(tx){
        tx.executeSql('UPDATE mxpg_comp_audits SET comp_audit=?,endTime=? WHERE audit_id=? AND store_id=?;',
            [true,auditEndTime, auditId, storeId]
        );
    });
}

/**
 * This method update Geo location position.
 * @param  {object} db
 * @param  {json} auditId
 * @param  {json} storeId
 * @param  {json} pos
 */
function updateGeoLocation(db, auditId, storeId, pos){
    db.transaction(function(tx){
        tx.executeSql('UPDATE mxpg_comp_audits SET lat=?, lng=?, accuracy=? WHERE audit_id=? AND store_id=?;',
            [pos.lat, pos.lng, pos.accuracy, auditId, storeId]
        );
    });
}


/**
 * This method update signature photo of the store.
 * @param  {object} db
 * @param  {json} auditId
 * @param  {json} storeId
 * @param  {json} imageURI
 * @param  {function} callback function
 */
function updateSignaturePhoto(db, auditId, storeId, imageURI){
    db.transaction(function(tx){
        tx.executeSql('UPDATE mxpg_comp_audits SET sign_image=? WHERE audit_id=? AND store_id=?;',
            [imageURI, auditId, storeId]
        );
    });
}

/**
 * This method update Store photo id of the store.
 * @param  {object} db
 * @param  {json} auditId
 * @param  {json} storeId
 * @param  {json} imageId
 * @param  {function} callback function
 */
function updateStoreImageId(db, auditId, storeId, imageId, success, error){
    db.transaction(function(tx){
        tx.executeSql('UPDATE mxpg_comp_audits SET store_image_id=? WHERE audit_id=? AND store_id=?;',
            [imageId, auditId, storeId], success, error
        );
    });
}
function updatePreviewImageId(db, auditId, storeId, imageId, success, error){
    db.transaction(function(tx){
        tx.executeSql('UPDATE mxpg_audits_preview SET loc_preview_image_id=? WHERE audit_id=? AND store_id=?;',
            [imageId, auditId, storeId], success, error
        );
    });
}

/**
 * This method update signature photo id  of the store.
 * @param  {object} db
 * @param  {json} auditId
 * @param  {json} storeId
 * @param  {json} imageId
 * @param  {function} callback function
 */
function updateSignImageId(db, auditId, storeId, imageId, success, error){
    db.transaction(function(tx){
        tx.executeSql('UPDATE mxpg_comp_audits SET sign_image_id=? WHERE audit_id=? AND store_id=?;',
            [imageId, auditId, storeId], success, error
        );
    });
}

/**
 * This method update product photo of the store.
 * @param  {object} db
 * @param  {json} auditId
 * @param  {json} storeId
 * @param  {json} productId
 * @param  {json} imageId
 * @param  {function} callback function
 */
function updateProductImageId(db, auditId, storeId, productId, imageId, success, error){
   // var query = 'select priority from mxpg_comp_products WHERE audit_id=? AND store_id=? AND product_id=?;';
    
    db.transaction(function(tx){
        //tx.executeSql(query, [auditId, storeId, productId], function(tx, response){

        tx.executeSql('UPDATE mxpg_comp_products SET image_id=? WHERE audit_id=? AND store_id=? AND product_id=?;',
            [imageId, auditId, storeId, productId], success, error
        );
       // });
    });
}



/**
 * This method update Gillete product Space photo of the store.
 * @param  {object} db
 * @param  {json} auditId
 * @param  {json} storeId
 * @param  {json} productId
 * @param  {json} imageId
 * @param  {function} callback function
 */
 function updateGilleteProductImageId(db, auditId, storeId, productId, imageId, success, error){
    // var query = 'select priority from mxpg_comp_products WHERE audit_id=? AND store_id=? AND product_id=?;';
     
     db.transaction(function(tx){
         //tx.executeSql(query, [auditId, storeId, productId], function(tx, response){
 
         tx.executeSql('UPDATE mxpg_comp_products SET space_photo_id=? WHERE audit_id=? AND store_id=? AND product_id=?;',
             [imageId, auditId, storeId, productId], success, error
         );
        // });
     });
 }
 



/**
 * This method update product photo of the store.
 * @param  {object} db
 * @param  {json} auditId
 * @param  {json} storeId
 * @param  {json} productId
 * @param  {json} imageId
 * @param  {function} callback function
 */
function updateSecondProductImageId(db, auditId, storeId, productId, imageId, success, error){
    //var query = 'select priority from mxpg_comp_products WHERE audit_id=? AND store_id=? AND product_id=?;';
    
    db.transaction(function(tx){
        //tx.executeSql(query, [auditId, storeId, productId], function(tx, response){

            tx.executeSql('UPDATE mxpg_comp_products SET opt_image_id=? WHERE audit_id=? AND store_id=? AND product_id=?;',
                [imageId, auditId, storeId, productId], success, error
            );
       // });
    });
}

/**
 * This method Remove the record from Completed Audit table.
 * @param  {object} db
 * @param  {json} auditId
 * @param  {function} callback function
 */

function removeAudit(db, auditId, storeId, success, error) {
    db.transaction(function(tx){
        tx.executeSql('DELETE FROM mxpg_store WHERE store_id=? AND audit_id=?;', [storeId, auditId], success);
    });

    db.transaction(function(tx){
        tx.executeSql('DELETE FROM mxpg_comp_audits WHERE store_id=? AND audit_id=?;', [storeId, auditId]);
    });

    db.transaction(function(tx){
        tx.executeSql('DELETE FROM mxpg_audits_locaudit WHERE store_id=? AND audit_id=?;', [storeId, auditId]);
    });


    db.transaction(function(tx){
        tx.executeSql('DELETE FROM mxpg_comp_products WHERE store_id=? AND audit_id=?;', [storeId, auditId]);
    });
}

/**
 * This method Remove the record from Completed Audit table.
 * @param  {object} db
 * @param  {json} auditId
 * @param  {function} callback function
 */

function removeStore(db, storeId, fn) {
   // var query0 = 'SELECT store_id, audit_id FROM mxpg_store;';

    db.transaction(function(tx){
        // tx.executeSql(query0, [], function(tx, response){
        //     var rows = response.rows;

        var query1 = 'DELETE FROM mxpg_store WHERE store_id=?;';
        var query2 = 'DELETE FROM mxpg_comp_products WHERE store_id=?;';
        var query3 = 'DELETE FROM mxpg_comp_audits WHERE store_id=?;';
        var query4='DELETE FROM mxpg_audits_locaudit WHERE store_id=?;';
            //var query4 = 'SELECT store_id, audit_id FROM mxpg_comp_audits WHERE comp_audit=?;';
            
            //tx.executeSql(query4, ["true"], function(tx, results){
                //var result = results.rows;
                
                // for(var i = 0; i < rows.length; i++){
                //     var storeId = rows.item(i).store_id;
                //     var auditId = rows.item(i).audit_id;
                    
                //     var isCompleted = false;
                //     for(var j = 0; j < result.length; j++){
                //         var sId = rows.item(j).store_id;
                //         var aId = rows.item(j).audit_id;
                        
                //         if(auditId == aId && storeId == sId){
                //             isCompleted = true;
                //             break;
                //         }                        
                //     }

                //    if(!isCompleted){
        tx.executeSql(query1, [storeId], function(a, e){
            
        }, function(a, e){
            console.log(e);
        });

        tx.executeSql(query2, [storeId], function(a, e){
        
        }, function(a, e){
            console.log(e);
        });
        //    }
        //}

        tx.executeSql(query3, [storeId], function(a, e){
            
        }, function(a, e){
            console.log(e);
        });
        tx.executeSql(query4, [storeId], function(a, e){
            
        }, function(a, e){
            console.log(e);
        });

        if(fn){
            fn();
        }
           // });

        // }, function(a, e){
        //     console.log(e);
        // });
    });
}

function removePartialAudit(db, storeId) {

    db.transaction(function(tx){
        tx.executeSql('DELETE FROM mxpg_comp_audits WHERE store_id=? AND comp_audit=?;', [storeId, false]);
    });


    db.transaction(function(tx){
        tx.executeSql('DELETE FROM mxpg_comp_products WHERE store_id=?;', [storeId]);
    });
    db.transaction(function(tx){
        tx.executeSql('DELETE FROM mxpg_audits_locaudit WHERE store_id=?', [storeId]);
    });


}

/**
 * This method alter table in completed audit details.
 */
function addBrandExecutionFlag(tx) {
    var alterStatement = "ALTER TABLE mxpg_comp_products ADD non_execution TEXT DEFAULT 'false'";
    tx.executeSql(alterStatement, [], function() {
        console.log("Success");
        updateBrandExecutionFlag(tx);
    }, function(err){
        console.log("error"+err);
    });
}


/**
 * This method alter table in completed audit details.
 */
function addQrCode(tx) {
    var alterStatement = "ALTER TABLE mxpg_comp_products ADD qr_code TEXT DEFAULT ''";
    tx.executeSql(alterStatement, [], function() {
        console.log("Success");
    }, function(err){
        console.log("error"+err);
    });
}

function updateBrandExecutionFlag(tx) {
    db.transaction(function(tx){
        tx.executeSql('UPDATE mxpg_comp_products SET non_execution =? WHERE image_uri =?;',
            [true, ''], function() {
                console.log("Success");
            }, function(err) {
                 console.log("error"+err);
            }
        );
    });
}