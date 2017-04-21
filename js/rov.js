

RemoteOperatedVehicle = function() {

  var self = {
    pwm : require('./PCA9685.js'),
    armed : false,
    depth : {
      hold   : false,
      wanted : 0,
      PID    : false
    },
    heading : {
      hold   : false,
      current: 0,
      wanted : 0,
      PID    : false,
	  turns  : 0
    },
    roll : 0,
    pitch : 0,
    gain : 100,
    motors : {
      frontleft : 1550,
      frontright : 1550,
      backleft : 1550,
      backright : 1550,
      upleft : 1550,
      upright : 1550
    },
    lastMotors : {},
    cameraPosition : 50,
    lights : [0,0],
    coreTemp : 0,
    disk : {used:0,total:0},
    memory : {used:0,total:0},
    cpu : 0,
    centerCommand : 1550
  }
  
  self.initialize = function() {
    self.log('info','Initializing ROV Class');
    // Initialize PWM
    self.pwm.initialize();
    self.armed = true;
    self.disarm();
    self.setLight(0, 0)
    self.setLight(1, 0)
    self.setCamera(50);
    self.log('info','PWM & ROV Initialized & Ready');

  }
  
  self.log = function(level, text) {
    console.log("Level: "+level+"\nMessage: "+text);
  }
    
  self.arm = function() {
    for(var i in self.motors) { self.motors[i] = self.centerCommand; }
    self.armed = true;
    self.updateThrusters();
    self.log("info", "ROV has been ARMED");
  }
  
  self.disarm = function() {
    for(var i in self.motors) { self.motors[i] = self.centerCommand; }
    self.updateThrusters();
    self.armed = false;
    self.log("info", "ROV has been DISARMED");
  }
  
  self.updateThrusters = function() {
    // If not armed or no changes in thrust
    if(!self.armed || JSON.stringify(self.lastMotors) == JSON.stringify(self.motors)) return;
    console.log("Changing thruster");
    self.pwm.setPWM(0, self.motors.frontright);
    self.pwm.setPWM(1, self.motors.frontleft);
    self.pwm.setPWM(2, self.motors.backright);
    self.pwm.setPWM(3, self.motors.backleft);
    self.pwm.setPWM(4, self.motors.upright);
    self.pwm.setPWM(5, self.motors.upleft);
    
    self.lastMotors = JSON.parse(JSON.stringify(self.motors));
  }
  self.setLight = function(no, d) {
    d = parseInt(d);
    no = parseInt(no);
    if(d > 100) d = 100; 
    if(d < 0) d = 0;
    
    self.lights[no] = d;
    // Range: 1000 ((base)1000 -> 2000)
    var add = 1000 / 100 * d;
    var base = 1000;
    self.pwm.setPWM(6+no,base+add);
  }
  
  
  self.setCamera = function(d) {
    d = parseInt(d);
    if(d > 100) d = 100; 
    if(d < 0) d = 0;
    
    self.cameraPosition = d;
    // Range: 1200 ((base)900 -> 2100)
    var add = 1200 / 100 * d;
    var base = 900;
    self.pwm.setPWM(8,base+add);
  }
  
  
  return self;
}

module.exports = RemoteOperatedVehicle();
