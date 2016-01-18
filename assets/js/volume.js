document.addEventListener('DOMContentLoaded', function() {

  var initvolume;

  chrome.storage.local.get("volume", function(data) {  
      initvolume = data["volume"]*100;
      console.log("Found this volume: " + initvolume);
      $("#sliderval").text(initvolume);
      $( "#slider" ).slider(
     {
      min: 0,
      max: 100,
      value: initvolume,
      step: 10,
     change: function(event, ui) { 
        var value = $( "#slider" ).slider("option","value" );
        $("#sliderval").text(value);
        value = value/100;
        value = value.toFixed(1);
        chrome.storage.local.set({"volume" : value}, function() {
        });
        chrome.runtime.sendMessage({greeting: value, agent: "volume"},
            function (response){
        });
      }
    }
    );
  });
});
