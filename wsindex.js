/**
 * Created by jeff on 15-08-24.
 */

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

var sock = new SockJS('http://localhost:9999/echo');

sock.onopen = function() {
    console.log('open');
    $('#content').val(function(i, text) {
        return getTimestamp() + ' : open\n' + text;
    })
};

sock.onclose = function() {
    console.log('close');
    $('#content').val(function(i, text) {
        return getTimestamp() + ' : close\n' + text;
    })
};

sock.onmessage = function(e) {
    var content = JSON.parse(e.data);

    //console.log(e);

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
