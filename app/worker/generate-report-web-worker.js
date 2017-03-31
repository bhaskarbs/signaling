(function () {
    var lastPhase, token, cuId, bclKey, reportName, host, url, processId;
    // Take care of browser prefixes.
    self.postMessage = self.webkitPostMessage || self.postMessage;
    this.onmessage = function (msg) {
        var data = JSON.parse(msg.data);
        if (data) {
            lastPhase = data.phase;
            switch (data.phase) {
                case 1:
                    token = data.token;
                    cuId = data.cuId;
                    bclKey = data.bclKey;
                    reportName = data.reportName;
                    //for url Hit through SiteMinder
                    host = data.host;
                    url = data.url;
                    processId = data.processId;
                    getInstance();
                    break;
                case 2:
                    getResourceUrl(data.xmlStringObject);
                    break;
                case 3:
                    generateReport(data.reportId);
            }
        }
    };
    var getInstance = function () {
        var xhrRequest = new XMLHttpRequest();
        //for siteminder HIT
        var url = host + '/secure/rptapi/infostore/cuid_' + cuId + '/rpt/instance';
        xhrRequest.open('GET', url);
        xhrRequest.setRequestHeader('Content-Type', 'application/json');
        xhrRequest.setRequestHeader('X-SAP-LogonToken', token);
        xhrRequest.send();
        xhrRequest.onreadystatechange = function () {
            if (xhrRequest.readyState === 4) {
                if (xhrRequest.status === 200 || xhrRequest.status === 201) {
                    var queryObject = {
                        'phase': 1,
                        'data': xhrRequest.responseText,
                        'processId': processId,
                        'responseHeader': xhrRequest.getAllResponseHeaders()
                    };
                    self.postMessage(JSON.stringify(queryObject));
                } else {
                    self.postMessage(JSON.stringify({ 'error': xhrRequest.statusText, 'processId': processId }));
                }
            }
        };
        xhrRequest.onerror = function (err) {
            self.postMessage(JSON.stringify({ 'error': err, 'processId': processId }));
        };
    };
    var getResourceUrl = function (xmlStringObject) {
        var xhrRequest = new XMLHttpRequest();
        //site Minder HIT
        var url = host + '/secure/rptapi/infostore/cuid_' + cuId + '/rpt/instance';
        xhrRequest.open('POST', url);
        xhrRequest.setRequestHeader('Content-Type', 'application/xml');
        xhrRequest.setRequestHeader('X-SAP-LogonToken', token);
        xhrRequest.send(xmlStringObject);
        xhrRequest.onreadystatechange = function () {
            if (xhrRequest.readyState === 4) {
                if (xhrRequest.status === 200 || xhrRequest.status === 201) {
                    var queryObject = {
                        'phase': 2,
                        'data': xhrRequest.responseText,
                        'processId': processId,
                        'responseHeader': xhrRequest.getAllResponseHeaders()
                    };
                    self.postMessage(JSON.stringify(queryObject));
                } else {
                    self.postMessage(JSON.stringify({ 'error': xhrRequest.statusText, 'processId': processId }));
                }
            }
        };
        xhrRequest.onerror = function (err) {
            self.postMessage(JSON.stringify({ 'error': err, 'processId': processId }));
        };
    };
    var generateReport = function (reportId) {
        var xhrRequest = new XMLHttpRequest();
        //siteminder hit
        var url = host + '/secure/rptapi/infostore/cuid_' + cuId + '/rpt/' + reportId + '/export?mime_type=application/PDF&isCreateBookmarksFromGroupTree=true';
        xhrRequest.open('GET', url);
        xhrRequest.setRequestHeader('Content-Type', 'application/json');
        xhrRequest.setRequestHeader('X-SAP-LogonToken', token);
        xhrRequest.setRequestHeader('Accept', 'application/pdf');
        xhrRequest.responseType = 'arraybuffer';
        xhrRequest.send();
        xhrRequest.onreadystatechange = function () {
            if (xhrRequest.readyState === 4) {
                if (xhrRequest.status === 200 || xhrRequest.status === 201) {
                    self.postMessage({ 'processId': processId, 'phase': 3, 'response': xhrRequest.response });
                } else {
                    self.postMessage(JSON.stringify({ 'error': xhrRequest.statusText, 'processId': processId }));
                }
            }
        };
        xhrRequest.onerror = function (err) {
            self.postMessage(JSON.stringify({ 'error': err, 'processId': processId }));
        };
    };
})();
