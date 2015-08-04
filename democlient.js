var opcua = require("node-opcua");
var async = require("async");

var client = new opcua.OPCUAClient();

// Endpoint for Raspberry Pi
var endpointUrl = "opc.tcp://192.168.1.116:26543/UA/Server";
// var endpointUrl = "opc.tcp://192.168.1.116:26543";

var the_session = null;

var readSensor = function(readValue, mainCallback) {
    var returnValue = null;
    async.series([
        // step 1 : connect to
        function (callback) {
            client.connect(endpointUrl, function (err) {
                if (err) {
                    console.log(" cannot connect to endpoint :", endpointUrl);
                } else {
                    console.log("connected !");
                }
                callback(err);
            });
        },
        // step 2 : createSession
        function (callback) {
            client.createSession(function (err, session) {
                if (!err) {
                    the_session = session;
                    console.log("Session successfully created");
                }
                callback(err);
            });

        },
        // step 4 : read a variable
        function (callback) {
            the_session.readVariableValue(readValue, function (err, dataValues, diagnostics) {
                if (!err) {
                    mainCallback(dataValues[0].value.value);
                }
                callback(err);
            })
        },
        function () {
            client.disconnect(function() {});
        }
    ]);
};

// RESTfull API

var express = require('express');
var app = express();
var fs = require("fs");

app.get('/', function (req, res) {
    readSensor("ns=2;s=Sonic", function(value) {
        res.send(value.toString());
    });
});

var server = app.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Listening at http://%s:%s", host, port);
});
