var fs = require('fs');

Utils = function() {

  var self = {

  }

  self.sleep = function(ms) {
    var waitTill = new Date(new Date().getTime() + ms);
    while(waitTill > new Date()){} 
    return true; 
  }
    
  self.map = function( x,  in_min,  in_max,  out_min,  out_max){
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  } 
  
  
  self.PID = function(kP, kI, kD, deadband, min, max) {
    var pid = {
      kP         : kP,
      kI         : kI,
      kD         : kD,
      db         : deadband,
      min        : min,
      max        : max,
      lastError  : 0,
      integral   : 0,
      output     : 0,
      lastUpdate : 0,
    }
    
    pid.reset = function() {
      pid.lastError = 0;
      pid.integral = 0;
      pid.lastUpdate = Date.now();
      return pid.output = 0;
    }
    
    pid.update = function(SP, PV) {
      var now = Date.now();
      timeChange = now - pid.lastUpdate;
          
      /* Compute error variables */
      var error = SP - PV;
      pid.integral += error * timeChange;
      var derivative = (error - pid.lastError) / timeChange;
  
      pid.output = (pid.kP * error) + (pid.kI * pid.integral) + (pid.kD * derivative);     
      
      pid.lastError = error;
      pid.lastUpdate = now;
        
      if(pid.output > pid.max) pid.output = pid.max;
      if(pid.output < pid.min) pid.output = pid.min;
  
      if(pid.lastUpdate == 0) return 0;
      return pid.output;
    }
      
    pid.reset();
   
    return pid;
  }
  
  
  self.writeConfig = function(object) {
    return fs.writeFile("config.json", JSON.stringify(object));
  }
  
  self.readConfig = function() {
    try {
      var data = fs.readFileSync("config.json", 'utf8');
      return JSON.parse(data);
    }
    catch(err) {
      console.log("Could not read config file, make sure it is correctly formated!");
      return {};
    }
  }
  
  return self;
}

module.exports = Utils();
