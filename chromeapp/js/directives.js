'use strict';

/* Directives */


var module = angular.module('todoListApp', []);
module.directive('contenteditable', function() {
  return {
	require: 'ngModel',
	link: function(scope, elm, attrs, ctrl) {
		  var ENTER = 13;
		  
		  elm.bind("keydown",function(e){
			if(e.keyCode == ENTER){
				e.srcElement.blur();
				document.getElementById("subBtn").click();
				//console.log(elm.parent().next()[0].children[1]);
				elm.parent().next()[0].children[1].focus();
			}
		  });
		  // model -> view
		  elm.bind("blur",function(){
				scope.$apply(function() {
				  ctrl.$setViewValue(elm.text());// view -> model
				});
		  });

		  // load init value from DOM
		  //ctrl.$setViewValue(elm.html());
		}
	};
});

module.directive("morebutton",[function(version){
return function(scope, elm, attrs) {
	var childSize = elm.children().length;
	var renameBtn = elm.children()[childSize-2];
	
	var removeBtn = elm.children()[childSize-1];
	elm.bind("mouseover",function(){
		removeBtn.setAttribute("style","display:''");
		renameBtn.setAttribute("style","display:''");
	});
	
	elm.bind("mouseout",function(){
		removeBtn.setAttribute("style","display:none");
		renameBtn.setAttribute("style","display:none");
	});
};
}]);
  
module.directive("troggletasklist",[function(version){
	return function(scope, elm, attrs) {
		elm.bind("mouseover",function(e){
			elm.css("cursor","pointer");
		});
		elm.bind("click",function(e){
			$(elm.next()).toggle( "blind",{duration:50});
		});
	};
}]);

module.directive("promptDialog",[function(version){
	return function(scope, elm, attrs) {
		elm.bind("click",function(e){
			$("#dialog" ).dialog();
		});
	};
}]);

module.directive("closeDialog",[function(version){
	return function(scope, elm, attrs) {
		elm.bind("click",function(e){
			console.log(elm.parent().parent()[0].id);
			$("#"+elm.parent().parent()[0].id).dialog("close");
		});
	};
}]);

module.directive("showProjDialog",[function(version){
	return function(scope, elm, attrs) {
		elm.bind("click",function(e){
			$("#projRenameDialog_"+attrs["showProjDialog"] ).dialog();
			e.stopPropagation();
		});
	};
}]);

module.directive("showTaskDialog",[function(version){
	return function(scope, elm, attrs) {
		elm.bind("click",function(e){
			$("#taskRenameDialog_"+attrs["showTaskDialog"]).dialog();
			e.stopPropagation();
		});
	};
}]);

module.directive("confirm",[function(version){
	return function(scope, elm, attrs) {
		elm.bind("click",function(e){
			var projectId = attrs["confirm"];
			$("#projRemoveDialog_"+projectId).dialog({
				  resizable: false,
				  height:140,
				  modal: true,
				  buttons: {
					"Delete The project item?": function() {
						scope.removeProj(projectId);
						scope.$apply(function() {
						  scope.projects = scope.projects;
						});
						$( this ).dialog( "close" );
					},
					Cancel: function() {
					  $( this ).dialog( "close" );
					}
				  }
			});
			e.stopPropagation();
		});
	};
}]);

module.directive("functionbar",function($compile,$rootScope) {
	var directiveObj = {
		restrict : "E",
		scope : {addProj:'&',},
		template : '<div><button>Add new task project</button><button>Collapse</button></div>',
		link :  function(scope, iElement, iAttrs){
						var addProjBtn = angular.element(iElement.children()[0].children[0]);
						addProjBtn.bind("click",scope.addProj());
					},
	};
	return directiveObj;
});
