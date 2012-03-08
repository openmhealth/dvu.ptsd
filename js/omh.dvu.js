/*******************************************************************************
 * D3.js is required, so let's make sure it's loaded.
 **/ 

if(typeof d3 == 'undefined'){
  alert('dvu.js requires d3.js.'+ 
    'Please include it in your document.');
}else{
  console.log('d3.js is loaded, great!')
}

omh.dvu = function(vis_container){
  var self = $.extend({},omh())
  self.container = vis_container
  self.id = $(self.container).attr('id')
  console.log('self.container',self.container)
  self.vis = d3.select(vis_container)
  .append('svg:svg').attr('class','mainGraph')
  
  self.height = function(){
    var height = self.vis.style('height').replace(/px$/, '')
    return parseInt(height)
  }
  
  self.width = function(){
    var width = self.vis.style('width').replace(/px$/, '')
    return parseInt(width)
  }
  
  //add some defs to the svg so we can crerate a clip path
  self.defs = self.vis.append('defs')
  self.defs.append('clipPath')
  .attr('id',$(vis_container).attr('id') + '_scatterClip')
  .append('rect')
  .attr('x',-6).attr('y',-6)
  .attr('width',self.width() - 62)
  .attr('height',self.height() - 62)
  
  self.defs.append('clipPath')
  .attr('id',$(vis_container).attr('id') + '_pathClip')
  .append('rect')
  .attr('x',0).attr('y',0)
  .attr('width',self.width() - 75)
  .attr('height',self.height()-75)
  
  //add the canvas where we will do our plots
  self.vis.append('g')
  .attr('id',self.id+'_plotCanvas')
  .attr('transform','translate(50,25)')
  .append('rect')
  .attr('id','boundingRect')
  .attr('x',0).attr('y',0)
  .attr('width', self.width() - 75).attr('height',self.height()-75)

  self.canvas = function(){
    return d3.select('#'+self.id+'_plotCanvas')
  } 

  self.plot_clr = '#777'
  self.color = function(clr){
    self.plot_clr = clr
    return self
  }
  self.stroke_wid = 2
  self.x_inc = 10
  self.y_inc = 10
  self.xLabels = true
  self.yLabels = true
  self.xLabels = function(b){
    xLabels = b
    if(b)
      $(self.container+' #xTicks text').show()
    else
      $(self.container+' #xTicks text').hide()
    return self
  }
  self.yLabels = function(b){
    yLabels = b
    if(b)
      $(self.container+' #yTicks text').show()
    else
      $(self.container+' #yTicks text').hide()
    return self
  }
  self.xRules = function(b){
    if(b)
      $(self.container+' #xTicks line').show()
    else
      $(self.container+' #xTicks line').hide()
    return self
  }
  self.yRules = function(b){
    if(b)
      $(self.container+' #yTicks line').show()
    else
      $(self.container+' #yTicks line').hide()
    return self
  }
  self.line_plot = true,
  self.linePlot = function(b){
    self.line_plot = b
  }
  self.tick_spacing = 10,
  self.tickSpacing = function(b){
    self.tick_spacing = b
    return self
  }
    
  /***************************************************************************
   ****************************************************************************
   * 
   * Set the thickness of the next plot path
   * Arguments:   
   *    width : (int or decimal) the width of the line in pixels
   *           
   **************************************************************************/ 
  self.strokeWidth = function(wid){
    self.stroke_wid = wid
    return self
  }
  /*
    scatter_plot : true,
    scatterPlot:function(b){
      scatter_plot = b
    },
   */
  /***************************************************************************
   ****************************************************************************
   * 
   * Set the graphs range in the Y axis
   * Arguments:   
   *    min :  (int) start of range
   *    max :  (int) end of range
   *    skip:  (int) number of labels/rules to skip 
   *           on graph
   *           
   **************************************************************************/ 
  self.yRange = function(min, max, skip){
    
    var inc = self.height() / (max-min)
    self.y_inc = inc
    d3.select(self.container+' #yTicks').remove()
    var yTicks = self.canvas.append('g')
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
   * Set the graphs range in the X axis
   * Arguments:   
   *    min :  (int) start of range
   *    max :  (int) end of range
   *    rules: (true:false) draw rules
   *    skip:  (int) number of labels/rules to skip 
   *           on graph
   *           
   **************************************************************************/ 
  self.xRange= function(min, max, rules, skip){
    d3.select(self.container+' #xTicks').remove()
    d3.select(self.container+' #xLabels').remove()
    
    var inc = self.width() / (max-min)
    self.x_inc = inc
    var xTicks = canvas.append('g')
    .attr('id','xTicks')
    var xLabels = canvas.append('g')
    .attr('id','xLabels')
    .attr('transform','translate(0,20)')

    self.range(min+1,max+1).each(function(i){
      if(i%skip == 0){
        i = i-min
        xTicks.append('line')
        .style('clip-path','url('+self.container+'_pathClip)')
        .attr('x1',i*inc).attr('y1',0)
        .attr('x2',i*inc).attr('y2','100%')
      }
    })

    self.range(min,max+1).each(function(i){
      if(i%skip == 0){
        i = i-min
        xLabels.append('text')
        .attr('x',i*inc).attr('y',hgt)
        .attr("dy", ".25em")
        .attr("text-anchor", "middle")
        .text(i)
      }
    })
  }.defaults(0,10,true,1)
  /***************************************************************************
   ****************************************************************************
   * 
   * Plots arrays of coordinates
   * Arguments:   
   *    xA :  (int[]) X coordinates
   *    yA :  (int[]) Y Coordinates
   *           
   **************************************************************************/ 
  self.plot = function(xA,yA){
    var len = xA.length < yA.length ? xA.length:yA.length
    var path = dvu.vis.append('g')
    .attr('transform','translate(50,25)')
    .attr('class','plot')
    .append('path')
    .style('clip-path','url('+self.container+'_pathClip)')
    .attr('stroke', self.plot_clr)
    .attr('stroke-width', self.stroke_wid)
    .attr('fill', 'none')
    console.log('this.x_inc',dvu.x_inc)
    var d = "M"+(xA[0]*self.x_inc)+" "+(yA[0]*dvu.y_inc)
    self.range(0,len).each(function(i){
      d += "L"+(xA[i]*dvu.x_inc)+" "+(yA[i]*dvu.y_inc)
    })
    path.attr('d',d)
  }.defaults([0,1,2,3,4,5,6,7,8,9,10],[10,2,7,4,7,9,3,5,9,3,7])

  /***************************************************************************
   ****************************************************************************
   * 
   * Set the X Axis label title
   * Arguments:   
   *    label : (string) the string that will be displayed
   *           
   **************************************************************************/ 
  self.xTitle = function(label){
    var wid = self.vis.style('width').replace(/px$/, '')
    var hgt = self.vis.style('height').replace(/px$/, '')
    var x = wid/2 + 12
    var y = hgt
    d3.select(self.container+' #xLabel').remove()
    self.vis.append('g')
    .attr('id','xLabel')
    .attr('transform','translate('+x+','+y+')')
    .append('text')
    .attr('class','label')
    .text(label)
  }.defaults('X AXIS')
  /***************************************************************************
   ****************************************************************************
   * 
   * Set the Y Axis label title
   * Arguments:   
   *    label : (string) the string that will be displayed
   *           
   **************************************************************************/ 
  self.yTitle = function(label){
    var hgt = self.vis.style('height').replace(/px$/, '')
    var y = hgt/2 -13
    d3.select(self.container+' #yLabel').remove()
    self.vis.append('g')
    .attr('id','yLabel')
    .attr('transform','rotate(-90) translate(-'+y+',10)')
    .append('text')
    .attr('class','label')
    .text(label)
  }.defaults('Y AXIS')

  console.log('omh.dvu',self)
  return self
}