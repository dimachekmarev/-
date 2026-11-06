const L = require('./_lib');
const C = require('./_course');
module.exports = (req, res) => L.send(res, 200, C.payload(!!L.bearer(req)));
