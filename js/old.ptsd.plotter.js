
ptsd.plotter = function(vis_container){
  //create what will become the return value of omh.dvu.timeline() 
  var self = $.extend(omh.dvu.timeline(vis_container),{
    plots:{},
    dot:function(circle,d,plot){
      console.log('circle.d',d)
      if(d.y > 40){
        circle.style('fill','red')
      }
      if(plot.db.title == 'Depression' && d.y >= 10){
        circle.style('fill','red')
      }
      circle.style('clip-path',
        'url('+self.container+'_scatter_clip)')
      .attr('class', 'dot')
      .attr('fill', plot.color)
      //.attr('stroke', plot.color)
      .attr('r',5)
      .attr('datum',d)
      .attr('info',d.info)
      .attr('minY',d.minY)
      .attr('maxY',d.maxY)
      .on("mouseover", function() {
        var point = d3.select(this)
        var cx = point.attr('cx')
        var cy = point.attr('cy')

        console.log('plot',plot)
        
        d3.select('.overlay').remove()
        var overlay =  self.vis.append('g')
        .attr('class','overlay')
        .attr('transform','translate('+cx+','+(cy-20)+')')
        overlay.append('rect')
        .attr('width','90')
        .attr('height','40')
        overlay.append('text')
        .style('fill',plot.db.color)
        .attr('dy','15')
        .attr('dx','10')
        .text(plot.db.title)
        overlay.append('text')
        .style('fill',plot.db.color)
        .attr('dy','30')
        .attr('dy','30')
        .attr('dx','10')
        .text(point.attr('info'))
        var minY = point.attr('minY')
        minY = parseInt(minY)
        var maxY = point.attr('maxY')
        maxY = parseInt(maxY)
        // $('.info_'+plot.plot_id+' .data_info').text(point.attr('info'))
        //console.log('self',self,'minY',minY,'maxY',maxY)
        
        if(maxY > 50)
          self.yRange(minY, maxY, 2)
        else
          self.yRange(minY ,maxY)
      })
      .on("mousedown",function(){
        var elm = $(this).parent()
        var id = elm.attr('class')
        id = id.replace('scatter_plot scatter_' ,'')
        var db = self.plots[id]
        var info = $('.info_'+id)
        console.log(info)
        $('#popup span').each(function(){
          var span = $(this)
          span.text(
            info.find('.'+span.attr('class')).text()
            )
        })
        $('#popup').show()
      })
      return circle
    },
    scaleTime:function(start_date, end_date){
      self.xRange(start_date, end_date)
      self.xLabels(self.x_labels)
      var canvas = d3.select(self.container+' #plot_canvas')
      var wid = self.width()
      var hgt = self.height()
      var x = d3.time.scale()
      .domain([start_date, end_date])
      .range([0, wid])
      
      $.each(self.plots,function(){
        var plot = this
        var y = d3.scale.linear().domain([plot.db.min_y, plot.db.max_y])
        .range([hgt, 0])
        
        $('.scatter_'+plot.plot_id+' circle').remove()
        $('.line_'+plot.plot_id+' line').remove()
        
        if(plot.path){
          console.log('scale path')
          plot.path.select('path')
          .attr("d", d3.svg.line()
            .x(function(d) {
              return x(d.x)
            })
            .y(function(d) {
              return y(d.y)
            }))
            
          $.each(plot.db.data,function(i,d){
            var dot = plot.scatter.append('circle')
            self.dot(dot, d, plot)
            .attr('cx', x(d.x))
            .attr('cy',y(d.y))  
          })
        }
        
        else {
          $.each(this.db.data,function(i,d){
            if(d.y == 1){
              var dot = plot.scatter.append('circle')
              self.dot(dot,d,plot)
              .attr('cx', x(d.x))
              .attr('cy',d.aux_y)
            }
          })
        }
      })
    
    },    
    plotDataBundle:function(db){
      if(db.max_y > 50)
        self.yRange(db.min_y ,db.max_y,2)
      else
        self.yRange(db.min_y ,db.max_y)
      self.yLabels(self.y_labels)
      
      var wid = self.width(), hgt = self.height()
      var y = d3.scale.linear().domain([db.min_y, db.max_y])
      .range([hgt, 0])
      var x = d3.time.scale().domain(
        [db.start_date, db.end_date]).range([0, wid])
      var plot = {}
      plot.db = db
      plot.plot_id = new Date().getTime()
      plot.color = db.color
      console.log('self.vis',self.vis)
      plot.path = self.vis.data([db.data]).append('g')
      .attr('transform','translate(50,25)')
      .attr('class','line_plot line_'+plot.plot_id)
      
      plot.path.append("path")
      .style('clip-path','url('+self.container+'_path_clip)')
      .attr('stroke', db.color)
      .attr('stroke-width', db.strokeWidth)
      .attr('fill', 'none')
      .attr("d", d3.svg.line()
        .x(function(d) {
          return x(d.x)
        })
        .y(function(d) {
          return y(d.y)
        }))
        
      plot.scatter = self.vis.data([db.data]).append('g')
      .attr('transform','translate(50,25)')
      .attr('class','scatter_plot scatter_'+plot.plot_id)
      
      var format = d3.time.format("%m/%d/%Y")
      $.each(db.data,function(k,d){
        var dot = plot.scatter.append('circle')
        self.dot(dot,d,plot)
        .attr('cx', x(d.x))
        .attr('cy',y(d.y))
      })
      self.plots[plot.plot_id] = plot
      self.last_plot = plot
      self.stroke_wid = 5
      return self
    },
    getPlot:function(plot_id){
      $.each(plots, function(){
        if(this.plot_id == plot_id)
          return this
      })
    },
    plotIcons:function(db){
     
      //self.xRange(db.start_date, db.end_date)
      //self.xLabels(self.x_labels)
      
      var canvas = d3.select(self.container+' #plot_canvas')
      var wid = self.width()
      var hgt = self.height()
      
      var x = d3.time.scale()
      .domain([db.start_date, db.end_date])
      .range([0, wid])
      
      var plot = {}
      plot.db = db
      plot.color =  db.color
      plot.plot_id = new Date().getTime()
      
      plot.line = self.vis.data([db.data]).append('g')
      .attr('transform','translate(50,25)')
      .attr('class','line_plot line_'+plot.plot_id)
      
      plot.scatter = self.vis.data([db.data]).append('g')
      .attr('transform','translate(50,25)')
      .attr('class','scatter_plot scatter_'+plot.plot_id)
      
      $.each(db.data,function(k,d){
        if(d.y == 1){
          var dot = plot.scatter.append('circle')
          self.dot(dot,d,plot)
          .attr('cx', x(d.x))
          //          .attr('cy',hgt-10)
          .attr('cy',d.aux_y)
        }
      })
      self.plots[plot.plot_id] = plot
      self.last_plot = plot
      return self
    }
  })
  return self
}

//Init GUI

  