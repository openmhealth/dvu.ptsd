
ptsd.plot.binary = function(vis_container){
  //create what will become the return value of omh.dvu.timeline() 
  var self = $.extend({},omh.dvu.timeline(vis_container))
  
  self.plot = function(data){
    
    data.sort(function(a, b){
      return a.time - b.time
    })

    self.xRange(ptsd.startDate, ptsd.endDate)
    
    //var y = d3.scale.linear()
    //.domain([data[0].min, data[0].max]).range([self.height(), 0])
    
    var y = 10
    
    var x = d3.time.scale()
    .domain([ptsd.startDate, ptsd.endDate]).range([0,self.width()]) 
      
    var path = self.vis.data([data])
    .append('g')
    .attr('transform','translate(50,25)')
    .attr('class','plot')
    .style('clip-path','url('+self.container+'_pathClip)')
    
    $.each(data, function(){
      path.append("circle")
      .style("fill", this.color)
      .style("stroke", 'black')
      .attr("r", 5)
      .attr("cx", x(this.x))
      .attr("cy", 0+7);
    })
  }
  
  return self
}