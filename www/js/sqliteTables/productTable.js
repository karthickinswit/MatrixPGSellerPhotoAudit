/*************************** Create All Enterprise Table in DB if not exist*****************************************/

function createProductTable(tx, success, error) {
    var createStatement = "CREATE TABLE IF NOT EXISTS mxpg_product(product_id TEXT, product_name TEXT, channel_id TEXT, channel_name TEXT, is_hotspot BOOLEAN, priority INTEGER, is_frontage BOOLEAN, id TEXT)";
    tx.executeSql(createStatement, [], success, error);
    var createIndex = "CREATE UNIQUE INDEX allProductIndex ON mxpg_product(product_id, channel_id)";
    tx.executeSql(createIndex);
}

function getProductName(db, mId, pId, fn) {
    var id = mId.split("-");
    var auditId = id[0];
    var storeId = id[1];
    var channelId = id[2];
    
    var query = "select product_name, priority, is_frontage from mxpg_product where product_id='" + pId + "' AND channel_id='" + channelId + "'";
    db.transaction(function(tx){
        tx.executeSql(query , [], function(tx, response) {
            fn(response.rows.item(0));
        });
    });
}

/**
 * This method Insert or Replace the record in the All Product table in SQLite DB.
 * @param  {object} db
 * @param  {json} store
 * @param  {function} callback function
 */

function populateProductTable(db, products, success, error) {
    db.transaction(function(tx){
        for(var i = 0; i < products.length; i++){
            var product = products[i];

            if(product.isHotSpot){
                product.priority = 10;
                
            }else{
                product.isHotSpot = false;
                product.priority = 6;
            }
            
            tx.executeSql('INSERT OR replace INTO mxpg_product(product_id, product_name, channel_id, channel_name, is_hotspot, priority, is_frontage) VALUES (?,?,?,?,?,?,?);',
                [product.brandId, product.brandName, product.chanId, product.chanName, product.isHotSpot, product.priority, product.isFrontage]
            , success, error);
        }
    });
}

/**
 * This method Select the record from the All Product table in SQLite DB.
 * @param  {object} db
 * @param  {json} store
 */

function selectProducts(db, auditId, storeId, channelId, fn, er) {

    var query = "select product_id, product_name, is_hotspot, priority, is_frontage from mxpg_product where channel_id='" + channelId + "' ORDER BY priority DESC";
    
    db.transaction(function(tx){
        tx.executeSql(query , [], function(tx, response) {
            var results = [];
            var len = response.rows.length;

            for(var i = 0; i < len; i++){
                var obj = response.rows.item(i);

                if(obj.is_hotspot == "true"){
                    obj.isHotSpot = true;
                }else{
                    obj.isHotSpot = false;
                } 

                results.push(obj);
            }
            
            fn({"products":results});
        }, er);
    });
}

/**
 * This method Select one record from the All Product table in SQLite DB.
 * @param  {object} db
 * @param  {json} store
 */

function selectProduct(db, productId, channelId, fn) {

    var query = "select is_hotspot, priority, is_frontage from mxpg_product where channel_id='" + channelId + "' AND product_id='" + productId + "'";
    
    db.transaction(function(tx){
        tx.executeSql(query , [], function(tx, response) {
            var obj = response.rows.item(0);
            fn(obj);
        });
    });
}


function getStoreImage(db, storeId, fn) {
    var query = "select store_image from mxpg_comp_audits where store_id=? and comp_audit=? "
    db.transaction(function(tx){
        tx.executeSql(query , [storeId, false], function(tx, response) {
            var length = response.rows.length;
            if(length > 0) {
                var obj = response.rows.item(0);
                fn(obj);
            }
        });
    });
}


function getProdImage(db, storeId, fn) {
    var query = "select image_uri from mxpg_comp_products where store_id= ?" ;
    db.transaction(function(tx){
        tx.executeSql(query , [storeId], function(tx, response) {
            fn(response);
        });
    });
}

function isTableExist(tableName, fn) {
    var query = "SELECT name FROM sqlite_master WHERE type='table' AND name= ?" ;
    db.transaction(function(tx){
        tx.executeSql(query , [tableName], function(tx, response) {
            fn(response);
        });
    });
}