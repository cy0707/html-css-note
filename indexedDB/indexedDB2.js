(function () {
  // Works with:
  // * Firefox >= 16.0
  // * Google Chrome >= 24.0 (you may need to get Google Chrome Canary)

  var db_name = 'person',
      db_version = 1,// Use a long long for this value (don't use a float)
      db_store_name = 'testTable',
      indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB,
      arrayKey = [ ],
      openRequest,
      lastCursor,
      db;
  function init(){
    // 打开数据库
    openRequest = indexedDB.open(db_name);
    // 当数据的版本号变化，或者新的数据库的被创建
    openRequest.onupgradeneeded = function(e) {
        console.log('runing onupgradeneeded');
        // 这个数据库是对象的结果的一个实例
        var thisDb = e.target.result;
        console.log(thisDb.version);
        // 查看这个数据库是否包含这个存储空间对象
        if (!thisDb.objectStoreNames.contains(db_store_name)) {
          // 如果没有存在这个存储空间，那么就创建这个存储空间
          console.log('you need create the objectstore');
          var objectStore = thisDb.createObjectStore(db_store_name, {keyPath: 'id', autoIncrement: true});
              // 创建索引,那些字段可以被索引，这两个字段都不是唯一的
              objectStore.createIndex('name','name', {unique: false});
              objectStore.createIndex('phone', 'phone', {unique: false}); 
        }
    };

    // 数据库打开失败
    openRequest.onerror = function(e) {
      console.log(event.target.errorCode);
    };


    // 数据库打开成功
    openRequest.onsuccess = function(e) {
      db = e.target.result;
      console.log(db.version);
      db.onerror = function(e) {
        alert('Database error: ' + e.target.errorCode);
        console.dir(e.target);
      };
      // 如果数据库存在
      if (db.objectStoreNames.contains(db_store_name)) {
          // 创建一个事务
          var transaction = db.transaction([db_store_name], 'readwrite');
          //事务完成是
          transaction.oncomplete = function(e) {
            console.log('all done');
          };
          transaction.onerror = function(e) {
            console.dir(e);
          }
          //获取存储对象里面的对象
          var objectStore = transaction.objectStore(db_store_name);
          // 对存储对象进行遍历，利用游标
          objectStore.openCursor().onsuccess = function(e) {
            var cursor = e.target.result;
            // 如果对象存在的话
            if (cursor) {
              render({key: cursor.key, name:cursor.value.name, phone:cursor.value.phone, address:cursor.value.address});
              lastCursor = cursor.key;
              cursor.continue();
            }else{
              console.log('done with cursor');
            }
          };

          objectStore.openCursor().onerror = function(e) {
            console.dir(e);
          };
      }

    };

    // 向数据库添加数据
    document.querySelector('#add').addEventListener('click', function(e){
        // 获取用户输入的值
        console.log('cc');
        var name = document.querySelector('#name').value,
            phone = document.querySelector('#phone').value,
            address = document.querySelector('#address').value,
            person = {
              name: name,
              phone: phone,
              address: address
            },
            // 创建一个事务
            transaction = db.transaction([db_store_name], 'readwrite');
            transaction.oncomplete = function(e){
              console.log('transaction complete');
            };
            transaction.onerror = function(e){
              console.dir(e);
            };
            // 得到事务存储对象
            var objectStore = transaction.objectStore(db_store_name);
            // 添加到数据库
            objectStore.add(person);
            // 游标遍历
            objectStore.openCursor().onsuccess = function(e) {
               cursor = e.target.result;
               var key;
               if (lastCursor == null) {
                  key = cursor.key;
                  lastCursor = key;
               }else{
                  key = ++lastCursor;
               }

               render({key:key, name:name, phone:phone, address:address});
            };
    }, false);


    // 删除数据库的数据
    function deleteRecord(id){
     // 创建一个事务
     transaction = db.transaction([db_store_name], 'readwrite');
     transaction.oncomplete = function(e){
       console.log('transaction complete');
     };
     transaction.onerror = function(e){
       console.dir(e);
     };
     var objectStore = transaction.objectStore(db_store_name),
         removeKey = parseInt(id);
      // 删掉元素
      document.querySelector('#content').removeChild(document.getElementById(removeKey));
      getRequest = objectStore.get(removeKey);
      getRequest.onsuccess = function(e){
        var result = getRequest.result;
        console.dir(result);
      };
      // 删除
      var request = objectStore.delete(removeKey);
      request.onsuccess = function(e){
        console.log('success delete record');
      };
      request.onerror = function(e){
        console.log('error delete record');
      };


     
    }


    // 查询
    document.querySelector('#search').addEventListener('click',function(e){
      var searchName = document.getElementById('search-name').value;
      // 创建一个事务
      transaction = db.transaction([db_store_name], 'readwrite');
      transaction.oncomplete = function(e){
        console.log('transaction complete');
      };
      transaction.onerror = function(e){
        console.dir(e);
      };
      var objectStore = transaction.objectStore(db_store_name);
      var boundKeyRange = IDBKeyRange.only(searchName);
      // 索引通过游标范围进行查询
        objectStore.index('name').openCursor(boundKeyRange).onsuccess = function(e){
          var cursor = e.target.result;
          if (!cursor) {
            return;
          }
          var rowData = cursor.value;
          console.log(rowData);
          document.getElementById('content').innerHTML = '';
          render({key:cursor.value.id, name:cursor.value.name, phone:cursor.value.phone, address:cursor.value.address});
          cursor.continue();
        };
    },false);

    // 删除数据库
    document.querySelector('#deleteDB').addEventListener('click',function(e){
      var deleteDB = indexedDB.deleteDatabase(db_name),
          content = document.querySelector('#content');
      while(content.firstChild){
        content.removeChild(content.firstChild);
      }
      deleteDB.onsuccess = function(e){
        console.log("success delete database");
      };
      deleteDB.onerror = function(e) {
        console.dir(event.target);
      }
    },false);

    // 渲染函数
    function render(person) {
      var content = document.querySelector('#content');
      content.innerHTML += '<tr id="' + person.name + '"><td>' + person.name + '</td><td>' + person.phone + '</td><td>' +person.address + '</td><td class="delete">删除</td></tr>';
    }

    // 表格删除事假
    document.querySelector('#content').addEventListener('click',function(e){
        if (e.target.className == 'delete') {
            var target = e.target.parentNode.firstChild;
            deleteRecord(target.firstChild.nodeValue)
        }
    },false);
  }
  init();
})(); // Immediately-Invoked Function Expression (IIFE)