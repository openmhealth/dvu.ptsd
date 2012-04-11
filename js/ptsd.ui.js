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
  'Tool Participation':[
  'All'
  ],
  'SUDs Ratings':[
  'Pre Exercise Ratings',
  'Post Exercise Ratings'
  ]
}

ptsd.ui.msg = function(text){
  if(text === '')
    $('.waiting').hide()
  else
    $('.waiting').show()
  $('#msg').text(text)
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
  surveyMenu.html('')
  $.each(ptsd.ui.surveyMenu,function(k,v){
    surveyMenu.append( $('<option>').attr('name',k).text(k) )
  })
  ptsd.ui.populatePlotMenu()
}

ptsd.ui.populatePlotMenu = function(){
  var plotMenu = $('#plotMenu')
  plotMenu.find('option').remove()
  var val = $('#surveyMenu').val()
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
  if(data.patient)
    el.find('.patient span').text(data.patient)
  else 
    el.find('.patient').hide()
  el.find('.timestamp span').text(data.timestamp)
  if(data.survey)
    el.find('.survey span').text(data.survey)
  else
    el.find('.survey').hide()
  if(data.question)
    el.find('.question').show().find('span').text(data.question)
  else
    el.find('.question').hide()
  if(data.text){
    el.find('.annotation').show().find('span').text(data.text)
    el.find('.response').hide() 
  }
  else{
    el.find('.annotation').hide()
    el.find('.response').show() 
  }
  if(data.y != 90){
    var res = data.y
    if(data.responseText)
      res += ", "+data.responseText
    el.find('.response span').text(res)
  }else{
    el.find('.response span').text(data.responseText)
  }

  var annotations = ptsd.data.model[$('#patientMenu').val()]['Annotation']
/*
$.each(annotations, function(){
    if(data.time === this.time){
      console.log('we got a time match')
      el.find('.annotations textarea').val(this.text)
    }else{
      console.log(data.time,'no match',this.time)
    }
  })
  */
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
  $('.popup').hide()
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
  info.removeClass('annotation')
  return id;
}

ptsd.ui.annotationInfoPanel = function(){
  var info = $('#infoProto').clone()
  info.addClass('annotation')
  info.find('.survey span').text('annotations')
  info.css('border-left-color','yellow')
}

ptsd.ui.annotationPopup = function(data){
  $('.popup').hide()
  $('#annotationPopup .patient span').text($('#patientMenu').val())
  $('#annotationPopup .timestamp span').text(data.timestamp)
  var annotations = ptsd.data.model[$('#patientMenu').val()]['Annotation']
  $.each(annotations, function(){
    if(data.time === this.time){
      $('#annotationPopup .annotations textarea').val(data.text)
    }
  })
  $('#annotationPopup').show()
}

