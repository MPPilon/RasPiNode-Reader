// API for demo opcuaclient.js to retrieve sensor readings for html front end
// by: Jeff Codling

var opcua = require("node-opcua");
var async = require("async");

var client = new opcua.OPCUAClient();

// Endpoint for Raspberry Pi inside work network
var endpointUrl = "opc.tcp://192.168.1.116:26543/UA/Server";

var the_session = null;

var readValue;

async.series([
    // step 1 : connect to OPCUA server
    function (callback) {
        client.connect(endpointUrl, function (err) {
            if (err) {
                console.log(" cannot connect to endpoint :", endpointUrl);
                console.log(err);
                callback(err);
            } else {
                console.log("connected");
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
    }
]);

// Depreciated function

//var readSensor = function(readValue, mainCallback) {
//    async.series([
//        // step 1 : connect to OPCUA server
//        function (callback) {
//            client.connect(endpointUrl, function (err) {
//                if (err) {
//                    console.log(" cannot connect to endpoint :", endpointUrl);
//                    console.log(err);
//                } else {
//                    //console.log("connected !");
//                }
//                callback(err);
//            });
//        },
//        // step 2 : createSession
//        function (callback) {
//            client.createSession(function (err, session) {
//                if (!err) {
//                    the_session = session;
//                    //console.log("Session successfully created");
//                }
//                callback(err);
//            });
//        },
//        // step 3 : read variable
//        function (callback) {
//            the_session.readVariableValue(readValue, function (err, dataValues, diagnostics) {
//                if (!err) {
//                    mainCallback(dataValues[0].value.value);
//                }
//                callback(err);
//            })
//        },
//        // step 4 : close session
//        function () {
//            client.disconnect(function() {});
//        }
//    ]);
//};

// REST API

var express = require('express');
var app = express();

// CORS
app.all('/sonic', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// GET ultrasonic sensor
app.get('/sonic', function (req, res) {
    readValue = "ns=2;s=Sonic";
    the_session.readVariableValue(readValue, function(err, dataValues, diagnostics) {
        if (!err) {
            res.send(dataValues[0].value.value.toString());
            console.log("Read ns=2;s=Sonic\t:\t" + dataValues[0].value.value);
        } else {
            console.log("Error reading ns=2;s=Sonic:\n" + err);
        }
    });
});

// CORS
app.all('/sim1', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// GET simulated sensor 1 - pump speed
app.get('/sim1', function(req, res) {
    readValue = "ns=2;s=PumpSpeed";
    the_session.readVariableValue(readValue, function(err, dataValues, diagnostics) {
        if (!err) {
            res.send(dataValues[0].value.value.toString());
            console.log("Read ns=2;s=PumpSpeed\t:\t" + dataValues[0].value.value);
        } else {
            console.log("Error reading ns=2;s=PumpSpeed:\n" + err);
        }
    });
});

// CORS
app.all('/sim2', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// GET simulated sensor 2 - Pressure
app.get('/sim2', function(req, res) {
    readValue = "ns=2;s=Pressure";
    the_session.readVariableValue(readValue, function(err, dataValues, diagnostics) {
        if (!err) {
            res.send(dataValues[0].value.value.toString());
            console.log("Read ns=2;s=Pressure\t:\t" + dataValues[0].value.value);
        } else {
            console.log("Error reading ns=2;s=Pressure:\n" + err);
        }
    });
});

var server = app.listen(8081, function() {
    var port = server.address().port;

    console.log("API listening on port %s", port);
});

function exit() {
    client.disconnect(function (err) {
        if (err) {
            console.log("Disconnect error : " + err);
        } else {
            console.log("Disconnected from : " + endpointUrl);
        }
        process.exit();
    });
}

process.on('SIGINT', exit);
