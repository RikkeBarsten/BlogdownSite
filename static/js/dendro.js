
//From here:
//https://beta.observablehq.com/@mbostock/d3-cluster-dendrogram

console.log("Hej fra dendro.js");


      //Set max size of viz
var svg = d3.select("svg"),
margin = {top: 5, right: 270, bottom: 5, left: 5},
width = +svg.attr("width") - margin.left - margin.right,
height = +svg.attr("height") - margin.top - margin.bottom;



d3.json("/data/star_wars.json").then(function(data) {
 
//First pass the json to the d3.hierarchy function
const root = d3.hierarchy(data)
      .sort((a, b) => (a.height - b.height) || a.data.name.localeCompare(b.data.name));
  root.dx = 10;
  root.dy = width / (root.height + 1);
  

  d3.cluster().nodeSize([root.dx, root.dy])(root);


  let x0 = Infinity;
  let x1 = -x0;
  root.each(d => {
    if (d.x > x1) x1 = d.x;
    if (d.x < x0) x0 = d.x;
  });


  //Append primary g to hold g's
    var g = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("transform", `translate(${root.dy / 3},${root.dx - x0})`);

  //Append the paths between nodes
      var link = g.append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)
  .selectAll("path")
    .data(root.links())
    .enter().append("path")
      .attr("d", d => `
        M${d.target.y},${d.target.x}
        C${d.source.y + root.dy / 2},${d.target.x}
         ${d.source.y + root.dy / 2},${d.source.x}
         ${d.source.y},${d.source.x}
      `);


  //Add node objects circles and text to node objects    
  var node = g.append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
    .selectAll("g")
    .data(root.descendants().reverse())
    .enter().append("g")
      .attr("transform", d => `translate(${d.y},${d.x})`);

  node.append("circle")
      .attr("fill", d => d.children ? "#555" : "#999")
      .attr("r", 2.5);

  node.append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.children ? -3 : 6)
      .text(d =>  d.children ? d.data.name : d.data.name + " - " + d.data.year)
    .filter(d => d.children)
      .attr("text-anchor", "end")
    .clone(true).lower()
      .attr("stroke", "white");



});





       

    

 