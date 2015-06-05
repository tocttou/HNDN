document.addEventListener('DOMContentLoaded', function() {

    //Reset display
    function reset(){
        document.getElementById('display').innerHTML = "";
    }

    //Set initial display for sound.
    chrome.storage.local.get("sound", function(data) {
      if(data["sound"] === undefined){
        chrome.storage.local.set({"sound":"sound1.mp3"}, function() {
            console.log("here");
            document.getElementById('soundValue').value = "sound1.mp3";
        });
      }
      else{
        console.log(data["sound"]);
        document.getElementById('soundValue').value = data["sound"];
      }
    });

    //Set initial display for type.
    chrome.storage.local.get("type", function(data) {
        if(data["type"] == "topstories"){
            document.getElementById("type").innerHTML = "Current: Top Stories";
        }
        else if(data["type"] == "newstories"){
            document.getElementById('type').innerHTML = "Current: New Stories";
        }
        else{
            chrome.storage.local.set({"type":"newstories"}, function() {
                document.getElementById("type").innerHTML = "Current: New Stories";
            });
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
        else{
            document.getElementById("onoff").innerHTML = "Disable";
            chrome.storage.local.set({"state":"Enabled"}, function() {
            });
        }
    });

    //Set the notification sound.
    var link = document.getElementById('soundValue');
    link.addEventListener('click', function() {
        reset();
    });
    link.addEventListener('change', function() {
        var sound = document.getElementById('soundValue').value; 
        chrome.storage.local.set({"sound" : sound}, function() {
          document.getElementById("display").innerHTML = "Set"; 
        });
        var play = new Audio('/assets/sounds/' + sound);
        play.play(); 
    });

    //Preview the notification.
    var preview = document.getElementById('preview');
    preview.addEventListener('click', function() {
        var presound = document.getElementById('soundValue').value;
        console.log(presound);
        var play = new Audio('/assets/sounds/' + presound);
        var notification = new Notification("Preview", {
            icon: '/assets/icons/newsicon128.png',
            body: "This is a sample notification."
          }); 
        play.play();
        reset();
    });

    //Toggle enable/disable.
    var state = document.getElementById('onoff');
    state.addEventListener('click', function() {
        chrome.storage.local.get("state", function(data) {
            if(data["state"] == "Enabled"){
                chrome.storage.local.set({"state" : "Disabled"}, function() {
                  document.getElementById("onoff").innerHTML = "Enable";
                });
            }
            else if(data["state"] == "Disabled"){
                chrome.storage.local.set({"state" : "Enabled"}, function() {
                  document.getElementById("onoff").innerHTML = "Disable";
                });
            }
        });
        reset();
    });

    //Set Top/New stories.
    var type = document.getElementById('type');
    type.addEventListener('click', function() {
        chrome.storage.local.get("type", function(data) {
            if(data["type"] == "topstories"){
                chrome.storage.local.set({"type" : "newstories"}, function() {
                  document.getElementById("type").innerHTML = "Current: New Stories";
                });
            }
            else if(data["type"] == "newstories"){
                chrome.storage.local.set({"type" : "topstories"}, function() {
                  document.getElementById("type").innerHTML = "Current: Top Stories";
                });
            }
        });
        reset();
    });

})