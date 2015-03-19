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
        console.log(data)
        jQuery.each(data.messages, function(i, val) {
            var buildVotes = "<div class=\"yakVotes\"><div class=\"upVote\" onclick=\"clickedUp(this)\" messageid=\"" + val.messageID + "\"><img src=\"/static/img/upVote.png\" /></div><div class=\"totalVote\">" + val.numberOfLikes + "</div><div class=\"downVote\" onclick=\"clickedDown(this)\" messageid=\"" + val.messageID + "\"><img src=\"/static/img/downVote.png\" /></div></div>";
            if (val.handle) {
                var buildHandle = "<div class=\"yakHandle\">" + val.handle + "</div>";
            } else {
                var buildHandle = "<div class=\"yakHandle\"></div>";
            }
            var buildComments = "<div class=\"yakComments\">" + val.comments + " COMMENTS</div>";
            var buildTime = moment(val.time).fromNow(true);
            console.log(buildTime);
            if (buildTime.split(" ").pop() == "days" || buildTime.split(" ").pop() == "day") {
                var days = buildTime.split(" ")[0] == "a" ? "1" : buildTime.split(" ")[0];
                builtTime = days + "d";
            } else if (buildTime.split(" ").pop() == "hours" || buildTime.split(" ").pop() == "hour") {
                console.log(buildTime.split(" "));
            }

            $("#yaks").append("<div class=\"yak\">" + buildVotes + buildHandle + "<div class=\"yakText\">" + val.message + "</div>" + buildTime + "</div>");
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

    $.ajax({
        type: "GET",
        url: "/upvote",
        data: { 'messageid': messageID, 'lat': kLat, 'lng': kLng }
    }).done(function(data) {
        console.log(data);
    });
}

function clickedDown(obj) {
    var objs = obj.parentNode.children;

    var downVote = obj;
    var votes = objs[1];
    var upVote = objs[0];
    var messageID = obj.getAttribute("messageid");

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

    $.ajax({
        type: "GET",
        url: "/downvote",
        data: { 'messageid': messageID, 'lat': kLat, 'lng': kLng }
    }).done(function(data) {
        console.log(data);
    });
}

function postYak() {
    bootbox.dialog({
            title: "New Yak",
            message: '<div class="row">  ' +
                '<div class="col-md-12"> ' +
                '<form class="form-horizontal"> ' +
                '<div class="form-group"> ' +
                '<label class="col-md-4 control-label" for="handle">Handle:</label> ' +
                '<div class="col-md-4"> ' +
                '<input id="handle" name="handle" type="text" placeholder="Handle" class="form-control input-md"> ' +
                '<span class="help-block">This can be blank.</span> </div> ' +
                '</div> ' +
                '<div class="form-group"> ' +
                '<label class="col-md-4 control-label" for="yak">Yak:</label> ' +
                '<div class="col-md-4"> ' +
                '<input id="yak" name="yak" type="text" placeholder="Yak" class="form-control input-md"> ' +
                '<span></span> </div> ' +
                '</div> ' +
                '</div> </div>' +
                '</form> </div>  </div>',
            buttons: {
                success: {
                    label: "Post",
                    className: "btn-success",
                    callback: function () {
                        var handle = $('#handle').val();
                        var yak = $('#yak').val();

                        $.ajax({
                            type: "POST",
                            url: "/postyak",
                            data: { 'message': yak, 'handle': handle, 'lat': kLat, 'lng': kLng }
                        }).done(function(data) {
                            console.log(data);
                            location.reload();
                        });
                    }
                }
            }
        }
    );
}
