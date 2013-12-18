// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// This event is fired each time the user updates the text in the omnibox,
// as long as the extension's keyword mode is still active.
chrome.omnibox.onInputChanged.addListener(
  function(text, suggest) {
    console.log('inputChanged: ' + text);
	/**
    suggest([
      {content: text + " one", description: "the first one"},
      {content: text + " number two", description: "the second entry"}
    ]);
	**/
  });

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
  function(text) {
    console.log('inputEntered: ' + text);
	var login = function(xhr,cquid){
		var targetUrl = "https://svs1cqw01/cqweb/cqlogin.cq?action=DoLogin";
				
		xhr.open("POST", targetUrl, true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.onreadystatechange = function(){
			if (xhr.readyState == 4) {
				//https://svs1cqw01/cqweb/#/cq_ecm/ECM/RECORD/ECM00188787&noframes=true&format=HTML&recordType=Defect
				chrome.tabs.create({url:"https://svs1cqw01/cqweb/#/cq_ecm/ECM/RECORD/"+text+"&noframes=true&format=HTML&recordType=Defect"});
			}
		};
		var formdata = "loginId=wpingli@cn.ibm.com&password=Spss8901&repository=cq_ecm&";
		formdata+="cquid="+cquid;
		
		xhr.send(formdata);
	};
	var url = "https://svs1cqw01/cqweb/";
	chrome.cookies.remove({"url":url,"name":"JSESSIONID"});
	chrome.cookies.get({"url":url,"name":"JSESSIONID"},function(c){
			var xhr = new XMLHttpRequest();
			
				xhr.open("GET", url, true);
				xhr.onreadystatechange = function(){
					if (xhr.readyState == 4) {
						chrome.cookies.get({"url":url,"name":"JSESSIONID"},function(c2){
							login(xhr,c2.value);
						});
					}
				};
				xhr.send();//get the cookie
			
		});
  });
