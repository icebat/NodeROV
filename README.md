# NodeROV

NodeROV is a project created by me (Thorlief Jacobsen) to run and control an underwater remote controlled vehicle easily with and Raspberry PI, some sensors and a gamepad.

I have had 5+ successfull trips at the currend date (21st April 17) but are still adding improvements and want to make it much more user friendly than it currently is.

# Screenshot:

![Screenshot](https://d3vv6lp55qjaqc.cloudfront.net/items/2x2n2W0d2b423f021U2f/noderov-screen1.png)

# Setup Raspberry PI

1. Install raspberry pi
2. Do the following:
   1. sudo raspi-config
   2. Expand File System
   3. Enable Camera
   4. Advance -> Enable I2C
   5. sudo  reboot
3. Enable i2c read-write: *sudo chmod o+rw /dev/i2c*
4. install NodeJS and NPM with:

   1. wget https://nodejs.org/dist/v6.9.5/node-v6.9.5-linux-armv7l.tar.xz
   2. sudo mv node-v6.9.5-linux-armv7l.tar.xz /
   3. cd /opt
   4. sudo tar xf node-v6.9.5-linux-armv7l.tar.xz
   5. sudo mv node-v6.9.5-linux-armv7l nodejs
   6. sudo rm node-v6.9.5-linux-armv7l.tar.xz
   7. sudo ln -s /opt/nodejs/bin/node /usr/bin/node
   8. sudo ln -s /opt/nodejs/bin/npm /usr/bin/npm



# Extra setup (Reccomanded)

* Allow node to gain access to ports below 1024 if you want to use port 80 and 82
   * ```sudo setcap 'cap_net_bind_service=+ep' /opt/nodejs/bin/node```
* Disable HDMI add the following to ***/etc/rc.local***
   * ```sudo /opt/vc/bin/tvservice -o```
3. Enable pi to run the script at boot, add to ***/etc/rc.local***:
   * ```sudo -H -u pi bash -c 'sh ~/NodeROV/start.sh```

# Disclaimer!!

Use this software at own risk, I do NOT reccomand you to use this software if you do now know what you are doing. It is not 100% finished and stuff might go haywire at any second! I might remove this disclaimer when I'm done with the procject, but who knows? Who wants to take responsibility for anything theese days! :)
