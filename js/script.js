function IDB(dbname) {
  var db, version;
  var request = indexedDB.open(dbname);
  request.onsuccess = function(e) {
    db = e.target.result;
    version = parseInt(db.version);
    console.log("database connected :" + dbname);
  }

  return {
    create: function (strname) {
      if(db.objectStoreNames.contains(strname)){
        console.log(strname + " store already exists");
      }
      else {
        version++;
        console.log(version);
        db.close();
        var request = indexedDB.open(dbname, version);
        request.onsuccess = function(e) {
          db = e.target.result;
        }
        request.onupgradeneeded = function(e) {
          db = e.target.result;
          db.createObjectStore(strname, { keyPath: '_id' });
          console.log("store created : "+ strname);
        };
        request.onerror = function(e) {
          console.log('an indexeddb error has occurred', e);
        }
      }
    },
    save: function(strname, obj) {
      var transaction = db.transaction([strname], 'readwrite');
      var store = transaction.objectStore(strname);
      store.put(obj);
      console.log("data saved : " + obj);
    },
    get: function(strname, _id, callback) {
      var transaction = db.transaction([strname], 'readwrite');
      var store = transaction.objectStore(strname);
      store.get(_id).onsuccess = function(e) {
        var data = e.target.result;
        console.log(data);
        callback(data);
      }
    },
    delete: function (strname) {
      if(!db.objectStoreNames.contains(strname)){
        console.log("store doesnot exists");
      }
      else {
        db.close();
        version++;
        var request = indexedDB.open(dbname, version);
        request.onsuccess = function(e) {
          db = e.target.result;
        }
        request.onupgradeneeded = function(e) {
          db = e.target.result;
          db.deleteObjectStore(strname, { keyPath: '_id' });
          console.log("store deleted: "+ strname);
        };
        request.onerror = function(e) {
          console.log('an indexedDB error has occurred', e);
        }
      }
    }
  }
}
