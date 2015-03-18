$(function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError, {timeout:5000});
    } else { 
        alert("Geolocation is not supported by this browser.");
    }
});

function showPosition(position) {
    $.getJSON('/get_yaks', {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    }, function(data) {
        jQuery.each(data.messages, function(i, val) {
            console.log(val);
            var buildVotes = "<div class=\"yakVotes\"><div class=\"upVote\" onclick=\"clickedUp(this)\"><img src=\"/static/img/upVote.png\" /></div><div class=\"totalVote\">" + val.numberOfLikes + "</div><div class=\"downVote\" onclick=\"clickedDown(this)\"><img src=\"/static/img/downVote.png\" /></div></div>";
            if (val.handle) {
                var buildHandle = "<div class=\"yakHandle\">" + val.handle + "</div>";
            } else {
                var buildHandle = "<div class=\"yakHandle\"></div>";
            }
            $("#yaks").append("<div class=\"yak\">" + buildVotes + buildHandle + "<div class=\"yakText\">" + val.message + "</div></div>");
        });
    });
}

function showError(error) {
    // switch(error.code) {
    //     case error.PERMISSION_DENIED:
    //         alert("User denied the request for Geolocation.");
    //         break;
    //     case error.POSITION_UNAVAILABLE:
    //         alert("Location information is unavailable.");
    //         break;
    //     case error.TIMEOUT:
    //         alert("The request to get user location timed out.");
    //         break;
    //     case error.UNKNOWN_ERROR:
    //         alert("An unknown error occurred.");
    //         break;
    // }
    alert(error);
}

function clickedUp(obj) {
    var objs = obj.parentNode.children;
    console.log(objs);

    var obj = upVote;
    var objs[1] = votes;
    var objs[2] = downVote;

    if (upVote.innerHTML == '<img src="/static/img/upVote.png">') {
        if (downVote.innerHTML == '<img src="/static/img/downVote.png">') {
            upVote.innerHTML = '<img src="/static/img/upVote_pressed.png">';
            votes.innerHTML = parseInt(votes.innerHTML) + 1;
        } else {
            upVote.innerHTML = '<img src="/static/img/upVote_pressed.png">';
            votes.innerHTML = parseInt(votes.innerHTML) + 2;
            downVote.innerHTML = '<img src="/static/img/downVote.png">';
        }
    } else {
        upVote.innerHTML = '<img src="/static/img/upVote.png">';
        votes.innerHTML = parseInt(votes.innerHTML) - 1;
    }
}

function clickedDown(obj) {
    var objs = obj.parentNode.children;
    console.log(objs);

    var obj = upVote;
    var objs[1] = votes;
    var objs[2] = downVote;

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
        votes.innerHTML = parseInt(votes.innerHTML) - 1;
    }
}