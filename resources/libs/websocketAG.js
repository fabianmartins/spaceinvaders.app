


function ApiGatewayWebSocket(awsFacade, websocketCallbacks) {
    this.messageCallback = websocketCallbacks.messageCallback;
    this.closeCallback = websocketCallbacks.closeCallback;
    this.errorCallback = websocketCallbacks.errorCallback;
    console.log(this.messageCallback);
    let self = this;
    awsFacade.getWebSocketEndpoint((err, data) => {
        if (err) {
            console.log('Error', err);
        } else {
            console.log('Success getting websocket URL', data);
            URL = data.GetParameterResponse.GetParameterResult.Parameter.Value;
            self.ws = new WebSocket(URL);
            self.ws.onmessage = ApiGatewayWebSocket.prototype.onMessageListener.bind(self);
            self.ws.onclose = ApiGatewayWebSocket.prototype.onCloseListener.bind(self);
            self.ws.onerror = ApiGatewayWebSocket.prototype.onErrorListener.bind(self);
        }
    });
}

ApiGatewayWebSocket.prototype.onMessageListener = function(message) {
    if (this.messageCallback) this.messageCallback(message);
}

ApiGatewayWebSocket.prototype.onErrorListener = function(err) {
    if (this.errorCallback) this.errorCallback(err);
}

ApiGatewayWebSocket.prototype.onCloseListener = function(closeMessage) {
    if (this.closeCallback) this.closeCallback(closeMessage)
}

ApiGatewayWebSocket.prototype.sendMessage = function(message) {
    if (message) {
        if (message.action)
            this.ws.send(JSON.stringify(message));
    }
}
