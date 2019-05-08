var first = 1;
//obama: article1236551
//filename="article09_05_28_1952214";
	var monthtbl = { 'January': 1, 'February': 2, 'March': 3, 'April': 4,'May':5, 'June':6,'July':7,'August': 8, 'September':9, 'October':10,
	'November':11, 'December': 12 };
	var monthtbl2 = { 'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4,'May':5, 'Jun':6,'Jul':7,'Aug': 8, 'Sep':9, 'Oct':10,
	'Nov':11, 'Dec': 12 };	
var timestamps =[];
var QueryString = function() {
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

filename = QueryString;
jsonFileMainView = "data/"+dataset+"/"+"/" + filename + ".json";
//  jsonFileMainView=filename+".json";
revisedTopicFile = filename + "_rev.json";
//alert(jsonFileMainView);
var commentCount=0;

function parseNodes(nodes) { // takes a nodes array and turns it into a <ol>

    var ol = document.createElement("ul");
    if (first == 1)
    {
        first = 0;
    }
    else {
        ol.setAttribute('class', 'children');
    }
    //ol.setAttribute('id', 'comments');
    //alert("Creating OL"+nodes.length);
    for (var i = 0; i < nodes.length; i++) {
        //alert("length"+nodes.length);
        if(commentCount<numberOfCommentsTobeShown) 
            ol.appendChild(parseNode(nodes[i]));
    }

    return ol;
}
var first=1;
function parseNode(node) { // takes a node object and turns it into a <li>
	// var res = node.date.split(" "); 
	//alert(timestamps.length);
	jsonObj[0].domain="macrumors";
	
	if(jsonObj[0].domain=="macrumors"){
		if(first==0)
		{
            // TODO
            timestamps.push(node.date); //new Date(node.date)?

			// var monthNumber = monthtbl2[res[0]];
			// var day=res[1].substring(0, res[1].length - 1);
			// var year = res[2].substring(0, res[2].length - 1);
		
			// // find end date	
			// var newDate=monthNumber+"/"+day+"/"+year+" "+res[3]+":00";
			// var dateEnd=new Date(newDate).getTime();
			// //timestamps.push(dateEnd);
			// timestamps.push(monthNumber+"/"+day+"/"+year);
			// //alert(node.date+" "+dateEnd);
		}
		if(first==1)
			first =0;
	}
    var li = document.createElement("LI");
    li.setAttribute('id', node.commentid);
    var sentences = "";
	for (var i = 0; i < node.sent.length; i++) {
        //alert("length"+node.sent.length);
        sentences += node.sent[i].sent + " ";
    }		
	
    if(jsonObj[0].domain=="macrumors"){
		sentences=node.htmltext;
                sentences=sentences.replace('<div class="smallfont" style="margin-bottom:2px">Quote:</div>','');
	}

    //if (filename.indexOf("_")>=0)
    //    jsonObj[0].domain = "slashdot";
    //else
    //    jsonObj[0].domain = "dailykos";
        
    if (jsonObj[0].domain == "slashdot") {
        //alert("yes");
        var date = new Date(parseInt(node.date));
        // hours part from the timestamp
        var day = date.getDate();
        var year = date.getFullYear();
        var hours = date.getHours();
        // minutes part from the timestamp
        var minutes = date.getMinutes();
        // seconds part from the timestamp
        var seconds = date.getSeconds();
        var curr_month = date.getMonth() + 1; //Months are zero based		
        node.date = "on " + day + "-" + curr_month + "-" + year + " at " + hours + ':' + minutes + ':' + seconds + " ";
        //alert(node.date);
    }
	var title="";
	if(node.title)
		title="<a class=\"link-title\" href=\"#" + node.parent + "\">" + node.title + ":</a>";
		//alert(node.uid);
    var aid="icons/gravatar.gif";			

	node.commentid=node.commentid.replace("http://www.semanticweb.org/ontologies/ConversationInstances.owl#","");	
	node.commentid=node.commentid.replace("comment","");	
	node.commentid=node.commentid.replace("article","");	
	node.commentid=node.commentid.replace(dataset+"_","");	
	node.commentid=node.commentid.replace(".","");	
        
        //hacking to resolve hovering first comment....
        var divid="id=\"div" + node.commentid;
        if(node.commentid=="1")divid="\"div" +"a";
	
    var text = "<div class=\"comment\"" + divid + "\"onmouseover=\"commentMouseOver(" + node.commentid + ")\"" +
            " onmouseout=\"commentMouseOut(" + node.commentid + ")\"" +
            " onclick=\"commentMouseClick(" + node.commentid + ")\" style=\"border:" + "0px;\">" +
            "<div class=\"comment-author\"><img src=\""+
			aid
			+"\" /><a href=\"/\"  style=\"color: rgb(152, 78, 163)\">" +
            node.author + "</a>" +
            drawSentimentbar(node) +
            "</div><div class=\"comment-body\"" + "id=\"comment" + node.commentid + "\"><p>" +
            //title + " " +
            sentences +
            "</p>" +
            "</div>" +
            "<p style=\"color: grey; font-size:12px;\">" + node.date + "</br></p>" +
            "</div>";

    li.innerHTML = text;
    //	li.className = node.class;
    commentCount=commentCount+1;
    if(commentCount<numberOfCommentsTobeShown)  
        if (node.children){
            li.appendChild(parseNodes(node.children));
            }
    return li;
}

function drawSentimentbar(node) {
    colorBins = findColor(node);
    var totalWidth = 60;
    var sentimentbar = "<table border=\"1\" cellpadding=\"0\"><tr style=\"height:" + findCommentHeight(node) + "px;\">";
    if (colorBins[0] > 0)
        sentimentbar += "<td style=\"background-color:" + "rgb(" + sentimentColors[4] + ")" + ";\" width=\"" + colorBins[0] * totalWidth + "px;\"></td>";
    if (colorBins[1] > 0)
        sentimentbar += "<td style=\"background-color:" + "rgb(" + sentimentColors[3] + ")" + ";\" width=\"" + colorBins[1] * totalWidth + "px;\"></td>";
    if (colorBins[2] > 0)
        sentimentbar += "<td style=\"background-color:" + "rgb(" + sentimentColors[2] + ")" + ";\" width=\"" + colorBins[2] * totalWidth + "px;\"></td>";
    if (colorBins[3] > 0)
        sentimentbar += "<td style=\"background-color:" + "rgb(" + sentimentColors[1] + ")" + ";\" width=\"" + colorBins[3] * totalWidth + "px;\"></td>";
    if (colorBins[4] > 0)
        sentimentbar += "<td style=\"background-color:" + "rgb(" + sentimentColors[0] + ")" + ";\" width=\"" + colorBins[4] * totalWidth + "px;\"></td>";
    sentimentbar += "</tr></table>";
    return sentimentbar;
}

function drawSentimentLegend() {
    var totalWidth = 100;
    var polaritywidth = (0.2) * totalWidth;
    var sentimentbar = "<table border=\"0\" cellpadding=\"2\"><tr style=\"height:5px;width:100px\">";
    sentimentbar += "<td></td><td></td><td></td><td></td><td></td><td><td></td> </td><td> </td><td> </td><td> </td> <td>            </td><td align=right><font size=\"2\">      Highly Negative</font> </td>";
    sentimentbar += "<td style=\"background-color:" + "rgb(" + sentimentColors[4] + ")" + ";\" width=\"" + polaritywidth + "px; \"></td>";
    sentimentbar += "<td style=\"background-color:" + "rgb(" + sentimentColors[3] + ")" + ";\" width=\"" + polaritywidth + "px;\"></td>";
    sentimentbar += "<td style=\"background-color:" + "rgb(" + sentimentColors[2] + ")" + ";\" width=\"" + polaritywidth + "px;\"></td>";
    sentimentbar += "<td style=\"background-color:" + "rgb(" + sentimentColors[1] + ")" + ";\" width=\"" + polaritywidth + "px;\"></td>";
    sentimentbar += "<td style=\"background-color:" + "rgb(" + sentimentColors[0] + ")" + ";\" width=\"" + polaritywidth + "px;\"></td>";
    sentimentbar += "<td><font size=\"2\">Highly Positive</font> </td>";
    sentimentbar += "</tr></table>";

    return sentimentbar;
}

function commentMouseOver(commentid) {    
    if(commentid=='undefined') commentid="a";
    console.log(commentid); 
    $("#div" + commentid).css("border-top", "2px solid");
    $("#div" + commentid).css("border-bottom", "2px solid");
    var node;
    //alert(nodes[1].commentid);
    for (i = 0; i < nodes.length; i++) {
        if (nodes[i].commentid == commentid) {
            node = nodes[i];
            break;
        }
//        if (nodes[i].commentid == "1"){
//            nodes[i].commentid = "a";
//            node = nodes[i];
//            alert();
//            break;
//        }
    }
    if(i==nodes.length) node=nodes[0];
    logInteraction("CommentMouseOver" + "," + node.commentid + "\n");
    drawLineMouseOver(node);
    /*nodeEnter.transition()
     .duration(0)
     .selectAll("rect")
     .style("stroke-width",function(s,i){			
     //alert("yes");
     var stroke="0.15px";
     if(commentid==s.commentid){
     stroke="2px";
     //alert("yes"+$("#div"+s.commentid).attr('style'));
     if($("#div"+s.commentid).attr('style').indexOf("rgb")==-1){
     
     }
     }
     else if(s.clickstate=="1") {stroke="2px";}
     return stroke;
     });
     */
    commentsList = [];
    commentsList.push(node.commentid);
    //a();
    //alert(commentsList.length);
    highlightAuthorsbytopic("dummy");
    highlightAuthorsLinks();
    highlightTopicsbyAuthor(node.author);
    highlightTopicLinks();

}

function commentMouseOut(commentid) {
    //alert(commentid);
    logInteraction("CommentMouseOut" + "," + commentid + "\n");

    vis.selectAll("line").remove();
    $("#div" + commentid).css("border-top", "0px solid");
    $("#div" + commentid).css("border-bottom", "0px solid");
    var nodeMouseOut;
    for (i = 0; i < nodes.length; i++) {
        if (nodes[i].commentid == commentid) {
            nodeMouseOut = nodes[i];
            break;
        }
    }
    if(i==nodes.length) nodeMouseOut=nodes[0];
    //undoHighlightTopicLinks();	
    //undoHighlightAuthorsLinks();	
    undoHighlightCommentsbyAuthor(nodeMouseOut.author);
    //if($("#div"+commentid).attr('style').indexOf("rgb")==-1)




    /*nodeEnter.transition()
     .duration(0)
     .selectAll("rect")
     .style("stroke-width",function(s,i){
     
     var stroke="0.15px";
     if(s.clickstate=="1") {
     stroke="2px";
     $("#div"+s.commentid).css("border", "2px solid");
     }
     return stroke;
     });		*/
}

function commentMouseClick(commentid) {

    var node;
    for (i = 0; i < nodes.length; i++) {
        if (nodes[i].commentid == commentid) {
            node = nodes[i];
            if (nodes[i].clickcomment == "1")
                nodes[i].clickcomment = "0";
            else
                nodes[i].clickcomment = "1";
            break;
        }
    }
    if(i==nodes.length) node=nodes[0];
    nodeEnter.transition()
            .duration(0)
            .selectAll("rect")
            .style("stroke-width", function(s, i) {
                var stroke = "0.15px";
                if (commentid == s.commentid) {
                    if (s.clickcomment == "0") {
                        stroke = "0.15px";
                        //$("#div"+commentid).css("border", "0px solid");						

                        /*$("#comment" + node.commentid).html("<p>" +
                         "<a href=\"#" + node.parent + "\">" + node.title + ":</a>" + " " +
                         node.sentences +
                         "</p>");*/
                        //$("#div"+commentid).css("border", "0px solid");	
                    }
                    else {
                        //stroke="2px";
                        //s.clickstate="1";
                        $("#div" + commentid).css("border-top", "2px solid");
                        $("#div" + commentid).css("border-bottom", "2px solid");

                        $("#comment" + node.commentid).html(node.colorText);
                        logInteraction("CommentMouseClick" + "," + node.commentid + "\n");
                    }
                }
                //else if(s.clickstate=="1") {stroke="2px";}

                return stroke;
            });
}
function loadCommentView(fileName){	
            /*			$.ajax({
                                      url: jsonFileMainView,
                                      async: true,
                                      dataType: 'json',
                                      success: function (data) {
                                      alert("loadcommentview");
            data = "[" + JSON.stringify(data) + "]"; //add damm bracket
            jsonObj = JSON.parse(data);		// get back to json object again		 

            da = parseNodes(jsonObj);
            var timestampstext="";

            for (var i = 0; i < timestamps.length; i++) {
                    //alert("length"+nodes.length);
                    timestampstext+=timestamps[i]+"\n";

            }	
            alert(timestampstext);	
            document.getElementById("content").appendChild(da);

            var legendDiv = document.getElementById("sentiment_legend");
            var legendHT
            ML = drawSentimentLegend();
            //alert(legendHTML);
            legendDiv.innerHTML = drawSentimentLegend();

                                      }
                                    });		*/
        commentCount=0;
	$.getJSON(fileName, function(data) {
				
		data = "[" + JSON.stringify(data) + "]"; //add damm bracket
		jsonObj = JSON.parse(data);		// get back to json object again		 
		
		da = parseNodes(jsonObj);
		var timestampstext="";
		
		for (var i = 0; i < timestamps.length; i++) {
			//alert("length"+nodes.length);
			timestampstext+=timestamps[i]+"\n";
		}	
                ;
            //alert(timestampstext);	
                $("#content").html('');
		document.getElementById("content").appendChild(da);
		 
		 //$("#content").html(da);

		//alert("loaded");
		/*var legendDiv = document.getElementById("sentiment_legend");
		var legendHTML = drawSentimentLegend();
		//alert(legendHTML);
                
                if(legendHTML!=null)
                    legendDiv.innerHTML = legendHTML;*/
	});

	$(window).load(function() {
                alert("y");
		$('#comments').collapsible({xoffset: '-20', yoffset: '30', defaulthide: false, imagehide: 'arrow-down.png', imageshow: 'arrow-right.png'});
	});
 }