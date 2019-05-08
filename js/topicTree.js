var topicTreeWidth = 500;
//var margintopicTree = {top: 30, right: 20, bottom: 30, left: -300};
var doubleclick = 0;
var collapseAll = 0;
var topicNodesCounter = 0;
var topicLabelsFromConversation = true;
var selectedNode = null;
var draggingNode = null;
var dragStarted = false;
var lastOperation = "";
var dropRecycle=false;
var removedNodes=[];


     
// Define your menu
var menuRecycle = [
    {
            title: 'Restore all topics',
            action: function(elm, d) {
                if(removedNodes.length==0) alert('no topics in the recycle bin');
                else{
                    for(i=0;i<removedNodes.length;i++){ 
                         var node=removedNodes[i];
                         //alert(selectedNode.parent.topicID+" "+selectedNode.parent.labels[0].phrase);
                         var parentNode = findNode(node.parent.topicID, topicRoot, '');
                         //console.log("parent:", parentNode);

                         var index=parentNode.children.length;
                         //if(operation[1]<parentNode.children.length) index=parseInt (operation[1]);
                         if (parentNode.children)
                             parentNode.children.splice(index, 0, node);
                         else
                             parentNode._children.splice(index, 0, node);    
                     }
            }
                removedNodes=[];
                updateTopicTree(parentNode);

            }
    },
    {
            title: 'Empty Recycle bin',
            action: function(elm, d, i) {
                if(removedNodes.length==0) alert('no topics in the recycle bin');
                    removedNodes=[];

            }
    }
];

    var menuNode =function(data){ items= [
        /*{
                title: 'Add summary',
                action: function(elm, d) {

                            console.log(d);
                            addSummary(d);

                }
        },       */    

        {
                //title: 'Add another level',
                //title: 'Show me fewer more generic children topics',
                title: 'Show fewer, more generic sub-topics',
                action: function(elm, d) {

                        console.log(d);
                        addALevel(d);

                }
        },
        {
                //title: 'Remove the next level',
                //title: 'Show me more specific children topics',
                title: 'Show more specific sub-topics',
                action: function(elm, d) {
                        console.log(d);                                   
                        removeALevel(d);                            
                }
        },
        {
                title: 'Rename this topic',
                action: function(elm, d) {
                        console.log(d);                                   
                        renameATopic(d);       
                }
        }
    ];
//    if(data._children || data.children==null)
//        return [items[2]];
    if(!data.addlevel || (data.addlevel==0)){    
        if(data._children || data.children==null)
            return [items[2]];  
        return [items[0],items[2]];    
        }
        
    else
        return items.slice(1,items.length);
    
//    else if (data.children)
//        return [items[0],items[2]];
//    if (data.addlevel==1)
//        return [items[0],items[2]];  

//    else if(data.children==null)
//        return items.slice(1,items.length);
//    if(!data.addlevel || (data.addlevel==0))    
//        return [items[0],items[2]];
//    else
//        return items.slice(1,items.length);
};
  $(function() {
    $( "#dialog-confirm" ).dialog({
      autoOpen: false,  
      resizable: false,
      width:400,
      modal: true,
       
    });
  });    
  
 

 
  function openhtml( ){
    var text="<label for=\"name\">Name</label>"+
      " <input type=\"text\" name=\"name\" id=\"renametext\" class=\"text ui-widget-content ui-corner-all\">";
    $( "#dialog_rename").html(text);
      
      
  }  
  function openr(par){
    $("#dialog_rename").show(0);
      
    $( "#dialog_rename").dialog(par);
  } 
function renameATopic(d){
    logInteraction("show more subtopics," + d.topicID);        
    
    $( "#dialog_rename" ).dialog({
      autoOpen: false,  
      resizable: false,
      width:400,
      modal: true,
      buttons: {                
        "Save": function() {
          if($("#renametext").val()){
             var node=findNode(d.topicID,topicRoot);
             node.labels[0].phrase=$("#renametext").val();
             node.name=node.labels[0].phrase;
 
            vis.selectAll("g.nodeTopicTree").forEach(function(t, i) {
                t.id = null;
            });
            //vis.selectAll(".circle").remove();
            vis.selectAll("g.nodeTopicTree").remove();
 
            updateTopicTree(topicRoot,false);
          }  
          $( this ).dialog( "close" );

        },        
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      }          
    });    
        var callbacks = $.Callbacks();
        callbacks.add(openhtml);

        // Outputs: foo!
        callbacks.fire();

        callbacks.add( openr);

        // Outputs: bar!, fn2 says: bar!
        callbacks.fire( "open" );
  }
  function open(par){
    $("#dialog").show(0);
      
    $( "#dialog").dialog(par);
  }
$(document).ready(function() {
    $("#btn_showsummary").click(function(event) {
        //loadSummaryView(topicRoot);



$( "#dialog" ).dialog({
                      autoopen: false,
                      resizable: false,
                      width:800,
                      height:800,
                      buttons: {                
                        "Save": function() {
                            saveTree();
                            $( this ).dialog( "close" ); 
                        },        
                        Cancel: function() {
                          $( this ).dialog( "close" );
                        }
                      }                

                });
//      $("#dialog" ).html("aaaa");
//      $("#dialog").dialog("open");
        var callbacks = $.Callbacks();
        callbacks.add(loadSummaryView);

        // Outputs: foo!
        callbacks.fire( topicRoot);

        callbacks.add( open);

        // Outputs: bar!, fn2 says: bar!
        callbacks.fire( "open" );
                    

    });
    $("#btn_undo").click(function(event) {
	 
		 
	       
        //alert(lastOperation);
        var operation = lastOperation.split(',');
        if (lastOperation == "")
            alert('no undo operation');
        else if (operation[0] == 'removeanode') {
            //var nodeTopicID=operation[1];            
            var node=removedNodes[removedNodes.length-1];
            //alert(selectedNode.parent.topicID+" "+selectedNode.parent.labels[0].phrase);
            //var parentNode = findNode(node.parent.topicID, topicRoot, '');
            //console.log("parent:", parentNode);
            var parentNode=node.parent;
            var index=parentNode.children.length;
            if(operation[1]<parentNode.children.length) index=parseInt (operation[1]);
            if (parentNode.children)
                parentNode.children.splice(index, 0, node);
            else
                parentNode._children.splice(index, 0, node);  
            removedNodes.pop();            
            updateTopicTree(parentNode);
            selectedNode = null;
            draggingNode = null;            
           }
           
        else if (operation[0] == 'mergesiblings') {
            var draggingNodeID = operation[1];
            var selectedNodeID = operation[2];
            var draggingNodeOldParentID = operation[3];
            var draggingNodeIndex = operation[4];

            var draggingNodeOldParent = findNode(draggingNodeOldParentID, topicRoot);

            var dragNode = findNode(draggingNodeID, topicRoot, 'remove');
            var selNode = findNode(selectedNodeID, topicRoot);
            //selNode.parent=selNode.parent.parent;
            var selNodeIndex = 0;

            var childrenList;
            if (selNode.parent.parent.children)
                childrenList = selNode.parent.parent.children;
            else if (selNode.parent.parent._children)
                childrenList = selNode.parent.parent._children;

            for (i = 0; i < childrenList.length; i++) {
                if (childrenList[i].topicID == selNode.parent.topicID) {
                    selNodeIndex = i;
                    break;
                }
            }

            var newparentSelNode = selNode.parent.parent;
            addNode(newparentSelNode, selNode, selNodeIndex);
            console.log(selNode);
            findNode(selNode.parent.topicID, topicRoot, 'remove');
            addNode(draggingNodeOldParent, dragNode, draggingNodeIndex);

            selNode.parent = newparentSelNode;
            dragNode.parent = draggingNodeOldParent;
            updateTopicTree(topicRoot, false);

        }
        if(operation[0]== 'addAsChild'){
            var draggingNodeID = operation[1];
            var selectedNodeID = operation[2];
            var draggingNodeOldParentID = operation[3];
            var draggingNodeIndex = operation[4];

            var draggingNodeOldParent = findNode(draggingNodeOldParentID, topicRoot);

            var dragNode = findNode(draggingNodeID, topicRoot, 'remove');
            var selNode = findNode(selectedNodeID, topicRoot);

            addNode(draggingNodeOldParent, dragNode, draggingNodeIndex);
            dragNode.parent = draggingNodeOldParent;

 
                updateTopicTree(topicRoot, false);            
            
        }
        else if (operation[0] == 'addlevel') {
            var node = findNode(operation[1], topicRoot);

            removeALevel(node);
        }
        else if (operation[0] == 'removelevel') {
            var node = findNode(operation[1], topicRoot);

            addALevel(node);
        }
        lastOperation = "";
    });





    /*var draggingNodeOldParentID=operation[3];
     
     var dragNode=findNode(draggingNodeID, topicRoot,'remove');   
     var selNode=findNode(selectedNodeID, topicRoot); 
     var draggingNodeOldParent=findNode(draggingNodeOldParentID, topicRoot);
     //selNode.parent=selNode.parent.parent;
     
     findNode(selNode.parent, topicRoot,'remove');   
     addNode(selNode.parent.parent, selNode, 0);
     addNode(draggingNodeOldParent, dragNode, 0);
     
     selNode.parent=selNode.parent.parent;
     
     
     addNode(draggingNodeOldParent, dragNode, 0);
     
     
     setTimeout(function() {
     nodesTopicTree.forEach(function(t, i) {
     t.id = null;
     });    
     updateTopicTree(topicRoot, false);
     },0);                */




});



function updateTopicTree(source, mode) {
    //console.log(source);
    // Compute the flattened node list. TODO use d3.layout.hierarchy
    //console.log("f",topicRoot.children[1].sentiments);

    //TODO: when expanding a node after merge operation, fix coordinates
    //may be order the nodes
    //if(firstTime){
    nodesTopicTree = topicTree.nodes(topicRoot);
    //alert(conversationData.length);
    nodesTopicTree = nodesTopicTree.slice(1, nodesTopicTree.length);
    //}
    console.log(nodesTopicTree);
    
    //if (topicLabelsFromConversation)
    //    updateTopicLabelsFromConversation();

    var topicBarHeight = 30;
    var topicSentimentWidth = 0;
    //topicSentimentWidth = 25;
    //
//var height = Math.max(500, nodesTopicTree.length * barHeight + margintopicTree.top + margintopicTree.bottom);
    /*d3.select("vis").transition()
     .duration(duration)
     .attr("height", height);
     
     d3.select(self.frameElement).transition()
     .duration(duration)e
     .style("height", height + "px");*/
//    console.log(conversationData);
    // Compute the "layout".
    var min = 99999, max = -99999;
        nodesTopicTree.forEach(function(n, i) {
        //if(firstTime){

        n.x = i * topicBarHeight + 20;
        n.y = n.y - 800;
        //}
        //console.log(n.labels);
        n.name = n.labels[0].phrase;
        n.clicked = 0;
        n.col = topicColor;
        var childrenNodes;
        if (n._children) {
            childrenNodes = n._children;
             
        }
        else if (n.children) {
            childrenNodes = n.children;
            
        }
        try{
        aggregateSentiment(n, childrenNodes);        
        }
        catch(err){n.strength=0;}
        if (n.strength < min)
            min = n.strength;
        if (n.strength > max)
            max = n.strength;
        //n.totalstrength = 0;
        //n.firstConversation = findFirstCommentofATopicNode(n);
        //alert(conversationData.length);
        if(!n.summary)
            n.summary="";
    });

    nodesTopicTree.forEach(function(n, i) {
        if (!n.fontsize) {
            n.fontsize = (n.strength - min) / (max - min) * 50;
            if (n.fontsize > 22)
                n.fontsize = 22;

            if (n.fontsize < 13)
                n.fontsize = 13;
            //if (!n._children && !n.children){
            //  if(n.fontsize>18)n.fontsize=18;
            //}
        }
    });

//    console.log(max + " " + min);
    // Update the nodes.  
    var nodeTopicTree = vis.selectAll("g.nodeTopicTree")
            .data(nodesTopicTree, function(d) {
        return d.id || (d.id = ++topicNodesCounter);
    });
    topicNodeEnter = nodeTopicTree.enter().append("g")
            .attr("class", "nodeTopicTree");
    
    topicNodeEnter.attr("transform", function(d) {
            return "translate(" + d.parent.y0 + "," + d.parent.x0 + ")";
        })
                .style("opacity", 1e-6);
    

    recycleRect =vis
            .append("g")
            .attr("class", "recyclerect")    
             .attr("x",-790)            
            .attr("y", nodesTopicTree[0].x+870);
 
            recycleRect.append("svg:rect")
            .attr("rx", 6)
            .attr("ry", 6)
            .attr("x",-790)
            .attr("height", function(d) {
                  return 40;
              })
            .attr("width", function(d) {
                  return 35;
              })
            .attr("y", nodesTopicTree[0].x+890)
            .attr("fill", "white")	 

    
            .style("opacity", "0.5")    
            .style("stroke", "darkgrey")
            .style("stroke-width", "2px");
      
    recycleRect.append("svg:text")
    .attr("x",-790)  
    .attr("y", nodesTopicTree[0].x+890)
            .attr("dy", 30)
            .attr("dx", 5)
            .attr('font-family', 'FontAwesome')
    
            .text("\uf1f8")
            //.attr("fill", "red")
            .style("stroke", "darkgrey")
   
            .style("font-size", '30px');
            
    recycleRect.on("mouseover", mouseoverRecycle);
    recycleRect.on("mouseout", mouseoutRecycle);
    			recycleRect.on('contextmenu', d3.contextMenu(menuRecycle, {
				onOpen: function() {
//					console.log('opened!');
				},
				onClose: function() {
//					console.log('closed!');
				}
			})); // attach menu to element
    
//    recycleRect.selectAll("text").on("mouseover", mouseoverRecycle);              

    var textLabels = vis.selectAll("text.topiclabel");
    textLabels.on("mouseover", null);
    //vis.selectAll("rect").on("mouseover", null);
    textLabels.on("mouseout", null);
    //vis.selectAll("rect").on("mouseout", null);
console.log(localStorage.getItem('interfaceName'));

    topicNodeEnter.call(d3.behavior.drag()
            .on("dragstart", function(d) {
                //if(localStorage.getItem('interfaceName')!='MultiConVis'){
                    console.log('dragstart' + d.name);
                    //console.log(d.x+" "+d.y);
                    dragStart(d);
//}
    })
            .on("drag", function(d) {
        var node = d3.select(this);
//                initialDrag(node);
        node.attr("transform", function(d, i) {
            d.xUpdate += d3.event.dx;
            d.yUpdate += d3.event.dy;
            //console.log(d.xUpdate+" "+d.yUpdate+" "+d.x+" "+d.y);
            return "translate(" + [d.y + d.xUpdate, d.x + d.yUpdate] + ")";
        })
    })
            .on("dragend", function(d) {
        console.log('dragend');
        dragEnd(d);
    }));

    
    topicNodeEnter.append("text")
            .text(function(d) {
        return d.labels[0].phrase;
    })
            .style("font-size", function(d) {
        return d.fontsize;
    }).attr("fill", function(d) {
        return d.col;
    });
    // Enter any new nodes at the parent's previous position.

    /*topicNodeEnter.append("circle")
     .attr("r", radius)
     .attr("fill", function(d) {
     return d.col;
     });*/

    textHeight = 20;
    topicNodeRoundedRectangle = topicNodeEnter

            .append("svg:rect")
            .attr("rx", 6)
            .attr("ry", 6)
            .attr("x", 8)
            .attr("width", function(d) {
        rectName = d.name;
        var width;
        topicNodeEnter.selectAll("text")
                .each(function(d) {
            if (d.name == rectName) {
                var bbox = this.getBBox();
                width = bbox.width;
                textHeight = bbox.height + 7;
            }
        });
        d.width = width;
        return width + topicSentimentWidth + 7;
        //return width;
    })
            .attr("height", function(d) {
        return textHeight;
    })
            .attr("y", -textHeight / 2 - 4)
            .style("fill", "(255, 255,255)")
            .style("opacity", "0")
            .style("stroke", "steelblue")
            .style("stroke-width", "2px");

    topicNodeEnter.selectAll("text").remove();
    topicNodeEnter
            .append("a")
            .attr("xlink:href", function(d) {
        return "#div" + d.firstConversation;
    })
            .append("text")
            .attr("dy", 3)
            .attr("dx", 10)
            .attr("class", "topiclabel")
            .text(function(d) {
        return d.labels[0].phrase;
    })
            .attr("fill", function(d) {
        return d.col;
    })
            .style("font-size", function(d) {
        return d.fontsize;
    })
            .append("title").text(function(d) {
        var phrases = "";

        if (d.labels) {

            for (i = 1; i < d.labels.length; i++) {
                phrases += d.labels[i].phrase + "\n";
                if (i > 4)
                    break;
            }
        }
        return phrases;
    });

    topicNodeEnter.append("text")
            .attr("class", "expand")
            .attr("dy", 3)
            .attr("dx", -10)
            .style("fill", colorNodeTopicTree)
            .attr('font-family', 'FontAwesome')
            .attr('font-size', function(d) {
        return d.size + 'em'
    })
            .attr("fill", function(d) {
        return d.col;
    });
    
    
topicNodeEnter.append("foreignObject")
            .attr("class", "externalObject")
            .attr("x", function(d1) {
                return d1.width+28;
            })    

            .attr("display", function(d1) {         
                return 'none';
        })                
            .append("xhtml:div")
            .html(function(d1,i) {return "<textarea rows=\"3\" cols=\"30\" style=\"position: fixed; overflow-y: scroll;resize: none; z-index: 1;\" id=\"text"+d1.topicID
            +"\"class=\"summarybox\" placeholder='enter your summary'>"+d1.summary+"</textarea>"
            +"<button id=\"button"+d1.topicID
            +"\" style=\"position: fixed; top:70px; z-index: 1;\" class=\"save_button\" " // type=\"button\" class=\"save_button\" style=\"position: fixed; top:70px; z-index: 1;\" align=\"right\""+
            //+"\"onclick=\"saveclick("  + ")\" " 
              +">Save</button> "
 ;});

    vis.selectAll("g.nodeTopicTree").selectAll("text.expand")
            .text(findicon)
            //.style("fill", colorNodeTopicTree) 
            .on("click", expandCollapseNodeTopicTree);
    
    topicNodeEnter.append("text")
            .attr("class", "summary")
            .attr("dy", 3)
            .attr("x", function(d) {
                return d.width+27;
            })
            .attr("dx", -10)
            .style("fill", colorNodeTopicTree)
            .style("opacity", 0)
            .text("\uf15c")
            .attr('font-family', 'FontAwesome')
            .attr('font-size', function(d) {
        return d.size + 'em'
    });
    vis.selectAll("g.nodeTopicTree").selectAll("text.summary")
     .on("mouseover",  function(d) {
                vis.selectAll("g.nodeTopicTree").selectAll("text.summary")
                 .style("opacity", function(d1, i)
               { 
                    if(d1.summary!="") {  return 1;}
                    else if (d.topicID==d1.topicID) return 0.5;                           
                    else return 0;
                }); 
        })
     .on("mouseout",  function(d) {
                vis.selectAll("g.nodeTopicTree").selectAll("text.summary")
                 .style("opacity", function(d1, i)
               {
                    if(d1.summary!="") return 1;                           
                    else if (d.topicID==d1.topicID) return 0;
                    else return 0;
                }); 
        })
     .on("click",  function(d) {
        vis.selectAll("g.nodeTopicTree").selectAll(".externalObject")             
            .attr("display", function(d1) { 
                if(d.topicID!==d1.topicID) {
                    return 'none';
                }
                else{//alert('yes'+d.topicID);
                }
        });          

                 
        if(d.summary!=""){
            //alert('summary'+d.summary);    
            $("#text"+d.topicID).text(d.summary);
        }
        else{
            //alert('no');
            //$("#text"+d.topicID).text("no");
        }

        vis.selectAll("g.nodeTopicTree").selectAll(".externalObject").selectAll(".save_button")            
        .on("click",  function(d1) {
            var node=findNode(d.topicID,topicRoot);
            $( ".summarybox" ).each(function( index ) {
                if(this.id=="text"+d.topicID){
                    //console.log( index + ": " + $( this ).val() +""+ this.id);
                    node.summary=$( this ).val();
                }
           });      
            //console.log(node);           
            //node.summary=$("#text"+d.topicID).val();
            vis.selectAll("g.nodeTopicTree").selectAll(".externalObject")             
               .attr("display", 'none');
            vis.selectAll("g.nodeTopicTree").selectAll("text.summary").style("opacity", function(d2)
                {
                    if(d2.summary!="") return 1;
                    else if(d.topicID==d2.topicID)  return 1;
                    else return 0;
                });                                       
        });
           
        /*$( "#button"+d.topicID).click(function(e){
     
            d.summary=$("#text"+d.topicID).val();      
            vis.selectAll("g.nodeTopicTree").selectAll(".externalObject")             
               .attr("display", function(d1) { 
                       return 'none';
           });
        
            //$(".save_button").remove();
            vis.selectAll("g.nodeTopicTree").selectAll("text.summary").style("opacity", function(d, i)
                {
                    if (d.summary) return 1;
                    else return 0;
                });
        });*/
            
    
//    $('#text'+d.topicID).keypress(
//        function(e){
//     
//     
//            if (e.keyCode == 13) {     
//            d.summary=$("#text"+d.topicID).val();
//            
//            
//            vis.selectAll("g.nodeTopicTree").selectAll(".externalObject")             
//               .attr("display", function(d1) { 
//                       return 'none';
//           });
//        
//            //$(".save_button").remove();
//            vis.selectAll("g.nodeTopicTree").selectAll("text.summary").style("opacity", function(d, i)
//                {
//                    if (d.summary) return 1;
//                    else return 0;
//                });
//            }
//        });
        
    });
            
    topicNodeEnter.selectAll("text.topiclabel").on("click", function(d) {
        //console.log("click");
        //setTimeout(function() {
        //    if(doubleclick==0){
        if (d.clickstate == 1) {
            d.clickstate = 0;
            topicName = d.name;
            undoHighlightTopicsTreeNodesTopic(topicName);
        }
        else
            d.clickstate = 1;
        topicName = d.name;
        highlightTopicsTreeNodesTopic(d);

        clickNodeTopicTree(d);
        //   }
        //}, 500);      
    });
    topicNodeEnter.selectAll("text.topiclabel").on("dblclick", function(d) {
        if (d.dbClickstate == 1) {
            
            removeALevel(d);
        }
        else {
            
            addALevel(d);
        }

    });


    // Transition nodes to their new position.
    // not sure if the following code is needed. seems redundant
//    topicNodeEnter.transition()
//            .duration(duration)
//            .attr("transform", function(d) {
//        return "translate(" + d.y + "," + d.x + ")";
//    })
//            .style("opacity", 1);
    //.each("end",function(){});

    nodeTopicTree.transition()
            .duration(duration)
            .attr("transform", function(d) {
        return "translate(" + d.y + "," + d.x + ")";
    })
            .style("opacity", 1)
            //.each(function() { ++transitionCount; })     
            .call(endall, function() {
//        console.log("all done");
//        console.log('yes');
        vis.selectAll("text.topiclabel").on("mouseover", mouseoverNodeTopicTree);
        //topicNodeEnter.selectAll("rect").on("mouseover", mouseoverNodeTopicTree);
        vis.selectAll("text.topiclabel").on("mouseout", mouseoutNodeTopicTree);
        vis.selectAll("text.topiclabel").on('contextmenu', d3.contextMenu(menuNode, {
            onOpen: function() {
                    //console.log(menuNode.length);
                    console.log('opened!');
            },
            onClose: function() {
                    console.log('closed!');
            }
        })); // attach menu to element        
    
//        vis.selectAll("text.topiclabel").on('contextmenu', d3.contextMenu(menuNode, function() {
//            console.log('Quick! Before the menu appears!');
//            menuNode=menuNode.slice(1, menuNode.length);
//            console.log(menuNode.length);
//        })); // attach menu to element
    //                        
//                        
        //topicNodeEnter.selectAll("rect").on("mouseout", mouseoutNodeTopicTree); 
    });
    function endall(transition, callback) { 
        if (transition.size() === 0) {
            callback()
        }
        var transitionCount = 0;
        transition
                .each(function() {
            ++transitionCount;
        })
                .each("end", function() {
            if (!--transitionCount)
                callback.apply(this, arguments);
        });
    }
    //.select("rect");

    // Transition exiting nodes to the parent's new position.
    if(mode=="collapse"){
    nodeTopicTree.exit().transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "translate(" + d.parent.y + "," + d.parent.x + ")";
        })
        .style("opacity", 1e-6)
        .remove();
    }
    else{
        nodeTopicTree.exit().transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "translate(" + source.y + "," + source.x + ")";
        })
        .style("opacity", 1e-6)
        .remove();
        
    }

    // Stash the old positions for transition.
    nodesTopicTree.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
 

}
function mouseoverRecycle(d){    
    //console.log('mouseover recycle');    
    
    
                if (dragStarted) {
                    dropRecycle=true;

            }

            recycleRect.selectAll("text").style("stroke", function(d, i) {
                            stroke = "#f03b20";
                    return stroke;
                }); 
            recycleRect.selectAll("rect")   
            .transition()
            .style("stroke","#f03b20")
            .style("opacity", "1");
            recycleRect.append("title").text(function(d) {
                        if(removedNodes.length==0){
                             return 'no garbage topic.';
                        }
                        else{
                            var str="";
                            if(removedNodes.length==1)str=" 1 topic node is deleted:\n";
                            else str=removedNodes.length+ " topic nodes are deleted:\n";
                            for(i=0;i<removedNodes.length;i++){
                                str+=removedNodes[i].labels[0].phrase+"\n";
                            }
                            return str;
                        }
                    });  
                    
    
}
function mouseoutRecycle(d){
     if(dragStarted){
            selectedNode = null;
    }
            recycleRect.selectAll("text").style("stroke","darkgrey");
            recycleRect.selectAll("rect")   
            .transition()
            .style("stroke","darkgrey")    
            .style("opacity", "0.5");            
    
}
function aggregateSentiment(n, childrenNodes) {
    var totalsentences = 0;
    //if(childrenNodes.length==0) alert(n);
    //console.log(nodesTopicTree);

    for (var k = 0; k < childrenNodes.length; k++) {
        var d = childrenNodes[k];
        if (d.topicsentiments)
            for (j = 0; j < d.topicsentiments.length; j++) {
                n.sentiments[j] += d.topicsentiments[j];
                totalsentences += d.topicsentiments[j];
            }

        for (j = 0; j < n.sentiments.length; j++) {
            //n.sentiments[j] += d.topicsentiments[j];
            totalsentences += n.sentiments[j];
        }
    }

    for (j = 0; j < n.sentiments.length; j++) {
        n.sentiments[j] = n.sentiments[j] / totalsentences;
    }
    n.strength = totalsentences;
}

function highlightTopicsTreeNodesTopic(nodetoHighlight) {

    vis.selectAll("g.nodeTopicTree").select("rect")
            .transition()
            .duration(duration)
            .style("opacity", function(d, i) {
        //console.log( "y: "+nodetoHighlight.name);
        var op = "1";
        if (nodetoHighlight.id == d.id) {
            op = "1";
        }
        else if (d.clickstate == 1)
            op = "1";
        else
            op = "0";
        return op;
    });
    vis.selectAll("g.nodeTopicTree").select("rect").transition()
            .duration(duration)
            //.style("fill","none")	
            .style("fill", function(d) {
        var fill = "rgb(255,255,255)";
        if (d.clickstate == 1)
            fill = topicClickColor;

        return fill;
    })
            .style("opacity", function(d, i) {

        var op = "0";
        if (nodetoHighlight.id == d.id) {

            op = "1";
        }
        else if (d.clickstate == 1)
            op = "1";
        //alert("helo");
        return op;
    })

            .style("stroke", function(d, i) {
        var stroke = d.col;
        if (dragStarted) {
            console.log("" + nodesTopicTree.length);
            vis.selectAll("g.nodeTopicTree").sort(function(a, b) { // select the parent and sort the path's
                if (a.name != draggingNode.name)
                    return 1; // a is not the hovered element, send "a" to the back
                else
                    return -1; // a is the hovered element, bring "a" to the front
            });
            if (draggingNode.topicID == d.topicID) {
                stroke = "white";
            }
            else if (hoveredTopic.topicID == d.topicID) {
                stroke = "#f03b20";
            }
        }
        else if (d.clickstate == "1")
            stroke = topicColor;

        return stroke;
    }
    );


    if (!listFlag) {
        var nodes = [];
        getLeafNodes(nodes, nodetoHighlight);
        var topicIDs = [];
        var topicNames = [];
        for (j = 0; j < nodes.length; j++) {
            for (i = 0; i < topicList.length; i++) {
                if (nodes[j].labels[0].phrase == topicList[i].name) {
                    console.log(topicList[i].topicID + " " + topicList[i].name);
                    topicIDs.push(topicList[i].topicID);
                    topicNames.push(topicList[i].name);
                    //systemTopicIDs=[];
                    break;
                }
            }
        }
        highlightTopics(topicIDs);
        highlightTopicLinksbyCollectionTopics(topicNames);
    }
}

function addbusySign(currentNode){
        vis.selectAll("g.nodeTopicTree")
    .append("image")
    .attr("class","busy")
 
            .attr("x", function(d) {
                return d.width+33;
            })
            .attr("y", -10)            
            .attr("dx", -10)
    .attr("name","name")
    .attr("xlink:href",function(d){
        if(d.topicID==currentNode.topicID) return "icons/loader6.gif";
    })
    .attr("width", "14")
    .attr("height", "15")
    .attr("opacity", ".8");    
    
}

function addALevel(currentNode) {
    logInteraction("show less subtopics," + currentNode.labels[0].phrase);    
    currentNode.dbClickstate = 1;
    lastOperation = "addlevel," + currentNode.topicID;
    currentNode.addlevel=1;
    var childrenList;
    if (currentNode.children)
        childrenList = currentNode.children;
    else if (currentNode._children)
        childrenList = currentNode._children;
    else
        alert('Cannot add another level to a leaf node.');
    var topicListstr = "";

    if (childrenList.length < 4) {
        alert('Too few children. Cannot add any more level');
        return;
    }
    addbusySign(currentNode);
    
    //alert(childrenList.length);
    for (i = 0; i < childrenList.length; i++) {
        topicListstr += childrenList[i].topicID + ",";
    }
    topicListstr = topicListstr.substring(0, topicListstr.length - 1)
    console.log('python addlevel_multiconvis.py  ' + dataset+" " +topicListstr);


    //read from cache
    $.getJSON('revisedtopics' + dataset + '.json', function(dataObjs) {
        for (k = 0; k < dataObjs.length; k++) {
            var cacheFound=true;

            for (i = 0; i < childrenList.length; i++) {
                childrenList[i].found = 0;
            }            
            var Lists = [];
            var topicLabels = [];

            var data = dataObjs[k];
            //console.log(data);
            var noOfTopics=0;
            for (var topicNodes in data) {
                var list1 = [];
                var topicIDs = topicNodes.split(',');
                //console.log(topicIDs[i]);
                noOfTopics+=topicIDs.length;
                for (j = 0; j < topicIDs.length; j++) {
                    for (i = 0; i < childrenList.length; i++) {
                      //console.log(childrenList[i].topicID);
                        if (childrenList[i].topicID == topicIDs[j]) {

                            childrenList[i].found = 1;

                            list1.push(childrenList[i]);
                            //console.log(childrenList[i]);
                            
                            break;
                        }
                    }
                }
                topicLabels.push(data[topicNodes]);
                //console.log(list1.length);
                Lists.push(list1);
            }
            for (i = 0; i < childrenList.length; i++) {
                if (childrenList[i].found == 0){cacheFound=false;   
                    //console.log(childrenList[i]);
                    //console.log('not found');
                    //break;
                }
 
                //else alert(childrenList[i].found);
            }
            if(noOfTopics!=childrenList.length) {cacheFound=false;console.log('not equal'+noOfTopics);}            
            else if (cacheFound) {
                console.log('found'); 
                cacheFound=true;
                console.log(list1.length);

                for (i = 0; i < Lists.length; i++) {
                    mergeTopics(Lists[i], currentNode, topicLabels[i], i);
                }
                animateAddNodes(currentNode);
                
                break;
            }
 
        }
        if(!cacheFound){
            console.log('not found in the cache');
            $.ajax({
                 url: '../CallPythonMultiConVis.php?topicID= ' + dataset+" "+topicListstr,
                 success: function(response) {//response is value returned from php (for your example it's "bye bye"
                 //console.log(JSON.stringify(response));
                 var Lists=[];
                 setTimeout(function () {
                   $.getJSON('revisedtopics'+dataset+'.json', function(dataObjs) {
                     var topicLabels=[];
                     //alert(dataObjs.length);
                     var data=dataObjs[dataObjs.length-1];
                     for (var topicNodes in data) {
                       console.log("Key: " + topicNodes.split(','));
                       //console.log("Value: " + data[topicNodes]);
                       var list1=[];
                       var topicIDs=topicNodes.split(',');
                       for(j=0;j<topicIDs.length;j++){
                         for (i=0;i<childrenList.length;i++){
                           if(childrenList[i].topicID==topicIDs[j]) {
                             list1.push(childrenList[i]);
                             break;
                           }
                         }
                       }
                       topicLabels.push(data[topicNodes]);
                       Lists.push(list1);


                     }
                     /*var alltopics = Array.prototype.concat.apply([], Lists);

                      //temporarily fixing the issue of not finding a topic in the topic segmentation.
                      if(childrenList.length!=alltopics.length){
                      alert('not equal'+alltopics.length+" "+childrenList.length);
                      var childrenNotIncluded=[];
                      for(j=0;j<childrenList.length;j++){
                      i=0;
                      for (i=0;i<alltopics.length;i++){
                      console.log(alltopics[i].topicID+" "+childrenList[j].topicID);
                      if(alltopics[i].topicID==childrenList[j].topicID) break;
                      }
                      if(i==childrenList.length) {alert(i);childrenNotIncluded.push(alltopics[i]);}
                      }
                      var min=Lists[0],minIndex=0;
                      for(i=0;i<Lists.length;i++){
                      if(Lists[i].length<min.length) {min=Lists[i];minIndex=i;}
                      }
                      Lists[minIndex].push(childrenNotIncluded);
                      console.log(childrenNotIncluded.length+" "+Array.prototype.concat.apply([], Lists).length);


                      }*/

                     console.log(topicLabels);
                     console.log(Lists);
                     for(i=0;i<Lists.length;i++){
                       mergeTopics(Lists[i], currentNode,topicLabels[i],i);
                     }
                     animateAddNodes(currentNode);
//                if (currentNode._children) {
//                    currentNode.children = currentNode._children;
//                    currentNode._children = null;
//                }
//                vis.selectAll("g.nodeTopicTree").selectAll("image").style("opacity", 0);
//                updateTopicTree(currentNode);
                   });
                 },500);



                 }

                 });           
        }

    });

     /*vis.selectAll("g.nodeTopicTree")     
    .select("svg:image")
    .transition()
    .attr("x",0)
    .attr("y",0)
    .attr("name","name")
    .attr("xlink:href","icons/loader6.gif")
    .attr("width", "14")
    .attr("height", "15")
    .attr("opacity", "0"); */    
    
}

function animateAddNodes(currentNode){
                if (currentNode._children) {
                    currentNode.children = currentNode._children;
                    currentNode._children = null;
                }
                vis.selectAll("g.nodeTopicTree").selectAll("image").style("opacity", 0);   

                function mySandwich(callback) {
                    updateTopicTree(currentNode);                    
                    callback();
                }
                mySandwich(function() {
                    setTimeout(function() {
                    //added On Nov 24, 2015 to make sure that the leave nodes are collapsed under new intermediate node    
                    for(i=0;i<currentNode.children.length;i++){
                        var newParentNode=currentNode.children[i];
                        if (newParentNode.children){  
                           newParentNode._children = newParentNode.children;
                           newParentNode.children = null;
                       }
                    }
                    updateTopicTree(currentNode,"collapse");
                    },duration);
                });  
 
}

function removeParentofSingleChild(d) {
    var childrenList = [];

    if (d.children)
        childrenList = d.children;
    else if (d._children)
        childrenList = d._children;
    if (childrenList.length == 1) {
        var childrenList2;
        if (d.parent.children)
            childrenList2 = d.parent.children;
        else if (d.parent._children)
            childrenList2 = d.parent._children;
        var nodeIndex = 0
        for (i = 0; i < childrenList2.length; i++) {
            if (childrenList2[i].topicID == d.topicID) {
                nodeIndex = i;
                break;
            }
        }

        findNode(d.topicID, topicRoot, 'remove');
        addNode(d.parent, childrenList[0], nodeIndex);

    }
}

function removeANodeToRecycleBin(node){
logInteraction("remove node," + node.labels[0].phrase);        
   
    removedNodes.push(node);
    var newParentNodeIndex=0;
    var childrenList=[];
     if (node.parent.children)
        childrenList = node.children;
    else if (node.parent._children)
        childrenList = node._children;
    
    if (childrenList != null) {
        for (i = 0; i < childrenList.length; i++) {
            if (childrenList[i].topicID == node.topicID)
                break;
        }
        if (i < childrenList.length) {
            newParentNodeIndex = i;
        }
    }    

     lastOperation = "removeanode," + node.topicID+","+newParentNodeIndex;

    //for (i = 0; i < childrenList.length; i++) {
        findNode(node.topicID, topicRoot, 'remove');
    //}    
        //removeNode(d.parent, newParentNodeIndex);
    vis.selectAll("g.nodeTopicTree").transition()
            .duration(duration*2)
            .style("opacity", function(d) {
         var opacity=1;
            
        if(node.topicID==d.topicID){
          opacity=0; 
        }return opacity;
        
        
    });        
        setTimeout(function() {
        updateTopicTree(node.parent);
    }, duration*2);

}

function removeALevel(d) {
    d.dbClickstate = 0;
    logInteraction("show more subtopics," + d.topicID);        
    
    lastOperation = "removelevel," + d.topicID;
    console.log("removelevel," + d.topicID)
    d.addlevel=0;
    var childrenList;
    var nextLevelNodes = [];
    if (d.children)
        childrenList = d.children;
    else if (d._children)
        childrenList = d._children;

    vis.selectAll("g.nodeTopicTree").transition()
            .duration(duration*2)
            .style("opacity", function(d) {
         var opacity=1;
            for (i = 0; i < childrenList.length; i++) {
        if(childrenList[i].topicID==d.topicID){
          opacity=0;break;  
        } 
        }return opacity;
        
        
    });
    //alert( childrenList.length);
    for (i = 0; i < childrenList.length; i++) {
        if (childrenList[i].children) {
            for (j = 0; j < childrenList[i].children.length; j++)
                nextLevelNodes.push(childrenList[i].children[j]);
        }
        else if (childrenList[i]._children) {
            for (j = 0; j < childrenList[i]._children.length; j++)
                nextLevelNodes.push(childrenList[i]._children[j]);
        }
        else
            nextLevelNodes.push(childrenList[i]);
        //alert( nextLevelNodes.length);            
    }
    console.log(childrenList);

//        for (i=0;i<nextLevelNodes.length;i++){
//            alert(nextLevelNodes[i].topicID);
//        }        
    for (i = 0; i < childrenList.length; i++) {
        console.log(childrenList[i].topicID);
        findNode(childrenList[i].topicID, topicRoot, 'remove');
    }
    if (d.children)
        d.children = nextLevelNodes;
    else if (d._children)
        d._children = nextLevelNodes;



    setTimeout(function() {
        updateTopicTree(topicRoot, false);
    }, duration*2);

}
function mergeTopics(topicstoBeMerged, currentNode, labelsRaw, parentIndex) {
    /*    d.children = d._children;
     d._children = null;    
     updateTopicTree(d);*/

    if(topicstoBeMerged==null || topicstoBeMerged=='undefined')
        alert("Ops! Can't perform this operation");
    
    var childrenList;
    if (currentNode.children)
        childrenList = currentNode.children;
    else if (currentNode._children)
        childrenList = currentNode._children;


    //console.log(labelsRaw);
    var newParentNode = {topicID: currentNode.topicID + "_" + parentIndex,
        topicsentiments: null,
        clickstate: "0", fontsize: topicstoBeMerged[0].fontsize + 2,
        children: topicstoBeMerged, parent: topicstoBeMerged[0].parent};

    var labels = labelsRaw.split(',');
    newParentNode.labels = [];
    for (var i = 0; i < labels.length; i++)
    {
        //alert(labels[i].split('_')[0]);
        newParentNode.labels.push({phrase: labels[i].split('_')[0]});
    }
    newParentNode.name=newParentNode.labels[0].phrase;
    var topicID = "";
    for (i = 0; i < topicstoBeMerged.length; i++) {
        topicID += topicstoBeMerged[i].topicID + "_";
    }

    //newParentNode.labels[0].phrase= "newTopicName";


    //find the index of the selected node
    var newParentNodeIndex = 0;
    var childrenList = null;
    if (topicstoBeMerged[0].parent.children)
        childrenList = topicstoBeMerged[0].parent.children;
    else if (topicstoBeMerged[0].parent._children)
        childrenList = topicstoBeMerged[0].parent._children;
    if (childrenList != null) {
        for (i = 0; i < childrenList.length; i++) {
            if (childrenList[i].topicID == topicstoBeMerged[0].topicID)
                break;
        }
        if (i < childrenList.length) {
            newParentNodeIndex = i;
        }
    }

    for (i = 0; i < topicstoBeMerged.length; i++) {
        findNode(topicstoBeMerged[i].topicID, topicRoot, 'remove');
    }


    //alert(selectedNode.parent.topicID+" "+selectedNode.parent.labels[0].phrase);
    var parentNode = findNode(topicstoBeMerged[0].parent.topicID, topicRoot, '');
    console.log("parent:", parentNode);

    if (parentNode.children)
        parentNode.children.splice(newParentNodeIndex, 0, newParentNode);
    else
        parentNode._children.splice(newParentNodeIndex, 0, newParentNode);



    for (i = 0; i < topicstoBeMerged.length; i++) {
        topicstoBeMerged[i].parent = newParentNode;
    }

    console.log(currentNode)
    /*setTimeout(function() {
     nodesTopicTree.forEach(function(t, i) {
     t.id = null;
     });
     updateTopicTree(topicRoot, false);
     }, 0);*/
    

}
// Toggle children on click.
function expandCollapseNodeTopicTree(d) {
    doubleclick = 1;
    if (d.children) {
        logInteraction("Collapse TopicTree," + d.labels[0].phrase);
        d._children = d.children;
        d.children = null;
    } else {
        logInteraction("Expand TopicTree," + d.labels[0].phrase);
        d.children = d._children;
        d._children = null;
    }
    console.log(d);    
    updateTopicTree(d, true);

    if (listFlag == false) {
        topiclinkUpdate(function() {
            updateTopicLinks();
            topicLinks.forEach(function(t, i) {
                if (t.type == "collection")
                    console.log(t);
            });

        });
    }
    function topiclinkUpdate(callback) {

        vis.selectAll(".linktopics").remove();
        //console.log(topicLinks.length);
        topicLinks = [];
        //linking topics with comments
        nodes.forEach(function(n, i) {
            for (j = 0; j < topicList.length; j++) {
                var topicfound = false;
                for (k = 0; k < n.sent.length; k++) {
                    if (topicList[j].topicID == n.sent[k].systemtopicid)
                    {
                        if (topicList[j].commentid == "0")
                            topicList[j].commentid = n.commentid;
                        topicLinks.push({source: {x: topicList[j].y, y: topicList[j].x, topic: n.sent[k].systemlabel},
                            target: {x: n.x + findCommentHeight(n) / 2, y: n.y + spaceforFacetSelector, topic: n.sent[k].systemlabel, commentid: n.commentid}, clickcomment: "0"});
                        topicfound = true;
                        break;
                    }
                }
                if (topicfound)
                    break; //to make sure each comment is connected to only one topic Jan 29, 2015
            }
        });

        /*var temp=topicLinks;
         topicLinks.forEach(function(t, i) {
         t.id=null;
         if(t.type=="collection")
         topicLinks.splice(i,1);
         });
         */
        //console.log(topicLinks.length);

        collectionConversationLink(currentConversation);
        //console.log(topicLinks.length);
        callback();
    }
    doubleclick = 0;
}

function mouseoverNodeTopicTree(d) {
    //var backgroundcolor = "#F5F8FA";
    if (dragStarted) {
        selectedNode = d;
//        if (draggingNode.name != d.name) {
//            nodesTopicTree.sort(function(a, b) { // select the parent and sort the path's
//                if (a.name != draggingNode.name)
//                    return 1; // a is not the hovered element, send "a" to the back
//                else
//                    return -1; // a is the hovered element, bring "a" to the front
//            });
//        }
        hoveredTopic = d;

    }
    var backgroundcolor = "rgb(228,236,241)";
    topicName = d.name;
    highlightTopicsTreeNodesTopic(d);
    highlightConversationsbyTopics(d, backgroundcolor);
    vis.selectAll("g.nodeTopicTree").selectAll("text.summary").style("opacity", function(d1, i)
   {
        if(d1.name=="Guy bends") console.log(d1.summary);
        if(d1.summary!="") return 1;
        else if (d.topicID==d1.topicID) return 0.3;        
        else return 0;
    });     
}
function mouseoutNodeTopicTree(d) {
    //selectedNode = null;
    var backgroundcolor = "white";
    undoHighlightTopicsTreeNodesTopic(d);
    highlightConversationsbyTopics(d, backgroundcolor);
    
    vis.selectAll("g.nodeTopicTree").selectAll("text.summary").style("opacity", function(d1, i)
   {
        if(d1.summary!="") return 1;                           
        else if (d.topicID==d1.topicID) return 0;
        else return 0;        
    });     
}
function clickNodeTopicTree(d) {
    logInteraction("Click TopicTree," + d.labels[0].phrase);
    if (d.clicked == 0) {
        d.clicked = 1;
    }
    else if (d.clicked == 1) {
        d.clicked = 0;
    }
    if (!listFlag)
    {
        /*if (d.children) {
         var topicConversationID = d.children[0].topicID.replace(dataset+"_", "");
         topicConversationID = topicConversationID.split(":");
         var conversationid = topicConversationID[0];
         conversationMouseClick(conversationid);
         }
         if (d._children) {
         var topicConversationID = d._children[0].topicID.replace(dataset+"_", "");
         topicConversationID = topicConversationID.split(":");
         var conversationid = topicConversationID[0];
         conversationMouseClick(conversationid);
         }*/

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
        $("#listmode").hide(500);
        $("#comments_counter").hide(500);
        $("#overview").show(500);
        $("#monthly-volume-chart").show(500);
        $("#timelinebutton").show(500);
        $("#conversation_count").show(0);
        listFlag = true;
        //selectConversationbyTopics(d);
        //vis.remove();
        //updateTopicTree(topicRoot);        
    }
    selectConversationbyTopics(d);
}


function highlightConversationsbyTopics(d, backgroundcolor) {
    logInteraction("Hover TopicTree," + d.labels[0].phrase);
    var nodes = [];
    var listofConversationsbyAllTopics = [];
    getLeafNodes(nodes, d);
    //console.log("no of children nodes: ", nodes.length);
    for (i = 0; i < nodes.length; i++) {
        listofConversationsbyAllTopics.push(listConversationsbyTopics(nodes[i]));
    }
    //console.log(listofConversationsbyAllTopics.length);
    listofConversationsbyAllTopics.forEach(function(conversationid, i) {
        $("#div" + conversationid).css("background", backgroundcolor);
    });
}

function listConversationsbyTopics(d) {
    var listofConversationsbyTopic = [];
    if (d._children) {
        for (var i = 0; i < d._children.length; i++) {
            var topicConversationID = d._children[i].topicID.replace(dataset + "_", "");
            topicConversationID = topicConversationID.split(":");
            listofConversationsbyTopic.push(topicConversationID[0]);
        }
    }
    else if (d.children) {
        for (var i = 0; i < d.children.length; i++) {
            var topicConversationID = d.children[i].topicID.replace(dataset + "_", "");
            topicConversationID = topicConversationID.split(":");
            listofConversationsbyTopic.push(topicConversationID[0]);
        }
    }
    else {
        var topicConversationID = d.topicID.replace(dataset + "_", "");
        topicConversationID = topicConversationID.split(":");
        listofConversationsbyTopic.push(topicConversationID[0]);
    }
    return listofConversationsbyTopic;
}

function selectConversationbyTopics(d) {


    console.log(d.firstConversation);
    var nodes = [];
    var listofConversationsbyAllTopics = [];
    getLeafNodes(nodes, d);
    console.log("no of children nodes: ", nodes.length);
    for (i = 0; i < nodes.length; i++) {
        listofConversationsbyAllTopics.push(listConversationsbyTopics(nodes[i]));
    }
    console.log(listofConversationsbyAllTopics.length);
    listofConversationsbyAllTopics.forEach(function(conversationid, i) {
        d.clicked == "1" ? $("#div" + conversationid).css("border-left", "5px solid " + topicColor) : $("#div" + conversationid).css("border-left", "1px solid #E1E8ED");
    });


}


function highlightTopicsbyConversation(topicList) {
    vis.selectAll("g.nodeTopicTree").select("rect").transition()
            .duration(duration)
            .style("opacity", function(d, i) {
        var op = "0";
        //alert(d.name);
        for (var i = 0; i < topicList.length; i++) {
            if (topicList[i].name == d.name) {
                op = "0.3";
                break;
            }
        }
        if (d.clickstate == 1)
            op = "1";
        return op;
    })
            .style("fill", function(d, i) {
        var stroke = "none";
        for (var i = 0; i < topicList.length; i++) {
            if (topicList[i].name == d.name) {
                stroke = topicColor;
                break;
            }
        }

        if (d.clickstate == 1)
            stroke = topicClickColor;
        return stroke;
    });
}

function undoHghlightTopicsbyConversation(conversationid) {
    var topicList = findAlltopicNodesofAConversation(conversationid);

    vis.selectAll("g.nodeTopicTree").select("rect").transition()
            .duration(duration)
            .style("opacity", function(d, i) {
        var op = "0";

        var topicConversationID = d.topicID.replace(dataset + "_", "");
        topicConversationID = topicConversationID.split(":");
        for (var i = 0; i < topicList.length; i++) {
            if (topicList[i].name == d.name) {
                op = "0";
                break;
            }
        }
        //alert(topicConversationID+"yes"+conversationid);
        //alert("yes"+topicConversationID);
        /*if (topicConversationID.length > 1)
         if (topicConversationID[0] == conversationid + "") {
         
         op = "0";
         
         }*/
        if (d.clickstate == 1)
            op = "1";
        return op;
    })
            .style("fill", function(d, i) {
        var stroke = "none";

        if (d.clickstate == 1)
            stroke = topicClickColor;
        return stroke;
    });
}

function undoHighlightTopicsTreeNodesTopic(nodeToHighlight) {
    topicNodeEnter.transition()
            .duration(duration)
            .style("opacity", function(d, i) {

        var opac = "1";
        if (d.clickstate == 1) {
            opac = "1";
        }
        return opac;
    })
    vis.selectAll("g.nodeTopicTree").select("rect")
            .transition()
            .duration(duration)
            .style("opacity", function(d, i) {

        var opac = "0.0";
        if (d.clickstate == 1) {
            opac = "1";
        }
        return opac;
    });
    if (!listFlag)
        undoHighlightTopicsbyTopic();//convis topic elements
}

function findAlltopicNodesofAConversation(conversationid, removeFlag) {
    var allTopicNodesofConversation = [];

    nodesTopicTree.forEach(function(d, j) {
        var list = listConversationsbyTopics(d);
        for (var i = 0; i < list.length; i++) {
            if (list[i] == conversationid) {
                allTopicNodesofConversation.push(d);
                d = null;
                break;

            }
        }
    });
    topicRoot.temp = allTopicNodesofConversation;
    /*nodesTopicTree.diff(allTopicNodesofConversation);
     Array.prototype.diff = function(a) {
     return this.filter(function(i) {return a.indexOf(i) < 0;});
     };*/
    return allTopicNodesofConversation;
}

function colorNodeTopicTree(d) {
    //return d._children ? topicColor : d.children ? "rgb(43,138,255)" : "rgb(170,208,255)";
    return d._children ? topicColor : d.children ? "rgb(43,138,255)" : topicColor;
}

function fontNodeTopicTree(d) {
    return d._children ? "17px" : d.children ? "17px" : "14px";
}

function updateTopicLabelsFromConversation() {

    nodesTopicTree.forEach(function(d) {
        d.sentiments = new Array();
        d.sentiments[0] = 0;
        d.sentiments[1] = 0;
        d.sentiments[2] = 0;
        d.sentiments[3] = 0;
        d.sentiments[4] = 0;
        if (d._children == null && d.children == null) {
            var topicConversationID = d.topicID.split(":");
            for (var i = 0; i < conversationData.length; i++) {
                if (conversationData[i].filename == topicConversationID[0]) {
                    break;
                }
            }
            if (i < conversationData.length) {


                for (var k = 0; k < conversationData[i].topics.length; k++) {

                    if (conversationData[i].topics[k].topicID == topicConversationID[1]) {

                        d.labels = conversationData[i].topics[k].labels;
                        for (j = 0; j < d.sentiments.length; j++)
                            d.sentiments[j] += conversationData[i].topics[k].topicsentiments[j];
                        //alert(d.sentiments);
                        //console.log(topicConversationID[1] + " " + d.labels[0].phrase);
                        break;
                    }

                }
            }
        }

    });
}

function findicon(d) {
    /*console.log(d);
     if(d._children){
     console.log("y");
     return "\uf196";
     }
     else if(d.children){
     console.log("n");
     return "\uf147"
     }
     else {console.log("n2");return"\uf096";}*/
    return d._children ? "\uf055" : d.children ? "\uf056" : "\uf111";
//return d._children ? "\uf196" : d.children ? "\uf147" : "\uf096";    
}





function dragStart(d) {
    dragStarted = true;
    draggingNode = d;
    d.xorig = d.x;
    d.yorig = d.y;
    d.xUpdate = 0;
    d.yUpdate = 0;
    domNode = d;

    d3.event.sourceEvent.stopPropagation(); // silence other listeners

}

function initialDrag(d) {
    if (dragStarted) {
        console.log(nodesTopicTree.length);
    }
}

function dragEnd(d) {

    if (dragStarted) {
        dragStarted = false;
            if (dropRecycle) {
                removeANodeToRecycleBin(draggingNode);
                dropRecycle=false;
            }        
        if (selectedNode) {
            if (draggingNode.name != selectedNode.name) {
                console.log(selectedNode);
                if(selectedNode.children || selectedNode._children){
                    $( "#dialog-confirm" ).html(
                        "How to connect <b>"+draggingNode.labels[0].phrase+"</b> to <b>"+selectedNode.labels[0].phrase+"</b>?"
                    );

                    $( "#dialog-confirm" ).dialog( "open" );                
                    $( "#dialog-confirm" ).dialog({
                      buttons: {
                        "Add as sibling": function() {
                          $( this ).dialog( "close" );
                          logInteraction("Add as sibling," + draggingNode.labels[0].phrase+","+selectedNode.labels[0].phrase);        
                          
                          mergeAsSiblings(draggingNode, selectedNode); 
                            selectedNode = null;
                            draggingNode = null;
                            delete d.xUpdate;
                            delete d.yUpdate;  
                        },                  
                        "Add as child": function() {
                          $( this ).dialog( "close" );
                          logInteraction("Add as child," + draggingNode.labels[0].phrase+","+selectedNode.labels[0].phrase);                                  
                          addAsChild(draggingNode, selectedNode);      
                    selectedNode = null;
                    draggingNode = null;
                    delete d.xUpdate;
                    delete d.yUpdate;                        
                        },        
                        Cancel: function() {
                          $( this ).dialog( "close" );
                        }
                      }                

                });
                }
                else{
                    mergeAsSiblings(draggingNode, selectedNode);      
                    selectedNode = null;
                    draggingNode = null;
                    delete d.xUpdate;
                    delete d.yUpdate;                    
                }
 
            }
            else {
        selectedNode = null;
        draggingNode = null;
        delete d.xUpdate;
        delete d.yUpdate;

            }
        }
        else {
        selectedNode = null;
        draggingNode = null;
        delete d.xUpdate;
        delete d.yUpdate;            
  
        }




    }

}
function addAsChild(draggingNode, selectedNode){
                console.log(draggingNode);
                console.log(selectedNode);
                
                //find index of the dragging node
                var draggingNodeIndex = 0;
                var childrenList;
                if (draggingNode.parent.children)
                    childrenList = draggingNode.parent.children;
                else if (draggingNode.parent._children)
                    childrenList = draggingNode.parent._children;
                for (i = 0; i < childrenList.length; i++) {
                    if (childrenList[i].topicID == draggingNode.topicID) {
                        draggingNodeIndex = i;
                        break;
                    }
                }
                lastOperation = "addAsChild," + draggingNode.topicID + "," + selectedNode.topicID + "," + draggingNode.parent.topicID + ',' + draggingNodeIndex;

                if(selectedNode._children){ //expand the parent node if not already expanded
                    selectedNode.children=selectedNode._children;
                    selectedNode._children=null;
                }
                findNode(draggingNode.topicID, topicRoot, 'remove');
                if(selectedNode.children)
                    selectedNode.children.splice(0, 0, draggingNode);
                    draggingNode.parent = selectedNode;
                updateTopicTree(topicRoot, false);    
   

}

function mergeAsSiblings(draggingNode, selectedNode){

                var leafNodes=[];
                var topicListstr="";
                getLeafNodes(leafNodes, draggingNode);                
                getLeafNodes(leafNodes, selectedNode);   
                for (i = 0; i < leafNodes.length; i++) {
                    topicListstr += leafNodes[i].topicID + ",";
                }
                topicListstr = topicListstr.substring(0, topicListstr.length - 1)
            $.ajax({
                 url: '../CallPythonMerge.php?topicID= ' + dataset+" "+topicListstr,
                 success: function(response) {//response is value returned from php (for your example it's "bye bye"
                    //alert(response);
                    var labels=[];
                    
                    if(response==null || response.trim()=="" || response.indexOf("error ")){
                        labels=draggingNode.labels;
                    }
                    else{
                    var topicLabels=[];
                    topicLabels=response.split(',');
                    
                    console.log(topicLabels);
                    for (i = 0; i < topicLabels.length; i++) {
                         
                        var l = topicLabels[i].split('_');
                        console.log(l);
                        labels.push({phrase: l[0], prob: l[1].substring(1, l.length - 1)});
                    }
                }
                var draggingNodeIndex = 0;
                var childrenList;
                if (draggingNode.parent.children)
                    childrenList = draggingNode.parent.children;
                else if (draggingNode.parent._children)
                    childrenList = draggingNode.parent._children;
                for (i = 0; i < childrenList.length; i++) {
                    if (childrenList[i].topicID == draggingNode.topicID) {
                        draggingNodeIndex = i;
                        break;
                    }
                }
                lastOperation = "mergesiblings," + draggingNode.topicID + "," + selectedNode.topicID + "," + draggingNode.parent.topicID + ',' + draggingNodeIndex;

                //add new node
                //alert(draggingNode.fontsize);
                var fontsize = draggingNode.fontsize > selectedNode.fontsize ? draggingNode.fontsize + 1 : selectedNode.fontsize + 1;
                if (fontsize > 22)
                    fontsize = 22;
                var newTopicName = "new topic";


                var topicsentiments;
                if (draggingNode._children)
                    topicsentiments = draggingNode._children[0].topicsentiments;
                else if (draggingNode.topicsentiments)
                    topicsentiments = draggingNode.topicsentiments;

                var newParentNode = {topicID: draggingNode.topicID + "_" + selectedNode.topicID,
                    topicsentiments: topicsentiments,
                    clickstate: "0", fontsize: fontsize,
                    children: [draggingNode, selectedNode], parent: selectedNode.parent};
                if(labels.length>0){
                    newParentNode.labels=labels;
                    
                }
                else {
                    newParentNode.labels= draggingNode.labels;
                    newParentNode.labels[0].phrase= draggingNode.labels[0].phrase+" "+selectedNode.labels[0].phrase;
                    newParentNode.name==newParentNode.labels[0].phrase;

                }

                //find the index of the selected node
                var newParentNodeIndex = 0;
                var childrenList = null;
                if (selectedNode.parent.children)
                    childrenList = selectedNode.parent.children;
                else if (selectedNode.parent._children)
                    childrenList = selectedNode.parent._children;
                if (childrenList != null) {
                    for (i = 0; i < childrenList.length; i++) {
                        if (childrenList[i].topicID == selectedNode.topicID)
                            break;
                    }
                    if (i < childrenList.length) {
                        newParentNodeIndex = i;
                    }
                }

                findNode(draggingNode.topicID, topicRoot, 'remove');
                findNode(selectedNode.topicID, topicRoot, 'remove');
                //alert(selectedNode.parent.topicID+" "+selectedNode.parent.labels[0].phrase);
                var parentNode = findNode(selectedNode.parent.topicID, topicRoot, '');
                console.log("parent:", parentNode);

                parentNode.children.splice(newParentNodeIndex, 0, newParentNode);

                removeParentofSingleChild(draggingNode.parent);

                draggingNode.parent = newParentNode;
                selectedNode.parent = newParentNode;
                updateTopicTree(topicRoot, false);   
                    
                }

                 });  
                 
 
                 
            /*dialogboxX=selectedNode.y
            dialogboxY=selectedNode.x;
            dialogRect =vis
                    .append("g")
                    .attr("class", "dialogRect")    
                    .attr("x",dialogboxX)            
                    .attr("y", selectedNode.x);


                    dialogRect.append("svg:rect")
                    .attr("rx", 6)
                    .attr("ry", 6)
                    .attr("x",-795)            
                    .attr("y", dialogboxY-15)
                    .attr("height", function(d) {
                          return 200;
                      })
                    .attr("width", function(d) {
                          return 390;
                      })
                    
                    .attr("fill", "darkgrey")	 
                    .style("opacity", "0.9")	             
                   .style("stroke", "steelblue")
                    .style("stroke-width", "2px");

            dialogRect.append("svg:text")
            .attr("x",dialogboxX)  
            .attr("y", dialogboxY)
                    .attr("dy", 30)
                    .attr("dx", 5)
 
                    .text("Add as child")
                    //.attr("fill", "red")
                    .style("stroke", "darkgrey")

                    .style("font-size", '30px');*/

            //event.preventDefault();
            
            //dialogRect.on("mouseover", mouseoverRecycle);
            //dialogRect.on("mouseout", mouseoutRecycle);                
                
                /*Code for manually moving dragging and selected node for merge operation
                 * var topicNodeHieght = 30;
                vis.selectAll("g.nodeTopicTree").transition()
                        .duration(duration)
                        .attr("transform", function(d) {
                    //console.log(d.y+" "+d.x);
                    var translateX = d.x;
                    var translateY = d.y;

                    if (draggingNode.x < selectedNode.x) { //when dragging node is upper
                        if (d.x > draggingNode.x && d.x < selectedNode.x) {
                            console.log(d.name + " " + d.y + " " + d.x);
                            translateX -= topicNodeHieght;
                        }
                        else if (d.x > selectedNode.x) {
                            console.log(d.name + " " + d.y + " " + d.x);
                            translateX += topicNodeHieght;
                        }
                        else if (d.topicID == draggingNode.topicID) {
                            translateX = selectedNode.x;
                        }

                        else if (d.topicID == selectedNode.topicID) {
                            translateX = selectedNode.x + topicNodeHieght;
                        }

                    }
                    else {//when dragging node is lower than selected node
                        if (d.x < draggingNode.x && d.x > selectedNode.x) {
                            //console.log(d.name+" "+d.y+" "+d.x);                            
                            translateX += topicNodeHieght * 2;
                        }
                        else if (d.x > draggingNode.x) {
                            //console.log(d.name+" "+d.y+" "+d.x);
                            translateX += topicNodeHieght;
                        }
                        else if (d.topicID == draggingNode.topicID) {
                            translateX = selectedNode.x + topicNodeHieght * 2;
                        }
                        else if (d.topicID == selectedNode.topicID) {
                            translateX = selectedNode.x + topicNodeHieght;
                        }
                    }
                    // bug: should adjust wrt the indentation of the selected node
                    if (d.topicID == draggingNode.topicID || d.topicID == selectedNode.topicID) {
                        translateY = selectedNode.y + topicNodeHieght;
                    }
                    d.xNew = translateX;
                    d.yNew = translateY;
                    return "translate(" + [translateY, translateX] + ")";
                });
                nodesTopicTree.forEach(function(d, i) {
                    d.x = d.xNew;
                    d.y = d.yNew;
                });
                var XnewNode = draggingNode.x - topicNodeHieght;
                var YnewNode = draggingNode.y - topicNodeHieght;

                if (draggingNode.x > selectedNode.x)
                    XnewNode = selectedNode.x - topicNodeHieght;*/    
}

function removeNode(parentNode, index) {
        if (parentNode.children)
            parentNode.children.splice(index, 1);
        else if (parentNode._children)
            parentNode._children.splice(index, 1);
 

}
function addNode(parentNode, childNode, index) {
    if (parentNode.children)
        parentNode.children.splice(index, 0, childNode);
    else if (parentNode._children)
        parentNode._children.splice(index, 0, childNode);



}

function getLeafNodes(leafNodes, currentNode) {
    if (currentNode.children) {
        currentNode.children.forEach(function(child) {
            getLeafNodes(leafNodes, child)
        });
    }
    else if (currentNode._children) {
        currentNode._children.forEach(function(child) {
            getLeafNodes(leafNodes, child)
        });
    }
    else {
        leafNodes.push(currentNode);
    }
}

function findNode(topidID, currentNode, mode, parentNode, index) {
    var i,
            currentChild,
            result;

    if (topidID == currentNode.topicID) {
        //alert('#'+currentNode.topicID);
    try{
        
        if (mode == 'remove')
            removeNode(parentNode, index);
    }
    catch(err){
        console.log(topidID);
        console.log(parentNode);
        
        console.log(parentNode);
    }            
        //else if(mode=='add')
        //    addNode(parentNode, currentNode, index);
        return currentNode;
    }
    else {

        // Use a for loop instead of forEach to avoid nested functions
        // Otherwise "return" will not work properly
        if (currentNode.children)
            for (i = 0; i < currentNode.children.length; i += 1) {
                currentChild = currentNode.children[i];
                // Search in the current child
                result = findNode(topidID, currentChild, mode, currentNode, i);
//
//                // Return the result if the node has been found
                if (result !== false) {
                    return result;
                }
            }

        else if (currentNode._children)
            for (i = 0; i < currentNode._children.length; i += 1) {
                currentChild = currentNode._children[i];
                // Search in the current child
                result = findNode(topidID, currentChild, mode, currentNode, i);

                // Return the result if the node has been found
                if (result !== false) {
                    return result;
                }
            }
        // The node has not been found and we have no more options
        return false;
    }
}
function findFirstCommentofATopicNode(topicNode) {
    // finding the first conversation for each topic node
    var nodes = [];
    var listofConversationsbyAllTopics = [];
    getLeafNodes(nodes, topicNode);
//    console.log("no of children nodes: ", nodes.length);
    for (i = 0; i < nodes.length; i++) {
        listofConversationsbyAllTopics.push(listConversationsbyTopics(nodes[i]));
    }
    var firstConversation = conversationData[0].filename.replace(dataset + "_", "");
    for (i = 0; i < conversationData.length; i++) {
        if (conversationData[i].ishidden == false) {
            var conversationid = conversationData[i].filename.replace(dataset + "_", "");
            for (j = 0; j < listofConversationsbyAllTopics.length; j++) {
                if (conversationid == listofConversationsbyAllTopics[j]) {
                    firstConversation = conversationid;
                    return firstConversation;
                }
            }
        }

    }
    return firstConversation;
}
function saveclick(){
    
    alert('click');
}
/*nodesTopicTree.forEach(function(d){    
 if(d._children){
 alert(d._children   );
 for(var i=0;i<d._children.length;i++){
 var topicConversationID = d._children[i].topicID.split(":");
 for (var j=0;j<conversationData.length;j++){
 if(conversationData[j].filename==topicConversationID[0]){                    
 break;
 }
 }
 if(i<conversationData.length){
 for (var k=0;k<conversationData[i].topics.length;k++){
 if(conversationData[i].topics[k].topicID==topicConversationID[1]){
 d=conversationData[i].topics[k];
 break;
 }
 }
 }            
 }
 }
 
 else if(d.children) {
 for(var i=0;i<d.children.length;i++){
 var topicConversationID = d.children[i].topicID.split(":");
 for (var j=0;j<conversationData.length;j++){
 if(conversationData[j].filename==topicConversationID[0]){                    
 break;
 }
 if(i<conversationData.length){
 for (var k=0;k<conversationData[i].topics.length;k++){
 if(conversationData[i].topics[k].topicID==topicConversationID[1]){
 d=conversationData[i].topics[k];
 break;
 }
 }
 }     
 }            
 }        
 }       
 
 if(d._children==null && d.children==null){
 var topicConversationID = d.topicID.split(":");
 for (var i=0;i<conversationData.length;i++){
 if(conversationData[i].filename==topicConversationID[0]){                    
 break;
 }
 }
 if(i<conversationData.length){
 for (var k=0;k<conversationData[i].topics.length;k++){
 //console.log(topicConversationID[1]);
 if(conversationData[i].topics[k].topicID==topicConversationID[1]){
 
 d=conversationData[i].topics[k];
 break;
 }
 
 }
 }
 }
 
 });*/





function saveTree(){
                //alert('topicTree');
        var cache = [];        
        var str_json = JSON.stringify(topicRoot, function(key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Circular reference found, discard key
                    return;
                }
                // Store value in our collection
                cache.push(value);
            }
            return value;
        });
        cache = null; // Enable garbage collection

                //var str_json = JSON.stringify(topicRoot);
                console.log(str_json);

                request= new XMLHttpRequest();
                request.open("POST", "JSON_Handler.php?q=" + 
                        localStorage.getItem('username') + "_" +localStorage.getItem('interfaceName')+"_"+localStorage.getItem('dataset'), true);
                request.setRequestHeader("Content-type", "application/json");
                request.send(str_json);                    

                 
    
    
}