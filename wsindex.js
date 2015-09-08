/**
 * Created by jeff on 15-08-24.
 */

// Data collection

//var chartData = [
//    { 'id': '#sonic', 'values': [] },
//    { 'id': '#pumpspeed', 'values': [] },
//    { 'id': '#pressure', values: []}
//];

var chartData = {
    labels: [],
    datasets: [
        {
            label: "Sonic",
            id: "#sonic",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: []
        }
    ]
};

var chartOptions = {

    ///Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines : true,

    //String - Colour of the grid lines
    scaleGridLineColor : "rgba(0,0,0,.05)",

    //Number - Width of the grid lines
    scaleGridLineWidth : 1,

    //Boolean - Whether to show horizontal lines (except X axis)
    scaleShowHorizontalLines: true,

    //Boolean - Whether to show vertical lines (except Y axis)
    scaleShowVerticalLines: true,

    //Boolean - Whether the line is curved between points
    bezierCurve : true,

    //Number - Tension of the bezier curve between points
    bezierCurveTension : 0.4,

    //Boolean - Whether to show a dot for each point
    pointDot : true,

    //Number - Radius of each point dot in pixels
    pointDotRadius : 4,

    //Number - Pixel width of point dot stroke
    pointDotStrokeWidth : 1,

    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
    pointHitDetectionRadius : 20,

    //Boolean - Whether to show a stroke for datasets
    datasetStroke : true,

    //Number - Pixel width of dataset stroke
    datasetStrokeWidth : 2,

    //Boolean - Whether to fill the dataset with a colour
    datasetFill : true,

    //String - A legend template
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
};

var ctx = document.getElementById('chart');
var ctx2 = ctx.getContext("2d");
var chrt = new Chart(ctx2).Line(chartData, chartOptions);

// Maximum number of datapoints to store
var maxDataToStore = 5;

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

        // Track charting data

        tempValues = [];

        chartData.datasets.forEach(function(v) {
            if (v.id == content.id) {
                tempValues = v.data;
                tempValues.push(content.reading);
                chartData.labels.push(getTimestamp());
                if (chartData.labels.length > maxDataToStore) {
                    chartData.labels.shift();
                }
                if (tempValues.length > maxDataToStore) {
                    tempValues.shift();
                }
                v.data = tempValues;
            }
        });

        chrt.update();

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
