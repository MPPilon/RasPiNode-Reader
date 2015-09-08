/**
 * Created by jeff on 15-08-24.
 */

// getTimestamp - Returns the current time in hours, minutes, seconds and milliseconds to 3 decimal places
function getTimestamp() {
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    var l = d.getMilliseconds();

    var hours = (h<10)?"0" + h.toString(): h.toString();
    var minutes = (m<10)?"0" + m.toString(): m.toString();
    var seconds = (s<10)?"0" + s.toString(): s.toString();
    var milliseconds = (l<10)?"0" + l.toString(): l.toString();

    return hours.toString() + ':' + minutes.toString() + ':' + seconds.toString() + ':' + milliseconds.toString();
}

// Web Socket

var sock = null,
    reconnectInterval = null;

// Function to create and manage a new connection to the web socket
var new_connection = function() {
    sock = new SockJS('http://localhost:9999/echo');

    clearInterval(reconnectInterval);

    // Socket open
    sock.onopen = function() {
        console.log('open');
        $('#content').val(function(i, text) {
            return getTimestamp() + ' : OPEN\n' + text;
        });
    };

    // Socket closed
    sock.onclose = function() {
        console.log('close');
        $('#content').val(function(i, text) {
            return getTimestamp() + ' : CLOSE\t-\tAttempting to reconnect\n' + text;
        });

        // try to reconnect every 2 seconds (recursively)
        reconnectInterval = setInterval(function() {
            new_connection();
        }, 2000);
    };

    // show results when new information
    sock.onmessage = function(e) {
        var content = JSON.parse(e.data);

        $(content.id).val(function(i, text) {
            return getTimestamp() +
                '\t' +
                content.reading +
                '\n' +
                text;
        });

        $('#content').val(function(i, text) {
            return getTimestamp()
                + '\t'
                + JSON.stringify(content)
                + '\n' + text;
        });
    };
};

// Start the first connection attempt
new_connection();
