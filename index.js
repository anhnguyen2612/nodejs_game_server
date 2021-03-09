var io= require('socket.io')(process.env.PORT || 52300)
const Player = require('./classes/Player.js')
var player = require('./classes/Player.js')

var players = []
var sockets = []

console.log('Server started')
io.on('connection', function(socket) {

    console.log('Connection Made!')

    var player = new Player()
    var thisPlayerID = player.id
    //console.log('id:' + thisPlayerID)
    players[thisPlayerID] = player
    sockets[thisPlayerID] = socket


    socket.emit('register',{id:thisPlayerID});
    socket.emit('spawn',player);
    socket.broadcast.emit('spawn',player)

    for(var playerID in players){
        if (playerID != thisPlayerID){
            socket.emit('spawn',players[playerID])
        }
    }



    socket.on('updatePosition',function(data){
        player.position.x= data.position.x
        player.position.y= data.position.y
        player.position.z= data.position.z

        

        socket.broadcast.emit('updatePosition',player)
    })

    socket.on("disconnect", function() {
        console.log(thisPlayerID + ' just disconnected')
        delete players[thisPlayerID]
        delete sockets[thisPlayerID]
        socket.broadcast.emit('disconnected',player)
        socket.disconnect(true) 
    });
});