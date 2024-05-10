const config2url = require("./config2url")
const url2config = require("./url2config")
const sub = require("./sub")

function rand_id() { // min and max included 
    return Math.floor(Math.random() * (0xffffffff - 0x10000000) + 0x10000000).toString(16) + "-" +
        Math.floor(Math.random() * (0xffff - 0x1000) + 0x1000).toString(16) + "-" +
        Math.floor(Math.random() * (0xffff - 0x1000) + 0x1000).toString(16) + "-" +
        Math.floor(Math.random() * (0xffff - 0x1000) + 0x1000).toString(16) + "-" +
        Math.floor(Math.random() * (0xffffffffffff - 0x100000000000) + 0x100000000000).toString(16)
}

module.exports = {
    config2url: config2url.config2url,
    url2config: url2config.url2config,
    stringify: config2url.stringify,
    parse: url2config.parse,
    subscribeUrl:sub.subscribeUrl,
    uuid: rand_id,
}