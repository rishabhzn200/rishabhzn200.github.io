// SETUP

var svg = d3.select("svg").filter('.skillssvg'),
    margin = { top: 20, right: 20, bottom: 30, left: 40 },
    x = d3.scaleBand().padding(0.1),
    y = d3.scaleLinear(),
    theData = undefined;

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

g.append("g")
    .attr("class", "axis axis--x");

g.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", "translate(3,0)");

g.append("text")
    .attr("transform", "rotate(-90) translate(-30, -30)")
    .attr("y", 0)
    .attr("dy", "0")
    .attr("text-anchor", "end")
    .text("Level");

// var tip = d3.tip().attr('class', 'd3-tip')
//     .offset([-10, 0])
//     .html(function(d) {
//         var ydata = ['Novice', 'Beginnner', 'Intermediate', 'Advanced', 'Expert'];
//
//         var percent = parseFloat(d.frequency) * 100;
//
//         var index = Math.round(percent / 20) - 1;
//
//         console.log('Percent is :');
//         console.log(index);
//
//         return "<strong>Skill:</strong> <span style='color:red'>" + d.letter + "</span><br/>" +
//             "<strong>Level:</strong> <span style='color:red'>" + ydata[index] + "</span>";
//     });
//
// svg.call(tip);


// DRAWING

function draw() {

    var bounds = svg.node().getBoundingClientRect(),
        width = bounds.width - margin.left - margin.right,
        height = bounds.height - margin.top - margin.bottom;

    x.rangeRound([0, width]);
    y.rangeRound([height, 0]);

    g.select(".axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.select(".axis--y")
        .call(d3.axisLeft(y).ticks(5, "%"));


    var bars = g.selectAll(".bar")
        .data(theData);

    // ENTER
    bars
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return x(d.letter); })
        .attr("y", function (d) { return y(d.frequency); })
        .attr("width", x.bandwidth())
        .attr("height", function (d) { return height - y(d.frequency); })

        .on("mouseover", handleMouseOver)//tip.show)
        .on("mouseout", handleMouseOut)//tip.hide);

        //
        // .on("mouseover", handleMouseOver)
        // .on("mouseout", handleMouseOut);

    // UPDATE
    bars.attr("x", function (d) { return x(d.letter); })
        .attr("y", function (d) { return y(d.frequency); })
        .attr("width", x.bandwidth())
        .attr("height", function (d) { return height - y(d.frequency); })
        // .on("mouseover", handleMouseOver)
        // .on("mouseout", handleMouseOut);

    // EXIT
    bars.exit()
        .remove();

}

function handleMouseOver(d, i) {  // Add interactivity

    console.log("Function Called");
    console.log(d);
    console.log(i);
    console.log(this);
    // Use D3 to select element, change color and size
    // d3.select(this).attr({
    //     fill: "orange"
    //     // r: radius * 2
    // });

    // var newp = d3.select("p").filter(".skillslist")
    //     .text("");

    console.log("Expecting p");
    console.log(this);
    console.log(this.getAttribute('width'));

    var x = this.getAttribute('x');
    var y = this.getAttribute('y');
    var width = this.getAttribute('width');
    var height = this.getAttribute('height');

    var res = d.skills.split(",");
    // console.log(res);

    //Remove old paragraphs
    var oldparagraphs = d3.selectAll('.pskillslist').remove();
    d3.selectAll('.paradiv1').remove();
    d3.selectAll('.paradiv2').remove();

    //Add new paragraphs
    var myparagraphs = d3.select(".skillslist").selectAll('p');

    // console.log("Expecting div");
    // console.log(mydiv._groups);

    // var divtoappend = mydiv._groups[0][0];


    var ydata = ['Novice', 'Beginnner', 'Intermediate', 'Advanced', 'Expert'];
    var percent = parseFloat(d.frequency) * 100;
    var index = Math.round(percent / 20) - 1;
    console.log('Percent is :');
    console.log(index);

    var paradiv = d3.select(".skillslist")

    paradiv.append('p').attr("class", 'paradiv1').text('Skill: ').append('strong').append('span').attr('color', 'red').text(d.letter);
        // .text('\tLevel: ').append('strong').append('span').attr('color', 'red').text(ydata[index]);
    paradiv.append('p').attr("class", 'paradiv2').text('Level: ').append('strong').append('span').attr('color', 'red').text(ydata[index]);
        // // .attr("class", 'pskillslist')
        // .text(<strong>Skill:</strong> <span style='color:red'>" + d.letter + "</span><br/>" +
        //                 "<strong>Level:</strong> <span style='color:red'>" +  + "</span>);

    myparagraphs.data(res)
        .enter()
            .append("p")
            .attr("class", 'pskillslist')
            .text(function(d, i){return (i+1).toString() + ". " + d;});
}


function handleMouseOut(d, i) {
    // Use D3 to select element, change color back to normal
    console.log("Function Called");
    // d3.select(this).attr({
    //     fill: "black"
    //     // r: radius
    // });

    // d3.select('.d3-tip').remove();

    // tip.attr('class', 'd3-tip n');
    //
    // // svg.call(tip);
    // tip.hide();
    // Select text by id and then remove
    // d3.select("#t" + d.x + "-" + d.y + "-" + i).remove();  // Remove text location
}


// LOADING DATA

function loadData(tsvFile) {
    console.log(tsvFile);

    d3.tsv(tsvFile, function (d) {
        // d.frequency = +d.frequency;
        // console.log("Rishabh")
        // console.log(d);
        return d;

    }, function (error, data) {
        console.log("Hello");
        if (error) throw error;

        theData = data;
        // console.log(data)

        // var pqr = theData.map(function (d) { return d.letter; });
        // console.log("Pqr is:");
        // console.log(pqr);

        x.domain(theData.map(function (d) { return d.letter; }));
        y.domain([0, d3.max(theData, function (d) { return d.frequency; })]);  // changed this

        // y.domain([0,1]);

        var ydata = ['Novice', 'Beginnner', 'Intermediate', 'Advanced', 'Expert'];

        y.domain([0,1]);

        draw();

    });
}

// START!

window.addEventListener("resize", draw);
loadData("data.tsv");
