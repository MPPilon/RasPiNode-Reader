function readSensor(idLabel) {

    xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById(idLabel).innerHTML = xmlhttp.responseText;
        }
    };

    xmlhttp.open("GET", "http://localhost:8081", true);
    xmlhttp.send();
}

