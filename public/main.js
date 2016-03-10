  var socket = io();

  socket.emit('add user', 'Volkan');
/*
  socket.on('power', function (data) {
    console.log(data);
  });
*/
  socket.on('user joined', function (data) {
    console.log(data.username + ' joined');
    alert(data.username + ' joined');
  });
