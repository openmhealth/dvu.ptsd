
ptsd.plot.binary = function(vis_container){
  //create what will become the return value of omh.dvu.timeline() 
  var self = $.extend({},omh.dvu.timeline(vis_container))
  
  self.plot = function(data){
    
    if(!data || data.length < 1){
      alert("No Data Available")
      return
    }
    
    data.sort(function(a, b){
      return a.time - b.time
    })

    self.xRange(ptsd.startDate, ptsd.endDate)
    
    //var y = d3.scale.linear()
    //.domain([data[0].min, data[0].max]).range([self.height(), 0])
    
    var y = 10
    
    var x = d3.time.scale()
    .domain([ptsd.startDate, ptsd.endDate]).range([0,self.width()]) 
      
    var scatter = self.vis.data([data])
    .append('g')
    .attr('transform','translate(50,25)')
    .attr('class','plot')
    .style('clip-path','url('+self.container+'_pathClip)')
    
    $.each(data, function(){
      scatter.append("circle")
      .style("fill", this.color)
      .style("stroke", 'black')
      .style("stroke-width", 1)
      .attr("data", JSON.stringify(this))
      .attr("class", "dot")
      .attr("r", 5)
      .attr("cx", x(this.x))
      .attr("cy",  this.y)
      .on("mouseover", function() {
        var datum = JSON.parse(d3.select(this).attr('data'))
        ptsd.ui.pointOverlay(datum)
      }).on("mouseout", function() {
        ptsd.ui.hidePointOverlay()
      }).on("mousedown", function() {
        var datum = JSON.parse(d3.select(this).attr('data'))
        ptsd.ui.popup(datum)
      })
    })
    return scatter
  }
  
  self.plotAnnotations = function(data){
    
    data.sort(function(a, b){
      return a.time - b.time
    })

    self.xRange(ptsd.startDate, ptsd.endDate)

    var y = 2
    
    var x = d3.time.scale()
    .domain([ptsd.startDate, ptsd.endDate]).range([0,self.width()]) 
      
    var scatter = self.vis.data([data])
    .append('g')
    .attr('transform','translate(50,25)')
    .attr('class','plot')
    .style('clip-path','url('+self.container+'_pathClip)')
    
    $.each(data, function(){
      scatter.append("rect")
      .style("fill", 'yellow')
      .style("stroke", 'black')
      .style("stroke-width", 1)
      .attr("data", JSON.stringify(this))
      .attr("class", "dot annotation")
      .attr("x", x(this.x))
      .attr("y",  2)
      .attr("width", 10)
      .attr("height", 10)
      .on("mouseover", function() {
        var datum = JSON.parse(d3.select(this).attr('data'))
        ptsd.ui.pointOverlay(datum)
      }).on("mouseout", function() {
        ptsd.ui.hidePointOverlay()
      }).on("mousedown", function() {
        var datum = JSON.parse(d3.select(this).attr('data'))
        ptsd.ui.annotationPopup(datum)
      })
    })
    return scatter
  }
  
  return self
}