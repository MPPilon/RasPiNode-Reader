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
                console.log("Make sure the OPCUA server is running at " + endpointUrl);
                callback(err);
            } else {
                console.log("Connected to %s".green, endpointUrl);
            }
            callback(err);
        });
    },
    // step 2 : createSession
    function (callback) {
        client.createSession(function (err, session) {
            if (!err) {
                the_session = session;
                console.log("Session successfully created".green);
            }
            callback(err);
        });
    },
    // step 3: Keep Alive - Server expects communication within 20 seconds to stay alive
    function (callback) {
        setInterval( function () {
            readValue = "ns=2;s=SomeDate";
            the_session.readVariableValue(readValue, function(err, dataValues, diagnostics) {
                if (!err) {
                    console.log("-Tick-Keep-Alive-\t:\t%s".yellow, dataValues[0].value.value);
                } else {
                    console.log("Error -Tick------\t:\n%s".red, err);
                    callback(err);
                }
            });
        }, 10000);
    }
]);

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

    console.log("API listening on port %s".yellow, port);
});

function exit() {
    client.disconnect(function (err) {
        if (err) {
            console.log("Disconnect error : %s".red, err);
        } else {
            console.log("\n\nDisconnected from : %s\n".green, endpointUrl);
        }
    });
    process.exit();
}

process.on('SIGINT', exit);
