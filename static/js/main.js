$(function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else { 
        alert("Geolocation is not supported by this browser.");
    }
});

var kLat;
var kLng;

function showPosition(position) {
    kLat = position.coords.latitude;
    kLng = position.coords.longitude;
    $.getJSON('/get_yaks', {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    }, function(data) {
        console.log(data);
        jQuery.each(data.messages, function(i, val) {
            var buildVotes = "<div class=\"yakVotes\"><div class=\"upVote\" onclick=\"clickedUp(this)\" messageid=\"" + val.messageID + "\"><img src=\"/static/img/upVote.png\" /></div><div class=\"totalVote\">" + val.numberOfLikes + "</div><div class=\"downVote\" onclick=\"clickedDown(this)\"><img src=\"/static/img/downVote.png\" /></div></div>";
            if (val.handle) {
                var buildHandle = "<div class=\"yakHandle\">" + val.handle + "</div>";
            } else {
                var buildHandle = "<div class=\"yakHandle\"></div>";
            }
            $("#yaks").append("<div class=\"yak\">" + buildVotes + buildHandle + "<div class=\"yakText\">" + val.message + "</div></div>");
        });
    });

    $("#loading").fadeOut(200, function() {
        $("#loading").remove();
        $("#yaks").fadeIn(2500);
    });
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

function clickedUp(obj) {
    var objs = obj.parentNode.children;

    var upVote = obj;
    var votes = objs[1];
    var downVote = objs[2];
    var messageID = obj.getAttribute("messageid");
    console.log(messageID);

    if (upVote.innerHTML == '<img src="/static/img/upVote.png">') {
        if (downVote.innerHTML == '<img src="/static/img/downVote.png">') {
            upVote.innerHTML = '<img src="/static/img/upVote_pressed.png">';
            votes.innerHTML = parseInt(votes.innerHTML) + 1;
            /*
            $.getJSON('/upvote', {
                lat: kLat,
                lng: kLng,
                messageid: messageID
            }, function(data) {
                console.log(data)
            });
            */
            
            $.ajax({
                type: "POST",
                url: "/upvote",
                data: { 'messageid': messageID, 'lat': kLat, 'lng': kLng }
            }).done(function(data) {
                console.log(data);
            });
            
        } else {
            upVote.innerHTML = '<img src="/static/img/upVote_pressed.png">';
            votes.innerHTML = parseInt(votes.innerHTML) + 2;
            downVote.innerHTML = '<img src="/static/img/downVote.png">';
            $.ajax({
                method: "GET",
                url: "/upvote",
                data: { messageID: messageID, lat: kLat, lng: kLng }
            }).done(function(data) {
                console.log(data);
            });
            $.ajax({
                method: "POST",
                url: "/upvote",
                data: { messageID: messageID, lat: kLat, lng: kLng }
            }).done(function(data) {
                console.log(data);
            });
        }
    } else {
        upVote.innerHTML = '<img src="/static/img/upVote.png">';
        votes.innerHTML = parseInt(votes.innerHTML) - 1;
    }
}

function clickedDown(obj) {
    var objs = obj.parentNode.children;
    console.log(objs);

    var downVote = obj;
    var votes = objs[1];
    var upVote = objs[0];

    if (downVote.innerHTML == '<img src="/static/img/downVote.png">') {
        if (upVote.innerHTML == '<img src="/static/img/upVote.png">') {
            downVote.innerHTML = '<img src="/static/img/downVote_pressed.png">';
            votes.innerHTML = parseInt(votes.innerHTML) - 1;
        } else {
            downVote.innerHTML = '<img src="/static/img/downVote_pressed.png">';
            votes.innerHTML = parseInt(votes.innerHTML) - 2;
            upVote.innerHTML = '<img src="/static/img/upVote.png">';
        }
    } else {
        downVote.innerHTML = '<img src="/static/img/downVote.png">';
        votes.innerHTML = parseInt(votes.innerHTML) + 1;
    }
}
