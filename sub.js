/**
 * https://blog.kingrong.kr/js-decode-for-clash/
 */
const { decode } = require('js-base64');
const http = require("http");
const https = require("https");
const { parse } = require("./url2config");
const { stringify } = require("./config2url");


/* handle subscribe link, get the response
 * @param url
 * @return Promise resove(string)
 */
function getRes(url) {
	if (typeof url !== "string" || !(url.startsWith("http://") || url.startsWith("https://"))) {
		throw new Error("Only can handle link format!");
	}
	return new Promise((resolve) => {
		const options = {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0',
			},
		};
		var strings = [];
		if (url.startsWith("http://")) {
			var req = http.get(url, options, (res) => {
				if (res.statusCode !== 200) {
					throw new Error("Request failed please check your Internet connection!\n" + `statusCode: ${res.statusCode}`);
				}
				res.on("data", (chunk) => {
					strings.push(chunk);
				});
			});
		} else if (url.startsWith("https://")) {
			var req = https.get(url, options, (res) => {
				if (res.statusCode !== 200) {
					throw new Error("Request failed please check your Internet connection!\n" + `statusCode: ${res.statusCode}`);
				}
				res.setEncoding("utf8");
				res.on("data", (chunk) => {
					if (chunk) {
						strings.push(chunk);
					}
				});
			});
		}
		// once the request done, join the chunks together, and resolve it
		req.on('close', () => {
			resolve(strings.join(""));
		});
	});
}

/* convert the obj from vmess link to the obj that clash accept
 * @param ob object
 * @return object
 */
// function clashFormat(ob) {
// 	if (typeof (ob) !== "object") {
// 		console.warn("clash Format:can only format object");
// 	} else {
// 		//a table for refer
// 		var table = {
// 			ps: "name",
// 			add: "server",
// 			port: "port",
// 			id: "uuid",
// 			aid: "alterId",
// 			security: "cipher",
// 			tls: "tls"
// 		};
// 		var defaultV = {
// 			name: "local",
// 			type: "vmess",
// 			server: "127.0.0.1",
// 			port: 1080,
// 			uuid: "",
// 			alterId: 0,
// 			cipher: "auto",
// 			tls: false,
// 			"skip-cert-verify": true
// 		};
// 		for (var key in ob) {
// 			if (key === "tls") {
// 				if (ob[key] === "tls") {
// 					defaultV[table[key]] = true;
// 				}
// 			} else if (table[key]) {
// 				defaultV[table[key]] = ob[key];
// 			}
// 		}
// 		return defaultV;
// 	}
// }

/* parse object to yarml format, return a string
 * note: this only can parse obj returned from clashFormat()
 * @param ob object
 * @return string
 */
// function objParseToYaml(ob){
// 	if(typeof(ob)!=="object"){
// 		throw Error("Only can parse object");
// 	}
// 	var s = JSON.stringify(ob);
// 	return s;
// }

// async function used to handle data get from getRes()
// split the data to the list and convert ervery one to the clash supported format
// and parse the link to the yarml string 
async function handleSubData(subUrl) {
	var data = "";
	data = await getRes(subUrl);
	var linkList = decode(data).split(/\s+/);
	var configStrings = [];
	var names = [];
	for (link of linkList) {
		//if link is not empty string
		if (link) {
			let temp = parse(link);
			// console.debug(temp)
			// share url
			console.debug(stringify(temp))
			// let clashObj = clashFormat(temp);
			// console.debug(clashObj)
			names.push(temp.ps);
			configStrings.push(temp);
		}
	}
	console.log(names);
}

module.exports = {
    subscribeUrl: handleSubData
};
