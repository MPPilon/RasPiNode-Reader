/**
 * Created by jeff on 15-08-24.
 */

// OPC UA Client Connection
var opcua = require("node-opcua");
var async = require("async");

var client = new opcua.OPCUAClient();

var endpointUrl = "opc.tcp://192.168.1.116:26543/UA/Server";

var the_session = null,
    numberReads = 0;

// Time Interval: (ms)
// 20 = 9000 readings / minute
// 60 = 3000 readings / minute
var timeInterval = 1000;
//

// Parse CLI arguments if available
if (process.argv.length > 2) {
    if (process.argv[2] == '-interval' && process.argv[3]) {
        timeInterval = process.argv[3];
        console.log('\nRead Interval set to ' + timeInterval + ' (' + timeInterval*3*60*60/1000 + ' per minute)\n');
    } else if (process.argv[2] == '--help' || process.argv[2] == '-h') {
        var usage = '\n\nUsage: node wsclient.js [option value]\n' +
                'option:\n' +
                '--help or -h\t\tshow this help dialogue\n' +
                '-interval #\t\tset read interval to # ms\n' +
                '\n\n';
        console.log(usage);
    }} else {
    console.log("No options: Running with defaults".green);
}
//

// Function to return an OPC UA variable value
var getSensorValue = function(id, readValue, cb) {
    the_session.readVariableValue(readValue, function(err, dataValues, diagnositics) {
        if (err) {
            console.log('Error reading %s'.red, readValue);
        } else {
            cb(dataValues[0].value.value, id, readValue);
        }
    })
};

// Historian Testing
var startRecording = function(id, cb) {
    the_session.addEventHistory(id, function(err) {
        if (err) {
            console.log('History: Error adding %s'.red, id);
        } else {
            cb(true);
        }
    })
};

var getHistoryValue = function(id, readValue, cb) {
    the_session.readHistoryValue(readValue, "2015-07-01T09:00:00.000Z", "2015-07-03T09:01:00.000Z", function(err, dataValues, diagnostics) {
        if (err) {
            console.log('History: Error reading %s'.red, readValue);
            if (diagnostics) {
                console.log(diagnostics);
            }
        } else {
            cb(dataValues[0].value.value, id, readValue);
        }
    })
};

// Create OPC UA server connection, session, and keep alive
async.series([
    // connection
    function (callback) {
        client.connect(endpointUrl, function (err) {
            if (err) {
                console.log('Cannot connect to endpoint %s'.red, endpointUrl);
                callback(err);
            } else {
                console.log('Connected to %s'.green, endpointUrl);
            }
            callback(err);
        });
    },
    // session
    function (callback) {
        client.createSession(function (err, session) {
            if (!err) {
                the_session = session;
                console.log('Session successfully created'.green);
            }
            callback(err);
        });
    },
    // keep alive
    function (callback) {
        setInterval( function () {
            getSensorValue('', 'ns=2;s=SomeDate', function(reading, id, sensor) {
                process.stdout.write('\rLast Keep Alive : '.yellow + reading + '\tReadings: '.green + numberReads);
            });
        }, 10000);
        callback();
    }
]);

// Web Socket and Web Server
var http = require('http'),
    sockjs = require('sockjs'),
    node_static = require('node-static');

var sockjs_opts = {sockjs_url: "http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js"};

// Open socket
var sockjs_echo = sockjs.createServer(sockjs_opts);

// Sensors to read
var subscriptions = [
    'ns=2;s=Sonic',
    'ns=2;s=PumpSpeed',
    'ns=2;s=Pressure'
];
var ids = [
    '#sonic',
    '#pumpspeed',
    '#pressure'
];

// when connected do ...
sockjs_echo.on('connection', function(conn) {
    setInterval( function() {
        var reading;
        for (var i = 0; i < subscriptions.length; i++) {
            getSensorValue(ids[i], subscriptions[i], function(reading, id, sensor) {
                var line;
                line = '{"id":"'
                    + id
                    + '","sensor":"'
                    + sensor
                    + '","reading":'
                    + reading + '}';
                //console.log(line);
                conn.write(line);
                numberReads++;
            });
        }
    }, timeInterval);

});

// File server location
var static_directory = new node_static.Server();

// HTTP Server
var server = http.createServer();
// request listener
server.addListener('request', function(req, res) {
    static_directory.serve( req, res);
});
// close listener
server.addListener('upgrade', function(req, res) {
    res.end();
});

// socket prefix (0.0.0.0:9999/echo)
sockjs_echo.installHandlers(server, {prefix:'/echo'});

console.log('Listening on 0.0.0.0:9999');
// Start the server
server.listen(9999, '0.0.0.0');

// On exit do...
process.on('SIGINT', function () {
    process.stdout.write("\n\n");
    client.disconnect(function (err) {
        if (!err) {
            console.log("\n\nDisconnected from %s".green, endpointUrl);
        } else {
            console.log("Disconnect Error : %s".red, err);
        }
    });
    process.exit();
});
