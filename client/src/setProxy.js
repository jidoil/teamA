const {createProxyMiddleware} = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(createProxyMiddleware("/api/customers",
    {target:process.env.NODEhost+"3001"}));
};