/**
 * Created by jeff on 15-08-24.
 */

// Data collection

Chart.defaults.global = {
    // Boolean - Whether to animate the chart
    animation: false,

    // Number - Number of animation steps
    animationSteps: 60,

    // String - Animation easing effect
    // Possible effects are:
    // [easeInOutQuart, linear, easeOutBounce, easeInBack, easeInOutQuad,
    //  easeOutQuart, easeOutQuad, easeInOutBounce, easeOutSine, easeInOutCubic,
    //  easeInExpo, easeInOutBack, easeInCirc, easeInOutElastic, easeOutBack,
    //  easeInQuad, easeInOutExpo, easeInQuart, easeOutQuint, easeInOutCirc,
    //  easeInSine, easeOutExpo, easeOutCirc, easeOutCubic, easeInQuint,
    //  easeInElastic, easeInOutSine, easeInOutQuint, easeInBounce,
    //  easeOutElastic, easeInCubic]
    animationEasing: "easeOutQuart",

    // Boolean - If we should show the scale at all
    showScale: true,

    // Boolean - If we want to override with a hard coded scale
    scaleOverride: false,

    // ** Required if scaleOverride is true **
    // Number - The number of steps in a hard coded scale
    scaleSteps: null,
    // Number - The value jump in the hard coded scale
    scaleStepWidth: null,
    // Number - The scale starting value
    scaleStartValue: null,

    // String - Colour of the scale line
    scaleLineColor: "rgba(0,0,0,.1)",

    // Number - Pixel width of the scale line
    scaleLineWidth: 1,

    // Boolean - Whether to show labels on the scale
    scaleShowLabels: true,

    // Interpolated JS string - can access value
    scaleLabel: "<%=value%>",

    // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
    scaleIntegersOnly: true,

    // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
    scaleBeginAtZero: false,

    // String - Scale label font declaration for the scale label
    scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

    // Number - Scale label font size in pixels
    scaleFontSize: 12,

    // String - Scale label font weight style
    scaleFontStyle: "normal",

    // String - Scale label font colour
    scaleFontColor: "#666",

    // Boolean - whether or not the chart should be responsive and resize when the browser does.
    responsive: false,

    // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio: true,

    // Boolean - Determines whether to draw tooltips on the canvas or not
    showTooltips: false,

    // Function - Determines whether to execute the customTooltips function instead of drawing the built in tooltips (See [Advanced - External Tooltips](#advanced-usage-custom-tooltips))
    customTooltips: false,

    // Array - Array of string names to attach tooltip events
    tooltipEvents: ["mousemove", "touchstart", "touchmove"],

    // String - Tooltip background colour
    tooltipFillColor: "rgba(0,0,0,0.8)",

    // String - Tooltip label font declaration for the scale label
    tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

    // Number - Tooltip label font size in pixels
    tooltipFontSize: 14,

    // String - Tooltip font weight style
    tooltipFontStyle: "normal",

    // String - Tooltip label font colour
    tooltipFontColor: "#fff",

    // String - Tooltip title font declaration for the scale label
    tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

    // Number - Tooltip title font size in pixels
    tooltipTitleFontSize: 14,

    // String - Tooltip title font weight style
    tooltipTitleFontStyle: "bold",

    // String - Tooltip title font colour
    tooltipTitleFontColor: "#fff",

    // Number - pixel width of padding around tooltip text
    tooltipYPadding: 6,

    // Number - pixel width of padding around tooltip text
    tooltipXPadding: 6,

    // Number - Size of the caret on the tooltip
    tooltipCaretSize: 8,

    // Number - Pixel radius of the tooltip border
    tooltipCornerRadius: 6,

    // Number - Pixel offset from point x to tooltip edge
    tooltipXOffset: 10,

    // String - Template string for single tooltips
    tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",

    // String - Template string for multiple tooltips
    multiTooltipTemplate: "<%= value %>",

    // Function - Will fire on animation progression.
    onAnimationProgress: function(){},

    // Function - Will fire on animation completion.
    onAnimationComplete: function(){}
};

// Maximum number of datapoints to store
var maxDataToStore = 20,
    i,
    labelsArray = ['nd'],
    dataArray = [],
    dataArray2 = [],
    dataArray3 = [];

for(i = 0; i < maxDataToStore; i++) {
    labelsArray.push('');
    dataArray.push(0);
    dataArray2.push(0);
    dataArray3.push(0);
}

var sonicChart = {
    labels: labelsArray,
    datasets: [
        {
            label: "Sonic",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: dataArray
        }
    ]
};

var pumpChart = {
    labels: labelsArray,
    datasets: [
        {
            label: "Pump Speed",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: dataArray2
        }
    ]
};

var pressureChart = {
    labels: labelsArray,
    datasets: [
        {
            label: "Pressure",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: dataArray3
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

var ctxSonic = document.getElementById('sonicChart');
var ctxPump = document.getElementById('pumpChart');
var ctxPressure = document.getElementById('pressureChart');
var ctx2Sonic = ctxSonic.getContext("2d");
var ctx2Pump = ctxPump.getContext("2d");
var ctx2Pressure = ctxPressure.getContext("2d");
var sonicChrt = null,
    pumpChrt = null,
    pressureChrt = null;

sonicChrt = new Chart(ctx2Sonic).Line(sonicChart, chartOptions);
pumpChrt = new Chart(ctx2Pump).Line(pumpChart, chartOptions);
pressureChrt = new Chart(ctx2Pressure).Line(pressureChart, chartOptions);

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

    // Process results when new information received
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

        if (content.id == '#sonic') {
            //sonicChrt = new Chart(ctx2Sonic).Line(sonicChart, chartOptions);
            sonicChrt.addData([content.reading], getTimestamp());
            sonicChrt.removeData();
        } else if (content.id == '#pumpspeed') {
            //pumpChrt = new Chart(ctx2Sonic).Line(sonicChart, chartOptions);
            pumpChrt.addData([content.reading], getTimestamp());
            pumpChrt.removeData();
        } else if (content.id == '#pressure') {
            //pressureChrt = new Chart(ctx2Sonic).Line(sonicChart, chartOptions);
            pressureChrt.addData([content.reading], getTimestamp());
            pressureChrt.removeData();
        } else {
            console.log('Error: Unexpected value read and returned');
        }

        //$('#content').prepend(getTimestamp() + '\t' + JSON.stringify(content) + '\n');

        $('#content').val(function(i, text) {
            return getTimestamp()
                + '\t'
                + content.id
                + "\t:\t"
                + content.reading
                + '\n' + text;
        });
    };
};

// Start the first connection attempt
new_connection();
