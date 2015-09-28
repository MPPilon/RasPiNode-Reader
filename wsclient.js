/**
 * OPC UA client Web Socket provider for OPC UA Reading Remote Sensor Data Demo
 *
 * by Jeff Codling
 * Started on 15-08-24
 *
 * Project: Industrial Web Apps / Lambton College Research and Innovation
 * in association with Lambton Water Research
 */

// OPC UA Client Connection
var opcua = require("node-opcua");
var async = require("async");

var client = new opcua.OPCUAClient();

var endpointUrlPrefix = "opc.tcp://";
var opcuaIp = "184.151.36.91";
//var opcuaIp = "108.170.131.122";
var opcuaPort = "26543";
var endpointUrlPostfix = "/UA/Server";

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

var the_session = null,
    numberReads = 0;

// Time Interval: (ms)
// 20 = 9000 readings / minute
// 60 = 3000 readings / minute
var timeInterval = 1000,
    keepalive = 10000;
//

// Parse CLI arguments if available
if (process.argv.length > 2) {

    if (process.argv.indexOf('-interval') != -1) {
        timeInterval = process.argv[process.argv.indexOf('-interval') + 1];
    } else if (process.argv.indexOf('-keepalive') != -1) {
        keepalive = process.argv[process.argv.indexOf('-keepalive') + 1];
    } else if (process.argv.indexOf('-ip') != -1) {
        opcuaIp = process.argv[process.argv.indexOf('-ip') + 1];
        console.log('\nSetting OPC UA server IP to ' + opcuaIp);
    } else if (process.argv.indexOf('-port') != -1) {
        opcuaPort = process.argv[process.argv.indexOf('-port') + 1];
        console.log('\nSetting OPC UA server Port to ' + opcuaPort);
    } else if (process.argv.indexOf('-url') != -1) {
        endpointUrlPostfix = process.argv[process.argv.indexOf('-url') + 1];
        console.log('\nSetting URL of server to ' + endpointUrlPostfix);
    } else if (process.argv.indexOf('--help') != -1 || process.argv.indexOf('-h') != -1) {
        var usage = '\n\nUsage: node wsclient.js [option value]\n' +
                'options:\n' +
                '--help or -h\t-\tshow this help dialogue\n' +
                '-interval #\t-\tset read interval to # ms\n' +
                '-keepalive #\t-\tset OPC UA server keepalive query interval (should be less than 15000)\n' +
                '-ip #.#.#.#\t-\tset OPC UA server IP address\n' +
                '-port #\t-\tset OPC UA server PORT number to use\n' +
                '-url\t-\tset server endpoint url to use\n' +
                '\n\n';
        console.log(usage);
        process.exit();
    }} else {
    console.log("No options: Running with defaults".green);
}
console.log('\nRead Interval set to '.green + timeInterval + 'ms (' + 1000/timeInterval*ids.length*60 + ' reads per minute)');
console.log('Keep Alive interval is set to '.green + keepalive + 'ms\n');

var endpointUrl = endpointUrlPrefix + opcuaIp + ":" + opcuaPort + endpointUrlPostfix;
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
        console.log('\nConnecting to OPC UA server at: ' + endpointUrl + '\n');
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
        }, keepalive);
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

// Start the server
server.listen(9999, '0.0.0.0');
console.log('Web Server Listening on localhost:9999'.green);
console.log('http://localhost:9999/wsindex.html - link to sample client\n'.green);

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
