ptsd.plot = {}
ptsd.plot.main = function(vis_container){
  //create what will become the return value of omh.dvu.timeline() 
  var self = $.extend({},omh.dvu.timeline(vis_container))
  
  self.width = function(){
    return 825;
  }
  self.height = function(){
    return 325;      
  }
  
  self.plot = function(data){
  
    if(!data || data.length < 1){
      alert("No Data Available")
    }

    data.sort(function(a, b){
      return a.time - b.time
    })

    self.xRange(ptsd.startDate, ptsd.endDate)
    
    var skip = 1
    if(data[0].skip)
      skip = data[0].skip
    
    self.yRange(data[0].min, data[0].max, skip)
    
    var y = d3.scale.linear()
    .domain([data[0].min, data[0].max]).range([self.height(), 0])
    
    var x = d3.time.scale()
    .domain([ptsd.startDate, ptsd.endDate]).range([0,self.width()])
    //.domain([data[0].x, data[data.length-1].x]).range([0, self.width()])      
      
    var plots = {}  
      
    plots.path = self.vis.data([data])
    .append('g')
    .attr('transform','translate(50,25)')
    .attr('class','plot')
    .style('clip-path','url('+self.container+'_pathClip)')
    plots.path.append("path")
    .attr('stroke', data[0].color)
    .attr('stroke-width', data[0].strokeWidth)
    .attr('stroke-dasharray', data[0].dash)
    .attr('fill', 'none')
    .attr("d", d3.svg.line()
      .x(function(d) {
        return x(d.x)
      })
      .y(function(d) {
        return y(d.y)
      }))
      
    plots.scatter = self.vis.data([data])
    .append('g')
    .attr('transform','translate(50,25)')
    .attr('class','plot')
    .style('clip-path','url('+self.container+'_scatterClip)')
      
    $.each(data, function(){
      
      var clr = this.color
      if(this.alert && this.alert())
        clr = "red"
      plots.scatter.append("circle")
      .style("fill", clr)
      .style("stroke", 'white')
      .style("stroke-width", 3)
      .attr("data", JSON.stringify(this))
      .attr("class", "dot")
      .attr("r", 7)
      .attr("cx", x(this.x))
      .attr("cy",  y(this.y))
      .on("mouseover", function() {
        var datum = JSON.parse(d3.select(this).attr('data'))
        self.yRange(datum.min, datum.max, skip)
        ptsd.ui.pointOverlay(datum)
      }).on("mouseout", function() {
        ptsd.ui.hidePointOverlay()
      }).on("mousedown", function() {
        var datum = JSON.parse(d3.select(this).attr('data'))
        ptsd.ui.popup(datum)
      })
    })
    return plots
  }
  
  return self
}