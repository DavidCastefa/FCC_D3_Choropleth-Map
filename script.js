// Much of the JavaScript used in this project is based on Ganesh H's YouTube walkthrough
// at https://www.youtube.com/watch?v=ha1toFtBfF8

let eduUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
let mapUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"

let eduData
let countyData

let height = 620 // window.innerHeight * 0.82;
let width = 960 // window.innerWidth * 0.92;

let padding = 50

let canvas = d3.select("#canvas")

let drawCanvas = () => {
  canvas.attr("height", height)
        .attr("width", width)
}

let drawMap = () => {

  let tooltip = d3.select("body")
                  .append("div")
                  .attr("id", "tooltip")
                  .style("opacity", 0)

  canvas.selectAll("path")
        .data(countyData)
        .enter()
        .append("path")
        .attr("d", d3.geoPath())
        .attr("class", "county")
        .attr("fill", countyDataItem => {
          let id = countyDataItem.id
          let county = eduData.find(eduDataItem => eduDataItem.fips == id)
          let percent = county.bachelorsOrHigher
          // colors from https://blog.datawrapper.de/how-to-choose-a-color-palette-for-choropleth-maps/
          // convert to hex at https://www.w3schools.com/colors/colors_picker.asp
          if (percent <= 10) return "#fcfad2" // creamy yellow 
          if (percent > 10 && percent <= 20) return "#c9e3b8" // dull light green
          if (percent > 20 && percent <= 30) return "#84cbbb" // dull blue green
          if (percent > 30 && percent <= 40) return "#48b7c1" // dull dark blue green
          if (percent > 40 && percent <= 50) return "#3382b5" // dark navy blue
          if (percent > 50) return "#253c90" // indigo
         })
        .attr("data-fips", countyDataItem => countyDataItem.id)
        .attr("data-education", countyDataItem => {
          let id = countyDataItem.id
          let county = eduData.find(eduDataItem => eduDataItem.fips == id)
          return county.bachelorsOrHigher
         })

        .on("mouseover", (event, countyDataItem) => {
          let id = countyDataItem.id
          let county = eduData.find(eduDataItem => eduDataItem.fips == id)
          let areaName = county.area_name
          let percent = county.bachelorsOrHigher
          let state = county.state
          tooltip.style("opacity", 1)
                 .attr("data-education", percent)
                 .html(
                    areaName + ", " + 
                    state + ":  " + 
                    percent + "%"
                  )
                 .style("position", "absolute")
                 .style("left", (event.pageX + 10) + "px")
                 .style("top", (event.pageY - 20) + "px")
          })
        .on("mouseleave", (event, item) => {
          tooltip.style("opacity", 0)
                 .html("")  // Avoid interference with other data points
          })
}

d3.json(mapUrl).then(
  (data, error) => {
    if (error) console.log(log)
    else {
      // topojson.feature converts to geojson format required by D3
      // also, we only need the features array of the resulting object
      countyData = topojson.feature(data, data.objects.counties).features
      console.log(countyData)
      d3.json(eduUrl).then(
        (data, error) => {
          if (error) console.log(log)
          else {
            eduData = data
            console.log(eduData)
            drawCanvas()
            drawMap()
          }
        }
      )
    }
  }

)
