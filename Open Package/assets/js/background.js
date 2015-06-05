var sound;
var state;
var message;
var print;
var arrNew = [];
var arrTop = [];

function playNotification(data,sound,message){
  if(message == "topstories"){
    print = "Top Story";
  }
  else{
    print = "New Story";
  }
  $.get("https://hacker-news.firebaseio.com/v0/item/" + data + ".json?print=pretty", function(item, status){                   
    if(status == "success") {
      var audio = new Audio('/assets/sounds/' + sound);
        var notification = new Notification(print, {
            icon: '/assets/icons/newsicon128.png',
            body: item["title"]
          });  
        notification.onclick = function () {
          window.open("https://news.ycombinator.com/item?id=" + data);      
        };              
      audio.play();   
    }
  });
}

function fetchLocalStorage(){
  chrome.storage.local.get("sound", function(data) {
    sound = data["sound"];
  });
  chrome.storage.local.get("state", function(data) {
    state = data["state"];
  });
  chrome.storage.local.get("type",function(data){
    if(data["type"] === undefined){
      message = "newstories";
      chrome.storage.local.set({"type":"newstories"}, function() {
      });
      chrome.storage.local.set({"state":"Enabled"}, function() {
      });
      chrome.storage.local.set({"sound":"sound1.mp3"}, function() {
      });
    }
    else{
      message = data["type"];
    }
  })
  tester();
}

fetchLocalStorage();
setInterval(fetchLocalStorage,"25000");

function tester() {
  if(state == "Enabled"){
    if(message == "topstories"){
      console.log("Testing top stories");
      $.get("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty", function(data, status){                   
        if(status == "success") {
          console.log("arrTop: " + arrTop[0] + " data: " + data[0]);
            if(arrTop.length == 0){
              arrTop.push(data[0]);
              console.log("Initialser running in background.js Testing: " + message);
              playNotification(data[0],sound,message);
            }
            else if(arrTop.length == 1){
              if(data[0] > arrTop[0]){
                arrTop.pop();
                arrTop.push(data[0]);
                var audio = new Audio('/assets/sounds/'+sound);
                playNotification(data[0],sound,message);
              }
          }                  
        }
        else{
            console.log("Fetching TopStories: " + status);
        }
    });
    }
    else if(message == "newstories"){
      console.log("Testing new stories");
      $.get("https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty", function(data, status){                   
        if(status == "success") {
          console.log("arrNew: " + arrNew[0] + " data: " + data[0]);
            if(arrNew.length == 0){
              arrNew.push(data[0]);
              console.log("Initialser running in background.js Testing: " + message);
              playNotification(data[0],sound,message);
            }
            else if(arrNew.length == 1){
              if(data[0] > arrNew[0]){
                arrNew.pop();
                arrNew.push(data[0]);
                var audio = new Audio('/assets/sounds/'+sound);
                playNotification(data[0],sound,message);
              }
          }                  
        }
        else{
            console.log("Fetching NewStories: " + status);
        }
    });
    }
  } 
}