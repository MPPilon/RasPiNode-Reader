<strong>Lambton College/Industrial Web Apps OPC UA Project Usage Instructions</strong>

In this document I will use the following convention:
Entered data will be <strong>BOLD<strong> such as usernames and passwords.
Entered commands will be <em>ITALIC</em> such as <em>ls</em>, <em>sudo</em>, etc.

On the Raspberry Pi 2:
The Pi2 is currently configured to be able to read the ultrasonic sensor installed on the breadboard. The OPC UA server is configured to read this sensor and simulate two others. These sensors are labeled as:
ns=2;s=sonic - Ultrasonic sensor distance in cm
ns=2;s=PumpSpeed - Simulated pump speed reading in rpm
ns=2;s=Pressure - Simulated Pressure reading in psi

Usage:
login using username: <strong>pi</strong> and password: <strong>raspberry</strong>

Move to the directory containing the server example:
<em>cd gpio_ultrasonic/node_modules/node_opcua/bin</em>

Run the server: (sudo is required to access the gpio pins)
<em>sudo node simple_server.js</em>

The OPC UA server will start and after a short time it will be available to clients.

On any platform capable of running a browser and javascript:
Using the files from my repo at https://github.com/jcodling/node-opcua.git you can run the demo client.

Currently there is an API that allows reading of data from the OPC UA server using a simple RESTful API. This simplifies the display of readings in a webpage using simple HTTP calls for values.

To run the demo you will require your choice of simple http server and the files included in the repo linked above.

Clone the repo:
<em>git clone https://github.com/jcodling/node-opcua.git</em>

Install the packages:
<em>npm install</em>

Run the API:
<em>node clientapi.js</em>

Run your simple http server and navigate to opcuaclient.html to start the demo.
