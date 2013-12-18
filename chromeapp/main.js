/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/trunk/apps/app.runtime.html
 * @see http://developer.chrome.com/trunk/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function() {
  var screenWidth = screen.availWidth;
  var screenHeight = screen.availHeight;
  var width = 1100;
  var height = 660;

  chrome.app.window.create('index.html',
    {id:"smart_todo_app",width: width, height: height, 
     left: (screenWidth-width)/2, 
     top: (screenHeight-height)/2,frame:"none",singleton :true});
});

//chrome.runtime.onSuspend
//chrome.runtime.onInstalled
