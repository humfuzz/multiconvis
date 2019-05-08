/*Show list of conversations
 
 */
var datestrings = "";
var datelaststrings = "";
var datesEndinMS = [];
var first = 1;
var longDelay = 600;
var commentStart;
var commentEnd;
var totalComments = 0;
var currentConversation;
var hideiconover=false;
// toggle button for showing timeline
$(document).ready(function() {
    $("#timelinebutton").click(function(event) {
        showTimeLine();
        if (timelineFlag == false) {
            $(this).find('i').attr("color", 'red');
        }
        else {
            $(this).find('i').attr("color", 'black');
        }
    });

    $("#refreshbutton").click(function(event) {
        
        if (listFlag){
            logInteraction("Refresh,List");        
            document.location.reload(true);
        }
        else {
            commentStart = 0;
            commentEnd = numberOfCommentsTobeShown;
            updateConversationView(currentConversation, commentStart, commentEnd);
            logInteraction("Refresh,List");
        }
    });

    $("#logout").click(function() {
        var str = "logout";
        logInteraction(str);
        saveTree();
        setTimeout(function() {
            window.location.replace("form/choose_interface.php");
        }, 2000);

    });
    $("#conversation_down").click(function() {
        if (commentStart < totalComments - numberOfCommentsTobeShown) {
            commentStart += numberOfCommentsTobeShown;
            commentEnd += numberOfCommentsTobeShown;

            if (commentEnd >= totalComments - 1)
                commentEnd = totalComments - 1;
            $("#commentsFilter").css('opacity', '.5').html((commentStart + 1) + "-" + commentEnd)
                    .animate({opacity: 1}, 500);
            //console.log(commentStart+" "+commentEnd);                

            updateConversationView(currentConversation, commentStart, commentEnd);
        }
    });
    $("#conversation_up").click(function() {
        if (commentStart >= 1) {
            commentStart -= numberOfCommentsTobeShown;
            if (commentEnd == totalComments - 1)
                commentEnd = commentStart + numberOfCommentsTobeShown;
            else
                commentEnd -= numberOfCommentsTobeShown;
            $("#commentsFilter").css('opacity', '.5').html((commentStart + 1) + "-" + commentEnd)
                    .animate({opacity: 1}, 500);
            updateConversationView(currentConversation, commentStart, commentEnd);
        }

    });

});

//menu for sorting conversations	
$(document).ready(function() {
    $('.dropdown').click(function() {
        $('.dropdown-menu').slideToggle();
    });
});

$(document).ready(function() {
    $('#sortlist li a').click(
            function(e) {
                //alert($(this).attr('id'));
                for (var i = 0; i < conversationData.length; i++) {
                    var conversationUrl1 = conversationData[i].commentid.replace("http://www.semanticweb.org/ontologies/ConversationInstances.owl#article", "");
                    conversationUrl1 = conversationUrl1.replace("article"+dataset+"_", "");
                    conversationData[i].divhtml = $("#div" + conversationUrl1).html();
                }
                if ($(this).attr('id') == "total_comments") {
                    conversationData = sortDatabyNoOfComments(conversationData, "descending");
                }
                else if ($(this).attr('id') == "time") {
                    conversationData = sortDatabyTime(conversationData, "descending");
                }
                else if ($(this).attr('id') == "total_authors") {
                    conversationData = sortDatabyNoOfAuthors(conversationData, "descending");
                }
                else if ($(this).attr('id') == "Topics") {
                    conversationData = sortDatabyNoOfTopics(conversationData, "descending");
                }
                else if ($(this).attr('id') == "sentiment_score") {
                    conversationData = sortDatabySentiment(conversationData, "descending");
                }        
                $('#sortlist li').each(function(d){
                    $(this).css("border-bottom", "0px");                         
                }); 
                 $(this).parent().css("border-bottom", "3px solid #DD4B39");  
                 
                nodesTopicTree.forEach(function(n, i) {
                            n.firstConversation=findFirstCommentofATopicNode(n);
                });
                
                removeandUpdateSortResults(conversationData);
                e.preventDefault(); // prevent the default action
                e.stopPropagation; // stop the click from bubbling
                $(this).closest('ul').find('.selected').removeClass('selected');
                $(this).parent().addClass('selected');
                logInteraction("Sort conversation,"+$(this).text());        
                
            });
                

});

$(document).ready(function() {
    $("#listmode").click(function(event) {
        logInteraction("Listmode Click");
        //$("#chart").hide(500);
        $("#thread_label").hide(100);        
        $("#single_conversation").hide(200);
        // $('#visall').attr('width', widthTopicTree);
        $('#visall').animate({width: widthTopicTree}, longDelay, function() {

        });
        vis.selectAll(".linktopics").remove();
        if (circle)
            circle.remove();
        $("#sortbutton").show(0);
        $("#sortlist").show(0);   
        $("#conversation_counter").show(0); 
        
        $("#listmode").hide(500);
        $("#comments_counter").hide(500);
        $("#overview").show(500);
        $("#overview_header").show(500);
        
        $("#monthly-volume-chart").show(500);
        $("#timelinebutton").show(500);
        $("#conversation_count").show(0);        
        listFlag = true;

        //vis.remove();
        //updateTopicTree(topicRoot);
    });
});

function findMax(datesEndinMS) {
    return Math.max.apply(Math, datesEndinMS);
}

function parseConversationList(nodes) { // takes a nodes array and turns it into a <ol>
    var ol = document.createElement("ul");
    ol.setAttribute('id', 'conversations');
    // show top 50 conversations
    for (var i = 0; i < nodes.length; i++) {
        ol.appendChild(parseConversation(nodes[i]));
    }
    //alert(datestrings);
    //alert(datelaststrings);
    var max = findMax(datesEndinMS);
    //alert(max);
    return ol;
}

function parseConversation(node) { // takes a node object and turns it into a <li>
  
    // var res = node.date.split(" ");
    // var day = res[2].substring(0, res[2].length - 1);
    // var year = res[3];
    
    // find start date
    // var showDate = res[1].substring (0,3) + " " + day + "," + year;
    
    // ISO 8601 update, changed sentimentbar to just use node.date and node.datelast
    

    //alert(newDate);
    var dateStart = findStartTime(node);
    datestrings += node.title + "," + dateStart + ",";
    dateEnd = findEndTime(node);
    datestrings += dateEnd + ",";
    datesEndinMS.push(dateEnd);


    // Convert back to days and return
    var one_day = 1000 * 60 * 60 * 24;
    var durationInDays = Math.round((dateEnd - dateStart) / one_day);
    datestrings += durationInDays + "\n";

    //alert(year);
    var divConversation = document.createElement("li");

    divConversation.setAttribute('class', 'conversationitem');
    var conversationUrl = node.commentid.replace("http://www.semanticweb.org/ontologies/ConversationInstances.owl#article", "");
    conversationUrl = conversationUrl.replace("article"+dataset+"_", "");
    divConversation.setAttribute('id', conversationUrl);
    var sentimentbar = "\n<table id=\"tab\"" + "" + " border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr cellspacing=\"0\">";


    sentimentbar +=
            '<td class="column_glyph">' +
            "<div class=\"conversationglyph\"" + "id=\"glyph" + conversationUrl +
            "\" style=\"border:" + "0px;\">" + "</div>" +
            "</td>";

    createConversationglyphData(node, "#glyph" + conversationUrl);

    try{
    sentimentbar += "<td  valign=\"top\" style=\" font-size:13px;\">" +
            '<a class="title">' + node.title + "</a>" +
            node.article[0].sent +
            "</td>"+
             '<td valign="top"><div '+' title="hide" id=\"min'+conversationUrl+
            "\"onclick=\"hideIconMouseClick(" + conversationUrl + ")\" " + "style=\"display: none;\"" + 
            " onmouseover=\"hideIconMouseOver(" + conversationUrl + ")\"" +                        
            " onmouseout=\"hideIconMouseOut(" + conversationUrl + ")\"" +    
             '"\><i class="fa fa-minus-square-o"></i></div></td>'+   
            "</tr><tr>" +
            '<td></td><td style=\"color: #736F6E; font-size:12px;\">'
            + "<div "+ "id=\"line" + conversationUrl +"\">"+'<i class="fa fa-comments-o"></i> '
    
            +node.totalcomments + " comments " +'<i class="fa fa-calendar"></i> ' + node.date +'</div><div><i class="fa fa-calendar"></i>'+
            + node.datelast+'</div></td><td>'
            +'</td></tr>';
    sentimentbar += "</table>";

    }
    catch(err){
        console.log("error caught in generating sentiment bar in overview.js")
        console.log(err)
        alert(node.title+node.filename);
    }
    var text = "<tr><td><div class=\"conversationitem\"" + "id=\"div" + conversationUrl +
            "\"onmouseover=\"conversationMouseOver(" + conversationUrl + ")\"" +
            " onmouseout=\"conversationMouseOut(" + conversationUrl + ")\"" +
            " onclick=\"conversationMouseClick(" + conversationUrl + ")\" >" +
            sentimentbar +
            "</div></td></tr>";
    //alert(text);

    divConversation.innerHTML = text;

    if (node.children)
        divConversation.appendChild(parseConversationList(node.children));
    return divConversation;
}
function loadConversationList() {
    //alert('data/collection'+dataset+'.json');
    $.getJSON("data/"+dataset+"/"+'collection'+dataset+'.json', function(data) {
        loadConversationglyphData(data,false);
        //loadConversationglyphData(data,true);
        conversationData = data;
        conversationData = sortDatabyTime(conversationData, "descending");
        //conversationData=sortDatabyNoOfComments(data, "descending");

        listOfConversations = parseConversationList(conversationData);
        //alert(data.length);
        document.getElementById("overview").appendChild(listOfConversations);        
        $("#conversation_count").html(data.length + " conversations");
        

    });
}

//TODO: async problem: need efficient way to load info
function loadConversationglyphData(data, generatetopics) {
    var collectiontopics=[];
    //alert(JSON.stringify(data));
    for (i = 0; i < data.length; i++) {         
        data[i].commentid = data[i].commentid.replace("http://www.semanticweb.org/ontologies/ConversationInstances.owl#", "");
        data[i].ishidden=false;
//        console.log("data/" + data[i].filename + ".json");
        $.ajax({
            url: "data/"+dataset+"/"   + data[i].filename + ".json",
            async: false,
            dataType: 'json',
            
            success: function(response) {
                data[i].totalTopics = response.totalTopics;
                data[i].totalLines = response.totalLines;
                data[i].topics = response.topics;
                data[i].totalAuthors = response.totalAuthors;

                //data[i].topicsentiments = response.topicsentiments;
                data[i].article = response.sent;
                //alert(response.topicsentiments);
                if(generatetopics){
                for(var j=0;j<response.topics.length;j++){
                    response.topics[j].topicID=data[i].filename+":"+response.topics[j].topicID;                    
                }                
                collectiontopics.push({topicID:""+i, labels:response.topics[0].labels,children: response.topics});
                }
            }
        });
    }
    if(generatetopics)
        console.log(JSON.stringify(collectiontopics));    
    //alert(data.length);
    //for (i = 0; i < data.length; i++) {
    //	alert(data[i].filename+" "+JSON.stringify(data[i].totalLines));		
    //}
    minVal = 9999;
    maxVal = -9999;
    for (j = 0; j < data.length; j++) {
        var currentLength = parseInt(data[j].totalcomments);
        if (currentLength < minVal) {
            minVal = data[j].totalcomments;
        }
        if (currentLength > maxVal)
            maxVal = data[j].totalcomments;
    }
}
function createConversationLineGraph(divID){


/*                .title(function(d) {
            //var value = d.value.avg ? d.value.avg : d.value;
            var value = d;
            if (isNaN(value)) {
                value = 0;
            }
            return dateFormat(d.key) + '\n' + numberFormat(d.value);
        });    */
    
}
function createConversationglyphData(node, divID) {
    //alert(JSON.stringify(d));
    setTimeout(function() {
        var w = 600;
        var h = 60;
        var barxPadding = 60;
        var barWidth = 75;
        var barHeight=20;
        var glyph = d3.select(divID).append("svg:svg")
                .attr("width", w)
                .attr("height", h)
                .append("svg:g");

        colorBins = findColor(node, 1);
        
        var height = findHeight(node);
        for (var i = 0; i < 5; i++) {
            //alert(JSON.stringify(node));
            node.avgsentiment+=colorBins[j]/5;
            glyph.append("a")
                    .attr("xlink:href", function() {
                return "#" + node.commentid;
            })
                    .append("svg:rect")
                    .attr("y", function(d) {
                return (h-height)/2;
            })
                    .attr("x", function() {
                var xValue = barxPadding;
                for (var j = 0; j < i; j++) {
                    xValue += barWidth * colorBins[j];
                }
                return xValue;
            })
                    .attr("commentid", function() {
                //alert(d.commentid);
                return node.commentid;
            })
                    .attr("height", height)
                    .attr("width", function() {
                return barWidth * colorBins[i];
            })
                    .style("fill", "rgb(" + sentimentColors[5 - i - 1] + ")");
            //.on("click", click)
            //.on("mouseover", mouseover)
            //.on("mouseout", mouseout);

        }
        
        var normalizedAuthorCount = findNormalizedAuthorCount(conversationData, node);
        var normalizedTopicCount = findNormalizedTopicCount(conversationData, node);        

            glyph.append("a")   
                    .append("svg:rect")
                    .attr("y", function(d) {
                return (h-height) / 2+(height/2-barHeight/2);
            })
                    .attr("x", function() {
                var xValue = barxPadding;
                return xValue- normalizedTopicCount*50-10;
            })
                    .attr("height", barHeight)
                    .attr("width", function() {
                return normalizedTopicCount*50+2;
            })
                    .style("fill", topicColor)
                    .style("opacity", 0.3);
            
            glyph.append("text")
                    .attr("x", function(d) {
                var xValue = barxPadding;
                return xValue-20;
            })
                    .attr("y", function(d) {
                return (h-height) / 2+(height/2-barHeight/2)+15;
            })
                    .text(node.topics.length);
            
            glyph.append("a")   
                    .append("svg:rect")
                    .attr("y", function(d) {
                return (h-height) / 2+(height/2-barHeight/2);
            })
                    .attr("x", function() {
                var xValue = barxPadding+barWidth+10;
                return xValue;
            })
                    .attr("height", barHeight)
                    .attr("width", function() {
                return normalizedAuthorCount*50+2;
            })
                    .style("fill", authorColor)
                    .style("opacity", 0.3);

            glyph.append("text")
                    .attr("x", function(d) {
                var xValue = barxPadding+barWidth+10;
                return xValue;
            })
                    .attr("y", function(d) {
                return (h-height) / 2+(height/2-barHeight/2)+15;
            })
                    .text(node.totalAuthors);                    
        /*var normalizedTopicRad;
        if(node.topics.length<8) normalizedTopicRad=h / 3;
        else if(node.topics.length<6) normalizedTopicRad=h / 4;
        else normalizedTopicRad=h/2;
        createHalfCircle(glyph, normalizedTopicRad,h / 2, 1, 0, -1, topicColor, node.topics.length);
        var authorCountRad=normalizedAuthorCount* h / 2;
        if(authorCountRad<15) authorCountRad+=15;
        createHalfCircle(glyph,authorCountRad, h / 2,barWidth+5, 0, 1, authorColor, node.totalAuthors);*/
        //glyph, radius1, xPadding, yPadding, direction, color, text
    }, 0);
}

function findNormalizedAuthorCount(data2, d) {

    var minVal = 99999999999, maxVal2 = -9999;
    for (var j = 0; j < data2.length; j++) {
        var currentLength = parseInt(data2[j].totalAuthors);

        if (currentLength < minVal) {
            minVal = currentLength;
        }
        if (currentLength > maxVal2) {
            maxVal2 = currentLength;
        }
        //alert("yes"+currentLength+","+minVal+","+maxVal2);
    }
//    alert("yes "+minVal+","+maxVal);
    var normalizedLength = ((d.totalAuthors - minVal) / maxVal2);
    //alert(normalizedLength);    
    return normalizedLength;

}

function findNormalizedTopicCount(data2, d) {
    var minVal = 99999999999, maxVal2 = -9999;
    for (var j = 0; j < data2.length; j++) {
        var currentLength = parseInt(data2[j].topics.length);

        if (currentLength < minVal) {
            minVal = currentLength;
        }
        if (currentLength > maxVal2) {
            maxVal2 = currentLength;
        }
        //alert("yes"+currentLength+","+minVal+","+maxVal2);
    }
//    alert("yes "+minVal+","+maxVal);
    var normalizedLength = ((d.topics.length - minVal) / maxVal2);
    //alert(normalizedLength);    
    return normalizedLength;
}
//radius,
// xPadding=horizontal starting point
// yPadding=vertical starting point
// direction right=1,left=-1
function createHalfCircle(glyph, radius,radius1, xPadding, yPadding, direction, color, text) {
    var radians = direction * Math.PI;
    // to make full circle: radians = 2 * Math.PI;

    var dimension = (2 * radius) + (2 * xPadding),
            points = 50;

    var angle = d3.scale.linear()
            .domain([0, points - 1])
            .range([0, radians]);

    var line = d3.svg.line.radial()
            .interpolate("basis")
            .tension(0)
            .radius(radius)
            .angle(function(d, i) {
        return angle(i);
    });

    //var halfCircleGlyph = glyph.append("svg")
    //	.attr("width", dimension)
    //	.attr("height", dimension)
    //.append("g");



    glyph.append("path").datum(d3.range(points))
            //.attr("class", "line")
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("opacity", 0.5)
            .attr("transform", "translate(" + (radius1 + xPadding) + ", " + (radius1 + yPadding) + ")")
    glyph.append("text")
            .attr("x", function(d) {
        return xPadding + (direction == -1 ? 14 : radius1)
    })
            .attr("y", radius1+2)
            .text(text);
    glyph.append("svg:line")
            .attr("stroke", color)
            .attr("x1", radius1 + xPadding)
            .attr("x2", radius1 + xPadding)
            .attr("y1", 60/2-radius)
            .attr("y2", (60/2+radius))
            .attr("opacity", 0.5);
}
function findHeight(node) {
    var normalizedLength = ((parseInt(node.totalcomments) - minVal) / maxVal) * 50 + 10;
    //alert(normalizedLength);
    //findDurationofAConversation(d);
//	alert(normalizedLength);
    return normalizedLength;
}

function hideIconMouseOver(conversationid) {
 hideiconover=true;
    
}
function hideIconMouseOut(conversationid) {
 hideiconover=false;
    
}

function hideIconMouseClick(conversationid) {
    $("#" + conversationid).hide(400);
    if(count >1)
        $("#conversation_count").html(count + " conversations");
    else if(count==1)
        $("#conversation_count").html(count + " conversation");
    
}
function conversationMouseOver(conversationid) {
    logInteraction("Hover conversation,"+conversationid);        
    //$("#div" + conversationid).css("background", "#F5F8FA");
    $("#div" + conversationid).css("background", "rgb(228,236,241)");
    
     $("#min"+conversationid).show();    
//    $("#div" + conversationid).css("border-bottom", "2px solid steelblue");
    var topicList = findAlltopicNodesofAConversation(conversationid);
    highlightTopicsbyConversation(topicList);
}

function conversationMouseOut(conversationid) {
    //alert(conversationid);
    $("#div" + conversationid).css("background", "white");
     $("#min"+conversationid).hide();    
    
//    $("#div" + conversationid).css("border-bottom", "2px solid white");
    undoHghlightTopicsbyConversation(conversationid);
}

function conversationMouseClick(conversationid) {
    if(hideiconover==false){
    logInteraction("Click conversation,"+conversationid);            
    //$('#visall').attr('width', w);
        $("#conversation_count").hide(100);        
        $("#monthly-volume-chart").hide(100);
        $("#sortbutton").hide(100);
        $("#sortlist").hide(100);
        $("#conversation_counter").hide(100);
        
        $("#timelinebutton").hide(100);
        $("#thread_label").show(100);
                
    $('#visall').animate({width: w}, longDelay, function() {
        //$("#div" + conversationid+" a").css("color", "red");
        listFlag = false;

        $("#overview").hide(0);
        $("#overview_header").hide(0);
        
        $("#single_conversation").show(0);
        $("#chart").show(500);
        $("#listmode").show(0);
        $("#comments_counter").show(500);
        for (var i = 0; i < conversationData.length; i++) {
            var currentid = conversationData[i].filename.replace(dataset+"_", "")
            if (conversationid.toString() == currentid) {
                commentStart = 0;
             
                totalComments = conversationData[i].totalcomments;
                commentEnd = numberOfCommentsTobeShown;                
                if (commentEnd > totalComments - 1)
                    commentEnd = totalComments - 1;                   
                $("#commentsFilter").html((commentStart + 1) + "  -" + commentEnd);
                currentConversation = conversationData[i];
                updateConversationView(conversationData[i], commentStart, commentEnd);
                break;
            }

        }
    });
    }
}

function removeandUpdateSortResults(conversationData) {
    //		$('#conversations').empty();
    $("#conversations li").each(function(index) {
//alert( index + ": " + $( this ).html() );
//alert("yes");
        var id = $(this).attr('id');
        var conversationUrl = conversationData[index].commentid.replace("http://www.semanticweb.org/ontologies/ConversationInstances.owl#article", "");
        conversationUrl = conversationUrl.replace("article"+dataset+"_", "");
        $("#div" + conversationUrl).fadeOut('fast', function() {
            $("#" + id).html("<div class=\"conversationitem\"" + "id=\"div" + conversationUrl +
                    "\"onmouseover=\"conversationMouseOver(" + conversationUrl + ")\"" +
                    " onmouseout=\"conversationMouseOut(" + conversationUrl + ")\"" +
                    " onclick=\"conversationMouseClick(" + conversationUrl + ")\" " +
                    +"\" style=\"border:" + "0px;\">" +
                    conversationData[index].divhtml + "</div>");
        });


        /*id=JSON.stringify(id.replace("article"+dataset+"_",""));
         
         id=id.replace("\"","");
         id=id.replace("\"","");
         
         $("#div"+id).swap({
         
         target: "div"+$("#div"+conversationUrl),
         opacity: "0.5",
         speed: 1000,
         callback: function() {
         alert("Swap Complete");
         }
         });*/


    });
}
function sortAnimate(conversationData) {
    //conversationData=sortDatabyPo	sition(conversationData, "descending");					
    var nextReplaceDivIndex = 0;
    for (var i = 0; i < conversationData.length; i++) {
        //if(conversationData[i].currentposition!=conversationData[i].newposition){
        for (var k = 0; k < conversationData.length; k++) {
            if (nextReplaceDivIndex == conversationData[k].currentposition)
                break;
        }

        var node1 = conversationData[k];
        var node2 = conversationData[conversationData[i].newposition]
        var conversationUrl1 = node1.commentid.replace("http://www.semanticweb.org/ontologies/ConversationInstances.owl#article", "");
        conversationUrl1 = conversationUrl1.replace("article"+dataset+"_", "");
        alert(conversationData[k].currentposition + " k:" + k + " " + node1.totalcomments + " " + node1.commentid);
        var conversationUrl2 = node2.commentid.replace("http://www.semanticweb.org/ontologies/ConversationInstances.owl#article", "");
        conversationUrl2 = conversationUrl2.replace("article"+dataset+"_", "");
        //alert(conversationUrl1+" , "+conversationUrl2);		
        /*$("#div"+conversationUrl1).swap({
         
         target: "div"+conversationUrl2,
         opacity: "0.5",
         speed: 1000,
         callback: function() {
         alert("Swap Complete");
         }
         });		*/
        //alert(conversationData[i].currentposition);
        //alert(conversationUrl1+":"+node1.totalcomments+" "+conversationUrl2+":"+node2.totalcomments);

        $("#div" + conversationUrl1).removeAttr('style');
        $("#div" + conversationUrl2).removeAttr('style');
        var tmp = $("#div" + conversationUrl1).html();
        //alert(node2.totalcomments+" "+node2.divhtml);
        $("#div" + conversationUrl1).empty().append(node2.divhtml);
        $("#div" + conversationUrl2).empty().append(tmp);

        //}	//end of if
        nextReplaceDivIndex++;
    }
}