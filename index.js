/*
 * Check the status of services or applications
 */

// Load libraries
const fs = require('fs');
const net = require('net');
const yaml = require('js-yaml');


// Constants
let timeMap = {"second":1, "sec":1, "s":1, "minute":60, "min":60, "m":60, "hour":3600, "hr":3600, "h":3600, "day":86400, "d":86400, "week":604800, "wk":604800, "w":604800, "month":18144000, "mo":18144000}

// Variables
let config = {};


// Load config file
try {
	let fileContents = fs.readFileSync('./config.yaml', 'utf8');
	config = yaml.load(fileContents);

	console.log(config);
} catch (e) { console.log(e); }


// Ping address and port
let ping = (url, port=80, timeout=2000) => {
	var sock = new net.Socket();

	sock.setTimeout(timeout);
	sock.on('connect', function() {
		console.log(url+':'+port+' is up.');
	sock.destroy();
	}).on('error', function(e) {
		console.log(url+':'+port+' is down: ' + e.message);
	}).on('timeout', function(e) {
		console.log(url+':'+port+' is down: timeout');
	}).connect(port, url);
}


// Decode time interval and return it in seconds
// Takes a string `i` of the form `<time> <unit>`
let intervalToSec = (i) => {
	const [t, u] = i.split(" ");

	return Number(t) * timeMap[u]
}


// Decode config and set intervals
for(let service in config.services) {
	const s = config.services[service]
	const i = intervalToSec(s.ping.interval);
	
	setInterval(() => ping(s.ping.address, s.ping.port), i*1000);
}


const tnas = config.services.truenas
console.log(tnas)
ping(tnas.ping.address, tnas.ping.port, tnas.ping.timeout === undefined ? 2500 : tnas.ping.timeout);

console.log(intervalToSec(tnas.ping.interval))

