/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")
const PrerenderSPAPlugin = require("prerender-spa-plugin")

const Renderer = PrerenderSPAPlugin.PuppeteerRenderer

module.exports = {
    configureWebpack: {
        plugins: [],
    },
}

module.exports.configureWebpack.plugins = (
    module.exports.plugins || []
).concat([
    new PrerenderSPAPlugin({
        staticDir: path.join(__dirname, "dist"),
        routes: ["/HomePc", "/HomeMobile", "/BookDetailPc", "/BookDetailMobile"],
        renderer: new Renderer({
            inject: {
                foo: "bar",
            },
            headless: true,
            renderAfterDocumentEvent: "render-event",
        }),
    }),
])
