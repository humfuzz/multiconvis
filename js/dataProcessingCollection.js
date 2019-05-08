
// TODO: this replaces alert with triggering a breakpoint in vscode
//       can remove this after debugging all the damn alerts
window.alert = function(msg) { debugger; }

var monthtbl = {
	'January': 1, 'February': 2, 'March': 3, 'April': 4, 'May': 5, 'June': 6, 'July': 7, 'August': 8, 'September': 9, 'October': 10,
	'November': 11, 'December': 12
};
var monthtbl2 = {
	'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10,
	'Nov': 11, 'Dec': 12
};
var QueryString = function () {
	// This function is anonymous, is executed immediately and 
	// the return value is assigned to QueryString!
	var query_string = {};
	var query = window.location.search.substring(1);
	//alert(query);
	var vars = query.split("&");
    /*for (var i=0;i<vars.length;i++) {
     var pair = vars[i].split("=");
     // If first entry with this name
     if (typeof query_string[pair[0]] === "undefined") {
     query_string[pair[0]] = pair[1];
     // If second entry with this name
     } else if (typeof query_string[pair[0]] === "string") {
     var arr = [ query_string[pair[0]], pair[1] ];
     query_string[pair[0]] = arr;
     // If third or later entry with this name
     } else {
     query_string[pair[0]].push(pair[1]);
     }
     } 
     return query_string;*/
	var pair = vars[0].split("=");

	return pair[1];
}();
dataset = QueryString;

// add more data to the collection json object from each conversation json
/*function aggregateDataFromConversationsToCollection(data)
{
				for(i=0;i<data.length;i++)
				{
                                    alert("yes");
					$.ajax({
					  url: "data/"+data[i].filename+".json",
					  async: false,
					  dataType: 'json',
					  success: function (response) {
                                                //alert("data/"+data[i].filename+".json"+response.sent[0].sent);
						data[i].totaltopics=response.totalTopics;
						data[i].totalLines=response.totalLines;
						data[i].topicsentiment=response.topicsentiment;
                                                data[i].article=response.sent;  
                                                
                                                
					  }
					});	
				}	
}*/

// sort conversations by time
function sortDatabyTime(data, order) {

	data.sort(function (a, b) {
		var aTime = findStartTime(a);
		var bTime = findStartTime(b);
		//alert(aTime+" "+bTime);
		if (isNaN(aTime)) return -1;
		else if (isNaN(bTime)) return -1;
		if (aTime > bTime && order == "descending") return -1;
		else return 1;
	});
	return data;
}

// sort conversations by no of comments
function sortDatabyNoOfComments(data, order) {

	data.sort(function (a, b) {
		var aTime = a.totalcomments;
		var bTime = b.totalcomments;
		//alert(aTime+" "+bTime);
		if (isNaN(aTime)) return -1;
		else if (isNaN(bTime)) return -1;
		if (aTime > bTime && order == "descending") return -1;
		else return 1;
	});
	return data;
}
// sort conversations by no of comments
function sortDatabyNoOfTopics(data, order) {

	data.sort(function (a, b) {
		var aTime = a.topics.length;
		var bTime = b.topics.length;
		//alert(aTime+" "+bTime);
		if (isNaN(aTime)) return -1;
		else if (isNaN(bTime)) return -1;
		if (aTime > bTime && order == "descending") return -1;
		else return 1;
	});
	return data;
}
// sort conversations by no of comments
function sortDatabyNoOfAuthors(data, order) {
	data.sort(function (a, b) {
		var aTime = parseInt(a.totalAuthors);
		var bTime = parseInt(b.totalAuthors);

		if (isNaN(aTime)) return -1;
		else if (isNaN(bTime)) return -1;
		if (aTime > bTime && order == "descending") return -1;
		else return 1;
	});
	return data;
}

// sort conversations by sentiment
function sortDatabySentiment(data, order) {
	for (var j = 0; j < data.length; j++) {
		data[j].colorBins = findColor(data[j], 1);
		data[j].avgsentiment = 0.0;

		for (var i = 0; i < 2; i++) {
			data[j].avgsentiment += data[j].colorBins[i] / 2;

		}
		console.log(data[j].avgsentiment);
	}
	data.sort(function (a, b) {

		var aTime = a.avgsentiment; //toDo: add this info to collection
		var bTime = b.avgsentiment; //toDo: add this info to collection
		console.log(aTime + " " + bTime);
		if (isNaN(aTime)) return -1;
		else if (isNaN(bTime)) return -1;
		if (aTime > bTime && order == "descending") return -1;
		else return 1;
	});
	return data;
}

function findStartTime(node) {
	// ISO 8601 update by Amon 2018-08

	return new Date(node.date).getTime();


	// var res = node.date.split(" "); 
	// var monthNumber = monthtbl[res[1]];
	// var day=res[2].substring(0, res[2].length - 1);
	// var year = res[3];
	// //alert(day+"/"+monthNumber+"/"+year);	
	// // find start date
	// var newDate=monthNumber+"/"+day+"/"+year+" "+res[4]+":00";
	// //alert(newDate);
	// return new Date(newDate).getTime();
}

function findEndTime(node) {
	// ISO 8601 update by Amon 2018-08
	return new Date(node.datelast).getTime();

	// var res = node.datelast.split(" "); 
	// //alert(day+"/"+monthNumber+"/"+year);
	// var monthNumber = monthtbl2[res[0]];
	// var day=res[1].substring(0, res[1].length - 1);
	// var year = res[2].substring(0, res[2].length - 1);

	// // find end date	
	// var newDate=monthNumber+"/"+day+"/"+year+" "+res[3]+":00";
	// return new Date(newDate).getTime(); 
}