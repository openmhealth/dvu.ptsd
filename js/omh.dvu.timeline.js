/*******************************************************************************
 * D3.js is required, so let's make sure it's loaded.
 **/ 

if(typeof d3 == 'undefined'){
  alert('omh.dvu.timeline.js requires omh.dvu.js.'+ 
    'Please include it in your document.');
}else{
  console.log('omh.dvu.js is loaded, wonderful!')
}

omh.dvu.timeline = function(vis_container){
  //create what will become the return value of omh.dvu.timeline() 
  var self = $.extend({},omh.dvu(vis_container))
  
  self.plots = []
  
  self.width = function(){
    var wid = d3.select(self.container+' #boundingRect')
    .attr('width').replace(/px$/, '')
    return parseInt(wid)
  }
  self.height = function(){
    var hgt = d3.select(self.container+' #boundingRect')
    .attr('height').replace(/px$/, '')
    return parseInt(hgt)      
  }

  /***************************************************************************
   ****************************************************************************
   * 
   * Set the graphs range in the X axis
   * Arguments:   
   *    min :  (date) start of date range
   *    max :  (date) end of date range
   *    rules: (true:false) draw rules
   *    skip:  (int) number of labels/rules to skip 
   *           on graph
   *           
   **************************************************************************/ 
  self.xRange = function(min, max){
    self.min = min  
    self.max = max  
    var canvas = self.canvas()
    //var canvas = d3.select('#plotCanvas')
    var wid = self.width()
    var hgt = self.height()
      
    d3.select(self.container+' #xTicks').remove()
    d3.select(self.container+' #xLabels').remove()
      
    var x = d3.time.scale().domain([min, max]).range([0, wid])
      
    //var tick_spacing = 10
    var xTicks = canvas.append('g').attr('id','xTicks')
    var x_tick = xTicks.selectAll('g.rule')
    .data(x.ticks(self.tick_spacing))
    .enter()

    x_tick.append('svg:line')
    .attr('x1', x)
    .attr('x2', x)
    .attr('y1', 0)
    .attr('y2', hgt);
     
    x_tick.append('svg:text')
    .attr('class', 'date_labels')
    .attr('x', x)
    .attr('y', hgt+15)
    .attr('dy', '.25em')
    .attr('text-anchor', 'middle')
    .text(x.tickFormat(self.tick_spacing))

    var format = d3.time.format("%b %d")
  }
 
  self.yRange = function(min, max, skip){
    
    
    var inc = self.height() / (max-min)
    self.y_inc = inc
    d3.select(self.container+' #yTicks').remove()
    var yTicks = self.canvas().append('g')
    .attr('id','yTicks')
      
    self.range(min+1,max+1).each(function(i){
      if(i%skip == 0){
        i = i-min
        yTicks.append('line')
        .style('clip-path','url('+self.container+'_pathClip)')
        .attr('x1','0').attr('y1',i*inc)
        .attr('x2','100%').attr('y2',i*inc)
      }
    })
      
    self.range(min,max+1).each(function(i){
      if(i%skip == 0){
        i = i-min
        l = max - i
        yTicks.append('text')
        .attr('x','-20').attr('y',i*inc)
        .attr("dy", ".25em")
        .attr("text-anchor", "middle")
        .text(l)
      }
    })
  }.defaults(0,10,1)
 
  /***************************************************************************
   ****************************************************************************
   * 
   * Plots arrays of coordinates
   * Arguments:   
   *    xA :  (date[]) X coordinates
   *    yA :  (int[]) Y Coordinates
   *           
   **************************************************************************/ 
  
  self.plot = function(data){
    
    data.sort(function(a, b){
      return a.time - b.time
    })

    self.xRange(data[0].x, data[data.length-1].x)
    
    var skip = 1
    if(data[0].skip)
      skip = data[0].skip
    
    self.yRange(data[0].min, data[0].max, skip)
    
    var y = d3.scale.linear()
    .domain([data[0].min, data[0].max]).range([self.height(), 0])
    
    var x = d3.time.scale()
    .domain([data[0].x, data[data.length-1].x]).range([0, self.width()])      
      
    var path = self.vis.data([data])
    .append('g')
    .attr('transform','translate(50,25)')
    .attr('class','plot')
    .style('clip-path','url('+self.container+'_pathClip)')
    .append("path")
    .attr('stroke', self.plot_clr)
    .attr('stroke-width', self.stroke_wid)
    .attr('fill', 'none')
    .attr("d", d3.svg.line()
      .x(function(d) {
        return x(d.x)
      })
      .y(function(d) {
        return y(d.y)
      }))
    return path
  }//.defaults(self.sampleDateArray(),[10,2,7,4,7,9,3,5,9,3,7]),
  
  self.scatterPlot = function(b){
    if(b)
      $(self.container+' .scatterPlot').show()
    else
      $(self.container+' .scatterPlot').hide()
    return self
  }
  
  
  return self
}