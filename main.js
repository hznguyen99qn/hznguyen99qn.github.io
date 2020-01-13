const socket = io('https://chatvideo102ok.herokuapp.com/');

$('#chat').hide();

socket.on('DANH_SACH_ONLINE', arrUserInfo => {
    $('#chat').show();
    $('#dang_ky').hide();
    arrUserInfo.forEach(user => {
        const {ten, peerId} = user;
        $('#userOnline').append(`<li class="user_online" id="${peerId}">${ten}<span class="glyphicon glyphicon-earphone"></span></li>`);
    });
    socket.on('CO_NGUOI_DUNG_MOI', user => {
        const {ten, peerId} = user;
        $('#userOnline').append(`<li id="${peerId}">${ten}</li>`);
    });
});
socket.on('DANG_KY_THAT_BAI', () => alert('Username da ton tai !'));
socket.on('CO_NGUOI_NGAT_KET_NOI', peerId => {
    $(`#${peerId}`).remove();
})


function openStream() {
    const config ={audio: true, video: true};
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

//openStream().then(stream => playStream('localStream', stream));
const peer = new Peer({host: 'chatvideo102ok.herokuapp.com', secure: true, port: 443});
peer.on('open',id => {
    $('#my-peer').append(id);
    $('#btnSignUp').click(() => {
        const username = $('#txtUserName').val();
        socket.emit('NGUOI_DUNG_DANG_KY', {ten: username, peerId: id});
    });
});

//caller
$('#btnCall').click(() => {
    const id = $('#remoteId').val();
    openStream().then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});
//answer
peer.on('call', call => {
    openStream().then(stream => {
        call.answer(stream);
        playStream('localStream', stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

$('#userOnline').on('click', 'li', function() {
    const id = $(this).attr('id');
    openStream().then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});