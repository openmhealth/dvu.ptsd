ptsd.controller = function(){
  var self = {}
  self.plots = []
  $(document).ready(function(){
    //capture mouse location
    $(document).mousemove(function(e){
      ptsd.ui.mouse.x = e.pageX
      ptsd.ui.mouse.y = e.pageY
    }); 
    //initialize plotters
    //ptsd.mainPlot = omh.dvu.timeline('#mainPlot')
    ptsd.mainPlot =   ptsd.plot.main('#mainPlot')
    ptsd.binaryPlot = ptsd.plot.binary('#binaryPlot')
    ptsd.startDate = new Date(2011, 11-1, 6);
    ptsd.endDate = new Date(2011, 11-1, 22);
    
    //need to check login, but here we go
    
    $('#loginDialog').submit(self.signIn)
    $('#logoutButton').click(ptsd.ohmage.logout)
    $('.close').click(function(){
      $(this).parent().hide()
    })
    
    $('#histoButton').click(function(){
      $("#histogram").show()
    })
    
    if(!ptsd.ohmage.token())
      ptsd.ui.showLoginDialog()
    else
      ptsd.ohmage.loadData(function(){
        if(ptsd.data.model == null){
          ptsd.ui.showLoginDialog()
          return
        }
        
        ptsd.ui.populatePatientMenu()
        ptsd.ui.populateSurveyMenu()
        
        $('#surveyMenu').change(ptsd.ui.populatePlotMenu)
        $('#plot').click(self.plot)
        
        ptsd.ui.setupDateChoosers()
      
      })
  })
  
  self.signIn = function(){
    $('#loginDialog .msg').text('Signing In...')
    var user = $('#loginDialog #username').val()
    var password = $('#loginDialog #password').val()
    ptsd.ohmage.login(user,password,{
      success:function(){
        console.log('success called')
        window.location.reload()
      },
      failure:function(){
        console.log('failure called')
        $('#loginDialog .msg').css('color','red').
        text('Incorrect user name or password. Please try again.')
      }
    })
    return false
  }
  
  self.plot = function(){
    console.log('trying to plot',
      $('#patientMenu').val(),
      $('#surveyMenu').val(),
      $('#plotMenu').val()
      )
    var data = ptsd.data.model[$('#patientMenu').val()]
    data = data[$('#surveyMenu').val()]
    var plotVal = $('#plotMenu').val()
    $('#plotMenu option').each(function(){
      var el = $(this)
      if(el.text() == plotVal)
        if(el.attr('name'))
          plotVal = el.attr('name')
    })
    
    data = data[plotVal]
    var datum = data[0]
    if(!datum)
      return;
    var id = ptsd.ui.infoPanel(datum)
    if(datum.max == 1){
      var plot = ptsd.binaryPlot.plot(data)
      plot.attr("id","scatter_"+id)
      ptsd.controller.plots.push({
        type:'scatter',
        plot:plot,
        data:data
      })
    }
    else{
      var plots = ptsd.mainPlot.plot(data)
      plots.path.attr("id","path_"+id)
      ptsd.controller.plots.push({
        type:'path',
        plot:plots.path,
        data:data
      })
      plots.scatter.attr("id","scatter_"+id)
      ptsd.controller.plots.push({
        type:'scatter',
        plot:plots.scatter,
        data:data
      })
    }
  }
  
  self.scaleTime = function(){
    ptsd.mainPlot.xRange(ptsd.startDate, ptsd.endDate)
    ptsd.binaryPlot.xRange(ptsd.startDate, ptsd.endDate)
    
    var x = d3.time.scale()
    .domain([ptsd.startDate, ptsd.endDate])
    .range([0,ptsd.mainPlot.width()])
    
    $.each(ptsd.controller.plots,function(){
      var y = d3.scale.linear()
      .domain([this.data[0].min, this.data[0].max]).
      range([ptsd.mainPlot.height(), 0])
      if(this.type =='path'){
        this.plot.select('path')
        .attr("d", d3.svg.line()
          .x(function(d) {
            return x(d.x)
          }).y(function(d) {
            return y(d.y)
          }))
      }else if(this.type =='scatter'){
        var i = 0
        this.plot.selectAll('circle').each(function(data){
          $(this).attr('cx',x(data[i].x))
          i++
        })
      }
    })
  }
  
  self.saveAnnotation = function(){
  
  }
  
  return self;
}.call()
