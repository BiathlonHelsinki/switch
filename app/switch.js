
var request = require("request");
var yaml_config = require('node-yaml-config');
var Gpio = require('onoff').Gpio,
  button = new Gpio(48, 'in', 'both');

var config = yaml_config.load('./config/config.yml');
 


var open_url =  'http://' + config.api + ":" + config.port + '/nodes/temporary/opensessions/open';
var close_url =  'http://' + config.api + ":" + config.port + '/nodes/temporary/opensessions/close';

function open_temporary() {
  request.get({url: open_url, 
    json: true,
    headers: {"X-Hardware-Name": config.name, "X-Hardware-Token": config.token}},
    function (error, response, body) {
      if (!error && response.statusCode === 200) {
	console.log('opened Temporary');
      } else {
	console.log("Got an error: ", error, ", status code: ", response.statusCode);
      }
    } 
  );
}

function close_temporary() {
  request.get({url: close_url,
    json: true,
    headers: {"X-Hardware-Name": config.name, "X-Hardware-Token": config.token}},
    function (error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log('closed Temporary');
      } else {
        console.log("Got an error: ", error, ", status code: ", response.statusCode);
      }
    }
  );
}

function open_or_close_temporary(value) {
  if (value == 1) {
    open_temporary();
  } else {
   close_temporary();
  }
}

button.watch(function (err, value) {
  if (err) {
    throw err;
  }
  open_or_close_temporary(value);
  
});

button.read(function (err, value) {
  if (err) {
    throw err;
  }
  open_or_close_temporary(value);
});
 
process.on('SIGINT', function () {
  button.unexport();
});



