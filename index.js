// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('../socket.io')(server); //Socket IO bir önceki dizinde olmalı
var Parse = require('parse/node');
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

//Parse
Parse.initialize("u0TO6ZybK5hz2Ht2AEdCcCDYc1Z604DkGiOccWCb", "6EG6HpCDTDfwkSSLd6MClj0DFUl1DmNrNdYqoJg2");

// Routing
app.use(express.static(__dirname + '/public'));

// App
var numUsers = 0;

io.on('connection', function (socket) {
  var addedUser = false;

  socket.on('power', function (data) { //true, false
    socket.broadcast.emit('power', {
      username: socket.username,
      message: data
    });
  });

  socket.on('motion', function (data) { //true, false
    socket.broadcast.emit('motion', {
      username: socket.username,
      message: data
    });
  });

  socket.on('music', function (data) {
    socket.broadcast.emit('music', {
      username: socket.username,
      message: data
    });
  });

  socket.on('sound', function (data) {
    socket.broadcast.emit('sound', {
      username: socket.username,
      message: data
    });
  });

  socket.on('soundEnd', function (data) {
    socket.broadcast.emit('soundEnd', {
      username: socket.username,
      message: data
    });
  });

  socket.on('soundStop', function (data) {
    socket.broadcast.emit('soundStop', {
      username: socket.username,
      message: data
    });
  });

  socket.on('add user', function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;

    //SEND PUSH
    sendPush('\ue21a ' + username + " sisteme bağlandı");

    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the user disconnects.. perform this
  socket.on('\ue219 ' + 'disconnect', function () {
    if (addedUser) {
      --numUsers;

      //SEND PUSH
      sendPush(username + " bağlantısı kesildi");

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });

///////////////////////////////////////////////////////////////////////////////
  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

});

function sendPush(text){
  Parse.Push.send({
      where:{},
      data: {
          alert: text
      }
  }, {
      success: function (response) {
        //console.log(response)
      },
      error: function (response) {
        //console.log(response)
      }
  });
}
