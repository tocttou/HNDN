var sound;
var state;
var message;
var print;
var speed;
var volume;

function playNotification(data,sound,message){
  if(message == "topstories"){
    print = "Top Story";
  }
  else{
    print = "New Story";
  }
  console.log(data);
  $.get("https://hacker-news.firebaseio.com/v0/item/" + data + ".json?print=pretty", function(item, status){                   
    if(status == "success") {
      if(item){
        var audio = new Audio('/assets/sounds/' + sound);
          var notification = new Notification(print, {
              icon: '/assets/icons/newsicon128.png',
              body: item["title"]
            });  
          notification.onclick = function () {
            window.open("https://news.ycombinator.com/item?id=" + data);      
          };
        audio.volume = volume;
        audio.play();
        if(speed != 0){
          setTimeout(function(){
              notification.close();
          }, speed); 
        }
      }
      else{
        $.get("https://hacker-news.firebaseio.com/v0/item/" + data + ".json?print=pretty", function(item2, status2){                
          if(status2 == "success") {
            if(item2){
              var audio = new Audio('/assets/sounds/' + sound);
                var notification = new Notification(print, {
                    icon: '/assets/icons/newsicon128.png',
                    body: item2["title"]
                  });  
                notification.onclick = function () {
                  window.open("https://news.ycombinator.com/item?id=" + data);      
                };
              audio.volume = volume;
              audio.play();
              if(speed != 0){
                setTimeout(function(){
                    notification.close();
                }, speed); 
              }
            }
          }
        });
      }
    }
    else{
      console.log("Failed to print: " + message + " ; data: " + data);
    }
  });
}

function setInitialStorage(){
chrome.storage.local.get("sound", function(data) {
  sound = data["sound"];
  if(!sound){
    chrome.storage.local.set({"sound":"sound1.mp3"}, function() {
      sound = "sound1.mp3";
    });
  }
});
chrome.storage.local.get("type", function(data) {
  message = data["type"];
  if(!message){
    chrome.storage.local.set({"type":"newstories"}, function() {
      message = "newstories";
    });
  }
});
chrome.storage.local.get("state", function(data) {
  state = data["state"];
  if(!state){
    chrome.storage.local.set({"state":"Enabled"}, function() {
      state = "Enabled";
    });
  }
});
chrome.storage.local.get("dismissal", function(data) {
  speed = data["dismissal"];
  if(!speed){
    chrome.storage.local.set({"dismissal": 0}, function() {
      speed = 0;
    });
  }
});
chrome.storage.local.get("volume", function(data) {
  volume = data["volume"];
  if(!volume){
    chrome.storage.local.set({"volume": 1.0}, function() {
      volume = 1.0;
    });
  }
});
}

function setStorageAgain(){                                          
chrome.storage.local.get("sound", function(data) {
  sound = data["sound"];
  if(!sound){
    chrome.storage.local.set({"sound":"sound1.mp3"}, function() {
      sound = "sound1.mp3";
    });
  }
});
chrome.storage.local.get("type", function(data) {
  message = data["type"];
  if(!message){
    chrome.storage.local.set({"type":"newstories"}, function() {
      message = "newstories";
    });
  }
});
chrome.storage.local.get("state", function(data) {
  state = data["state"];
  if(!state){
    chrome.storage.local.set({"state":"Enabled"}, function() {
      state = "Enabled";
    });
  }
});
chrome.storage.local.get("dismissal", function(data) {
  speed = data["dismissal"];
  if(!speed){
    chrome.storage.local.set({"dismissal": 0}, function() {
      speed = 0;
    });
  }
});
chrome.storage.local.get("volume", function(data) {
  volume = data["volume"];
  if(!volume){
    chrome.storage.local.set({"volume": 1.0}, function() {
      volume = 1.0;
    });
  }
});
console.log("i found this speed: " + speed + " and this volume: " + volume);
  tester();
}

function setIcon(){
  chrome.storage.local.get("icon", function(data) {
    icon = data["icon"];
    if(icon == "black"){
      chrome.browserAction.setIcon({
          path: "/assets/icons/disabledicon.png"
      });
    }
    else if(icon == "orange"){
      chrome.browserAction.setIcon({
          path: "/assets/icons/newsicon48.png"
      });
    }
  });
}

setInitialStorage();
setIcon();
setTimeout(setStorageAgain,"5000");

chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
    if(request.greeting == "Enabled" || request.greeting == "Disabled"){
      console.log("State Changed to " + request.greeting);
      state = request.greeting;
    }
    else if(request.greeting == "topstories" || request.greeting == "newstories"){
      console.log("Type Changed to " + request.greeting);
      message = request.greeting;
    }
    else if(request.agent == "sound"){
      console.log("Sound Changed to " + request.greeting);
      sound = request.greeting;
    }
    else if(request.agent == "timing"){
      console.log("Speed Changed to " + request.greeting);
      speed = request.greeting;
    }
    else if(request.agent == "volume"){
      console.log("volume Changed to " + request.greeting);
      volume = request.greeting;
    }
});

function tester() {

    var data = new Firebase('https://hacker-news.firebaseio.com/');

    data.child("v0/topstories").startAt().limitToFirst(1).on('value', function(topshot) {
      chrome.storage.local.get("sound", function(data) {
        sound = data["sound"];
      });
      chrome.storage.local.get("type", function(data) {
        message = data["type"];
      });
      chrome.storage.local.get("state", function(data) {
        state = data["state"];
      });
      console.log("Current topstory: " + topshot.val());
      console.log("Current state: " + state);
      if(state == "Enabled" && message == "topstories"){
        playNotification(topshot.val(),sound,message);
      }
    });

    data.child("v0/newstories").startAt().limitToFirst(1).on('value', function(newshot) {
      chrome.storage.local.get("sound", function(data) {
        sound = data["sound"];
      });
      chrome.storage.local.get("type", function(data) {
        message = data["type"];
      });
      chrome.storage.local.get("state", function(data) {
        state = data["state"];
      });
      console.log("Current newstory: " + newshot.val());
      console.log("Current state: " + state);
      if(state == "Enabled" && message == "newstories"){
        playNotification(newshot.val(),sound,message);
      }
    });
}
