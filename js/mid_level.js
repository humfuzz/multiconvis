'use strict';

/* show timelines for each conversation */


var sentimentColorsMidLevel = [
    "rgb(125,87,210)",
    "rgb(170, 163, 205)",
    "rgb(240, 240, 240)",
    "rgb(253, 184, 99)",
    "rgb(230, 97, 1)"
];
var timeStampsAll = new Array();
var moveCharts = new Array();
var lineCharts = new Array();
var fileName = "iphone_9"; // ???????
var dataDir = "data/"+dataset+"/";
var conversations;
var volumeChart = dc.barChart('#monthly-volume-chart');
var chartWidth=1000;
//createDivForTimeline(fileName);
timeLineForCollection("collection"+dataset+".json");


function createDivForTimeline(d) {
    var fileName = d.filename;
    var strDiv = "<div id=\"sentiment-over-time-" + fileName.replace(".json", "") + "\" " + "style=\"display: none;\"" + ">" +
            //"<b>"+fileName+":"+d.title+"</b><br>"+
            //"<span class=\"reset\" style=\"display: none;\">range: <span class=\"filter\"></span></span>"+
            "<a class=\"reset\" href=\"javascript:" +
            "dc.redrawAll();\"" +
            //	"style=\"display: none;\">reset</a>"+
            "<div class=\"clearfix\"></div></div>";

    //alert("#div"+fileName.replace(dataset+"_",""));
    $("#div" + fileName.replace(dataset+"_", "")).append(strDiv);
    timeLineConversation(fileName);
}



// create Sentiment Over Time For the Collection
function showTimeLine() {
    //alert("yes"+conversations.length);
    if (timelineFlag == false)
        conversations.forEach(function(d) {

            $("#sentiment-over-time-" + d.filename.replace(".json", "")).show(500);
            $("#timelinebutton").attr('value', 'Hide timeline'); //versions older than 1.6

    });
    else
    {
        conversations.forEach(function(d) {
            $("#sentiment-over-time-" + d.filename.replace(".json", "")).hide(500);
            $("#timelinebutton").attr('value', 'Show timeline'); //versions older than 1.6
        });
    }
    timelineFlag = (timelineFlag == true) ? false : true;
}

function timeLineForCollection(filename) {
    logInteraction("Timeline");
//setTimeout(function() {
    d3.json(dataDir + filename, function(json) {
        //alert(JSON.stringify(json));
        //var root=json;	
        //var tree = d3.layout.tree()
        //		.size([0, 0]);	
        //var conversations = tree.nodes(root);
        conversations = json;
//	for(var i-0;i<nodes.length
        conversations.forEach(function(d) {
            //
            createDivForTimeline(d);
        });
        /*if(typeof callback == 'function')
         callback();*/
        setTimeout(function() {
            //alert(timeStampsAll.length);
            commentVolumeOverTime(timeStampsAll);

        },2500);
    });
//  }, 15000);
}

function commentVolumeOverTime(timeStampsAll) {
    // Enamul: information scent for timeline
    //alert(JSON.stringify(timeStampsAll));

    var crossFilterObj = crossfilter(timeStampsAll);
    var dayDim = crossFilterObj.dimension(function(d) {
        return d.day;
    });
         
    var volumeByDayGroup = dayDim.group().reduce(
        function reduceAdd(p, v) {
          return p + 1;
        },
        function reduceRemove(p, v) {
          return p - 1;
        },
        function reduceInitial() {
          return 0;
          
        }
    );
        //clamping the bar to make smaller ones visible
    var groupAll=volumeByDayGroup.all();
    for(var i=0;i<groupAll.length;i++){
        if(groupAll[i].value<200)
           groupAll[i].value=groupAll[i].value*4;
        if(groupAll[i].value<70)
            groupAll[i].value=groupAll[i].value+70;

    } 
//    console.log(volumeByDayGroup.all());
    //var volumeByDayGroup = dayDim.group().reduceCount();

    volumeChart.width(chartWidth)
            .height(50)
            .margins({top: 0, right: 50, bottom: 20, left: 40})
            .dimension(dayDim)
            .group(volumeByDayGroup)
            .centerBar(true)
            .gap(1)
            .x(d3.time.scale().domain([new Date(2014, 6, 1), new Date(2014, 9, 30)]))
            .round(d3.time.day.round)
            .alwaysUseRounding(true)
            .renderlet(function(chart) {
        // smooth the rendering through event throttling
        dc.events.trigger(function() {
            // focus some other chart to the range selected by user on this chart				
//             for (var i = 0; i < moveCharts.length; i++) {
//                moveCharts[i].focus(chart.filter());
//            } 
  
            if (chart.filter()) {
                var text = chart.filter();
                if (text.length > 0) {
                    var startDate = new Date(text[0]);
                    var endDate = new Date(text[1]);
                    //$("#divconsole").html(JSON.stringify(endDate.getMonth()));
                    filterConversationbyDate(startDate, endDate);
                }
            }
        });

    })
    .xUnits(d3.time.days);
    dc.filterAll();
    dc.renderAll();
}

function filterConversationbyDate(startDate, endDate) {

    var count = 0;
    for (var i = 0; i < conversationData.length; i++) {
        //alert(conversationData[i].date);
        var aTime = findStartTime(conversationData[i]);
        var conversationUrl1 = conversationData[i].commentid.replace("http://www.semanticweb.org/ontologies/ConversationInstances.owl#article", "");
        conversationUrl1=conversationUrl1.replace("article"+dataset+"_","");			
        //alert(aTime," "+startDate.getTime());		
        //alert(conversationUrl1);
        if (aTime > startDate.getTime() && aTime < endDate.getTime()) {
            count++;
            conversationData[i].ishidden=false;
            $("#" + conversationUrl1).show(400);
        }
        else {
            conversationData[i].ishidden=true;
            //console.log("#div"+conversationUrl1);
            $("#" + conversationUrl1).hide(400);
        }
    }
    if(count >1)
        $("#conversation_count").html(count + " conversations");
    else if(count==1)
        $("#conversation_count").html(count + " conversation");
    logInteraction("Filter conversation ByDate,"+count);        
    
}


function timeLineConversation(fileName) {
    var moveChart = dc.lineChart('#sentiment-over-time-' + fileName.replace(".json", ""));
    //var yearlyBubbleChart = dc.bubbleChart('#yearly-bubble-chart');
    // ### Anchor Div for Charts 
    //### Load your data
    //Data can be loaded through regular means with your
    //favorite javascript library
    //

    //```
    var tree = d3.layout.tree()
            .size([1000, 0]);

    d3.json(dataDir + fileName + ".json", function(data) {
        var nodes = tree.nodes(data);
        console.log(nodes);
        // var res = nodes[0].date.split(" ");
        // var monthNumber = monthtbl[res[1]];
        // var day = res[2].substring(0, res[2].length - 1);
        // var year = res[3];
        // ////alert(day+"/"+monthNumber+"/"+year);	
        // // find start date

        // nodes[0].date = monthNumber + "/" + day + "/" + year + " " + res[4] + ":00";

        // for (var i = 1; i < nodes.length; i++) {
        //     var res = nodes[i].date.split(" ");
        //     var monthNumber = monthtbl2[res[0]];
        //     var day = res[1].substring(0, res[1].length - 1);
        //     var year = res[2].substring(0, res[2].length - 1);
        //     //alert(monthNumber+"/"+day+"/"+year+" "+res[3]+":00");
        //     nodes[i].date = monthNumber + "/" + day + "/" + year + " " + res[3] + ":00";
        //     if (nodes[i].date == null) {
        //         alert("yes");
        //     }
        // }

        // var dateFormat = d3.time.format('%m/%d/%Y %H:%M:%S');
        var dateFormat = d3.time.format.iso;
        var numberFormat = d3.format('.2f');

        nodes.forEach(function(d) {
            //alert(d.date);
            if (d.date == null) {
                alert("yes");
            }
            d.dd = dateFormat.parse(d.date);
            //alert(d.dd);

            try {
                d.month = d3.time.month(d.dd); // pre-calculate month for better performance
            }
            catch(err) {
                console.log("error:"+dataDir + fileName + ".json");
                console.log(d);
            }
            d.day = d3.time.day(d.dd); // pre-calculate month for better performance
            d.hour = d3.time.hour(d.dd); // pre-calculate month for better performance		
            d.bins = findSentimentMidLevel(d);
            timeStampsAll.push({commentid: d.commentid, day: d.day});
            //alert(d.bins);
        });

        //### Create Crossfilter Dimensions and Groups
        //See the [crossfilter API](https://github.com/square/crossfilter/wiki/API-Reference) for reference.
        var ndx = crossfilter(nodes);
        var all = ndx.groupAll();

        // maintain running tallies by year as filters are applied or removed

        // dimension by full date
        var dateDimension = ndx.dimension(function(d) {
            return d.dd;
        });
        // dimension by month
        var moveMonths = ndx.dimension(function(d) {
            return d.day;
        });
        // dimension by day
        var dayDim = ndx.dimension(function(d) {
            //alert(d.day);	
            return d.day;
        });
        var hourDim = ndx.dimension(function(d) {
            return d.hour;
        });

        // group by total movement within month
        var monthlyMoveGroup = moveMonths.group().reduceSum(function(d) {
            return Math.abs(d.close - d.open);
        });
        // group by total volume within move, and scale down result
        var volumeByMonthGroup = moveMonths.group().reduceCount();
        var volumeByHourGroup2 = hourDim.group().reduceCount();

        var volumeByHourGroup = hourDim.group().reduce(
                function(p, v) {
                    //alert(v.bins[0]*v.sent.length);
                    //p=p+1;
                    ++p.count;
                    p.totalSentences += v.sent.length;
                    for (i = 0; i < v.bins.length; i++) {
                        p.sumBin[i] += v.bins[i] * v.sent.length;
                        p.sumCommentSent[i] = (p.sumBin[i] / p.totalSentences) * p.count;
                    }
                    return p;

                    //	v.bins[0]  
                    //  alert(p);
                    //  return p + 1;
                    //return v.bins[0]*v.sent.length;
                },
                function(p, v) {
                    --p.count;
                    p.totalSentences -= v.sent.length;
                    for (i = 0; i < v.bins.length; i++) {
                        p.sumBin[i] -= v.bins[i] * v.sent.length;
                        p.sumCommentSent[i] = (p.sumBin[i] / p.totalSentences) * p.count;
                    }
                    return p;
                },
                function() {
                    return {count: 0, sum: 0, SumBin0: 0,
                        sumCommentSent: [0, 0, 0, 0, 0],
                        sumBin: [0, 0, 0, 0, 0],
                        totalSentences: 0};
                });
        //#### Stacked Area Chart
        //Specify an area chart, by using a line chart with `.renderArea(true)`
        moveChart
                .renderArea(true)
                .width(1300)
                .height(100)
                .transitionDuration(1000)
                .margins({top: 0, right: 0, bottom: 20, left: 0})        
                //.margins({top: 30, right: 50, bottom: 25, left: 40})
                .dimension(dayDim)
                .mouseZoomable(false)
                // Specify a range chart to link the brush extent of the range with the zoom focue of the current chart.
                .rangeChart(volumeChart)
                 //.x(d3.time.scale().domain([new Date(2014, 1, 1), new Date(2014, 10, 30)]))

                 .x(d3.time.scale().domain([new Date(2014, 8, 21), new Date(2014, 8, 27)]))
                
                //.x(d3.time.scale().domain([new Date(2014, 8, 21), new Date(2014, 08, 27)]))
                .round(d3.time.hour.round)
                //.xUnits(d3.time.hours)
                //.yAxis().tickValues([0, 100, 200, 300])
                //.elasticY(true)
                .renderHorizontalGridLines(true)
                //.legend(dc.legend().x(850).y(10).itemHeight(13).gap(5))
                .brushOn(false)
                // Add the base layer of the stack with group. The second parameter specifies a series name for use in the
                // legend
                // The `.valueAccessor` will be used for the base layer
                .group(volumeByHourGroup, 'highly negative')
                .ordinalColors(sentimentColorsMidLevel)

                .renderLabel(false)        
                .valueAccessor(function(d) {
            //alert(JSON.stringify(d);
            //return d.value;
            return d.value.sumCommentSent[0];
        })
                // stack additional layers with `.stack`. The first paramenter is a new group.
                // The second parameter is the series name. The third is a value accessor.
                .stack(volumeByHourGroup, 'negative', function(d) {
            return (d.value.sumCommentSent[1]);
        })
                .stack(volumeByHourGroup, 'neutral', function(d) {
            return (d.value.sumCommentSent[2]);
        })
                .stack(volumeByHourGroup, 'postive', function(d) {
            return (d.value.sumCommentSent[3]);
        })
                .stack(volumeByHourGroup, 'highly postive', function(d) {
            return (d.value.sumCommentSent[4]);
        })
                /*.stack(volumeByHourGroup, 'Monthly Index Move', function (d) {
                 return (d.value.count-d.value.sumCommentSent[0]
                 -d.value.sumCommentSent[1]
                 -d.value.sumCommentSent[2]
                 -d.value.sumCommentSent[3]
                 -d.value.sumCommentSent[4]);
                 }	)*/

                // title can be called by any stack layer.
                .title(function(d) {
            //var value = d.value.avg ? d.value.avg : d.value;
            var value = d;
            if (isNaN(value)) {
                value = 0;
            }
            return dateFormat(d.key) + '\n' + numberFormat(d.value);
        });
        moveCharts.push(moveChart);

    var f=fileName.replace(dataset+"_", "");
    var startdate, enddate;
    for (var i = 0; i < conversationData.length; i++) {
        var conversationUrl1 = conversationData[i].commentid.replace("http://www.semanticweb.org/ontologies/ConversationInstances.owl#article", "");
        conversationUrl1=conversationUrl1.replace("article"+dataset+"_","");			
        if(f==conversationUrl1) {
            startdate=findStartTime(conversationData[i]);
            enddate=findEndTime(conversationData[i]);                                    
            break;   
        }
    }    
    //console.log(f+" "+startdate+""+enddate);    
    var lineChart = dc.lineChart('#line' + f);
    lineChart
//            .renderArea(true)
            .width(300)
            .height(25)
            .transitionDuration(1000)
            .margins({top: 0, right: 0, bottom: 0, left: -1})
            .dimension(dayDim)
            .mouseZoomable(false)
            .x(d3.time.scale().domain([new Date(startdate), new Date(enddate)]))
            .round(d3.time.hour.round)
            .brushOn(false)
            .group(volumeByHourGroup, 'highly negative')
            //.ordinalColors(sentimentColorsMidLevel)
            .renderLabel(false)
            .valueAccessor(function(d) {
        //alert(JSON.stringify(d);
        //return d.value;
        return d.value.count;
    });
    lineCharts.push(lineChart);

        /*
         //#### Data Count
         // Create a data count widget and use the given css selector as anchor. You can also specify
         // an optional chart group for this chart to be scoped within. When a chart belongs
         // to a specific group then any interaction with such chart will only trigger redraw
         // on other charts within the same chart group.
         <div id='data-count'>
         <span class='filter-count'></span> selected out of <span class='total-count'></span> records
         </div>
         */
        dc.dataCount('.dc-data-count')
                .dimension(ndx)
                .group(all)
                // (optional) html, for setting different html for some records and all records.
                // .html replaces everything in the anchor with the html given using the following function.
                // %filter-count and %total-count are replaced with the values obtained.
                .html({
            //	some:'<strong>%filter-count</strong> selected out of <strong>%total-count</strong> records' +
            //		' | <a href=\'javascript:dc.filterAll(); dc.renderAll();\'\'>Reset All</a>',
            //	all:'All records selected. Please click on the graph to apply filters.'
        });

        /*
         //#### Data Table
         // Create a data table widget and use the given css selector as anchor. You can also specify
         // an optional chart group for this chart to be scoped within. When a chart belongs
         // to a specific group then any interaction with such chart will only trigger redraw
         // on other charts within the same chart group.
         <!-- anchor div for data table -->
         <div id='data-table'>
         
         </div>
         <!-- data rows will filled in here -->
         </div>
         */
        /*dc.dataTable('.dc-data-table')
         .dimension(dateDimension)
         // data table does not use crossfilter group but rather a closure
         // as a grouping function
         .group(function (d) {
         var format = d3.format('02d');
         return d.dd.getFullYear() + '/' + format((d.dd.getMonth() + 1));
         })
         .size(10) // (optional) max number of records to be shown, :default = 25
         // There are several ways to specify the columns; see the data-table documentation.
         // This code demonstrates generating the column header automatically based on the columns.
         .columns([
         'date',    // d['date'], ie, a field accessor; capitalized automatically
         'author',    // ...
         
         'htmltext'   // d['volume'], ie, a field accessor; capitalized automatically
         ])
         // (optional) sort using the given field, :default = function(d){return d;}
         .sortBy(function (d) {
         return d.dd;
         })
         // (optional) sort order, :default ascending
         .order(d3.ascending)
         // (optional) custom renderlet to post-process chart using D3
         .renderlet(function (table) {
         table.selectAll('.dc-table-group').classed('info', true);
         });*/
        //#### Rendering
        //simply call renderAll() to render all charts on the page	
        dc.renderAll();
    });

    //#### Version
    //Determine the current version of dc with `dc.version`
    d3.selectAll('#version').text(dc.version);

}
function findSentimentMidLevel(d) {
    var colorbins = new Array();
    colorbins[0] = 0;
    colorbins[1] = 0;
    colorbins[2] = 0;
    colorbins[3] = 0;
    colorbins[4] = 0;
    for (var i = 0; i < d.sent.length; i++) {
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
    return colorbins;
}