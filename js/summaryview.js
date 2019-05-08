var first = 1;


function parsetopicNodes(nodes) { // takes a nodes array and turns it into a <ol>
    var ol = document.createElement("ul");
    if (first == 1)
    {
        ol.setAttribute('id', 'comments');
        first = 0;
    }
    else {
        ol.setAttribute('class', 'children');
    }
    for (var i = 0; i < nodes.length; i++) {
        if(ifSummaryInThePath(nodes[i]))
            ol.appendChild(parsetopicNode(nodes[i]));

    }
    return ol;
}
function ifSummaryInThePath(currentNode){
            if(currentNode.summary) {return true;}
            else{
            var childrenList=null;
            if (currentNode.children)
                childrenList=currentNode.children;
            else if(currentNode._children)
                childrenList=currentNode._children;
            if(childrenList)
            for (i = 0; i < childrenList.length; i += 1) {
                result = ifSummaryInThePath(childrenList[i]);
//                // Return the result if the node has been found
                if (result !== false) {
                    return result;
                }
            }
        }
}
function parsetopicNode(node) { // takes a node object and turns it into a <li>
    var li = document.createElement("LI");
    li.setAttribute('id', node.topicID);
    var summ=node.summary;
    if(!node.summary)
        summ="";
    var title="";
    var fontsize=node.fontsize;
    if(typeof node.fontsize === "undefined")
        fontsize=14;
    var topicNodeLabel=node.labels[0].phrase;
    var summIcon="";
    if(summ!="")
        summIcon=" \uf15c";
    //alert(fontsize);
    summIcon="<a class=\"link-title\" style=\"color: "+topicColor+";  font-family:FontAwesome; font-size:"+14+"px;\" >" +summIcon  + "</a>"; 
    
    title="<a class=\"link-title\" style=\"color: "+topicColor+";  font-size:"+fontsize+"px;\" >" + topicNodeLabel + "</a>"; 
    text = "<div class=\"comment\"" + "id=\"div" + node.topicID + "\" style=\"border:" + "1px;\">" +
            "<div class=\"comment-body\"" + "id=\"comment" + node.topicID + "\"><p>" +
            title+
            summIcon+
            "<p>"+
             '<textarea rows="4" cols="250">'+
            summ +"</textarea> "
            "</p>" +
            "</div>" +
            "</div>";

    li.innerHTML = text;
    //	li.className = node.class;
    if (node.children) {
        li.appendChild(parsetopicNodes(node.children));
    }
    else if (node._children) {
        li.appendChild(parsetopicNodes(node._children));
    }
    return li;
}

function loadSummaryView(topicRoot) {
    //topicHierarchy = "[" + JSON.stringify(topicHierarchy) + "]"; //add damm bracket
    //jsonObj = JSON.parse(topicHierarchy);		// get back to json object again
    //console.log(topicHierarchy);
    da = parsetopicNodes(topicRoot.children);

    console.log(da);
    $("#dialog").html('');
    document.getElementById("dialog").appendChild(da);

    $(window).load(function() {
        alert("y");
        $('#comments').collapsible({xoffset: '-20', yoffset: '30', defaulthide: false, imagehide: 'arrow-down.png', imageshow: 'arrow-right.png'});
    });
}