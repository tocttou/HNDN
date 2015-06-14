var sound;
var state;
var message;
var print;
var speed;

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
        audio.play();
        chrome.storage.local.get("dismissal", function(data) {
          speed = data["dismissal"];
        });
        console.log("Did here");
        console.log(speed);
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
              audio.play();
              chrome.storage.local.get("dismissal", function(data) {
                speed = data["dismissal"];
              });
              console.log("Did There");
              console.log(speed);
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
}

function setStorageAgain(){                                          //For some weird reason, storage is not set for the first time.
chrome.storage.local.get("sound", function(data) {                   //Probably because chrome local storage is slow.
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
console.log("i found this speed: " + speed);
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
    else{
      console.log("Type Changed to " + request.greeting);
      message = request.greeting;
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
      if(state == "Enabled" && message == "newstories"){
        playNotification(newshot.val(),sound,message);
      }
    });
}