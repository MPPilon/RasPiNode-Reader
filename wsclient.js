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
var readline = require("readline");

var client = new opcua.OPCUAClient();
client.endpoint_must_exist = false;

var endpointUrlPrefix = "opc.tcp://";
//var opcuaIp = "108.170.131.122";

//This info is for the local server
/*var opcuaIp = "localhost";
var opcuaPort = "4334";
var endpointUrlPostfix = "/OPCUA/Mabel";*/

//This info is for the Raspberry Pi
var opcuaIp = "10.55.39.69";
var opcuaPort = "4334";
var endpointUrlPostfix = "/OPCUA/Dipper";

// Sensors to read
var subscriptions = [
    'Temperature'
];
var ids = [
    "ns=1;s=temperature"
];

var the_session = null,
    numberReads = 0,
    averageThirtySeconds = 0,
    readingAdder = 0,
    secondCounter = 0;

// Time Interval: (ms)
// 20 = 9000 readings / minute
// 60 = 3000 readings / minute
var timeInterval = 30000,
    keepalive = 1000;
//

//create a console interface

var cmd = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
var getSensorValue = function(id, cb) {
    the_session.readVariableValue(id, function(err, dataValues, diagnositics) {
        if (err) {
            console.log('Error reading %s'.red + ": " + err + " - " + dataValues.value.value, id);
        } else {
            cb(dataValues.value.value, id);
        }
    });
};

// Historian Testing
var startRecording = function(id, cb) {
    the_session.addEventHistory(id, function(err) {
        if (err) {
            console.log('History: Error adding %s'.red, id);
        } else {
            cb(true);
        }
    });
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
    });
};

// Create OPC UA server connection, session, and keep alive
async.series([
    function (callback) {
      client.getEndpointsRequest(function (err, endpoints) {

        console.log("Client: " + client);

      });
      callback();
    },
    // connection
    function (callback) {
        console.log('\nConnecting to OPC UA server at: ' + endpointUrl + '\n');
        client.connect(endpointUrl, function (err) {
            console.log("Entered connect callback");
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
        console.log("Session function");
        client.createSession(function (err, session) {
            if (!err) {
                the_session = session;
                console.log('Session successfully created'.green);
            }
            callback(err);
        });
    },

  /*  function(callback) {
      //This function crawls through the address space and prints it to
      //OutputFile.txt for further reading.
        var treeify = require("node-opcua/node_modules/treeify");
        var fs = require("fs");
        var writeStream = fs.createWriteStream("OutputFile.txt");
        var crawler = new opcua.NodeCrawler(the_session);

          var t = Date.now();
          var t1;
          client.on("send_request", function () {
              t1 = Date.now();
          });
          client.on("receive_response", function () {
              var t2 = Date.now();
              var util = require("util");
              var str = util.format("R= %d W= %d T=%d t= %d", client.bytesRead, client.bytesWritten, client.transactionsPerformed, (t2 - t1));
              console.log(str.yellow.bold);
          });

          t = Date.now();
          crawler.on("browsed", function (element) {
              // console.log("->",element.browseName.name,element.nodeId.toString());
          });

          var nodeId = "RootFolder";
          console.log("now crawling all folders ...please wait...");
          crawler.read(nodeId, function (err, obj) {
              if (!err) {
                  // todo : treeify.asTree performance is *very* slow on large object, replace with better implementation
                  //xx console.log(treeify.asTree(obj, true));
                  treeify.asLines(obj, true, true, function (line) {
                      writeStream.write(line + "\n");
                  });
              }
          });
          console.log("Crawl complete.");
        /*if(!err) {
          console.log("RootFolder length: " + browse_result[0].references.length);
          console.log("RootFolder: " + browse_result);
          var browseDescription = {
            nodeId: "FolderType",
            browseDirection: opcua.browse_service.BrowseDirection.Forward
          };
          the_session.browse(browseDescription, function(err2, browse_result2) {
            console.log("Second folder result:" + browse_result2);
          });
        }*/
         //callback();
      //});

    //},

    // keep alive
    function (callback) {
        console.log("keepalive function");
        setInterval( function () {
            getSensorValue("ns=1;s=temperature", function(reading, id) {
                process.stdout.write('\rLast Keep Alive : '.yellow + reading + ' \tReadings: '.green + numberReads);
                readingAdder += reading;
                if (secondCounter == 30) {
                  averageThirtySeconds = readingAdder / 30;
                  readingAdder = 0;
                  secondCounter = 0;
                }
                secondCounter++;
            });
        }, keepalive);

        cmd.prompt();
        cmd.on("line", function(request) {
          //line happens when we submit something from the console.
          getSensorValue(request, function(response, requested) {
            console.log("Requested " + requested + ", received: \n" + response);
          });
          cmd.prompt();
        });
        callback();
    }
]
);
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
          /* jshint loopfunc:true */
          getSensorValue(ids[i], function(reading, id) {
              var line;
              //line = '{ "id": "#' + id.substring(7, id.length + 1) + '", "reading": ' + reading + ' }';
              line = '{ "id": "#' + id.substring(7, id.length + 1) + '", "reading": ' + averageThirtySeconds + ' }';
              //console.log("Sent to page: " + line);
              conn.write(line);
              numberReads++;
          });

          //console.log("ID: " + ids[i] + " |Subscriptions: " + subscriptions[i]);
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
