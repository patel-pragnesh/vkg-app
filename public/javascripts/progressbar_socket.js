var socket = io('http://localhost:3000');
var clientSocketId = null;
socket.on('connected', function(data){
});
socket.on('progress', function(current_progress){
    // Progressbar frissítés
    if(current_progress != 'SavedToDB'){
        $("#dynamic")
            .css("width", current_progress + "%")
            .attr("aria-valuenow", current_progress)
            .text(current_progress + "% Kész");
    }else{
        location.reload();
    }
});