var QueryString = function () {
    var query_string = {};
    var query = window.location.search.substring(1);
    //alert(query);
    var vars = query.split("&");

    var pair = vars[0].split("=");
    if (vars.length > 1) {
        username = vars[1].split("=")[1];
        // Store
        if (username != '') {
            localStorage.setItem("username", username);
        }
    }
    if (vars.length > 2) {
        interfaceName = vars[2].split("=")[1];
    }
    return pair[1];
}();
// var dataset='fhawejf';
if (QueryString)
    var dataset = QueryString;
localStorage.setItem("dataset", dataset);

//var dataset="ipad";
var collectionMode = false;
var updateTopicFlag = true;
var timelineFlag = false;
var listFlag = true;
var lastScrollTop = 0;
filename = "";
var currentConversationid = "";

$("#chart").show(500);
loadConversationList();
$('#visall').attr('width', widthTopicTree);
//alert(interfaceName);

interfaceName = "MultiConVis";
if (interfaceName == 2)
    interfaceName = "MultiConVisIT";
localStorage.setItem("interfaceName", interfaceName);

//purple- orange
sentimentColors = [
    "230, 97, 1",
    "253, 184, 99",
    "240, 240, 240",
    //"178, 171, 210",
    "170, 163, 205",
    //"94, 60, 153"
    "125,87,189"
];

topicColor = "rgb(0, 71, 157)";
authorColor = "rgb(152, 78, 163)";
topicClickColor = "rgb(179,200,226)";
authorClickColor = "rgb(224,202,227)";

topichoverOpacity = 0.3;
var margin = { top: 30, right: 20, bottom: 30, left: 20 };
//indented vs semi-circular
var semiCircular = 1;

var w = 1380,
    totalThreadheight = 950,
    h = 950,
    commentNodeCounter = 0,
    barHeight = 0,
    barWidth = w * .15,
    duration = 800,
    durationMedium = 2000,
    root,
    minimumbarHeight = 7,
    maximumbarHeight = 16;
var widthTopicTree = 500;
var arcRad = 250, arcCx = barWidth / 2, arcCy = 200, angleInDegrees = 15;
var radius = 5, gap = 50;
var indentation = 150;
var spaceforFacetSelector = 7;
var verticalGapBetweenConversations = 0;
var tree = d3.layout.tree()
    .size([h, indentation]);

var TopicIndentation = 60;
var topicTree = d3.layout.tree()
    .size([h, TopicIndentation]);
var topicRoot;
var nodesTopicTree;
var textAuthor = null;
var textTopics = null;
var circle = null;

var diagonal = d3.svg.diagonal()
    .projection(function (d) {
        return [d.y, d.x];
    });

var topicDiagonal = d3.svg.diagonal()
    .projection(function (d) {
        return [d.y, d.x];
    });

var vis = null;
if (listFlag)
    vis = d3.select("#chart").append("svg:svg")
        .attr("overflow", "auto")
        .attr('id', "visall")
        .attr("width", widthTopicTree)
        .attr("height", h)
        .append("svg:g")
        .attr("transform", "translate(800,0)");

d3.json("data/" + dataset + "/" + "topicHierarchy_" + dataset + ".json", function (json) {


    json.x0 = 0;
    json.y0 = 0;
    //sortDatabyTime(json);

    nodesTopicTree = topicTree.nodes(topicRoot = json);


    //nodesTopicTree.
    //updateTopicLabelsFromConversation();
    console.log(nodesTopicTree.length);
    console.log(topicRoot.children);
    topicRoot.children = topicRoot; // looking for a parent topic so just make it itself. that way no file changes needed

    for (var i = 0; i < topicRoot.children.length; i++) {
        topicRoot.children[i].sentiments = new Array();
        topicRoot.children[i].sentiments[0] = 0;
        topicRoot.children[i].sentiments[1] = 0;
        topicRoot.children[i].sentiments[2] = 0;
        topicRoot.children[i].sentiments[3] = 0;
        topicRoot.children[i].sentiments[4] = 0;
        topicRoot.children[i].parent = topicRoot;
        if (topicRoot.children[i].children) {
            for (var j = 0; j < topicRoot.children[i].children.length; j++) {
                topicRoot.children[i].children[j].parent = topicRoot.children[i];
            }
            topicRoot.children[i]._children = topicRoot.children[i].children;
            topicRoot.children[i].children = null;
        }
    }
    //console.log(topicRoot);   
    //console.log("f",topicRoot.children[1].sentiments);
    vis.append("rect")
        .attr("width", "100%")
        .attr("opacity", "0")
        .attr("stroke", "rgb(0,0,0)")
        .attr("height", "100%")
        .attr("transform", "translate(-800,0)")
        .on("click", function () {
            vis.selectAll("g.nodeTopicTree").selectAll(".externalObject")
                .attr("display", function (d1) {
                    //if(this.attr("display")!='none'){
                    var node = findNode(d1.topicID, topicRoot);
                    $(".summarybox").each(function (index) {
                        if (this.id == "text" + d1.topicID) {
                            //console.log( index + ": " + $( this ).val() +""+ this.id);
                            node.summary = $(this).val();
                        }
                    });

                    return 'none';
                    //}
                });

            vis.selectAll("g.nodeTopicTree").selectAll("text.summary").style("opacity", function (d2) {
                if (d2.summary != "") return 1;
                else return 0;
            });

        });
    updateTopicTree(topicRoot, "first");
});
/*function updateTopicTree(source) {
 nodesTopicTree = topicTree.nodes(topicRoot);
 //for (i=0;i<nodesTopicTree.length;i++){
 //alert(json.stringify(nodesTopicTree[i]));
 //}
 
 }*/

function search() {
    alert("hello");
}
function mouseclick(d, i) {
    //document.location.reload(true);
    //logInteraction("Refresh");
    //alert(d3.mouse(this));
}

/*if(collectionMode){
 d3.json("data/collectiontest.json", function(json) {
 json.x0 = 0;
 json.y0 = 0;
 //sortDatabyTime(json);
 update(root = json,  updateTopicFlag);
 if(collectionMode==false)
 $("#div_title").append(root.title + "\t(" + nodes.length + " comments)");
 });
 }
 else { //load an individual conversation
 d3.json(filename, function(json) {
 json.x0 = 0;
 json.y0 = 0;
 //sortDatabyTime(json);
 update(root = json, updateTopicFlag, filename);
 if(collectionMode==false)
 $("#div_title").append(root.title + "\t(" + nodes.length + " comments)");
 loadCommentView(filename);					
 
 });
 }*/

var nodes = [];
var topicList = [];
var topicLinks = [];
var authorList = [];
var authorLinks = [];
var threadStructureHeight = 0;
var ConversationHeight = new Array();
commentsList = [];
var numberOfCommentsTobeShown = 100;
function preprocess(commentStart, commentEnd) {
    tree = d3.layout.tree().size([h, indentation]);
    nodes = tree.nodes(root);
    var commentHeight = new Array();
    //alert(nodes.length);
    for (i = 0; i < nodes.length; i++) {
        commentHeight[i] = findCommentHeight(nodes[i]);
        threadStructureHeight += commentHeight[i];
    }
    numberOfCommentsTobeShown = totalComments;
    //nodes.forEach(function(n, i) 
    for (i = 0; i < nodes.length; i++) {
        height = 0;
        for (j = 0; j < i; j++) {
            height += commentHeight[j];
        }
        nodes[i].x = height;
        if (height > totalThreadheight) { numberOfCommentsTobeShown = i - 1; break; }
    }
    //alert(height);
    h = height;
    if (numberOfCommentsTobeShown < totalComments)
        totalComments = numberOfCommentsTobeShown;

    commentEnd = numberOfCommentsTobeShown - 1;
    //totalComments=nodes.length;
    //else {
    //alert(commentEnd);
    console.log(commentEnd + " " + nodes.length);
    if (commentEnd > nodes.length) commentEnd = nodes.length - 1;
    /*nodes[commentEnd].commentid = nodes[commentEnd].commentid.replace("http://www.semanticweb.org/ontologies/ConversationInstances.owl#", "");
    nodes[commentEnd].commentid = nodes[commentEnd].commentid.replace("comment", "");
    nodes[commentEnd].commentid = nodes[commentEnd].commentid.replace("article", "");
    nodes[commentEnd].commentid = nodes[commentEnd].commentid.replace("data/"+dataset+"_", "");
    nodes[commentEnd].commentid = nodes[commentEnd].commentid.replace(".", "");
    $("#conversation_down").attr("href", "#div" + nodes[commentEnd].commentid);// since the button is already clicked the effect will be in the next step	
*/

    //}
    if (commentStart != null && commentEnd != null) {
        //nodes = nodes.slice(commentStart, commentEnd+1);
        nodes = nodes.slice(commentStart, numberOfCommentsTobeShown);
    }

    if (collectionMode) {
        for (i = 0; i < nodes.length; i++) {
            nodes[i].commentid = nodes[i].commentid.replace("http://www.semanticweb.org/ontologies/ConversationInstances.owl#", "");
            $.ajax({
                url: "data/" + dataset + "/" + nodes[i].filename + ".json",
                async: false,
                dataType: 'json',
                success: function (response) {
                    nodes[i].totalTopics = response.totalTopics;
                    nodes[i].totalLines = response.totalLines;
                    nodes[i].topics = response.topics;
                }
            });
        }
        verticalGapBetweenConversations = 50;
    }
    else {
        for (i = 0; i < nodes.length; i++) {
            nodes[i].commentid = nodes[i].commentid.replace("http://www.semanticweb.org/ontologies/ConversationInstances.owl#", "");
            nodes[i].commentid = nodes[i].commentid.replace("comment", "");
            nodes[i].commentid = nodes[i].commentid.replace("article", "");
            nodes[i].commentid = nodes[i].commentid.replace(dataset + "_", "");
            nodes[i].commentid = nodes[i].commentid.replace(".", "");
            if (nodes[i].commentid == "1") nodes[i].commentid = "a";
            nodes[i].colorText = "";
            nodes[i].sentences = "";

            if (root.domain == "slashdot") {
                var date = new Date(parseInt(nodes[i].date));
                // hours part from the timestamp
                var day = date.getDate();
                var year = date.getFullYear();

                var hours = date.getHours();
                // minutes part from the timestamp
                var minutes = date.getMinutes();
                // seconds part from the timestamp
                var seconds = date.getSeconds();

                var curr_month = date.getMonth() + 1; //Months are zero based		

                nodes[i].date = "on " + day + "-" + curr_month + "-" + year + " at " + hours + ':' + minutes + ':' + seconds + " ";
            }
            /*for (j = 0; j < nodes[i].sent.length; j++) {
             nodes[i].sentences+=nodes[i].sent[j].sent+" ";
             var colorSentence = nodes[i].sent[j].sent;
             for (k = 0; k < nodes[i].sent[j].sentimentwords.length; k++) {
             //alert(nodes[i].sent[j].sentimentwords.length);
             
             if (nodes[i].sent[j].sent.indexOf(nodes[i].sent[j].sentimentwords[k].word)>=0) {
             if (nodes[i].sent[j].sentimentwords[k].polarity < 0)
             colorSentence = colorSentence.replace(nodes[i].sent[j].sentimentwords[k].word, "<strong style=\"color: rgb(125,87,189)\">" + nodes[i].sent[j].sentimentwords[k].word + "</strong>");
             else
             colorSentence = colorSentence.replace(nodes[i].sent[j].sentimentwords[k].word, "<strong style=\"color: rgb(230, 97, 1)\">" + nodes[i].sent[j].sentimentwords[k].word + "</strong>");
             //alert("yes"+nodes[i].sent[j].sent);
             }
             }
             nodes[i].colorText += colorSentence + " ";
             }*/
            nodes[i].htmltext = nodes[i].htmltext.replace('<div class="smallfont" style="margin-bottom:2px">Quote:</div>', '');
            nodes[i].colorText = nodes[i].htmltext;
            for (j = 0; j < nodes[i].sent.length; j++) {

                for (k = 0; k < nodes[i].sent[j].sentimentwords.length; k++) {
                    //alert(nodes[i].sent[j].sentimentwords.length);

                    if (nodes[i].htmltext.indexOf(nodes[i].sent[j].sentimentwords[k].word) >= 0) {
                        if (nodes[i].sent[j].sentimentwords[k].polarity < 0)
                            nodes[i].colorText = nodes[i].colorText.replace(nodes[i].sent[j].sentimentwords[k].word, "<strong style=\"color: rgb(125,87,189)\">" + nodes[i].sent[j].sentimentwords[k].word + "</strong>");
                        else
                            nodes[i].colorText = nodes[i].colorText.replace(nodes[i].sent[j].sentimentwords[k].word, "<strong style=\"color: rgb(230, 97, 1)\">" + nodes[i].sent[j].sentimentwords[k].word + "</strong>");
                        //alert("yes"+nodes[i].sent[j].sent);
                    }
                }

            }
            //alert(nodes[i].commentid);
            /*if(nodes[i].clickstate=="0")
             nodes[i].clickstate="1";
             else nodes[i].clickstate="0";*/

            //find Keyphrase
            nodes[i].topicText = "";

        }

    }

}

function updateConversation(source, filename) {

    // Update the nodes�
    var node = vis.selectAll("g.node")
        .data(nodes, function (d) {
            return d.id || (d.id = ++commentNodeCounter);
        });

    nodeEnter = node.enter().append("svg:g")
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        //.on("mousewheel.zoom", scrollThread)
        .style("opacity", 1e-6);
    $(document).ready(function () {
        $("#refreshbutton").click(function (event) {

            scrollThread(nodeEnter);
        });
    });
    function scrollThread(d) {
        /*if (d3.event.sourceEvent.wheelDelta){
         if (d3.event.sourceEvent.wheelDelta > 0){
         alert("+");
         }else{
         alert("-");
         }
         }*/

        var upscroll = 1;
        $(window).scroll(function (event) {
            var st = $(this).scrollTop();
            if (st > lastScrollTop) {
                //alert("downscroll code");
                upscroll = 0;
            } else {
                //alert("upscroll code");
                upscroll = 1;
            }
            lastScrollTop = st;
        });


        nodeEnter.transition()
            .duration(1000)
            .attr("transform", function (d) {
                var movex = 0;
                if (upscroll == 1) {

                    movex = d.x - 200;
                    d.x = d.x - 200;
                }
                else {
                    movex = d.x + 200;
                    d.x = d.x + 200;
                }
                return "translate(" + (d.y) + "," + movex + ")";
            })
            .style("opacity", 1);

        topicLinks.forEach(function (t, i) {
            t.id = null;
            //alert(t.target);
            if (t.type != "collection")
                t.target.x = t.target.x - 200;
        });
        authorLinks.forEach(function (t, i) {
            t.id = null;
            //alert(t.target);
            if (t.type != "collection")
                t.target.x = t.target.x - 200;
        });

        vis.selectAll(".linktopics").remove();
        vis.selectAll(".linkauthors").remove();
        updateTopicLinks();

        vis.selectAll(".linkauthors")
            .data(authorLinks)
            .enter().append("path")
            .attr("class", "linkauthors")
            .attr("d", topicDiagonal)
            .attr("opacity", "0.3");

    }
    // Enter any new nodes at the parent's previous position.

    //draw sentiment bars

    /*nodeEnter.append("svg:rect")
     .attr("y", -barHeight / 2)
     //.attr("height", barHeight)
     .attr("height", findCommentHeight)
     .attr("width", function (d){
     return barWidth+100;
     })
     .style("fill", "rgb(255,255,255)")
     //.style("opacity", opacity)
     .on("click", click);
     */
    /*  nodeEnter.append("svg:line")
     .attr("y1",  -barHeight / 2-.1)
     //.attr("height", barHeight)
     .attr("x2", function (d){	
     //alert(d.topicShift);
     return barWidth+100;
     })
     .attr("y2",  -barHeight / 2)
     .style("stroke", function (d){
     colorLine="rgb(255,255,255)";
     if(d.topicShift==1)
     colorLine="rgb(0,0,0)";
     return colorLine;})
     .style("stroke-width","1.0px");
     */

    topicSelector = nodeEnter.append("svg:rect")
        .attr("commentid", function (d) {
            return d.commentid;
        })
        .attr("height", function (d) {
            var h = findCommentHeight(d);
            return h - 1;
        })
        .attr("width", function (d) {
            return 5;
        })
        .attr("opacity", 0)
        .style("fill", topicColor);

    nodeEnter.append("a")
        .attr("xlink:href", function (d) {
            return "#div" + d.commentid;
        })
        .append("svg:rect")
        //.attr("y", function(d){alert(d.y);})
        .attr("x", function (d) {
            return spaceforFacetSelector;
        })
        .attr("commentid", function (d) {
            //alert(d.commentid);
            return d.commentid;
        })
        .attr("height", findCommentHeight)
        .attr("width", function (d) {
            colorBins = findColor(d, 0);
            return barWidth * colorBins[0];
        })
        .style("fill", "rgb(" + sentimentColors[4] + ")")
        .style("stroke", "rgb(0,0,0)")
        .style("stroke-width", ".25px")
        .append("title").text(showCommentTooltip);

    nodeEnter.append("svg:a")
        .attr("xlink:href", function (d) {
            return "#div" + d.commentid;
        })
        .append("svg:rect")
        .attr("y", -barHeight / 2)
        .attr("x", function (d) {
            colorBins = findColor(d, 0);
            return spaceforFacetSelector + barWidth * colorBins[0];
        })
        .attr("height", findCommentHeight)
        .attr("commentid", function (d) {
            return d.commentid;
        })
        .attr("width", function (d) {
            colorBins = findColor(d, 0);
            return (barWidth * colorBins[1]);
        })
        .style("fill", "rgb(" + sentimentColors[3] + ")")
        .style("stroke", "rgb(0,0,0)")
        .style("stroke-width", ".25px")
        //.append("title").text(showCommentTooltip) 
        .append("title").text(showCommentTooltip);

    nodeEnter.append("svg:a")
        .attr("xlink:href", function (d) {
            return "#div" + d.commentid;
        })
        .append("svg:rect")
        .attr("y", -barHeight / 2)
        .attr("x", function (d) {
            colorBins = findColor(d, 0);
            return spaceforFacetSelector + barWidth * colorBins[0] + barWidth * colorBins[1];
        })
        .attr("height", findCommentHeight)
        .attr("commentid", function (d) {
            return d.commentid;
        })
        .attr("width", function (d) {
            colorBins = findColor(d, 0);
            return (barWidth * colorBins[2]);
        })

        .style("fill", "rgb(" + sentimentColors[2] + ")")
        .style("stroke", "rgb(0,0,0)")
        .style("stroke-width", ".25px")
        .append("title").text(showCommentTooltip);

    nodeEnter.append("svg:a")
        .attr("xlink:href", function (d) {
            return "#div" + d.commentid;
        })
        .append("svg:rect")
        .attr("y", -barHeight / 2)
        .attr("x", function (d) {
            colorBins = findColor(d, 0);
            return spaceforFacetSelector + barWidth * colorBins[0] + barWidth * colorBins[1] + barWidth * colorBins[2];

        })

        .attr("height", findCommentHeight)
        .attr("commentid", function (d) {
            return d.commentid;
        })
        .attr("width", function (d) {
            colorBins = findColor(d, 0);
            return barWidth * colorBins[3];
        })
        .style("fill", "rgb(" + sentimentColors[1] + ")")
        .style("stroke", "rgb(0,0,0)")
        .style("stroke-width", ".25px")
        .append("title").text(showCommentTooltip);

    nodeEnter.append("svg:a")
        .attr("xlink:href", function (d) {
            return "#div" + d.commentid;
        })
        .append("svg:rect")
        .attr("y", function (d) {
            //alert(-barHeight / 2);
            return -barHeight / 2;
        })
        .attr("x", function (d) {
            colorBins = findColor(d, 0);
            return spaceforFacetSelector + barWidth * colorBins[0] + barWidth * colorBins[1] + barWidth * colorBins[2] + barWidth * colorBins[3];
        })
        .attr("height", findCommentHeight)
        .attr("commentid", function (d) {
            return d.commentid;
        })
        .attr("width", function (d) {
            colorBins = findColor(d, 0);
            return barWidth * colorBins[4];
        })
        .style("fill", "rgb(" + sentimentColors[0] + ")")
        //.style("stroke", "rgb(0,0,0)")
        .append("title").text(showCommentTooltip);

    /*nodeEnter.append("svg:rect")
     .attr("y", function (d){
     //alert(-barHeight / 2);
     return -barHeight / 2;})
     .attr("x", function(d){
     colorBins = findColor(d,0);				
     return spaceforFacetSelector + barWidth+4;
     })
     .attr("height", findCommentHeight)
     .attr("commentid", function(d) {
     return d.commentid;
     })
     .attr("width", function(d) {
     
     return  20;
     })
     .style("fill", "rgb(" + 100,100,100 + ")")
     .on("click", click)
     .on("mouseover", mouseover)
     .on("mouseout", mouseover)
     .append("text")
     .text(function(d) {
     return d.date;
     });*/

    authorSelector = nodeEnter.append("svg:rect")
        .attr("commentid", function (d) {
            return d.commentid;
        })
        .attr("x", function (d) {
            colorBins = findColor(d, 0);
            return spaceforFacetSelector + 2 + barWidth;
        })
        .attr("height", function (d) {
            var h = findCommentHeight(d);
            return h - 1;
        })
        .attr("width", function (d) {
            return 5;
        })
        .attr("opacity", 0)
        .style("fill", authorColor);

    // Transition nodes to their new position.
    nodeEnter.transition()
        .duration(duration)
        .attr("transform", function (d) {
            return "translate(" + d.y + "," + d.x + ")";
        })
        .style("opacity", 1);


    // Transition exiting nodes to the parent's new position.
    node.exit().transition()
        .duration(duration)
        .attr("transform", function (d) {
            return "translate(" + source.y + "," + source.x + ")";
        })
        .style("opacity", 1e-6)
        .remove();

    /* 
     //collectionConversationLinking title
     nodeEnter.append("text")      
     .attr("y", function (d){
     //alert(-barHeight / 2);
     return -barHeight / 2+10;})
     .attr("x", function(d){
     colorBins = findColor(d,0);				
     return spaceforFacetSelector + barWidth * colorBins[0]+barWidth * colorBins[1]+barWidth * colorBins[2]+barWidth * colorBins[3]+barWidth * colorBins[4]+50;
     })	
     .attr("dy", 0.0)
     .attr("dx", 00)
     .style("fill", "black")
     
     .call(wrap
     ,350 ); // wrap the text in <= 30 pixels
     //adding title
     
     nodeEnter.append("text")      
     .attr("y", function (d){
     //alert(-barHeight / 2);
     return -barHeight / 2+10;})
     .attr("x", function(d){
     colorBins = findColor(d,0);				
     return spaceforFacetSelector + barWidth * colorBins[0]+barWidth * colorBins[1]+barWidth * colorBins[2]+barWidth * colorBins[3]+barWidth * colorBins[4]+10;
     })	
     .attr("dy", 40.0)
     .attr("dx", 50)
     .style("fill", "grey")
     .text(function(d) {	 
     return d.date;
     });	 */
    //



    // Transition nodes to their new position.
    nodeEnter.transition()
        .duration(duration)
        .attr("transform", function (d) {
            return "translate(" + d.y + "," + d.x + ")";
        })
        .style("opacity", 1);
    /*  
     node.transition()
     .duration(duration)
     .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
     .style("opacity", 1)
     .select("rect")
     .style("fill", "rgb(26, 150, 65)");
     */


    // Update the links�
    /*  var link = vis.selectAll("path.link")
     .data(tree.links(nodes), function(d) { return d.target.id; });
     
     // Enter any new links at the parent's previous position.
     link.enter().insert("svg:path", "g")
     .attr("class", "link")
     .attr("d", function(d) {
     var o = {x: source.x0, y: source.y0};
     return diagonal({source: o, target: o});
     })
     .transition()
     .duration(duration)
     .attr("d", diagonal);
     
     // Transition links to their new position.
     link.transition()
     .duration(duration)
     .attr("d", diagonal);
     
     // Transition exiting nodes to the parent's new position.
     link.exit().transition()
     .duration(duration)
     .attr("d", function(d) {
     var o = {x: source.x, y: source.y};
     return diagonal({source: o, target: o});
     })
     .remove();
     */




}

// update thread overview, topics authors and visual links
function update(source, updateTopicFlag, d) {
    updateConversation(source, d.filename);
    arcCy = (threadStructureHeight + verticalGapBetweenConversations * nodes.length) / 2;
    //verticalGapBetweenConversations
    arcRad = threadStructureHeight / 2;
    //if(arcRad<200) arcRad=200;
    if (arcRad > 500) arcRad = 500;
    arcRad = 500;
    //if(arcCy>480) arcCy=480;	
    arcCy = 450;
    //arcRad=500; 
    var startAngle = 130;

    //store the list of topics into an array
    if (updateTopicFlag) {
        var indentedList = false;
        //		createTopicHierarchyCircular(nodesTopicTree, indentedList);

    }
    var angleInDegrees = 123 / root.topics.length; //Don't want to use full 180 degree			
    var shiftxTopic = 0;
    if (threadStructureHeight > 500)
        shiftxTopic = 100;
    var min = 9999, max = -9999, x;
    for (j = 0; j < root.topics.length; j++) {

        if (root.topics[j].strength < min)
            min = root.topics[j].strength;
        if (root.topics[j].strength > max)
            max = root.topics[j].strength;
    }
    root.topics.sort(function (a, b) {
        for (i = 0; i < nodes.length; i++) {

            for (j = 0; j < nodes[i].sent.length; j++) {
                //alert(nodes[i].sent[j].systemlabel);
                if (nodes[i].sent[j].systemlabel == a.labels[0].phrase) {
                    //alert(nodes[i].sent[j].systemlabel+" "+a.labels[0].phrase+" "+b.labels[0].phrase);
                    return 1;
                }
                else if (nodes[i].sent[j].systemlabel == b.labels[0].phrase) {
                    return -1;
                }
            }
        }
        //return aComesFirst;
    });

    for (j = 0; j < root.topics.length; j++) {
        var topicLabel = root.topics[j].labels[0].phrase;
        var angle = startAngle + angleInDegrees * j;
        var coordx = (arcRad * Math.cos((startAngle + angleInDegrees * j) * Math.PI / 180)) + arcCx + shiftxTopic;
        var coordy = (arcRad * Math.sin((startAngle + angleInDegrees * j) * Math.PI / 180)) + arcCy;

        var fontSize = (root.topics[j].strength - min) / min + 12;
        if (fontSize > 20)
            fontSize = 20;

        //console.log(fontSize);
        topicList.push({
            topicID: root.topics[j].topicID, name: "" + topicLabel, x: coordx, y: coordy,
            angle: angle, col: topicColor, type: "topic", phrases: root.topics[j].labels, clickstate: "0",
            fontsize: fontSize + "px", commentid: "0"
        });
    }

    //linking topics with comments
    nodes.forEach(function (n, i) {
        for (j = 0; j < topicList.length; j++) {
            var topicfound = false;
            for (k = 0; k < n.sent.length; k++) {
                if (topicList[j].topicID == n.sent[k].systemtopicid) {
                    if (topicList[j].commentid == "0")
                        topicList[j].commentid = n.commentid;
                    topicLinks.push({
                        source: { x: topicList[j].y, y: topicList[j].x, topic: n.sent[k].systemlabel },
                        target: { x: n.x + findCommentHeight(n) / 2, y: n.y + spaceforFacetSelector, topic: n.sent[k].systemlabel, commentid: n.commentid }, type: "conversation", clickcomment: "0"
                    });
                    topicfound = true;
                    break;
                }
            }
            if (topicfound)
                break; //to make sure each comment is connected to only one topic Jan 29, 2015
        }
    });




    //alert("yes"+JSON.stringify(topicLinks));
    //create list of authors and linking authors with comments
    //arcCx=200;

    var uniqueAuthors = [];
    for (i = 0; i < nodes.length; i++) {
        for (j = 0; j < uniqueAuthors.length; j++) {
            if (nodes[i].author == uniqueAuthors[j].author) {
                //alert(uniqueAuthors[j].noofcomments);
                uniqueAuthors[j].noofcomments = uniqueAuthors[j].noofcomments + 1;
                uniqueAuthors[j].commentlength = uniqueAuthors[j].commentlength + nodes[i].sent.length;
                break;
            }
        }
        if (j == uniqueAuthors.length)
            uniqueAuthors.push({ author: nodes[i].author, noofcomments: 1, commentlength: nodes[i].sent.length });
    }
    uniqueAuthors.sort(function (b, a) {
        var diff = a.noofcomments - b.noofcomments;
        if (diff == 0)
            diff = a.commentlength - b.commentlength;
        return diff;
    });
    //alert(uniqueAuthors.length);
    var NumberofAuthorsTobeShown = 40;
    if (uniqueAuthors.length < 30)
        NumberofAuthorsTobeShown = uniqueAuthors.length;
    var angleInDegreesAuthors = 125 / NumberofAuthorsTobeShown; //Dont want to use full 180 degree		
    uniqueAuthors.splice(NumberofAuthorsTobeShown - 1, uniqueAuthors.length - NumberofAuthorsTobeShown);

    //arcCx-=150;
    var min = 9999, max = -9999, x;
    for (j = 0; j < uniqueAuthors.length; j++) {

        if (uniqueAuthors.noofcomments < min)
            min = uniqueAuthors.noofcomments;
        if (uniqueAuthors.noofcomments > max)
            max = uniqueAuthors.noofcomments;
    }

    var countAuthor = 0;
    var authorIndex = -1;
    var shiftCoordx = 0;
    if (threadStructureHeight > 500)
        shiftCoordx = 100;
    for (i = 0; i < nodes.length; i++) {
        for (j = 0; j < uniqueAuthors.length; j++) {
            if (nodes[i].author == uniqueAuthors[j].author) {
                authorIndex = -1;
                for (k = 0; k < authorList.length; k++) {
                    if (nodes[i].author == authorList[k].name) {
                        authorIndex = k;
                        break;
                    }
                }
                if (authorIndex == -1) {
                    var startAngle = -60;
                    var angle = startAngle + angleInDegrees * countAuthor;
                    var coordx = (arcRad * Math.cos((startAngle + angleInDegreesAuthors * countAuthor) * Math.PI / 180)) + arcCx;
                    var coordy = (arcRad * Math.sin((startAngle + angleInDegreesAuthors * countAuthor) * Math.PI / 180)) + arcCy;

                    coordx -= shiftCoordx;
                    var fontsize = (uniqueAuthors[j].noofcomments) * 3 + 10;
                    if (fontsize > 25)
                        fontsize = 25;
                    authorList.push({ commentid: nodes[i].commentid, name: nodes[i].author, x: coordx, y: coordy, col: authorColor, type: "author", fontstroke: fontsize, clickstate: "0" });
                    authorLinks.push({ source: { x: coordy, y: coordx - 3, author: nodes[i].author }, target: { x: nodes[i].x + findCommentHeight(nodes[i]) / 2, y: nodes[i].y + barWidth + spaceforFacetSelector, author: nodes[i].author, commentid: nodes[i].commentid }, clickstate: "0" });
                    countAuthor++;
                }
                else {
                    var coordx1 = (arcRad * Math.cos((startAngle + angleInDegreesAuthors * authorIndex) * Math.PI / 180)) + arcCx;
                    var coordy1 = (arcRad * Math.sin((startAngle + angleInDegreesAuthors * authorIndex) * Math.PI / 180)) + arcCy;
                    //alert(authorIndex+" "+nodes[i].author+authorList[authorIndex].name);
                    for (k = 0; k < authorLinks.length; k++) {
                        if (nodes[i].author == authorLinks[k].source.author) {

                            authorLinks.push({ source: { x: authorLinks[k].source.x, y: authorLinks[k].source.y, author: nodes[i].author }, target: { x: nodes[i].x + findCommentHeight(nodes[i]) / 2, y: nodes[i].y + barWidth, author: nodes[i].author, commentid: nodes[i].commentid } });
                            break;
                        }
                    }
                }
                break;
            }
        }

    }
    //	alert(countif);


    //authorcount


    if (collectionMode) {
        titles = [];
        for (i = 0; i < nodes.length; i++) {
            titles.push(nodes[i].title.replace("Mac Rumors", ""));
        }
    }


    updateTopics(d);

    setTimeout(function () {

        updateTopicLinks();
    }, 0);



    var linkAuthorComments = vis.selectAll(".linkauthors")
        .data(authorLinks)
        .enter().append("path")
        .attr("class", "linkauthors")
        .attr("d", topicDiagonal)
        .attr("opacity", "0.3");


    var imgsAuthors = vis.selectAll("image").data(authorList);
    imgsAuthors.enter()
        .append("svg:image")
        .attr("x", function (d) {
            return d.x - 10;
        })
        .attr("y", function (d) {
            return d.y - 8;
        })
        .attr("xlink:href", "icons/author.png")
        .attr("width", "14")
        .attr("height", "15")
        .attr("opacity", ".5");

    textAuthor = vis.selectAll("textAuthors").data(authorList);
    drawAuthorText();
    authorRect = vis.selectAll(".authorrect")
        .data(authorList)
        .enter()
        .append("a")
        .attr("xlink:href", function (d) {
            return "#div" + d.commentid;
        })
        .append("svg:rect")
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("x", function (d) {
            rectName = d.name;
            var width;
            textAuthor.each(function (d) {

                if (d.name == rectName) {
                    var bbox = this.getBBox();
                    width = bbox.width;
                }
            });
            return d.x + 5;
        })
        .attr("y", function (d) {
            return d.y - textHeight + textHeight / 3 + 5;
        })
        .attr("width", function (d) {
            rectName = d.name;
            var width;
            textAuthor.each(function (d) {

                if (d.name == rectName) {
                    var bbox = this.getBBox();
                    width = bbox.width;
                }

            });
            return width + 8;
        })
        .attr("height", textHeight - 4)
        //.attr("transform", function(d, i) { return "scale(" + (1 - d / 25) * 20 + ")"; })
        .style("fill", "rgb(255,255,255)")
        .style("opacity", "0")
        .style("stroke-width", "2px");

    textAuthor.remove();
    drawAuthorText();

    vis.selectAll("image")
        .on("mouseover", function (d) {
            aut = d.name;
            d3.select(this)
                .transition()
                .duration(duration)
                .attr("opacity", "1");
            highlightCommentsbyAuthor(aut);
            highlightAuthorsLinks();
            highlightTopicLinks();
            highlightAuthorsbyAuthor(aut);
            highlightTopicsbyAuthor(aut);
        });

    vis.selectAll("image")
        .on("mouseout", function (d) {
            undoHighlightAuthorsLinks();
            d3.select(this)
                .transition()
                .duration(duration)
                .attr("opacity", ".5");
            undoHighlightCommentsbyAuthor(aut);
            commentsList = [];
        });

    /*var testCircle = circle.append("circle")
     .attr("cx", arcCx)
     .attr("cy", arcCy)
     .attr("r", arcRad)
     .attr("fill", "none")	 
     .style("stroke", "rgb(240,240,240)");
     */
    vis.selectAll(".circle")
        .on("mouseout", function (d) {
            topicName = d.name;
            undoHighlightTopicsbyTopic(topicName);
            undoHighlightCommentsbyTopic(topicName);
            commentsList = [];
        });



    // Stash the old positions for transition.
    nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
} //end of update function

function collectionConversationLink(d) {

    //ADDING LINKS BETWEEN TOPIC-COLLECTION AND TOPIC-CONVERSATION
    //console.log(d.filename.replace("data/"+dataset+"_", ""));
    var conversationid = d.filename.replace(dataset + "_", "");
    var topicCollCon = findAlltopicNodesofAConversation(conversationid);
    console.log(topicCollCon);
    //updateTopicTree(topicRoot);
    topicsToBeConnected = [];
    for (j = 0; j < topicList.length; j++) {
        var currentLength = topicsToBeConnected.length;
        for (k = 0; k < topicCollCon.length; k++) {
            //console.log(topicCollCon[k].name);
            var topicConversationID = topicCollCon[k].topicID.split(":");
            //if(conversationid==topicConversationID[0])
            if (topicConversationID[1] == topicList[j].topicID) {
                topicsToBeConnected.push({ source: topicCollCon[k], target: topicList[j] });
            }
            var childrenList = [];
            if (topicCollCon[k].children) childrenList = topicCollCon[k].children;
            else if (topicCollCon[k]._children) childrenList = topicCollCon[k]._children;
            //console.log(childrenList);
            var nodes = [];
            getLeafNodes(nodes, topicCollCon[k]);

            for (var i = 0; i < nodes.length; i++) {
                //var topicConversationID=nodes[i].topicID.split(":");

                //if(conversationid==topicConversationID[0])                    
                //if (topicConversationID[1] == topicList[j].topicID) {
                //console.log(nodes[i].topicID.split(":")[0]);
                if (nodes[i].topicID.split(":")[0] == d.filename)
                    if (nodes[i].topicID.split(":")[1] == topicList[j].topicID) {
                        topicsToBeConnected.push({ source: topicCollCon[k], target: topicList[j] });
                        break;
                    }
            }

            /*for (var i = 0; i < childrenList.length; i++) {
                var topicConversationID=childrenList[i].topicID.split(":");
                
                //if(conversationid==topicConversationID[0])                    
                    //if (topicConversationID[1] == topicList[j].topicID) {
                    if(childrenList[i].labels[0].phrase==topicList[j].name){
                        topicsToBeConnected.push({source: topicCollCon[k], target: topicList[j]});
                        break;
                    }
            }*/

            /*if (topicCollCon[k]._children) {
                for (var i = 0; i < topicCollCon[k]._children.length; i++) {
            if(conversationid==topicConversationID[0])                    
                    if (topicCollCon[k]._children[i].topicID.split(":")[1] == topicList[j].topicID) {
                        topicsToBeConnected.push({source: topicCollCon[k], target: topicList[j]});
                        break;
                    }
                }
            }
            else if (topicCollCon[k].children) {
                for (var i = 0; i < topicCollCon[k].children.length; i++) {
                    if (topicCollCon[k].children[i].topicID.split(":")[1] == topicList[j].topicID) {
                        topicsToBeConnected.push({source: topicCollCon[k], target: topicList[j]});
                        break;
                    }
                }
            }*/

            if (topicsToBeConnected.length > currentLength) {
                var collectiontopic = topicsToBeConnected[topicsToBeConnected.length - 1].source;
                topicList[j].y0 = topicList[j].y;
                topicList[j].x0 = topicList[j].x;
                topicList[j].y = collectiontopic.x;
                topicList[j].x = collectiontopic.y + collectiontopic.width + 9;
                topicList[j].exist = "yes";
                break;
            }
        }
    }
}

function updateTopics(d) {
    /*circle.transition()
     .duration(1000)
     .attr("transform", function(d) {
     for(i=0;i<nodesTopicTree.length;i++){
     var transX=0, transY=0;
     if(d.name==nodesTopicTree[i].name){
     //alert(nodesTopicTree[i].name+" "+nodesTopicTree[i].x);
     topicLinks.push({source: {x: nodesTopicTree[i].x, 
     y: nodesTopicTree[i].y}, 
     target: {x: d.y, y:d.x}});	
     transX=nodesTopicTree[i].x-d.y;
     transY=nodesTopicTree[i].y- d.x;
     
     break;
     }						
     }	
     return "translate(" + transX + "," + transY + ")";
     });*/
    /*for (j=0;j<topicList.length;j++){
     topicList[j].x0=topicList[j].x;
     topicList[j].y0=topicList[j].y;		
     }*/




    /*for(i=0;i<nodesTopicTree.length;i++){
     for (j=0;j<topicList.length;j++){
     
     if(topicList[j].name==nodesTopicTree[i].name){
     //alert(nodesTopicTree[i].name+" "+nodesTopicTree[i].x);
     //topicLinks.push({source: {x: nodesTopicTree[i].x, y: nodesTopicTree[i].y}, 
     //target: {x: topicList[j].y, y: topicList[j].x}, type:"collection"});
     
     topicList[j].y0=topicList[j].y;
     topicList[j].x0=topicList[j].x;	
     topicList[j].y=nodesTopicTree[i].x;
     topicList[j].x=nodesTopicTree[i].y;								
     topicList[j].exist="yes";
     break;
     }
     
     }
     }*/
    collectionConversationLink(d);
    circle = vis.selectAll(".circle")
        .data(topicList, function (d) {
            return d.id || (d.id = ++i);
        });
    circle.enter()
        .append("g")
    //            .attr("class", "circle")
    //            .attr("fill", function(d) {
    //        return d.col;
    //    })
    //            .attr("x", function(d) {
    //        return 0;
    //    })
    //            .attr("y", function(d) {
    //        return 0;
    //    })

    drawTopicText(circle);
    circle.append("circle")
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        })
        .attr("r", radius)
        .append("title").text(function (d) {
            var phrases = "";
            if (d.phrases)
                for (i = 1; i < d.phrases.length; i++) {
                    phrases += d.phrases[i].phrase + "\n";
                    if (i > 3)
                        break;
                }
            return phrases;
        })
        .style("opacity", function (d) {
            var opac = 0;
            if (d.nodetype == "newmerge") {
                //alert("yes");
                opac = 0;
            }
            if (d.nodetype == "newsplit") {
                opac = 1;
                //alert(translateX+" "+translateY);
            }
            return opac;
        });
    //_nodesTopicTree=nodesTopicTree;
    //nodesTopicTree=null;
    //_nodeEnter=nodeEnter;
    //nodeEnter=null;    
    // Transition nodes to their new position.
    /* 
    
    _textTopics=textTopics;
    textTopics=null;    
    

    
    _textAuthor=textAuthor;
    textAuthor=null;*/


    circle.on("mouseover", null);
    circle.on("mouseout", null);
    nodeEnter
        .on("click", null)
        .on("mouseover", null)
        .on("mouseout", null)
    var textLabels = vis.selectAll("text.topiclabel");
    textLabels.on("mouseover", null);
    //vis.selectAll("rect").on("mouseover", null);
    textLabels.on("mouseout", null);
    //vis.selectAll("rect").on("mouseout", null);
    circle.transition()
        .duration(durationMedium)
        .attr("transform", function (d) {
            if (d.exist == "yes") {
                //alert((d.x0-d.x)+" "+(d.y0-d.y)+d.name);
                return "translate(" + (d.x0 - d.x) + "," + (d.y0 - d.y) + ")";
            }
            else return "translate(" + (0) + "," + (0) + ")";
        })
        .call(waitForAnimation, function () {
            //.each("end", function(){         //active all events once this transition ends
            console.log("animation ends");
            textTopics.on("mouseover", topicMouseover);
            roundedRect.on("mouseover", topicMouseover);
            textTopics.on("mouseout", topicMouseout);
            roundedRect.on("mouseout", topicMouseout);
            textTopics.on("click", topicMouseClick);
            roundedRect.on("click", topicMouseClick);

            textAuthor.on("mouseover", authorMouseover);
            authorRect.on("mouseover", authorMouseover);
            textAuthor.on("mouseout", authorMouseout);
            authorRect.on("mouseout", authorMouseout);
            authorRect.on("click", authorMouseclick);
            textAuthor.on("click", authorMouseclick);

            vis.selectAll("text.topiclabel").on("mouseover", mouseoverNodeTopicTree);
            //topicNodeEnter.selectAll("rect").on("mouseover", mouseoverNodeTopicTree);
            vis.selectAll("text.topiclabel").on("mouseout", mouseoutNodeTopicTree);
            //topicNodeEnter.selectAll("rect").on("mouseout", mouseoutNodeTopicTree); 

            vis.selectAll("text.topiclabel").on("click", clickNodeTopicTree);
            //nodeEnter=_nodeEnter;
            nodeEnter
                .on("click", click)
                .on("mouseover", mouseover)
                .on("mouseout", mouseout)

            //textTopics=_textTopics;
            //textAuthor=_textAuthor;
            //});        


        });
    function waitForAnimation(transition, callback) {
        if (transition.size() === 0) {
            callback()
        }
        var transitionCount = 0;
        transition
            .each(function () {
                ++transitionCount;
            })
            .each("end", function () {
                if (!--transitionCount)
                    callback.apply(this, arguments);
            });
    }







    textTopics = circle;

    //alert(textHeight);
    textHeight = 20;
    roundedRect = textTopics
        //.data(topicList)
        //.enter()
        .append("svg:rect")
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("x", function (d) {
            rectName = d.name;
            var width;
            vis.selectAll("text.convistopics").each(function (d) {
                if (d)
                    if (d.name == rectName) {
                        var bbox = this.getBBox();
                        width = bbox.width;
                    }
            });
            return d.x - width - 10;
            //return d.x;
        })
        .attr("y", function (d) {
            return d.y - textHeight + textHeight / 4;
        })
        .attr("width", function (d) {
            rectName = d.name;
            var width;
            vis.selectAll("text.convistopics")
                .each(function (d) {
                    if (d)
                        if (d.name == rectName) {
                            var bbox = this.getBBox();
                            width = bbox.width;
                        }

                });
            return width + 4;
            //return width;
        })
        .attr("height", textHeight + 4)
        //.attr("transform", function(d, i) { return "scale(" + (1 - d / 25) * 20 + ")"; })            
        .style("opacity", "0")
        .style("stroke-width", "2px");


    //textTopics.remove();	

    circle.selectAll("text").remove();
    drawTopicText(circle);



}

function updateTopicLinks() {
    //alert(topicsToBeConnected.length);
    for (i = 0; i < topicsToBeConnected.length; i++) {
        var collectiontopic = topicsToBeConnected[i].source;

        var conversationtopic = topicsToBeConnected[i].target;
        conversationtopic.x = conversationtopic.x0;
        conversationtopic.y = conversationtopic.y0;
        vis.selectAll("text.convistopics").each(function (d) {
            if (d.name == conversationtopic.name) {
                var bbox = this.getBBox();
                conversationtopic.width = bbox.width;
            }
        });
        topicLinks.push({
            source: { topicNode: collectiontopic, x: collectiontopic.x, y: collectiontopic.y + collectiontopic.width + 25 + 10, topic: collectiontopic.labels[0].phrase },
            target: { x: conversationtopic.y, y: conversationtopic.x - conversationtopic.width - 6, topic: conversationtopic.name }, type: "collection"
        });
        //console.log(topicLinks[topicLinks.length-1]);
    }
    var linktopicsCounter = 0;
    linkTopicComments = vis.selectAll(".linktopics")
        .data(topicLinks, function (d) {
            return d.id || (d.id = ++linktopicsCounter);
        }
        );
    linkTopicComments.enter().append("path")
        .attr("class", "linktopics")
        .attr("d", topicDiagonal)
        .attr("opacity", function (d) {
            if (d.type == "collection")
                return "0.3";
            return "0.3";
        });
    /*linkTopicComments.transition()
            .duration(400)
            .style("opacity", function(d) {
        return "0.3";
    })*/


}
//draw topic text
function drawTopicText(circle) {
    circle
        .append("a")
        .attr("xlink:href", function (d) {
            return "#div" + d.commentid;
        })
        .style("text-decoration", "none")
        .append("text")
        /*.attr("transform", function(d) {
         return "translate(" + (-(d.name.length*8.5))+ ")"; 
         })*/
        .attr("class", "convistopics")
        .style("font-size", function (d) {
            return d.fontsize;
        })
        .attr("dx", function (d) {
            return -8;
        })
        .attr("x", function (d) {
            return d.x;
        })
        .attr("y", function (d) {
            return d.y + radius / 2;
        })
        .attr("fill", function (d) {
            return d.col;
        })
        .style("text-anchor", "end")

        .text(function (d) {
            return d.name;
        })
        .append("title").text(function (d) {
            var phrases = "";
            if (d.phrases)
                for (i = 1; i < d.phrases.length; i++) {
                    phrases += d.phrases[i].phrase + "\n";
                    if (i > 4)
                        break;
                }
            return phrases;
        });



}

function drawAuthorText() {
    textAuthor.enter()
        .append("a")
        .attr("xlink:href", function (d) {
            return "#div" + d.commentid;
        })
        .style("text-decoration", "none")
        .append("svg:text")
        .attr("transform", function (d) {
            return "translate(" + 10 + ")";
        })
        .style("font-size", function (d) {
            return d.fontstroke + "px";
        })
        .attr("x", function (d) {
            return d.x;
        })
        .attr("y", function (d) {
            return d.y;
        })
        //.attr("dx", "6") // margin
        .attr("dy", ".30em") // vertical-align
        .attr("fill", function (d) {
            return d.col;
        }) // vertical-align		
        .text(function (d) {
            return d.name;
        });
}

function topicMouseover(d) {
    topicName = d.name;
    highlightTopicsbyTopic(topicName);
    highlightCommentsbyTopic(d);
    highlightAuthorsbytopic(topicName);
    highlightTopicLinks(topicName);
    highlightAuthorsLinks();

}
function topicMouseout(d) {
    topicName = d.name;
    undoHighlightTopicsbyTopic(topicName);
    undoHighlightCommentsbyTopic(topicName);
    commentsList = [];

}
function topicMouseClick(d) {

    if (d.clickstate == "1") {
        d.clickstate = "0";
        TopicName = d.name;
        undoHighlightTopicsbyTopic(topicName);
        undoHighlightCommentsbyTopic(topicName);
        commentsList = [];
    }
    else
        d.clickstate = "1";
    topicName = d.name;
    highlightTopicsbyTopic(topicName);
    highlightCommentsbyTopic(d);
    highlightAuthorsbytopic(topicName);
    highlightTopicLinks();
    highlightAuthorsLinks();
    clickTopic(d);

}
function authorMouseover(d) {
    aut = d.name;
    highlightCommentsbyAuthor(aut);
    highlightAuthorsLinks();
    highlightTopicLinks();
    highlightAuthorsbyAuthor(aut);
    highlightTopicsbyAuthor(aut);

}
function authorMouseout(d) {
    aut = d.author;

    aut = d.name;
    commentsList = [];
    undoHighlightCommentsbyAuthor(aut);

}
function authorMouseclick(d) {
    if (d.clickstate == "1") {
        d.clickstate = "0";
        authorName = d.name;
        undoHighlightCommentsbyAuthor(aut);
        commentsList = [];
    }
    else
        d.clickstate = "1";
    author = d.name;
    clickAuthor(author, d.clickstate);

}
function dbclick(d) {
    //alert(d.name);
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    //update(root);

}
// if the user click a particular topic	
function clickTopic(topic) {
    selectMode = topic.clickstate;
    link = topic.name;
    logInteraction("ClickTopic" + "," + link + "," + selectMode + "\n");
    commentsList = [];
    for (i = 0; i < nodes.length; i++) {
        var isTopic = 0;
        for (j = 0; j < nodes[i].sent.length; j++) {
            if (nodes[i].sent[j].systemtopicid == topic.topicID) {

                commentsList.push(nodes[i].commentid);
                isTopic = 1;
                break;
            }
        }
        if (isTopic == 1) {
            if (selectMode == "1")
                $("#comment" + nodes[i].commentid).html("<p>" +
                    "<a href=\"#" + nodes[i].parent + "\">" + ":</a>" + " " +
                    nodes[i].colorText + "</p>");
            else {
                var sentences = "";
                //$("#comment" + nodes[i].commentid).html("<p>" + "<a href=\"#" + nodes[i].parent + "\">" + nodes[i].colorText + ":</a>" + " " + nodes[i].sentences + "</p>");
            }
        }
    }
    // draw border around comments in thread view
    /*nodeEnter.transition()
     .duration(0)
     .selectAll("rect")
     //.style("stroke","rgb(0, 71, 157)")	
     .style("stroke-width", function(d, i) {
     var stroke = "0.25px";
     if(d.clickstate=="1") stroke="2px";			
     for (i = 0; i < d.sent.length; i++) {
     if (d.sent[i].systemlabel == link) {
     if(selectMode=="1"){
     d.clickstate="1";
     stroke = "2px";                    
     }
     else{
     d.clickstate="0";						
     stroke="0.25px";
     }
     break;
     }
     }
     return stroke;
     });*/


    topicSelector.transition()
        .duration(duration)
        .style("opacity", function (d, i) {
            var op = "0";

            if (d.clickstate == "1")
                op = "1";
            for (i = 0; i < d.sent.length; i++) {
                if (d.sent[i].systemtopicid == topic.topicID) {
                    if (selectMode == "1") {
                        d.clickstate = "1";
                        op = "1";
                    }
                    else {
                        d.clickstate = "0";
                        op = "0";
                    }
                    break;
                }
            }

            return op;
        });
    // fade border when toggle click
    roundedRect.transition()
        .duration(0)
        .style("fill", topicClickColor)
        .style("opacity", function (d, i) {
            var op = "0";
            if (d.clickstate == "1") {
                op = "1";
            }
            if (link == d.name) {
                if (selectMode == "1")
                    op = "1";

            }
            return op;
        })

    for (j = 0; j < commentsList.length; j++) {
        if (selectMode == "1")
            //$("#div" + commentsList[j]).css("border-left", "2px solid");
            $("#div" + commentsList[j]).css("border-left", "5px solid #00479D");
        else {
            $("#div" + commentsList[j]).css("border", "0px solid");

        }
    }
    //highlightTopicLinks();
}

function clickAuthor(name, selectMode) {
    logInteraction("ClickAuthor," + author);
    commentsList = [];
    for (i = 0; i < nodes.length; i++) {
        if (nodes[i].author == name) {
            if (selectMode == "1")
                nodes[i].clickAuthor = "1";
            else
                nodes[i].clickAuthor = "0";
            commentsList.push(nodes[i].commentid);
        }
    }

    for (j = 0; j < commentsList.length; j++) {
        if (selectMode == "1")
            //$("#div" + commentsList[j]).css("border", "2px solid");
            $("#div" + commentsList[j]).css("border-right", "5px solid #984EA3");
        else
            $("#div" + commentsList[j]).css("border-right", "0px solid");
    }

    // draw border around comments in thread view		
    /*nodeEnter.transition()
     .duration(duration)
     .selectAll("rect")
     /*.style("stroke",function(d, i) {
     //alert(d.author);
     //alert(this.property("stroke"));
     if (d.author == name) {					
     if(selectMode=="1"){
     return "rgb(152, 78, 163)";                    
     }
     }
     })*/
    /*.style("stroke-width", function(d, i) {
     var stroke = "0.25px";
     if(d.clickstate=="1") stroke="2px";
     
     if (d.author == name) {
     
     if(selectMode=="1"){
     //alert(d.author);
     d.clickstate="1";
     stroke = "2px";
     }
     else{
     d.clickstate="0";
     stroke="0.25px";
     }
     }
     
     return stroke;
     });*/

    authorSelector.transition()
        .duration(duration)
        .style("opacity", function (d, i) {
            var op = "0";
            if (d.clickstate == "1") {
                op = "0.2";
                if (d.author == author)
                    op = "1";
            }
            return op;
        });
    updateAuthorSelector("1");
    // fade border when toggle click
    authorRect.transition()
        .duration(0)
        .style("fill", function (d, i) {
            if (d.clickstate == "1")
                return authorClickColor;
        })
        .style("opacity", function (d, i) {
            var op = "0";
            if (name == d.name) {
                if (selectMode == "1")
                    op = "1";
            }
            return op;
        })
}

// Toggle children on click.
function click(d) {
    //alert("ClickComment," + d.commentid);
    logInteraction("ClickComment," + d.commentid);
    if (collectionMode) {


        updateConversationView(d);
    }
    else {
        for (i = 0; i < nodes.length; i++) {
            if (nodes[i].commentid == d.commentid) {
                if (nodes[i].clickcomment == "1")
                    nodes[i].clickcomment = "0";
                else
                    nodes[i].clickcomment = "1";
                break;
            }
        }

        nodeEnter.transition()
            .duration(0)
            .selectAll("rect")
            .style("stroke-width", function (s, i) {
                var stroke = "0.25px";
                if (s.clickcomment == "1") {
                    //stroke = "2px";
                    $("#div" + s.commentid).css("border-top", "2px solid");
                    $("#div" + s.commentid).css("border-bottom", "2px solid");
                }
                else {
                    $("#div" + s.commentid).css("border-top", "0px solid");
                    $("#div" + s.commentid).css("border-bottom", "0px solid");
                }
                if (d.commentid == s.commentid) {
                    /*if(d.clickstate=="1") 
                     {d.clickstate="0";}*/
                    //if (d.clickstate == "1")
                    //{
                    $("#comment" + d.commentid).html("<p>" +
                        "<a href=\"#" + d.parent + "\">" + ":</a>" + " " +
                        d.colorText +
                        "</p>");
                    //d.clickstate="1";
                    //}
                    /*else{
                     
                     $("#comment"+d.commentid).html("<p>"+
                     "<a href=\"#"+d.parent+"\">"+d.title+":</a>"+" "	+d.sentences+"</p>");
                     
                     }*/
                }
                return stroke;
            });
    }
    /*if (d.children) {
     d._children = d.children; //collapsed-> d._children
     d.children = null;
     } else {
     d.children = d._children;
     d._children = null;
     }
     update(d);*/
}

function updateConversationView(d, commentStart, commentEnd) {
    //alert("data/"+d.filename+".json");

    if (vis == null)
        vis = d3.select("#chart").append("svg:svg")
            .attr("width", w)
            .attr("height", h)
            .append("svg:g")
            .attr("transform", "translate(400,0)");
    else {
        filename = "data/" + dataset + "/" + d.filename + ".json";
        d3.json(filename, function (json) {
            json.x0 = 0;
            json.y0 = 0;
            root = json;
            collectionMode = false;
            verticalGapBetweenConversations = 0;
            indentation = 40;
            nodes = null;
            vis.selectAll(".node").remove();

            nodeEnter = null;
            preprocess(commentStart, commentEnd);

            vis.selectAll(".linkauthors").remove();
            vis.selectAll("image").remove();
            vis.selectAll(".linktopics").remove();

            if (textAuthor)
                textAuthor.remove();
            if (circle)
                circle.remove();

            //updateTopicLinks();           
            //reset ids. TO resolve the ugly bug
            startAngle = 120;
            authorLinks.forEach(function (t, i) {
                t.id = null;
            });
            topicLinks.forEach(function (t, i) {
                t.id = null;
            });
            authorLinks = [];
            topicLinks = [];
            authorList = [];
            topicList = [];
            vis.selectAll(".circle").remove();

            updateTopicFlag = true;

            //$("#div_title").html(root.title);
            $("#div_title").html(root.title + "\t(" + totalComments + " comments)");
            update(json, updateTopicFlag, d);
            loadCommentView("data/" + dataset + "/" + d.filename + ".json");


        });


    }
}


// mouse over comment
function mouseover(d) {

    /*var testCircle = circle.append("circle")
     .attr("cx", d.y)
     .attr("cy", d.x)
     .attr("r", 2)
     .style("fill", "red");
     */
    logInteraction("ThreadMouseOver", d.commentid);
    delete mouseOverLine1;
    delete mouseOverLine2;

    drawLineMouseOver(d);
    $("#div" + d.commentid).css("border-top", "2px solid");
    $("#div" + d.commentid).css("border-bottom", "2px solid");

    //alert(d.x);
    //alert(d.y);

    commentsList = [];
    commentsList[0] = d.commentid;
    highlightAuthorsbytopic("dummy");
    highlightAuthorsLinks();

    highlightTopicsbyAuthor(d.author);
    highlightTopicLinks();
}

// mouse out from comment
function mouseout(d) {
    logInteraction("ThreadMouseOut", d.commentid);
    undoHighlightCommentsbyAuthor(d.author);

    //mouseOverLine1.remove();
    //mouseOverLine2.remove();		

    vis.selectAll("line").remove();
    nodeEnter.transition()
        .duration(0)
        .selectAll("rect")
        .style("stroke-width", function (s, i) {
            var stroke = "0.25px";
            //if (s.clickstate == "1")
            //	stroke = "2px";
            //if($("#div"+d.commentid).attr('style').indexOf("rgb")==-1)		
            $("#div" + d.commentid).css("border-top", "0px solid");
            $("#div" + d.commentid).css("border-bottom", "0px solid");

            return stroke;
        });
}

function createTopicHierarchyCircular(topics, indentedListFlag) {
    var startAngle = 123;
    //updateTT(topicRoot);
    angleInDegrees = 120 / topics.length; //Don't want to use full 180 degree
    var shiftCoordx = 50;
    // find min and max topic strength for font normalization purpose	
    /*   var min = 9999, max = -9999, x;
     for (j = 0; j < root.topics.length; j++) {
     
     if (root.topics[j].strength < min)
     min = root.topics[j].strength;
     if (root.topics[j].strength > max)
     max = root.topics[j].strength;
     }*/

    topics = topics.slice(1, topics.length);
    topics = topics.reverse();
    var numberOfTopicstobeShown = topics.length;
    if (topics.length > 60)
        numberOfTopicstobeShown = 60;

    for (j = 0; j < numberOfTopicstobeShown; j++) {
        var topicLabel = topics[j].labels[0].phrase;

        if (indentedListFlag) {
            topics[j].x = j * 30;
        }
        else {

            var angle = startAngle + angleInDegrees * j;

            var coordx = (arcRad * Math.cos((startAngle + angleInDegrees * j) * Math.PI / 180)) + arcCx;
            coordx -= shiftCoordx;
            var coordy = (arcRad * Math.sin((startAngle + angleInDegrees * j) * Math.PI / 180)) + arcCy;
            //coordy =coordy+topics[j].y;
            coordx = coordx + topics[j].y;
            topics[j].y = coordx;
            topics[j].x = coordy;
        }
        var fontSize = 12;
        //var fontSize= (topics[j].strength - min) / 12 + 12;
        if (fontSize > 20)
            fontSize = 20;

        topicList.push({ topicID: topics[j].topicID, name: "" + topicLabel, x: coordx, y: coordy, angle: angle, col: topicColor, type: "topic", phrases: topics[j].labels, clickstate: "0", fontsize: fontSize + "px", commentid: "0" });
    }
    // Update the nodes�
    //topics = vis.selectAll("g.node")
    //.data(topics, function(d) {  return d.id || (d.id = ++i); });

    // Update the links�
    //alert(topicTree.links(topics));
    // Update the nodes�
    var node = vis.selectAll("g.node")
        .data(topics, function (d) {
            return d.id || (d.id = ++i);
        });

    var link = vis.selectAll("path.link")
        .data(topicTree.links(topics), function (d) {
            return d.target.id;
        });
    var x = topicTree.links(topics);
    // Enter any new links at the parent's previous position.
    source = topicRoot;

    link.enter().insert("path", "g")
        .attr("class", "link")
        //.attr("stroke", "red")
        .attr("d", function (d) {
            var o = { x: source.x0, y: source.y0 };
            return diagonal({ source: o, target: o });
        })
        .transition()
        .duration(duration)
        .attr("d", diagonal);


    var filenumber = filename.replace(dataset + "_", "");
    filenumber = filenumber.replace(".json", "");
    //linking topics with comments
    nodes.forEach(function (n, i) {
        for (j = 0; j < topicList.length; j++) {
            for (k = 0; k < n.sent.length; k++) {
                var topicConversationID = topicList[j].topicID.replace(dataset + "_", "");
                topicConversationID = topicConversationID.split(":");

                if (topicConversationID.length > 1) {

                    if (topicConversationID[0] == filenumber) {
                        //alert("yes"+JSON.stringify(topicConversationID[0]+" "+filenumber));
                        if (topicConversationID[1] == n.sent[k].systemtopicid) {
                            if (topicList[j].commentid == "0")
                                topicList[j].commentid = n.commentid;
                            topicLinks.push({
                                source: { x: topicList[j].y, y: topicList[j].x, topic: n.sent[k].systemlabel },
                                target: { x: n.x + findCommentHeight(n) / 2, y: n.y + spaceforFacetSelector, topic: n.sent[k].systemlabel, commentid: n.commentid }, clickcomment: "0"
                            });
                            break;
                        }
                    }
                }
            }
        }
    });

}




function drawLineMouseOver(d) {
    mouseOverLine1 = vis.append("svg:line")
        .attr("x1", d.y + spaceforFacetSelector)
        .attr("y1", d.x)
        .attr("y2", d.x)
        .attr("x2", d.y + spaceforFacetSelector + barWidth)
        .style("stroke", "rgb(0,0,0)")
        .style("stroke-width", "1.5px");

    mouseOverLine2 = vis.append("svg:line")
        .attr("x1", d.y + spaceforFacetSelector)
        .attr("y1", d.x + findCommentHeight(d))
        .attr("y2", d.x + findCommentHeight(d))
        .attr("x2", d.y + spaceforFacetSelector + barWidth)
        .style("stroke", "rgb(0,0,0)")
        .style("stroke-width", "1.5px");
}
function highlightTopicsbyTopic(link) {
    logInteraction("HoverTopic," + link);
    vis.selectAll(".circle")
        .transition()
        .duration(duration)
        .attr("opacity", function (d, i) {
            if (topicName == d.name)
                return "1";
            else if (d.clickstate == "1") {
                return "1";
            }
            else
                return "0.3";
        });

    roundedRect.transition()
        .duration(duration)
        //.style("fill","none")	
        .style("fill", function (d) {
            var fill = "none";
            if (d.clickstate == "1")
                fill = topicClickColor;
            return fill;
        })
        .style("opacity", function (d, i) {

            var op = "0";
            if (link == d.name) {
                op = "1";
            }
            else if (d.clickstate == "1")
                op = "1";
            return op;
        })
        .style("stroke", function (d, i) {
            var stroke = "none";
            if (link == d.name) {
                stroke = d.col;
            }
            else if (d.clickstate == "1")
                stroke = d.col;
            return stroke;
        }
        );
    /*textTopics.transition()
     .attr("style", function(d,i){
     fontstyle= "font-weight:regular;";	
     if(d.clickstate=="1") fontstyle="font-weight:bold;";
     if(link==d.name){
     fontstyle= "font-weight:bold;";
     }
     return fontstyle;
     });		
     */
    //roundedRect.transition().duration(0).style("fill","none")	;
}

function highlightCommentsbyTopic(topic) {

    nodeEnter.transition()
        .duration(duration)
        .selectAll("rect")
        .style("opacity", function (d, i) {
            var opac = "0.2";
            //alert(d.systemtopicid);
            for (i = 0; i < d.sent.length; i++) {

                if (topic.topicID == d.sent[i].systemtopicid) {

                    commentsList.push(d.commentid);
                    opac = 1; break;
                }
            }

            return opac;

        });

    topicSelector.transition()
        .duration(duration)
        .style("opacity", function (d, i) {
            var op = "0";
            if (d.clickstate == "1") {
                op = "0.2";
                for (i = 0; i < d.sent.length; i++) {
                    if (topic.topicID == d.sent[i].systemtopicid) {
                        op = "1";
                        break;
                    }
                }
            }
            return op;
        });

    updateAuthorSelector("0.2");

}

function highlightCommentsbyAuthor(author) {
    nodeEnter.transition()
        .duration(duration)
        .selectAll("rect")

        .style("opacity", function (d, i) {
            var opac = "0.2";
            for (i = 0; i < d.sent.length; i++) {
                if (d.author == author) {
                    opac = "1";
                    commentsList.push(d.commentid);
                    break;
                }
            }
            return opac;
        });
    topicSelector.transition()
        .duration(duration)
        .style("opacity", function (d, i) {
            var op = "0";
            if (d.clickstate == "1") {
                op = "0.2";
                if (d.author == author)
                    op = "1";
            }
            return op;
        });
    updateAuthorSelector(".2");

}
function highlightAuthorsbytopic(link) {

    var authorstobeHighlighted = [];
    for (i = 0; i < nodes.length; i++) {
        for (j = 0; j < commentsList.length; j++) {

            if (nodes[i].commentid == commentsList[j]) {

                authorstobeHighlighted.push(nodes[i].author);
                break;
            }
        }
    }
    vis.selectAll("image").transition()
        .duration(0)
        .attr("opacity", function (d, i) {
            var opacAuthor = "0.3";
            for (i = 0; i < authorstobeHighlighted.length; i++) {
                if (authorstobeHighlighted[i] == d.name) {
                    opacAuthor = "1";
                    break;
                }
            }
            return opacAuthor;
        });

    authorRect.style("fill", function (d, i) {
        var stroke = "none";
        for (i = 0; i < authorstobeHighlighted.length; i++) {
            if (authorstobeHighlighted[i] == d.name) {
                stroke = d.col;
                break;
            }
        }
        if (d.clickstate == "1")
            stroke = authorClickColor;
        return stroke;
    });
    authorRect.transition()
        .duration(0)
        .style("opacity", function (d, i) {
            var op = "0";
            for (i = 0; i < authorstobeHighlighted.length; i++) {
                if (authorstobeHighlighted[i] == d.name) {
                    op = "0.3";
                    break;
                }
            }
            if (d.clickstate == "1")
                op = "1";
            return op;
        });

    //.style("fill",function(d,i){	return d.col;})	;  
}
function highlightAuthorsbyAuthor(author) {
    logInteraction("HoverAuthor," + author);
    vis.selectAll("image")
        .transition()
        .duration(duration)
        .attr("opacity", function (d, i) {
            var op = "0.3";
            if (author == d.name)
                op = "1";
            else if (d.clickstate == "1")
                op = "1";
            return op;
        });


    authorRect.transition()
        .duration(duration)
        //.style("fill", "none")
        .style("fill", function (d) {
            var fill = "none";
            if (d.clickstate == "1")
                fill = authorClickColor;
            return fill;
        })
        .style("opacity", function (d, i) {
            var op = "0";
            for (i = 0; i < commentsList.length; i++) {
                if (commentsList[i] == d.commentid) {
                    op = "1";
                    break;
                }
            }
            if (d.clickstate == "1") {
                op = "1";
            }
            return op;
        })
        .style("stroke", function (d, i) {

            var stroke = "rgb(255, 255,255)";
            for (i = 0; i < commentsList.length; i++) {
                if (commentsList[i] == d.commentid) {
                    stroke = d.col;
                    break;
                }
            }
            if (d.clickstate == "1")
                stroke = d.col;
            return stroke;
        }
        );


    /*roundedRect.transition()
             .duration(duration)
 //.style("fill","none")	
             .style("fill", function(d) {
         var fill = "none";
         if (d.clickstate == "1")
             fill = topicClickColor;
         return fill;
     })
             .style("opacity", function(d, i) {
 
         var op = "0";
         if (link == d.name) {
             op = "1";
         }
         else if (d.clickstate == "1")
             op = "1";
         return op;
     })
             .style("stroke", function(d, i) {
         var stroke = "none";
         if (link == d.name) {
             stroke = d.col;
         }
         else if (d.clickstate == "1")
             stroke = d.col;
         return stroke;
     }
     );*/

}
function highlightTopics(topicIDs) {

    roundedRect.transition()
        .duration(duration)
        .style("opacity", function (d, i) {
            var op = "0";
            labelsbyCommentID();
            //console.log(systemTopicIDs);

            for (i = 0; i < topicIDs.length; i++) {
                if (topicIDs[i] == d.topicID) {
                    op = "0.3";
                    break;
                }
            }
            if (d.clickstate == "1")
                op = "1";
            return op;
        })
        .style("fill", function (d, i) {
            var stroke = "none";

            labelsbyCommentID();
            for (i = 0; i < topicIDs.length; i++) {

                if (topicIDs[i] == d.topicID) {
                    stroke = d.col;
                    break;
                }
            }
            if (d.clickstate == "1")
                stroke = topicClickColor;
            return stroke;
        });

    vis.selectAll(".circle")
        .transition()
        .duration(duration)
        .attr("opacity", function (d, i) {
            var op = "0.7";
            for (i = 0; i < topicIDs.length; i++) {

                if (topicIDs[i] == d.name) {
                    op = "1";
                    break;
                }
            }
            if (d.clickstate == "1")
                op = "1";
            return op;
        });


}
function highlightTopicsbyAuthor(link) {

    roundedRect.transition()
        .duration(duration)
        .style("opacity", function (d, i) {
            var op = "0";
            labelsbyCommentID();
            //console.log(systemTopicIDs);

            for (i = 0; i < systemTopicIDs.length; i++) {
                if (systemTopicIDs[i] == d.topicID) {
                    op = "0.3";
                    break;
                }
            }
            if (d.clickstate == "1")
                op = "1";
            return op;
        })
        .style("fill", function (d, i) {
            var stroke = "none";

            labelsbyCommentID();
            for (i = 0; i < systemTopicIDs.length; i++) {

                if (systemTopicIDs[i] == d.topicID) {
                    stroke = d.col;
                    break;
                }
            }
            if (d.clickstate == "1")
                stroke = topicClickColor;
            return stroke;
        });

    vis.selectAll(".circle")
        .transition()
        .duration(duration)
        .attr("opacity", function (d, i) {
            var op = "0.7";
            for (i = 0; i < systemTopicIDs.length; i++) {

                if (systemTopicIDs[i] == d.name) {
                    op = "1";
                    break;
                }
            }
            if (d.clickstate == "1")
                op = "1";
            return op;
        });


}

function labelsbyCommentID() {
    systemTopicIDs = [];
    if (collectionMode) {
        //todo
    }
    else {
        for (i = 0; i < commentsList.length; i++) {
            for (j = 0; j < nodes.length; j++) {
                if (nodes[j].commentid == commentsList[i]) {
                    for (s = 0; s < nodes[j].sent.length; s++) {
                        systemTopicIDs.push(nodes[j].sent[s].systemtopicid);
                    }
                    break;
                }
            }
        }

    }
}
function highlightTopicLinks(currentTopic) {

    //alert(currentTopic);
    vis.selectAll(".linktopics")
        .transition()
        .attr("opacity", function (d, i) {
            var opac = "0.3";
            if (d.type == "collection") {
                if (d.target.topic == currentTopic) {
                    opac = "1";

                    //console.log(d);
                    var atopicCollection = [];
                    atopicCollection.push(d.source.topicNode);
                    highlightTopicsbyConversation(atopicCollection);
                }
            }
            else {
                for (i = 0; i < commentsList.length; i++) {
                    /*if(d.target.topic==currentTopic && d.type=="collection"){
                        console.log(currentTopic+" "+d.target.topic); 
                    }*/
                    if (d.clickstate == "1")
                        opac = "1";
                    else if (d.target.commentid == commentsList[i]) {
                        opac = "1";
                        if (currentTopic == undefined) { console.log("yes"); opac = "1"; }
                        //d.clickstate="1";

                    }
                }
            }

            return opac;
        });
    /*vis.selectAll(".linktopics")
            .transition()            
            .attr("opacity", function(d, i) {
            var opac = "0";

             return opac;
    }); */
}
function highlightTopicLinksbyCollectionTopics(topicsList) {

    //alert(currentTopic);
    vis.selectAll(".linktopics")
        .transition()
        .attr("opacity", function (d) {
            var opac = "0.3";
            if (d.type == "collection") {
                for (i = 0; i < topicsList.length; i++) {
                    if (d.target.topic == topicsList[i]) {
                        opac = "1";
                    }

                }
            }

            return opac;
        });

}
function highlightAuthorsLinks() {
    vis.selectAll(".linkauthors")
        .transition()
        .attr("opacity", function (d, i) {
            var opac = ".3";

            for (i = 0; i < commentsList.length; i++) {
                if (d.target.commentid == commentsList[i])
                    opac = "1";
            }
            return opac;
        });
}



function undoHighlightTopicsbyConversation(conversationid) {

    /*vis.selectAll(".circle")
     .transition()
     .duration(duration)
     .attr("opacity", function(d, i) {
     
     var opac = "0.7";
     if (d.clickstate == "1") {
     opac = "1";
     }
     return opac;
     });*/


    /* roundedRect.transition()
     .duration(duration)
     .style("opacity", function(d, i) {
     
     var opac = "0.0";
     if (d.clickstate == "1") {
     opac = "1";
     }
     return opac;
     });*/

}
function undoHighlightTopicsbyTopic(link) {

    undohighlightTopicLinks();
    undoHighlightAuthorsLinks();



    vis.selectAll(".circle")
        .transition()
        .duration(duration)
        .attr("opacity", function (d, i) {

            var opac = "0.7";
            if (d.clickstate == "1") {
                opac = "1";
            }
            return opac;
        });


    roundedRect.transition()
        .duration(duration)
        .style("opacity", function (d, i) {

            var opac = "0.0";
            if (d.clickstate == "1") {
                opac = "1";
            }
            return opac;
        });

}

function undoHighlightCommentsbyTopic(link) {
    nodeEnter.transition()
        .duration(duration)
        .selectAll("rect")
        .style("opacity", 1);

    topicSelector.transition()
        .duration(duration)
        .style("opacity", function (d, i) {
            var op = "0";

            if (d.clickstate == "1")
                op = "1";
            return op;
        });
    updateAuthorSelector("1");
    /*topicSelector.transition()
     .duration(duration)
     .style("opacity", function(d, i) {
     var op = "0";
     if(d.clickstate=="1")
     op="1";
     return op;
     })*/

    vis.selectAll("image").transition()
        .duration(duration)
        .attr("opacity", function (d, i) {
            if (d.clickstate == "1")
                return "1";
            else
                return "0.3";
        });

    authorRect.transition()
        .duration(0)
        .style("opacity", function (d, i) {
            var opac = "0.0";
            opac = "0.0";
            if (d.clickstate == "1")
                opac = "1";
            return opac;
        })
        .style("fill", function (d, i) {
            if (d.clickstate == "1")
                return authorClickColor;
        }
        );
}


function undoHighlightCommentsbyAuthor(author) {
    nodeEnter.transition()
        .duration(duration)
        .selectAll("rect")
        .style("opacity", function (d, i) {
            var opac = "1";
            return opac;
        });
    topicSelector.transition()
        .duration(duration)
        .style("opacity", function (d, i) {
            var op = "0";
            if (d.clickstate == "1")
                op = "1";
            return op;
        });
    updateAuthorSelector("1");
    undohighlightTopicLinks();

    /*roundedRect.style("fill", function(d, i) {
     
     var stroke = "rgb(255,255,255)";
     if(d.clickstate=="1") return topicClickColor;			
     });*/
    roundedRect.transition()
        .duration(duration)
        .style("opacity", function (d, i) {
            var op = "0";
            labelsbyCommentID();
            for (i = 0; i < systemTopicIDs.length; i++) {

                if (systemTopicIDs[i] == d.topicID) {
                    op = "0";
                    break;
                }
            }
            if (d.clickstate == "1")
                op = "1";
            return op;
        });
    undoHighlightAuthor();
    vis.selectAll(".circle")
        .transition()
        .duration(duration)
        .attr("opacity", function (d, i) {
            var op = "0.7";
            for (i = 0; i < systemTopicIDs.length; i++) {

                if (systemTopicIDs[i] == d.topicID) {
                    op = "0.7";
                    break;
                }
            }
            return op;
        });

}

function undoHighlightAuthor() {
    vis.selectAll("image").transition()
        .duration(duration)
        .attr("opacity", function (d, i) {
            opac = "0.3";
            if (d.clickstate == "1") {
                opac = "1";
            }
            return opac;
        });
    authorRect.transition()
        .duration(duration)
        .style("opacity", function (d, i) {

            var opac = "0.0";
            if (d.clickstate == "1") {
                opac = "1";
            }
            return opac;
        });

    undoHighlightAuthorsLinks();
    commentsList = [];

}

function undohighlightTopicLinks() {
    vis.selectAll(".linktopics")
        .transition()
        .attr("opacity", function (d, i) {
            var opac = ".2";
            if (d.clickstate == "1")
                opac = "1";

            return opac;
        });
    //alert(filename);
    undoHghlightTopicsbyConversation(currentConversationid);
    //undoHighlightTopicsTreeNodesTopic();

}
function undoHighlightAuthorsLinks() {
    vis.selectAll(".linkauthors")
        .transition()
        //.duration(duration)
        .attr("opacity", function (d, i) {
            return "0.3";
        });
}

function updateAuthorSelector(selectedOpacity) {
    authorSelector.transition()
        .duration(duration)
        .style("opacity", function (d, i) {
            var op = "0";
            if (d.clickAuthor == "1") {
                op = selectedOpacity;
            }
            return op;
        });


}

function findColor(d, mode) {
    //return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
    //return d._children ? "#c6dbef" : d.children ? "#ffffff" : "#ffffff";

    var colorbins = new Array();
    colorbins[0] = 0;
    colorbins[1] = 0;
    colorbins[2] = 0;
    colorbins[3] = 0;
    colorbins[4] = 0;
    if (mode) {
        totalLines = 0;
        for (i = 0; i < d.topics.length; i++) {
            var k = 1;

            //alert("k"+JSON.stringify(d.topics[i].topicsentiments));

            var a = d.topics[i].topicsentiments;
            for (var j = 0; j < 5; j++) {
                colorbins[j] += parseInt(a[j]);
                totalLines += parseInt(a[j]);
            }
            //for (j = 0; j < d.topicsentiment[i].length; j++) {

            //alert(JSON.stringify(colorbins[0]));
            //}
        }


        var count = 0;
        for (i = 0; i < colorbins.length; i++) {
            count = count + colorbins[i];
            colorbins[i] = colorbins[i] / totalLines;

            //alert(colorbins[i]);
        }
    }
    else {
        for (i = 0; i < d.sent.length; i++) {
            if (d.sent[i].linePolarity < -1.99) {
                colorbins[0]++;
            }
            else if (d.sent[i].linePolarity < 0) {
                colorbins[1]++;
            }
            else if (d.sent[i].linePolarity == 0) {
                colorbins[2]++;
            }
            else if (d.sent[i].linePolarity > 1.99) {
                colorbins[4]++;
            }
            else if (d.sent[i].linePolarity > 0) {
                colorbins[3]++;
            }
        }
        for (i = 0; i < colorbins.length; i++) {
            colorbins[i] = colorbins[i] / d.sent.length;
            //alert(colorbins[i]);
        }
        /*selectedColor = "rgb(26, 150, 65)";
         if (d.sent[0].linePolarity < 0) {
         //selectedColor="rgb("+colorFamily[1][parseInt(d.sent[0].systemtopicid)]+")";
         selectedColor = "rgb(215, 25, 28)";
         } */
    }
    return colorbins;
    //return selectedColor;  
}
function opacity(d) {
    //return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
    //return d._children ? "#c6dbef" : d.children ? "#ffffff" : "#ffffff";
    opacity = 1;
    if (d.sent[0].systemtopicid < 5) {
        opacity = 0.2;
    }
    return opacity;
}
function findCommentHeight(d) {
    if (d.sent.length * 2 < minimumbarHeight)
        return minimumbarHeight;
    else if (d.sent.length * 2 > 20)
        return maximumbarHeight;
    else
        return d.sent.length * 2;

}
function findConversationHeight(d) {
    if (collectionMode) {
        var minVal = 9999, maxVal = -9999, x;
        for (j = 0; j < nodes.length; j++) {
            var currentLength = parseInt(nodes[j].totalLines);

            if (currentLength < minVal) {
                minVal = nodes[j].totalLines;
            }
            if (currentLength > maxVal)
                maxVal = nodes[j].totalLines;

        }
        //alert("yes "+minVal+","+maxVal);
        var normalizedLength = ((parseInt(d.totalLines) - minVal) / (maxVal - minVal)) * 50 + 10;
        //alert(normalizedLength);
        //findDurationofAConversation(d);
        return normalizedLength;
    }
    else {
        if (d.sent.length * 2 < minimumbarHeight)
            return minimumbarHeight;
        else if (d.sent.length * 2 > 20)
            return maximumbarHeight;
        else
            return d.sent.length * 2;

    }
}

function findDurationofAConversation(d) {

    var startTime = findStartTime(d);
    var endTime = findEndTime(d);
    var duration = endTime - startTime;
    //alert(endTime- startTime);
    d.duration = duration;
    //alert(duration);
    if (duration < 0)
        //alert(d.title+ d.date+" "+d.datelast+" "+ d.startTime+" "+d.endTime);
        var minVal = 99999999999, maxVal = -9999, x;
    for (j = 0; j < nodes.length; j++) {
        var currentLength = nodes[j].duration;
        //alert("yes1 "+currentLength);
        if (currentLength < minVal) {
            minVal = nodes[j].duration;
        }
        if (currentLength > maxVal)
            maxVal = nodes[j].duration;
    }
    //alert("yes "+minVal+","+maxVal);
    var normalizedLength = ((duration - minVal) / maxVal) * 50 + 10;
    //alert(normalizedLength);

}


function showCommentTooltip(d) {
    return d.sent[0].sent + "...";
}