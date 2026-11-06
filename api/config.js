const L = require('./_lib');
module.exports = (req, res) => L.send(res, 200, { mode: L.mode(), tariffs: Object.values(L.TARIFFS), seller: L.seller() });
