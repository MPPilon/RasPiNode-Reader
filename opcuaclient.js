var sonic = false,
    sim1 = false,
    sim2 = false;

var timeInterval = 1000;

function changeButton(idLabel, state) {
    if(state) {
        document.getElementById('stop' + idLabel).classList.remove('disabled');
        document.getElementById('start' + idLabel).classList.add('disabled');
        document.getElementById('clear' + idLabel).classList.add('disabled');
    } else {
        document.getElementById('stop' + idLabel).classList.add('disabled');
        document.getElementById('start' + idLabel).classList.remove('disabled');
        document.getElementById('clear' + idLabel).classList.remove('disabled');
    }
}

function insertLine(idLabel, lineText, timestamp) {
    document.getElementById(idLabel)
        .insertAdjacentHTML('afterbegin', timestamp +
        " : " + lineText +
        "<br>");
}

function getTimestamp() {
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();

    var hours = (h<10)?"0" + h.toString(): h.toString();
    var minutes = (m<10)?"0" + m.toString(): m.toString();
    var seconds = (s<10)?"0" + s.toString(): s.toString();

    return hours.toString() + ":" + minutes.toString() + ":" + seconds.toString();
}

var mainLoop = function () {

    xmlhttp = new XMLHttpRequest();

    if (sonic) {
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                insertLine("ultrasonic", xmlhttp.responseText, getTimestamp());
            }
        };

        xmlhttp.open("GET", "http://localhost:8081/sonic", false);
        xmlhttp.send();
    }

    if (sim1) {
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                insertLine("sensor1", xmlhttp.responseText, getTimestamp());
            }
        };

        xmlhttp.open("GET", "http://localhost:8081/sim1", false);
        xmlhttp.send();
    }

    if (sim2) {
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                insertLine("sensor2", xmlhttp.responseText, getTimestamp());
            }
        };

        xmlhttp.open("GET", "http://localhost:8081/sim2", false);
        xmlhttp.send();
    }

    console.log("pulse");
};

function startSensor(idLabel, sensorId) {

    document.getElementById(idLabel).insertAdjacentHTML('afterbegin','--START--<br>');
    changeButton(idLabel, true);

    if (sensorId == 'sonic') {
        sonic = true;
    } else if (sensorId == 'sim1') {
        sim1 = true;
    } else if (sensorId == 'sim2') {
        sim2 = true;
    } else {
        console.log('Error: [START] Declared sensor is not of defined type');
    }
}

function stopSensor(idLabel, sensorId) {

    document.getElementById(idLabel).insertAdjacentHTML('afterbegin','--STOP---<br>');
    changeButton(idLabel, false);

    if(sensorId == 'sonic') {
        sonic = false;
    } else if(sensorId == 'sim1') {
        sim1 = false;
    } else if(sensorId == 'sim2') {
        sim2 = false;
    } else {
        console.log('Error: [STOP] Declared sensor is not of defined type');
    }
}

function clearTextArea(idLabel) {

    document.getElementById(idLabel).innerHTML = "";

}

setInterval(mainLoop, timeInterval);