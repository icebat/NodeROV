// silly - debug - verbose - info - warn - error  

var winston  = require('winston');

var logger = new winston.Logger({
  level: 'verbose', 
  transports: [
    new winston.transports.Console({
      timestamp: (new Date()).toLocaleTimeString(),
      colorize: true,
      level : 'info'
    }),

    new winston.transports.File({ 
      filename: 'logs/'+new Date().toISOString().split('T')[0]+'.log',
      level: 'verbose'  
    })
  ]
});

logger.socketIOTransport = function (client) {
    this.name  = 'socketIO';
    this.level = 'info';
    this.client = client;
    this.log = function(level, msg) {  
      if(msg.substr(0,6) == "CLIENT") { return; }  
      client.send("log " + JSON.stringify({ type : 'log', level : level, message : msg, time : Date.now() }));
    };
    this.on = function() { };
    this.removeListener = function() {};
};

module.exports = logger;