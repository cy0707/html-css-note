(function () {
  // Works with:
  // * Firefox >= 16.0
  // * Google Chrome >= 24.0 (you may need to get Google Chrome Canary)

  const DB_NAME = 'mdn-demo-indexeddb-epublications';
  const DB_VERSION = 1; // Use a long long for this value (don't use a float)
  const DB_STORE_NAME = 'publications';

  var db;

  function initDb() {
    console.debug("initDb ...");
    var req = indexedDB.open(DB_NAME, DB_VERSION);
    // 数据库成功的发生事件
    req.onsuccess = function (evt) {
      // Better use "this" than "req" to get the result to avoid problems with
      // garbage collection.
      // db = req.result;
      db = this.result;
      console.debug("initDb DONE");
    };
    // 数据库发生错误的的处理事件
    req.onerror = function (evt) {
      console.error("initDb:", evt.target.errorCode);
    };
    // 数据库更新时触发的事件
    req.onupgradeneeded = function (evt) {
      console.debug("initDb.onupgradeneeded");
      // currentTarget这是添加事件处理的程序的那个元素
      // 并是不是真正的事件对象
      // 创建
      var store = evt.currentTarget.result.createObjectStore(
        DB_STORE_NAME, { keyPath: 'id', autoIncrement: true });
      // 索引具有对存储的数据执行简单限制的能力。
      // 通过在创建索引时设置 unique 标记，
      // 索引可以确保不会有两个具有同样索引 key path 值的对象被储存
      store.createIndex('biblioid', 'biblioid', { unique: true });
      // biblioid不可以重复，title和year可以重复
      store.createIndex('title', 'title', { unique: false });
      store.createIndex('year', 'year', { unique: false });
    };
  }

  function getFile(key, success_callback) {
  	// 打开存储对象以只读的方式
    var tx = db.transaction(DB_STORE_NAME, 'readonly');
    // 获取对象
    var store = tx.objectStore(DB_STORE_NAME);
    var req = store.get(key);
    req.onsuccess = function(evt) {
      var value = evt.target.result;
      if (value)
        success_callback(value.file);
    };
  }

  function displayPubList() {
    console.debug("displayPubList");
    var pub_msg = $('#pub-msg');
    pub_msg.empty();
    var pub_list = $('#pub-list');
    pub_list.empty();

    var tx = db.transaction(DB_STORE_NAME, 'readonly');
    var store = tx.objectStore(DB_STORE_NAME);
    var req;

    req = store.count();
    // Requests are executed in the order in which they were made against the
    // transaction, and their results are returned in the same order.
    // Thus the count text below will be displayed before the actual pub list
    // (not that it is algorithmically important in this case).
    req.onsuccess = function(evt) {
      pub_msg.append('<p>There are <strong>' + evt.target.result +
                     '</strong> record(s) in the object store.</p>');
    };
    req.onerror = function(evt) {
      console.error("add error", this.error);
      displayActionFailure(this.error);
    };

    var i = 0;
    var img_id;
    var file_presence;
    var presence_html;
    req = store.openCursor();
    req.onsuccess = function(evt) {
      var cursor = evt.target.result;
      if (cursor) {
        presence_html = "<span class='presence-no'>No image</span>";
        file_presence = cursor.value.file != null;
        console.debug("cursor.value:", cursor.value);
        if (file_presence) {
          img_id = 'pub-img-' + i;
          presence_html = '<img id="' + img_id + '"/>';
          getFile(cursor.key, function(file) {
            console.debug("file:", file);

            // Note that here it is not possible to set a link to the file to
            // make  it possible to download it.
            // The only possible options are:
            // * display the file if it is an image
            // * getting text/other info from the file and display them
            var obj_url = window.URL.createObjectURL(file);
            $('#' + img_id).attr('src', obj_url);
            window.URL.revokeObjectURL(obj_url);
          });
        }
        pub_list.append('<li>' +
                        '[' + cursor.key + '] ' +
                        '(biblioid: ' + cursor.value.biblioid + ') ' +
                        cursor.value.title + ' - ' +
                        cursor.value.year + ' / ' +
                        presence_html +
                        '</li>');

        // Move on to the next object in store
        cursor.continue();

        // This counter serves only to create distinct img ids
        i++;
      } else {
        console.debug("No more entries!");
      }
    };
  };

  function addPublication(biblioid, title, year, file) {
    console.debug("addPublication arguments:", arguments);
    if (!db) {
      console.error("addPublication: the db is not initialized");
      return;
    }
    var tx = db.transaction(DB_STORE_NAME, 'readwrite');
    var store = tx.objectStore(DB_STORE_NAME);
    var req = store.add({ biblioid: biblioid, title: title, year: year,
                          file: file });
    req.onsuccess = function (evt) {
      console.debug("Insertion in DB successful");
      displayPubList();
    };
    req.onerror = function() {
      console.error("add error", this.error);
      displayActionFailure(this.error);
    };
  }

  function displayActionSuccess(msg) {
    msg = typeof msg !== 'undefined' ? "Success: " + msg : "Success";
    $('#action-status').html('<span class="action-success">' + msg + '</span>');
  }
  function displayActionFailure(msg) {
    msg = typeof msg !== 'undefined' ? "Failure: " + msg : "Failure";
    $('#action-status').html('<span class="action-failure">' + msg + '</span>');
  }
  function resetActionStatus() {
    console.debug("resetActionStatus ...");
    $('#action-status').empty();
    console.debug("resetActionStatus DONE");
  }

  function addEventListeners() {
    console.debug("addEventListeners");
    initDb();

    $('#register-form-reset').click(function(evt) {
      resetActionStatus();
    });

    $('#add-button').click(function(evt) {
      console.debug("add ...");
      var title = $('#pub-title').val();
      var year = $('#pub-year').val();
      var biblioid = $('#pub-biblioid').val();
      if (!title || !year || !biblioid) {
        displayActionFailure("Required field(s) missing");
        return;
      }

      var file_input = $('#pub-file');
      var selected_file = file_input.get(0).files[0];
      console.debug("selected_file:", selected_file);
      file_input.val(null);
      var content_url = $('#pub-content-url').val();
      if (selected_file) {
        addPublication(biblioid, title, year, selected_file);
      } else {
        addPublication(biblioid, title, year);
        displayActionSuccess();
      }

    });

    $('#delete-button').click(function(evt) {
      console.debug("delete ...");
      var k = $('#pub-biblioid-to-delete').val();
      console.debug("delete k:", k);
      var tx = db.transaction(DB_STORE_NAME, 'readwrite');
      var store = tx.objectStore(DB_STORE_NAME);

      // Warning: The exact same key used for creation needs to be passed for
      // the deletion. If the key was a Number for creation, then it needs to be
      // a Number for deletion.
      k = Number(k);

      // The code that could be nice if it worked
      // var req = store.delete(k);
      // req.onsuccess = function(evt) {
      //   var record = evt.target.result;
      //   console.debug("record:", record);
      //   if (typeof record !== 'undefined') {
      //     displayActionSuccess("Deletion successful");
      //     displayPubList();
      //   } else {
      //     displayActionFailure("No matching record found");
      //   }
      // };
      // req.onerror = function (evt) {
      //   console.error("delete:", evt.target.errorCode);
      // };

      // The code that actually works
      //
      // As per spec http://www.w3.org/TR/IndexedDB/#object-store-deletion-operation
      // the result of the Object Store Deletion Operation algorithm is
      // undefined, so it's not possible to know if some records were actually
      // deleted by looking at the request result.
      var req = store.get(k);
      req.onsuccess = function(evt) {
        var record = evt.target.result;
        console.debug("record:", record);
        if (typeof record !== 'undefined') {
          req = store.delete(k);
          req.onsuccess = function(evt) {
            console.debug("evt:", evt);
            console.debug("evt.target:", evt.target);
            console.debug("evt.target.result:", evt.target.result);
            console.debug("delete successful");
            displayActionSuccess("Deletion successful");
            displayPubList();
          };
          req.onerror = function (evt) {
            console.error("delete:", evt.target.errorCode);
          };
        } else {
          displayActionFailure("No matching record found");
        }
      };
      req.onerror = function (evt) {
        console.error("delete:", evt.target.errorCode);
      };

    });

    var search_button = $('#search-list-button');
    search_button.click(function(evt) {
      displayPubList();
    });

  }

// function dbAddAndGetBlob(title, year, url) {
//   // Create XHR
//   var xhr = new XMLHttpRequest();
//   var blob;

//   // We can't use jQuery here because as of jQuery 1.7.2 the new "blob"
//   // responseType is not handled.
//   // http://bugs.jquery.com/ticket/7248
//   //
//   // Attention Same origin policy, the URL must come from the same origin than
//   // the web app.
//   xhr.open('GET', url, true);
//   // Set the responseType to blob
//   xhr.responseType = 'blob';
//   xhr.addEventListener("load", function () {
//                          if (xhr.status === 200) {
//                            console.debug("File retrieved");

//                            // Blob as response
//                            blob = xhr.response;
//                            console.debug("Blob:" + blob);

//                            // Insert the received blob into IndexedDB
//                            dbAdd(title, year, blob);
//                          } else {
//                            console.error("loadConfigFormHtmlContent error:",
//                                          xhr.responseText, xhr.status);
//                          }
//                        }, false);
//   // Send XHR
//   xhr.send();
// }

  addEventListeners();
})(); // Immediately-Invoked Function Expression (IIFE)