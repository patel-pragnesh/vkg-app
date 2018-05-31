exports.setDataLoadProgress = function(req){
    let session_clients = req.app.get('session_clients');
    if(session_clients[req.session.session_uniqid]){
        session_clients[req.session.session_uniqid].isDataLoadProgress = true;
    }
}

exports.isDataLoadProgress = function(req){
    let session_clients = req.app.get('session_clients');
    let isDataLoadProgress = false;
    if(session_clients[req.session.session_uniqid] && session_clients[req.session.session_uniqid].isDataLoadProgress == true){
        isDataLoadProgress = true;
    }
    return isDataLoadProgress;
}

exports.sendProgressToClients = function(req, msg){
    let socketio = req.app.get('socketio');
    let socket_clients = req.app.get('socket_clients');
    let session_clients = req.app.get('session_clients');

    if(socket_clients[req.session.session_uniqid]){
        socket_clients[req.session.session_uniqid].forEach(function(element){
            socketio.sockets.connected[element].emit('progress', msg);
        });
    }

    if(msg=='SavedToDB'){
        session_clients[req.session.session_uniqid].isDataLoadProgress = false;
    }
}