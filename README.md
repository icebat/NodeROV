1. Install raspberry pi
2. Do the following:
	sudo raspi-config
		Expand File System
		Enable Camera
		Advance -> Enable I2C
	sudo  reboot
3. Enable i2c read-write: sudo chmod o+rw /dev/i2c*
2. install node js and npm with :

	wget https://nodejs.org/dist/v6.9.5/node-v6.9.5-linux-armv7l.tar.xz
	sudo mv node-v6.9.5-linux-armv7l.tar.xz /opt
	cd /opt
	sudo tar xf node-v6.9.5-linux-armv7l.tar.xz
	sudo mv node-v6.9.5-linux-armv7l nodejs
	sudo rm node-v6.9.5-linux-armv7l.tar.xz
	sudo ln -s /opt/nodejs/bin/node /usr/bin/node
	sudo ln -s /opt/nodejs/bin/npm /usr/bin/npm
	
x. Allow node to gain access to ports below 1024: //just if you wanna use port 80
	sudo setcap 'cap_net_bind_service=+ep' /opt/nodejs/bin/node

x. Disable HDMI add: "sudo /opt/vc/bin/tvservice -o" to /etc/rc.local

Enable pi to run the script at boot, add to /etc/rc.local:

"sudo -H -u pi bash -c 'sh ~/NodeROV/start.sh'"



Power -> Sensor -> Board
           |
        5v I V gnd
        
        
5v  -> Attiny85 -> PWM -> Sensor -> Raspberry
I   -> Attiny85
V   -> Attiny 85
GND -> Attiny85 -> PWM -> Sensor -> Raspberry



Adafruit 10DOF has 10k pullup on VIN 
Adafruit PWM shield has also 10K pullup on VCC

