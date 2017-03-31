(function () {
  var response = { data: {}, count: 0 };
  self.postMessage = self.webkitPostMessage || self.postMessage;
      self.onmessage = function (msg) {
        var data = JSON.parse(msg.data);
        (function poll(){
            getNotificationData(data.url);
            setTimeout(function() {
              poll();
            }, 10000);
          })();
      };
   var getNotificationData = function (url) {
          var xhrRequest = new XMLHttpRequest();
          xhrRequest.open('GET', url);
          xhrRequest.setRequestHeader('Content-Type', 'application/json');
          xhrRequest.send();
          xhrRequest.onreadystatechange = function () {
              if (xhrRequest.readyState === 4) {
                  if (xhrRequest.status === 200 || xhrRequest.status === 201) {
                     var data = JSON.parse(xhrRequest.responseText);
                     response.count = parseInt(data.d.__count);
                     response.data = data.d.results;
                      self.postMessage(JSON.stringify({'response':response}));
                  } else {
                      self.postMessage(JSON.stringify({ 'error': xhrRequest.statusText}));
                  }
              }
          };
          xhrRequest.onerror = function (err) {
              self.postMessage(JSON.stringify({ 'error': err}));
          };
      };
})();
