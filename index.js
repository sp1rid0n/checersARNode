// Files

console.log("Importing files...")
const config = require("./config.js")
const util = require("./util.js")
const route = require("./route.js")
const ws = require("./ws.js")
const db = require("./database.js")

// Startup

util.log("Starting [project name]...")

// Modules

util.log("Importing modules...")
const crypto = require("crypto")
const http = require("http")
const url = require("url")
const WebSocket = require("websocket")

// HTTP server

const server = http.createServer((req, res) => {
    // Access-Control-Allow headers

    res.setHeader("Access-Control-Allow-Origin", "*")

    // Handle requests

    if (req.method === "GET") {
        if (req.headers["x-forwarded-proto"] === "http") {
            // Redirect to HTTPS

            res.writeHead(301, {
                Location: `https://${req.headers.host}${req.url}`
            })
            res.end()
        } else {
            // Route request

            route(url.parse(req.url).pathname, req.headers.cookie ? cookie.parse(req.headers.cookie) : null).then(response => {
                if (response.code === 200) {
                    // Content-Type

                    if (response.mimeType) {
                        res.setHeader("Content-Type", response.mimeType)
                    }

                    // Response

                    res.writeHead(200)
                    res.write(response.data)
                    res.end()
                } else if (response.code === 301 || response.code === 302) {
                    // Redirect

                    res.writeHead(response.code, {
                        Location: response.redirect
                    })
                    res.end()
                } else if (response.code === 404) {
                    // 404

                    util.read_file("public/errors/404.html").then(file => {
                        res.writeHead(404)
                        res.write(file)
                        res.end()
                    })
                } else {
                    // Response

                    res.writeHead(response.code)
                    res.write(response.data)
                    res.end()
                }
            })
        }
    } else {
        // Invalid request

        res.writeHead(400)
        res.write("ERROR: INVALID REQUEST")
        res.end()
    }
}).listen(config.port)

server.on("listening", () => {
    util.log(`HTTP server listening on port ${config.port}`)
})

// WebSocket server

util.log("Creating WebSocket server...")

const ws_server = new WebSocket.server({
    httpServer: server
})

// WebSocket requests

ws_server.on("request", req => {
    // Check protocol

    if (req.requestedProtocols.includes(config.wsProtocol)) {
        // Accept connection

        const connection = req.accept(config.wsProtocol)
        connection.id = crypto.randomBytes(config.idLength).toString("hex")

        // Initialize

        ws.initialize(connection)
    } else {
        req.accept(req.requestedProtocols[0]).drop(1002, "ERROR: INVALID WEBSOCKET REQUEST")
    }
})