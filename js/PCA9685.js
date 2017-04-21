var i2c = require('i2c');

PCA9685 = function(address, device) {

  var self = {
    address: (typeof address !== 'undefined') ?  address : 0x40,
    device    :(typeof device !== 'undefined') ?  device : '/dev/i2c-1',
    frequency : 50,
  }

  self.i2c = new i2c(self.address, {device: self.device}),
  
  // Basic sleep function
  self.sleep = function(ms) {
    var waitTill = new Date(new Date().getTime() + ms);
    while(waitTill > new Date()){} 
    return true; 
  }

  // Initializer, needs to be run after changing frequency
  self.initialize = function() {
    // Calculate the prescaler based on frequency
    let prescaler = Math.round(25000000 / (4096 * self.frequency)) -1;
    // Set all PWM to 0
    self.setAllPWM(0);    
    // Set all outputs to use a totem pole structure.
    self.i2c.writeBytes(0x01, [0x04], function() {}); // MODE2 -> OUTDRV 
    // Set it to respond on call on all i2c busses and sleep (Oscillator off) 
    self.i2c.writeBytes(0x00, [0x11], function() {}); // MODE1 -> ALLCALL, SLEEP
    // Sleep 50µS so the oscillator can calm down
    self.sleep(1);
    // Set the prescale to precalculated scale
    self.i2c.writeBytes(0xFE, [prescaler], function() {}); // PRE_SCALE -> pre-calculated
    // Disable sleep so it can start up the oscillator again 
    self.i2c.writeBytes(0x00, [0x01], function() {}); // MODE1 -> ALLCALL   
    // Spee 50µs so the oscillator can start up
    self.sleep(1);
    return true;
  }
  
  self.turnOffPWM = function() {
    self.i2c.writeBytes(0xFD, [0x10], function() {})
  }
  
  // Usage: setPWM(channel, microsecounds);
  self.setPWM = function(no, us) {
    let steps = self.usToSteps(us);
    // 0x06 -> 0x09 (LED0_ON_L,LED0_ON_H,LED0_OFF_L,LED0_OFF_H)
    // The 4*NO changes it so it inclines depending on NO up to 15.    
    
    // Steps are maxmimum between 0 and 4096
    // no is between 0 and 15 
    if(steps < 0 || steps > 4096) { return false; }
    if(no < 0 || no > 15) { return false; }
    
    // Lets write the start high to step 0
    self.i2c.writeBytes(0x06+4*no, [0x00], function() {})
    self.i2c.writeBytes(0x07+4*no, [0x00], function() {})
    // Then write the end high to steps calculated from usToSteps
    self.i2c.writeBytes(0x08+4*no, [steps & 0xFF], function() {})
    self.i2c.writeBytes(0x09+4*no, [steps>>8], function() {})
	return true;
  }
  
  // Usage: setPWM(microsecounds);
  self.setAllPWM = function(us) {
    let steps = self.usToSteps(us);
    // 0xFA -> 0xFD (ALL_LED_ON_L,ALL_LED_ON_H,ALL_LED_OFF_L,ALL_LED_OFF_H)

    // Steps are maxmimum between 0 and 4096
    if(steps < 0 || steps > 4095) { return false; }
    // Lets write the start high to step 0
    self.i2c.writeBytes(0xFA, [0x00], function() {})
    self.i2c.writeBytes(0xFB, [0x00], function() {})
    // Then write the end high to steps calculated from usToSteps
    self.i2c.writeBytes(0xFC, [steps & 0xFF], function() {})
    self.i2c.writeBytes(0xFD, [steps>>8], function() {})
  }
  
  // Calculate how many steps an specific µS can be
  self.usToSteps = function(us) {
    // E.g. 50hz cycle = 1000000µS / 50hz = 20 000µS pr cycle.
    let MicrosecoundPerCycle = 1000000 / self.frequency;
    // Then get how many µS we get pr step by dividing steps on µS pr cycle
    let stepsPerMicrosecound = 4095 / MicrosecoundPerCycle;
    // Then return µS wanted times steps we get per µS
    return Math.round(us * stepsPerMicrosecound)
  }
  
  return self;
}
module.exports = PCA9685();
