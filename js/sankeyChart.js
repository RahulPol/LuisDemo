function getChart(chartData,elem) {

    var data = chartData;

    var margin = {
            top: 10,
            right: 20,
            bottom: 10,
            left: 10
        },

        dependencyHT = $('.dependency').height(),
        dependencyWT = $('.dependency').width(),
        sankeyTableHT = $('.sankeyTable').height();

    

    width = dependencyWT - margin.left - margin.right,
        height = dependencyHT - margin.top - margin.bottom - sankeyTableHT - 20;

    var formatNumber = d3.format(",.0f"),
        format = function (d) {
            return formatNumber(d) + " TWh";
        },
        color = d3.scale.category20();


    var svg = d3.select(elem).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");




    // var svg = d3.select("#chart")
    //     .append("div")
    //     .classed("svg-container", true)
    //     .append("svg")    
    //     .attr('preserveAspectRatio', 'xMinYMin meet')
    //     .attr('viewBox', '0 0 860 400')
    //     .attr("svg-content-responsive", true)
    //     .append("g")
    //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var sankey = d3.sankey()
        .nodeWidth(10)
        .nodePadding(8)
        .size([width, height]);

    var path = sankey.link();

    var mapping = data;
    //console.log('JSON data mapping....', mapping);
    sankey
        .nodes(mapping.nodes)
        .links(mapping.links)
        .layout(32);

    var abc = mapping.nodes;
    abc.forEach(function (item) {
        sankey.colorNodes(item);
        // console.log(item)
        //console.log('sankey',sankey)
    })



    var link = svg.append("g").selectAll(".link")
        .data(mapping.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", path)
        .attr("id", function (d, i) {
            d.id = i;
            return "link-" + i;
        })
        .style("stroke-width", function (d) {
            return 5 //Math.max(1, d.dy);
        })
        .style("stroke", function (d) {
            return d.color;
        })
        .sort(function (a, b) {
            return b.dy - a.dy;
        });

    link.append("title")
        .text(function (d) {
            return d.source.name + " → " + d.target.name; //+ "\n" + format(d.value);
        });


    var node = svg.append("g").selectAll(".node")
        .data(mapping.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        })
        .on("mouseover", highlight_node_links)
        .on("mouseout", clear_highlight)
        .call(d3.behavior.drag()
            .origin(function (d) {
                return d;
            })
            .on("dragstart", function () {
                this.parentNode.appendChild(this);
            })
            .on("drag", dragmove));

    node.append("rect")
        .attr("height", function (d) {
            return d.dy;
        })
        .attr("width", sankey.nodeWidth())
        .style("fill", function (d) {
            return d._color;
            //d.color = color(d.name.replace(/ .*/, ""));
        })
        .style("stroke", function (d) {
            return d3.rgb(d.color).darker(3);
        })
        .append("title")
        .text(function (d) {
            // console.log('Title....', d);
            return d.fullName; //+ "\n" + format(d.value);
        });

    node.append("text")
        .attr("x", -6)
        .attr("y", function (d) {
            return d.dy / 2;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function (d) {
            return d.name;
        })
        .filter(function (d) {
            //return d.x < width / 2;
            return d.x < width - 10
        })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");


    function dragmove(d) {
        d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
        sankey.relayout();
        link.attr("d", path);
    }

    function clear_highlight(node, i) {

        var remainingNodes = [],
            nextNodes = [];

        var stroke_opacity = 0;
        if (d3.select(this).attr("data-clicked") == "1") {
            d3.select(this).attr("data-clicked", "0");
            stroke_opacity = 0.2;
        } else {
            d3.select(this).attr("data-clicked", "1");
            stroke_opacity = 0.2;
        }

        var traverse = [{
            linkType: "sourceLinks",
            nodeType: "target"
        }, {
            linkType: "targetLinks",
            nodeType: "source"
        }];

        traverse.forEach(function (step) {
            node[step.linkType].forEach(function (link) {
                remainingNodes.push(link[step.nodeType]);
                clear_highlightForNode(link.id, stroke_opacity);
            });

            while (remainingNodes.length) {
                nextNodes = [];
                remainingNodes.forEach(function (node) {
                    node[step.linkType].forEach(function (link) {
                        nextNodes.push(link[step.nodeType]);
                        clear_highlightForNode(link.id, stroke_opacity);
                    });
                });
                remainingNodes = nextNodes;
            }
        });
    }

    function highlight_node_links(node, i) {

        var remainingNodes = [],
            nodeColor = node.color,
            nextNodes = [],
            sourceNode = node;

        var stroke_opacity = 0;
        if (d3.select(this).attr("data-clicked") == "1") {
            d3.select(this).attr("data-clicked", "0");
            stroke_opacity = 0.2;
        } else {
            d3.select(this).attr("data-clicked", "1");
            stroke_opacity = 1;
        }

        var traverse = [{
            linkType: "sourceLinks",
            nodeType: "target"
        }, {
            linkType: "targetLinks",
            nodeType: "source"
        }];

        traverse.forEach(function (step) {
            node[step.linkType].forEach(function (link) {
                remainingNodes.push(link[step.nodeType]);
                highlight_link(nodeColor, link.id, stroke_opacity);
            });


            while (remainingNodes.length) {
                nextNodes = [];
                remainingNodes.forEach(function (node) {
                    node[step.linkType].forEach(function (link) {
                        if (sourceNode.name == 'BNY' || sourceNode.name == 'GS') {
                            // console.log('link from bny', link);
                            if (link.source.name == 'Other Bank Balance' && link.target.name == 'IT2 Extract') {
                                return;
                            }
                        }

                        if (sourceNode.name == 'GS Balance Funding Excess') {

                            if (link.source.name == 'Fund Liquidity Overview' && link.target.name == 'GS Balance')
                                return;
                        }
                        nextNodes.push(link[step.nodeType]);
                        highlight_link(nodeColor, link.id, stroke_opacity);
                    });
                });
                remainingNodes = nextNodes;
            }
        });
    }

    function highlight_link(color, id, opacity) {
        //d3.select("#link-" + id).style("stroke", color);
        d3.select("#link-" + id).style("stroke-opacity", opacity);
    }

    function clear_highlightForNode(id, opacity) {
        //d3.select("#link-" + id).style("stroke", "black");
        d3.select("#link-" + id).style("stroke-opacity", opacity);
    }

    //});

}