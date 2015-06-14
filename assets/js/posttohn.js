document.addEventListener('DOMContentLoaded', function() {

    var post = document.getElementById('post');
    post.addEventListener('click', function() {
        chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
           function(tabs){
              window.open("http://news.ycombinator.com/submitlink?u=" + encodeURIComponent(tabs[0].url) + "&t=" + encodeURIComponent(tabs[0].title));
           }
        );
    });

});