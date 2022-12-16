// Files and modules

const config = require("./config.js")
const util = require("./util.js")

// Data

const users = []

// Methods

function initialize(connection) {
    // New connection

    util.log(`New connection: ${connection.id}`)
    broadcast(`user ${connection.id} joined`)
    users.push(connection)

    // WebSocket events

    connection.on("message", message => {
        console.log(`WebSocket message received: ${message.utf8Data}`)
        broadcast(message.utf8Data)
    })

    connection.on("close", () => {
        console.log(`Disconnect: ${connection.id}`)
        disconnect_user(connection)
        broadcast(`user ${connection.id} left`)
    })
}

function broadcast(message) {
    // Broadcast message to all users

    for (let u = 0; u < users.length; u ++) {
        users[u].send(message)
    }
}

function disconnect_user(connection) {
    // Delete user

    for (let u = 0; u < users.length; u ++) {
        if (users[u].id === connection.id) {
            users.splice(u, 1)
            break
        }
    }
}

// Exports

module.exports = {
    initialize: initialize,
    broadcast: broadcast
}