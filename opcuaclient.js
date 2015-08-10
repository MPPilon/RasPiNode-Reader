var sonic, sim1, sim2;

var timeInterval = 2000;

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

function readSensor(idLabel, sensorId) {

    xmlhttp = new XMLHttpRequest();

    document.getElementById(idLabel).insertAdjacentHTML('afterbegin','--START--<br>');
    changeButton(idLabel, true);

    if(sensorId == 'sonic') {
        sonic = setInterval(function() {

            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var timestamp = new Date();
                    insertLine(idLabel, xmlhttp.responseText, timestamp);
                }
            };

            xmlhttp.open("GET", "http://localhost:8081/" + sensorId, true);
            xmlhttp.send();

        }, timeInterval);
    } else if(sensorId == 'sim1') {
        sim1 = setInterval(function() {

            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var timestamp = new Date();
                    insertLine(idLabel, xmlhttp.responseText, timestamp);
                }
            };

            xmlhttp.open("GET", "http://localhost:8081/" + sensorId, true);
            xmlhttp.send();

        }, timeInterval);
    } else if(sensorId == 'sim2') {
        sim2 = setInterval(function() {

            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var timestamp = new Date();
                    insertLine(idLabel, xmlhttp.responseText, timestamp);
                }
            };

            xmlhttp.open("GET", "http://localhost:8081/" + sensorId, true);
            xmlhttp.send();

        }, timeInterval);
    } else {
        console.log('Error: [START] Declared sensor is not of defined type');
    }
}

function stopSensor(idLabel, sensorId) {

    document.getElementById(idLabel).insertAdjacentHTML('afterbegin','--STOP---<br>');
    changeButton(idLabel, false);

    if(sensorId == 'sonic') {
        clearInterval(sonic);
    } else if(sensorId == 'sim1') {
        clearInterval(sim1);
    } else if(sensorId == 'sim2') {
        clearInterval(sim2);
    } else {
        console.log('Error: [STOP] Declared sensor is not of defined type');
    }
}

function clearTextArea(idLabel) {

    document.getElementById(idLabel).innerHTML = "";

}
