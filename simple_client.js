// Simple OPC UA client using Node-OPCUA
// Modified by Jeff Codling for proof of concept

// value to read from server
var readValue = "ns=2;s=Pressure";
var readValue2 = "ns=2;s=PumpSpeed";
var readValue3 = "ns=4;s=TemperatureAnalogItem";

// data store for subscribed variables
var values = [];
var values2 = [];
var values3 = [];

var opcua = require("node-opcua");
var async = require("async");

var client = new opcua.OPCUAClient();

// Endpoint currently set to access Open OPC UA server running in Win8 VM

// var endpointUrl = "opc.tcp://" + require("os").hostname() + ":4841";

// Endpoint for Windows 8.1 VM
// var endpointUrl = "opc.tcp://10.211.55.3:16664";

// Endpoint for Raspberry Pi
var endpointUrl = "opc.tcp://192.168.1.116:26543/UA/Server";

var the_session = null;
async.series([
    // step 1 : connect to
    function(callback)  {
        client.connect(endpointUrl,function (err) {
            if(err) {
                console.log(" cannot connect to endpoint :" , endpointUrl );
            } else {
                console.log("connected !");
            }
            callback(err);
        });
    },
    // step 2 : createSession
    function(callback) {
        client.createSession( function(err,session) {
            if(!err) {
                the_session = session;
                console.log("Session successfully created");
            }
            callback(err);
        });

    },
    // step 3 : browse
    function(callback) {

        the_session.browse("RootFolder", function(err,browse_result,diagnostics){
            if(!err) {
                browse_result[0].references.forEach(function(reference) {
                    console.log( reference.browseName);
                });
            }
            callback(err);
        });
    },
    // step 4 : read a variable
    function(callback) {
        the_session.readVariableValue(readValue, function(err,dataValues,diagnostics) {
            if (!err) {
                console.log("\n " + readValue + " = " + dataValues[0] + "\n");
            }
            callback(err);
        })
    },

    // step 5: install a subscription and monitored item
    //
    // -----------------------------------------
    // create subscription
    function(callback) {

        the_subscription=new opcua.ClientSubscription(the_session,{
            requestedPublishingInterval: 250,
            requestedLifetimeCount: 10,
            requestedMaxKeepAliveCount: 2,
            maxNotificationsPerPublish: 10,
            publishingEnabled: true,
            priority: 10
        });
        the_subscription.on("started",function(){
            console.log("subscription started for 2 seconds - subscriptionId=",the_subscription.subscriptionId);
        }).on("keepalive",function(){
            console.log("keepalive");
        }).on("terminated",function(){
            callback();
        });
        setTimeout(function(){
            the_subscription.terminate();
        },10000);


        // install monitored item
        //
        var monitoredItem  = the_subscription.monitor({
            nodeId: opcua.resolveNodeId(readValue),
            attributeId: 13
          //, dataEncoding: { namespaceIndex: 0, name:null }
        },
        { 
            samplingInterval: 100,
            discardOldest: true,
            queueSize: 10 
        });
        console.log("Monitor-----------------1-------------------");

        // subscription.on("item_added",function(monitoredItem){
        //xx monitoredItem.on("initialized",function(){ });
        //xx monitoredItem.on("terminated",function(value){ });
        
        var monitoredItem2 = the_subscription.monitor({
        		nodeId: opcua.resolveNodeId(readValue2),
        		attributeId: 13
        },
        {
        		sampleInterval: 100,
        		discardOldest: true,
        		queueSize: 10
        });
        console.log("Monitor-----------------2-------------------");

        var monitoredItem3 = the_subscription.monitor({
        		nodeId: opcua.resolveNodeId(readValue3),
        		attributeId: 13
        },
        {
        		sampleInterval: 100,
        		discardOldest: true,
        		queueSize: 10
        });
        console.log("Monitor-----------------3-------------------");

        monitoredItem.on("changed",function(value){
            console.log("==========" + readValue.cyan);
            console.log(value.value.value);
            values.push(value.value.value);
        });
        
        monitoredItem2.on("changed",function(value){
        		console.log("----------" + readValue2.red);
        		console.log(value.value.value);
            values2.push(value.value.value);
        });

        monitoredItem3.on("changed",function(value){
        		console.log("++++++++++" + readValue3.green);
        		console.log(value.value.value);
            values3.push(value.value.value);
        });
    },

    // ------------------------------------------------
    // closing session
    //
    function(callback) {
        console.log("-closing session".yellow);
        the_session.close(function(err){

            console.log("-session closed".red);
            callback();
        });
    },


],
    function(err) {
        if (err) {
            console.log("-failure ".red,err);
        } else {
            console.log("done!".green)
            
            var average = 0,
            min = 9999999999,
            max = 0,
            i = 0;
            
            console.log("\nStats".white);
            for(i = 0; i < values.length; i++) {
            		average += values[i];
            };
            average /= values.length;
            min = Math.min.apply(Math, values);
            max = Math.max.apply(Math, values);
            
            console.log("");
            console.log(readValue.cyan);
            console.log("Len=" + values.length + "\tMax=" + max + "\tMin=" + min + "\tAvg=" + average);

						console.log("");

            average = min = max = 0;
            for(i = 0; i < values2.length; i++) {
            		average += values2[i];
            };
            average /= values2.length;
            min = Math.min.apply(Math, values2);
            max = Math.max.apply(Math, values2);

            console.log(readValue2.red);
            console.log("Len=" + values2.length + "\tMax=" + max + "\tMin=" + min + "\tAvg=" + average);

						console.log("");

            average = min = max = 0;
            for(i = 0; i < values3.length; i++) {
            		average += values3[i];
            };
            average /= values3.length;
            min = Math.min.apply(Math, values3);
            max = Math.max.apply(Math, values3);

            console.log(readValue3.green);
            console.log("Len=" + values3.length + "\tMax=" + max + "\tMin=" + min + "\tAvg=" + average);

        }
        client.disconnect(function(){});
    }
);

