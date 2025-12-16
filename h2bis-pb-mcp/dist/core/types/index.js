/**
 * Database connection state
 */
export var ConnectionState;
(function (ConnectionState) {
    ConnectionState["DISCONNECTED"] = "disconnected";
    ConnectionState["CONNECTING"] = "connecting";
    ConnectionState["CONNECTED"] = "connected";
    ConnectionState["DISCONNECTING"] = "disconnecting";
    ConnectionState["ERROR"] = "error";
})(ConnectionState || (ConnectionState = {}));
//# sourceMappingURL=index.js.map