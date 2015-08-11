Lambton College/Industrial Web Apps OPC UA Project Usage Instructions

In this document I will use the following convention:
Entered data will be BOLD such as usernames and passwords.
Entered commands will be ITALIC such as ls, sudo, etc.

On the Raspberry Pi 2:
The Pi2 is currently configured to be able to read the ultrasonic sensor installed on the breadboard. The OPC UA server is configured to read this sensor and simulate two others. These sensors are labeled as:
ns=2;s=sonic - Ultrasonic sensor distance in cm
ns=2;s=PumpSpeed - Simulated pump speed reading in rpm
ns=2;s=Pressure - Simulated Pressure reading in psi

Usage:
login using username: pi and password: raspberry

Move to the directory containing the server example:
cd gpio_ultrasonic/node_modules/node_opcua/bin

Run the server: (sudo is required to access the gpio pins)
sudo node simple_server.js

The OPC UA server will start and after a short time it will be available to clients.

On any platform capable of running a browser and javascript:
Using the files from my repo at https://github.com/jcodling/node-opcua.git you can run the demo client.

Currently there is an API that allows reading of data from the OPC UA server using a simple RESTful API. This simplifies the display of readings in a webpage using simple HTTP calls for values.

To run the demo you will require your choice of simple http server and the files included in the repo linked above.

Clone the repo:
git clone https://github.com/jcodling/node-opcua.git

Install the packages:
npm install

Run the API:
node clientapi.js

Run your simple http server and navigate to opcuaclient.html to start the demo.
