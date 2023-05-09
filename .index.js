//We are using d3.js (v3), jquery and topojson (https://github.com/topojson or https://github.com/topojson/topojson)
// TopoJSON is an extension of GeoJSON that encodes topology. Combined with fixed-precision encoding for coordinates, TopoJSON is usually much smaller than GeoJSON.


// D3 works with two types of geographic JSON, GeoJSON, and a format called TopoJSON.

// GeoJSON vs. TopoJSON
// TopoJSON is an extension of GeoJSON that encodes topology. Rather than representing geometries discretely, geometries in TopoJSON files are stitched together from shared line segments called arcs.

$(document).ready(() => {
  // Width and Height of the whole visualisation 
  const w = 1000;
  const h = 480;

   //D3 has some internal functionality that can turn GeoJSON data into screen coordinates based on the projection you set. This is not unlike other libraries such as Leaflet, but the result is much more open-ended, not constrained to shapes on a tiled Mercator map.1 So, yes, D3 supports projections.
  const projection = d3.geo.equirectangular()
  // Creation of GeoPath function that uses built-in D3 functionality to turn lat/lon coordinates into screen coordinates
  const path = d3.geo.path()
    .projection(projection);
  // the following is to create SVG canvas: 
  const svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h)

  svg.append("rect")
  .attr("width", w)
  .attr("height", h)
  .attr("fill", "#90caf9"); //Map background. Colour set: blue lighten-3

  //  Append empty placeholder g element to the SVG
  // g will contain geometry elements
  const g = svg.append("g");

  // Adds call to d3.json to load the TopoJSON file
  d3.json("https://d3js.org/world-50m.v1.json", (error, data) => {
    if (error) console.error(error);
      g.append("path")
      .datum(topojson.feature(data, data.objects.countries))
      .attr("d", path);

    const zoom = d3.behavior.zoom()
      .on("zoom", () => {
        g.attr("transform", "translate(" + d3.event.translate.join(",") + ")scale(" + d3.event.scale + ")");
        g.selectAll("path").attr("d", path.projection(projection));
    });
    svg.call(zoom);

    // JSON url to load the data from the jason file
  d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json", (error, data) => {
    if (error) 
      console.error(error); 

    const locations = data.features;
    let hue = 0;  // Create the circles

    locations.map( (d) => {
      hue += 0.36
      d.color = "hsl(" + hue + ", 100%, 50%)";
    });

    g.selectAll("circle")
      .data(locations)
      .enter()
      .append("circle")
      .attr("cx", (d) => {
      if (d.geometry) {
        return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0];
      }
    })
    .attr("cy", (d) => {
      if (d.geometry) {
        return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1];
      }
    })
    .attr("r", (d) => {
      if (d.properties.mass) {
        return parseInt(d.properties.mass) ** (1 / 9);
      }
    })
    .style("fill", (d) => {
      return d.color;
    })
    //  Add event listeners | mouse-over
        .on("mouseover", (d) => {
          d3.select(this).style("fill", "black"); 
          d3.select("#name").text(d.properties.name);
          d3.select("#nametype").text(d.properties.nametype);
          d3.select("#fall").text(d.properties.fall);
          d3.select("#mass").text(d.properties.mass);
          d3.select("#recclass").text(d.properties.recclass);
          d3.select("#reclat").text(d.properties.reclat);
          d3.select("#reclong").text(d.properties.reclong);
          d3.select("#year").text(d.properties.year);
          d3.select("#tooltip")
            .style("left", (d3.event.pageX + 20) + "px")
            .style("top", (d3.event.pageY - 80) + "px")
            .style("display", "block")
            .style("opacity", 0.9)
        })
        //Add Event Listeners | mouseout
        .on("mouseout", (d) => { 
          d3.select(this).style("fill", d.color);
          d3.select("#tip")
            .style("display", "none");
      });
    });
  });
});
