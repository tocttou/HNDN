document.addEventListener('DOMContentLoaded', function() {

    //Set initial display for sound.
    chrome.storage.local.get("sound", function(data) {
        document.getElementById('soundValue').value = data["sound"];
    });

    //Set initial display for type.
    chrome.storage.local.get("type", function(data) {
        if(data["type"] == "topstories"){
            document.getElementById("type").innerHTML = "Current: Top Stories";
        }
        else if(data["type"] == "newstories"){
            document.getElementById('type').innerHTML = "Current: New Stories";
        }
    });

    //Set initial state.
    chrome.storage.local.get("state", function(data) {
        if(data["state"] == "Enabled"){
            document.getElementById("onoff").innerHTML = "Disable";
        }
        else if(data["state"] == "Disabled"){
            document.getElementById("onoff").innerHTML = "Enable";
        }
    });

    //Set the notification sound.
    var link = document.getElementById('soundValue');
    link.addEventListener('change', function() {
        var sound = document.getElementById('soundValue').value; 
        chrome.storage.local.set({"sound" : sound}, function() {
        });
        var play = new Audio('/assets/sounds/' + sound);
        play.play(); 
    });

    //Toggle enable/disable.
    var state = document.getElementById('onoff');
    state.addEventListener('click', function() {
        chrome.storage.local.get("state", function(data) {
            if(data["state"] == "Enabled"){
                chrome.storage.local.set({"state" : "Disabled"}, function() {
                  document.getElementById("onoff").innerHTML = "Enable";
                  chrome.browserAction.setIcon({
                      path: "/assets/icons/disabledicon.png"
                  });
                });
                chrome.storage.local.set({"icon" : "black"}, function() {
                });
            }
            else if(data["state"] == "Disabled"){
                chrome.storage.local.set({"state" : "Enabled"}, function() {
                  document.getElementById("onoff").innerHTML = "Disable";
                  chrome.browserAction.setIcon({
                      path: "/assets/icons/newsicon48.png"
                  });
                });
                chrome.storage.local.set({"icon" : "red"}, function() {
                });
            }
        });
    });

    //Set Top/New stories.
    var type = document.getElementById('type');
    type.addEventListener('click', function() {
        chrome.storage.local.get("type", function(data) {
            if(data["type"] == "topstories"){
                chrome.storage.local.set({"type" : "newstories"}, function() {
                  document.getElementById("type").innerHTML = "Current: New Stories";
                });
                chrome.runtime.sendMessage({greeting: "newstories"},
                    function (response){
                });
            }
            else if(data["type"] == "newstories"){
                chrome.storage.local.set({"type" : "topstories"}, function() {
                  document.getElementById("type").innerHTML = "Current: Top Stories";
                });
                chrome.runtime.sendMessage({greeting: "topstories"},
                    function (response){
                });
            }
        });
    });

    //Set display for dismissal time.
        chrome.storage.local.get("dismissal", function(data) {
            document.getElementById("dismissal").value = data["dismissal"];
        });

    //Set notification dismissal time.
    var dismiss = document.getElementById('dismissal');
    dismiss.addEventListener('change', function() {
        var speed = document.getElementById('dismissal').value; 
        chrome.storage.local.set({"dismissal" : speed}, function() {
        });
    });

});