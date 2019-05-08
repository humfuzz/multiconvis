var recordInteractions=true;
function wrap(text, width, titles) {

    count = 0;
    text.each(function() {
        //alert(count);
        var text = d3.select(this),
                words = titles[count].split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                x = text.attr("x"),
                y = text.attr("y"),
                dy = 0, //parseFloat(text.attr("dy")),
                tspan = text.text(null)
                .append("tspan")
                .attr("x", x)
                .attr("y", y)
                .attr("dy", dy + "em");
        
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" ")); 
                line = [word];
                tspan = text.append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", ++lineNumber * lineHeight + dy + "em")
                        .text(word);
            }
        }
        count = count + 1;
    });
}

function logInteraction(str)
{
        //alert(str);
    if(recordInteractions==true){
        str = username + "," +interfaceName + "," + filename + "," + str;
        //alert(str); 
        if (str == "") {
            //document.getElementById("txtHint").innerHTML = "";
            return;
        }
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();

        }
        else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function()
        {

            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                //alert("yes"+xmlhttp.responseText);
                //document.getElementById("txtHint").innerHTML = xmlhttp.responseText;
            }
        }
        //console.log( "do_query.php?q=" + str);
        xmlhttp.open("GET", "do_query.php?q=" + str, true);
        xmlhttp.send();
    }
}
$("#search").keyup(function(event) {
    if (event.keyCode == 13) {
        highlightme();
    }
});
function highlightme()
{
    //setTimeout(performSearch, 300);
    //alert("test");
    //function performSearch() {
    var str = document.getElementById('search').value;
    if (str == "") {
        $('#content').removeHighlight();
        return;
    }
    else if (str.length < 3) {
        return;
    }
    var strarray = str.split(" ");
    void($('#content').removeHighlight().highlight(strarray)); //pass string array to function
    //}
}



window.onload = function() {
    //Get submit button
    var submitbutton = document.getElementById("search");
    //Add listener to submit button
    if (submitbutton.addEventListener) {
        submitbutton.addEventListener("click", function() {
            if (submitbutton.value == 'Search') {//Customize this text string to whatever you want
                submitbutton.value = '';
            }
        });
    }

}

