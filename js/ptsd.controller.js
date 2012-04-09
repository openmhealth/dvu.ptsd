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
    ptsd.mainPlot =   ptsd.plot.main('#mainPlot')
    ptsd.binaryPlot = ptsd.plot.binary('#binaryPlot')
    //set dates
    ptsd.startDate = new Date(2012, 3-1, 1);
    ptsd.endDate = new Date(2012, 5-1, 31);
    // enable date chooser
    ptsd.ui.setupDateChoosers()
   
    //login
    $('#loginDialog').submit(self.signIn)
    
    $('#logoutButton').click(ptsd.ohmage.logout)
    
    $('.close').click(function(){
      $(this).parent().hide()
    })
  
    $('#campaignMenu').change(self.campaignChanged)
    $('#patientMenu').change(self.patientChanged)
    $('#surveyMenu').change(ptsd.ui.populatePlotMenu)

    $('#histoButton').click(function(){
      $("#histogram").show()
    })
    
    $('#annotationButton').click(self.annotate)
    $('#plot').click(self.preparePlot)
    
    if(!ptsd.ohmage.token())
      ptsd.ui.showLoginDialog()
    else{
      ptsd.ohmage.userInfo(function(campaign){
        console.log('campaign',campaign)
      })
    }
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
  
  self.campaignChanged = function(){
    console.log('campaignChanged')
    ptsd.ohmage.campaign = $('#campaignMenu').val()
    ptsd.ohmage.loadPatients()
  }
  
  self.patientChanged = function(){
    var patient = $('#patientMenu').val()
    //var surveyKey = self.getSurveyId() 
    console.log('ptsd.ohmage.surveyId',ptsd.ohmage.surveyId)
    $('.dot.annotation,#infoProto.annotation').remove()
  /*
    if(ptsd.ohmage.surveyKey){
      ptsd.ohmage.getAnnotations(function(res){
        ptsd.data.filters.anotation(res)
        console.log('ptsd.data.model[elm.val()]["Annotation"]', ptsd.data.model[patient]["Annotation"])
        ptsd.binaryPlot.plotAnnotations(ptsd.data.model[patient]["Annotation"])
        ptsd.ui.annotationInfoPanel()
      })
    }
    */
  }
  
  self.annotate = function(){
    var annotation = $('#popup .annotations textarea').val()
    var timestamp = $('#popup .timestamp span').text()
    timestamp = new Date(timestamp).getTime()
    console.log("annotation : "+annotation+", timestamp"+timestamp)
    ptsd.ohmage.annotate(annotation, timestamp,function(){
      $('#annotationMsg').show()
    })
  }
  
  self.checkData = function(){
    
  }
  
  self.preparePlot = function(){
    var patient = $('#patientMenu').val()
    console.log('Preparing plot:',
      patient,
      $('#surveyMenu').val(),
      $('#plotMenu').val()
      )
    var data = ptsd.data.model[patient]
    if(!data){
      ptsd.ohmage.loadData(patient,function(){
        self.plot()
        ptsd.ohmage.getAnnotations(function(res){
          ptsd.data.filters.anotation(res)
          ptsd.binaryPlot.plotAnnotations(ptsd.data.model[patient]["Annotation"])
          ptsd.ui.annotationInfoPanel()
        })
      })
    } else{
      self.plot()
    }
  
  }
  
  self.plot = function(){
    var data = ptsd.data.model[$('#patientMenu').val()]
    data = data[$('#surveyMenu').val()]
    var plotVal = $('#plotMenu').val()
    $('#plotMenu option').each(function(){
      var el = $(this)
      if(el.text() == plotVal)
        if(el.attr('name'))
          plotVal = el.attr('name')
    })
    if(!data){
      alert("No Data Available")
      return
    }
    data = data[plotVal]
    if(!data){
      alert("No Data Available")
      return
    }
    var datum = data[0]
    if(!datum){
      alert("No Data Available")
      return;
    }
    
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
