<strong>Lambton College/Industrial Web Apps OPC UA Project Usage Instructions</strong>
<br>
This project is based on the node OPC UA project at: https://github.com/node-opcua<br>
<br>
In this document I will use the following convention:<br>
Entered data will be <strong>BOLD</strong> such as usernames and passwords.<br>
Entered commands will be <em>ITALIC</em> such as <em>ls</em>, <em>sudo</em>, etc.<br>
<br>
<em>This demo is to be used with my Pi2 in the lab. You will have to modify simple_server.js to conform to your environment.</em><br>
<br>
On the Raspberry Pi 2:<br>
The Pi2 is currently configured to be able to read the ultrasonic sensor installed on the breadboard. The OPC UA server is configured to read this sensor and simulate two others. These sensors are labeled as:<br>
ns=2;s=sonic - Ultrasonic sensor distance in cm<br>
ns=2;s=PumpSpeed - Simulated pump speed reading in rpm<br>
ns=2;s=Pressure - Simulated Pressure reading in psi<br>
<br>
Usage:<br>
login using username: <strong>pi</strong> and password: <strong>raspberry</strong><br>
<br>
Move to the directory containing the server example:<br>
<em>cd gpio_ultrasonic/node_modules/node_opcua/bin</em><br>
<br>
Run the server: (sudo is required to access the gpio pins)<br>
<em>sudo node simple_server.js</em><br>
<br>
The OPC UA server will start and after a short time it will be available to clients.<br>
<br>
On any platform capable of running a browser and nodejs(with npm)/javascript:<br>
Using the files from my repo at https://github.com/jcodling/node-opcua.git you can run the demo client.<br>
<br>
Currently there is a client that allows reading of data from the OPC UA server and provides a websocket for a simple html/js client.<br>
<br>
Clone the repo:<br>
<em>git clone https://github.com/jcodling/node-opcua.git</em><br>

Install the packages:<br>
<em>npm install</em><br>
<br>
Run the API:<br>
<em>node wsclient.js</em><br>
<br>
Navigate to localhost:9999/wsindex.html to start the demo.
