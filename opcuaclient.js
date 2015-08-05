var sonic, sim1, sim2;

var timeInterval = 2000;

function readSensor(idLabel, sensorId) {

    xmlhttp = new XMLHttpRequest();

    document.getElementById(idLabel).insertAdjacentHTML('afterbegin','--START--\n');
    document.getElementById('stop' + idLabel).classList.remove('disabled');
    document.getElementById('start' + idLabel).classList.add('disabled');
    document.getElementById('clear' + idLabel).classList.add('disabled');

    if(sensorId == 'sonic') {
        sonic = setInterval(function() {

            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var timestamp = new Date();
                    document.getElementById(idLabel)
                        .insertAdjacentHTML('afterbegin',xmlhttp.responseText +
                        " : " + timestamp +
                        "\n");
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
                    document.getElementById(idLabel)
                        .insertAdjacentHTML('afterbegin',xmlhttp.responseText +
                        " : " + timestamp +
                        "\n");
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
                    document.getElementById(idLabel)
                        .insertAdjacentHTML('afterbegin',xmlhttp.responseText +
                        " : " + timestamp +
                        "\n");
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

    document.getElementById(idLabel).insertAdjacentHTML('afterbegin','--STOP---\n');
    document.getElementById('stop' + idLabel).classList.add('disabled');
    document.getElementById('start' + idLabel).classList.remove('disabled');
    document.getElementById('clear' + idLabel).classList.remove('disabled');

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
