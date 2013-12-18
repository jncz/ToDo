'use strict';

/* Controllers */
/**
The data structures looks like this:
{key:"project",value:[{projId:"",projName:"",task:[{taskId:"",taskName:'',createTime:'',done:''}],archiveTask:[{....}],createtime:""}]}
**/

function MyCtrl(sc) {
	var MAX_TASK_NUM = 15;
	var DATA_PROJECT = "project";
	var idGen = function(){
		var d = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x7|0x8)).toString(16);
		});
		return uuid;
	};
	var getTaskById = function(taskId){
		var t = null;
		angular.forEach(sc.todos, function(todo) {
			if(todo.id==taskId){
				t = todo;
			}
		});
		return t;
	};
	
	var getProjectById = function(projId){
		var t = null;
		angular.forEach(sc.projects, function(proj) {
			if(proj.id==projId){
				t = proj;
			}
		});
		return t;
	};
	var NBStorage = {
		_localStore : chrome.storage.local,
		_synStore : chrome.storage.sync,
		get : function(key,callback){
			this._synStore.get(key,function(it){
				console.log(it);
			});
			return this._localStore.get(key,callback);
		},
		set : function(data){
			//save to local
			this._localStore.set(data);
			//sync to server
			try{
				//this._synStore.set(data);
			}catch(error){
				console.log(error);
			}
		}
	};
	var storage = NBStorage;

	var dataContainer = {
		loadData : function(key){
			sc.projects = [];
			storage.get(key,function(items){
				sc.$apply(function(){
					angular.forEach(items.project,function(p){
						if(p.name){
							sc.projects.push(p);
						}
						p.isTasklistFull = false;
					});
				});
			});
		},
		persistData : function(key,data){
			//document.getElementById("data").contentWindow.postMessage({'result': data},"*");
			var items = {};
			items[key] = data;
			storage.set(items);
		},
		removeData : function(key,taskId,callback){
			
			storage.get(key,function(items){
				var datas = items.project.task;
				angular.forEach(datas,function(d,cIndex){
					if(d.id==taskId){
						datas.splice(cIndex,1);
						dataContainer.persistData(DATA_PROJECT,items.project);
						callback(cIndex);
					}
				});
			});
		},
	};

	dataContainer.loadData(DATA_PROJECT);

	//sc.isTasklistFull = false;//to mark whether the task list is larger than 15
	sc.addTodo = function(projId) {
		var proj = getProjectById(projId);
		
		if(proj.task.length>=MAX_TASK_NUM){
			proj.isTasklistFull = true;
			return;
		}
		
		var todo = {id:idGen(),text:proj.todoText, done:false,createtime:(new Date()).getTime()};
		proj.task.push(todo);
		proj.todoText = "";
		dataContainer.persistData(DATA_PROJECT,sc.projects);
	  };

	sc.remaining = function(projId) {
		var proj = getProjectById(projId);
		var count = 0;
		angular.forEach(proj.task, function(todo) {
		  count += todo.done ? 0 : 1;
		});
		return count;
	  };

	sc.archive = function(projId) {
		var proj = getProjectById(projId);
		var doneTask = [];
		var oldTodos = proj.task;
		proj.task = [];
		angular.forEach(oldTodos, function(todo) {
		  if (!todo.done){ 
			proj.task.push(todo);
		  }else{
			if(!proj.doneTask){
				proj.doneTask = [];
			}
			proj.doneTask.push(todo);
		  }
		});
		dataContainer.persistData(DATA_PROJECT,sc.projects);
	  };
	  
	sc.change = function(orgToDo){
		//TODO
	};
	
	sc.remove = function(projId,taskId){
		var proj = getProjectById(projId);
		angular.forEach(proj.task, function(todo,index) {
		  if(todo.id==taskId){
			proj.task.splice(index,1);
			proj.isTasklistFull = proj.task.length>=MAX_TASK_NUM;
			dataContainer.persistData(DATA_PROJECT,sc.projects);
		  }
		});
	};
	
	sc.rename = function(projId,taskId){
		dataContainer.persistData(DATA_PROJECT,sc.projects);
	};
	
	sc.addProj = function(){
		console.log("add project");
		var project = {id:idGen(),name:sc.projectName,task:[],doneTask:[],createtime:(new Date()).getTime()};
		sc.projects.push(project);
		sc.projectName = "";
		project.isTasklistFull = false;
	};
	
	sc.removeProj = function(projId){
		var proj = getProjectById(projId);
		angular.forEach(sc.projects, function(project,index) {
		  if(project.id==projId){
			sc.projects.splice(index,1);
			dataContainer.persistData(DATA_PROJECT,sc.projects);
		  }
		});
	};
	
	sc.renameProj = function(projId){
		dataContainer.persistData(DATA_PROJECT,sc.projects);
	};
	
}
MyCtrl.$inject = ["$scope"];