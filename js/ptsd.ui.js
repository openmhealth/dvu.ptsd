if(typeof ptsd == 'undefined'){
  alert('ptsd.data_model.js requires ptsd.js.'+ 
    'Please include it in your document.');
}else{
  console.log('ptsd.js is loaded, super!')
}

ptsd.ui = {}
ptsd.ui.mouse = {}
ptsd.ui.surveyMenu = {
  'PTSD Symptoms':[
  'All=All',
  '1pcl1=Repeated disturbing memories, thoughts, or images of the stressful experience',
  '1pcl2=Repeated disturbing dreams of the stressful experience',
  '1pcl3=Suddenly acting or feeling as if the stressful experience were happening again',
  '1pcl4=Feeling very upset when something reminded you of the stressful experience',
  '1pcl5=Having physical reactions when reminded of the stressful experience',
  '1pcl6=Avoiding thinking, talking, or having feelings about the stressful experience',
  '1pcl7=Avoiding activities or situations that reminded you of the stressful experience',
  '1pcl8=Trouble remembering important parts of the stressful experience',
  '1pcl9=Loss of interest in activities that you used to enjoy',
  '1pcl10=Feeling distant or cut off from other people',
  '1pcl11=Feeling emotionally numb or unable to have loving feelings for those close to you',
  '1pcl12=Feeling as if your future somehow will be cut short',
  '1pcl13=Trouble falling or staying asleep',
  '1pcl14=Feeling irritable or having angry outbursts',
  '1pcl15=Having difficulty concentrating',
  '1pcl16=Being "superalert" or watchful or on guard',
  '1pcl17=Feeling jumpy or easily startled'
  ],
  'Depression': [
  "All=All",
  "1phq91=having little interest or pleasure in doing things",
  "1phq92=feeling down, depressed or hopeless",
  "1phq93=trouble falling or staying asleep, or sleeping too much",
  "1phq94=feeling tired or having little energy",
  "1phq95=poor appetite or overeating",
  "1phq96=feeling bad about yourself ",
  "1phq97=trouble concentrating on things",
  "1phq98=moving or speaking exceptionaly slowly or rapidly",
  "1phq99=thoughts that you would be better off dead, or of hurting yourself in some way"
  ],

  'Mood and Behaviors':[
  'Overall Mood',
  'Anger',
  'Conflict',
  'Sleep'
  ],
  'Medications':[
  'All=Dosage',
  'Side-Effects=Side-Effects'
  ],
  'Coping and Substance Use':[
  'Alcohol',
  'Alcohol Quantity',
  'Coping Ability',
  'Coping Situations',
  'Coping Tools',
  'Non-prescribed Drugs'
  ],
  'Support Types':[
  'Support from Others'
  ],
  'Tool Participation':[],
  'Symptom Severity':[],
  'SUDS Ratings':[]
}

ptsd.ui.showLoginDialog = function(){
  $('#logoutButton').hide()
  $('body,svg').css('background','#ddd')
  $('#loginDialog').dialog()
}
ptsd.ui.hideLoginDialog = function(){
  $('#logoutButton').show()
  $('body,svg').css('background','#fff')
  $('#loginDialog').hide()
}

ptsd.ui.populatePatientMenu = function(){
  var val, patientMenu = $('#patientMenu')
  $.each(ptsd.data.model, function(k,v){
    patientMenu.append( $('<option>').attr('name',k).text(k) )
  })
}

ptsd.ui.populateSurveyMenu = function(){
  var surveyMenu = $('#surveyMenu')
  $.each(ptsd.ui.surveyMenu,function(k,v){
    surveyMenu.append( $('<option>').attr('name',k).text(k) )
  })
  ptsd.ui.populatePlotMenu()
}

ptsd.ui.populatePlotMenu = function(){
  var plotMenu = $('#plotMenu')
  plotMenu.find('option').remove()
  var val  = $('#surveyMenu').val()
  var v
  var plots = ptsd.ui.surveyMenu[val]
  $.each(plots, function(k,v){
    val = this.toString()
    v = val.split('=')
    if(v.length < 2)
      v = [val,val]
    plotMenu.append( $('<option>').attr('name',v[0]).text(v[1]) )
  })
}

ptsd.ui.setupDateChoosers = function(){

  ptsd.ui.startDate = $('#startDate').datepicker({
    showAnim:'fade',
    altField: '#from',
    dateFormat: 'm/d/yy', 
    altFormat: 'M d, yy',
    changeMonth: true,       
    onSelect: function(selectedDate) {
      ptsd.startDate = new Date(selectedDate)
      ptsd.controller.scaleTime()
    }
  })   
    
  ptsd.ui.endDate = $('#endDate').datepicker({
    showAnim:'fade',
    altField: '#to',
    dateFormat: 'm/d/yy', 
    altFormat: 'M d, yy',
    changeMonth: true,       
    onSelect: function(selectedDate) {
      ptsd.endDate = new Date(selectedDate)
      ptsd.controller.scaleTime()
    }
  })
}

ptsd.ui.populateOverlay = function(el,data){
  el.find('.patient span').text(data.patient)
  el.find('.timestamp span').text(data.timestamp)
  el.find('.survey span').text(data.survey)
  if(data.question)
    el.find('.question').show().find('span').text(data.question)
  else
    el.find('.question').hide()
  var res = data.y
  if(data.responseText)
    res += ", "+data.responseText
  el.find('.response span').text(res)
}
  
ptsd.ui.pointOverlay = function(data){
  var el = $('#pointOverlay')
  ptsd.ui.populateOverlay(el,data)
  el.css("top",ptsd.ui.mouse.y+20).css("left",ptsd.ui.mouse.x-50).show()
}
  
ptsd.ui.hidePointOverlay = function(){
  $('#pointOverlay').hide()
}

ptsd.ui.popup = function(data){
  ptsd.ui.hidePointOverlay()
  var el = $('#popup')
  ptsd.ui.populateOverlay(el,data)
  el.show()
}

ptsd.ui.infoPanel = function(data){
  var id = new Date().getTime()
  var info = $('#infoProto').clone()
  info.css('border-left-color',data.color)
  ptsd.ui.populateOverlay(info,data)
  info.removeAttr("id").addClass("info_"+id)
  if(data.max == 1)
    $('#binary_info_panel').append(info)
  else
    $('#info_panel').append(info)
  info.find('.close').attr('id',id).click(function(){
    var e = $(this)
    e.parent().remove()
    $('#path_'+e.attr('id')).remove()
    $('#scatter_'+e.attr('id')).remove()
  })
  return id;
}


     
/*
$(document).ready(function(){
  $('#x_rules').change(function(){
    var elm = $(this)
    var checked = elm.attr('checked')
    main.xRules(checked != null)
  })

  $('#y_rules').change(function(){
    var elm = $(this)
    var checked = elm.attr('checked')
    main.yRules(checked != null)
  })
  
  $('#x_labels').change(function(){
    var elm = $(this)
    var checked = elm.attr('checked')
    main.xLabels(checked != null)
  })
  
  $("#thickness").keyup(function(evt) {
    var val = $(this).val()
    val = parseInt(val)
    if(val != 'NaN'){
      d3.select('path').style('stroke-width',val)
      main.strokeWidth(val)
    }
  });
  
  $('#popup .close').click(function(evt){
    $('#popup').hide()
  })
        
  $('.dot').mousedown(function(evt){
    $('#popup').show()
  })
  
  $('#plot_category').change(function(evt){
    $("#plot_category option:selected").each(function () {
      var cat =  $(this).text()
      console.log('cat',cat)
      $('#plot_type option').remove()
      $('#plot_type').show()
      .append($('<option>').text('All'))
      if(cat == 'Tool Participation'){
        $('#plot_type')
        .append($('<option>').text('Relaxation Tool'))
        .append($('<option>').text('Tool 2'))
        .append($('<option>').text('Tool 3'))
      }
      else if(cat == 'SUDS Ratings'){
        $('#plot_type')
        .append($('<option>').text('Before'))
        .append($('<option>').text('After'))
      }else if(cat == 'Symptom Severity'){
        $('#plot_type')
        .append($('<option>').text('Before'))
        .append($('<option>').text('After'))
      }else if(cat == 'Support Types'){
        $('#plot_type')
        .append($('<option>').text('911'))
        .append($('<option>').text('Hotline'))
        .append($('<option>').text('Other'))
      }else if(cat == 'PTSD Symptoms'){
        var pt = $('#plot_type').replaceWith(pcl_menu)
      }else if(cat == 'Mood and Behaviors'){
        var pt = $('#plot_type')
        main.range(1,7).each(function(i){
          pt.append($('<option>').text('Question '+i))
        })
      }else if(cat == 'Coping and Substance Use'){
        $('#plot_type')
        .append($('<option>').text('Alcohol'))
        .append($('<option>').text('Drugs'))
      }else if(cat == 'Medications'){
        $('#plot_type').hide()
      }else if(cat == 'Depression'){
        var pt = $('#plot_type')
        main.range(1,10).each(function(i){
          pt.append($('<option>').text('Question '+i))
        })
      }
    });
  })

  self.data_gen = ptsdDataGen();
  
  console.log('#plot_form',$('#plot_form'))
  $('#plot_form').submit(function(){
    
    var form = $(this)
    var patient = form.find('#patient').val()
    var plot_category = form.find('#plot_category').val()
    var plot_type = form.find('#plot_type').val()
    var color =  form.find('#color').val()
    
    if(plot_category == "PTSD Symptoms" && plot_type != "All"){
      plot_category+= " Sub"
    }else{

    }
    console.log('plot_category',plot_category)
    var db = self.data_gen.call(plot_category)
    if(plot_type != "All"){
      db.strokeWidth = 3
    }
    console.log('db',db)
    main.strokeWidth(1)
    .tickSpacing(15)
    
    var graph
    if(db.type == 'path'){
      main.strokeWidth(5).plotDataBundle(db)
      graph = main
    }
    else if(db.type == 'line'){
      binary.plotIcons(db)
      graph = binary
    }
    //main.plotIcons(db)
    
    var info = $('#defs .info').clone()
    //info.css('background-color',main.plot_clr)
    //info.css('background-color',db.color)
    info.css('border-left',db.color+ " 3px solid")
    info.find('.subject').text(patient)
    info.find('.category').text(plot_category)
    info.find('.type').text(plot_type)
    info.addClass('info_'+graph.last_plot.plot_id)
    info.find('.close').attr('id',graph.last_plot.plot_id)
    .click(function(){
      $('.path_'+this.id).remove()
      $('.line_'+this.id).remove()
      $('.scatter_'+this.id).remove()
      $('.info_'+this.id).remove()
    })
      
    info.find('.lines').change(function(){
      var elm = $(this)
      var checked = elm.attr('checked')
      elm = elm.parent()
      elm = elm.next('.close')
      var id = elm.attr('id')
      if(checked){
        $('.path_'+id).show()
        $('.line_'+id).show()
      }else{
        $('.path_'+id).hide()
        $('.line_'+id).hide()
      }
      console.log('elm',elm)
    })
    
    info.find('.scatter').change(function(){
      var elm = $(this)
      var checked = elm.attr('checked')
      elm = elm.parent()
      elm = elm.next('.close')
      var id = elm.attr('id')
      if(checked){
        $('.scatter_'+id).show()
      }else{
        $('.scatter_'+id).hide()
      }
      console.log('elm',elm)
    })
    if(graph == main)
      $('#info_panel').append(info)
    else
      $('#binary_info_panel').append(info)
    return false;
  })
})
 */