if(typeof ptsd == 'undefined'){
  alert('ptsd.data_model.js requires ptsd.js.'+ 
    'Please include it in your document.');
}else{
  console.log('ptsd.data.js initializing...')
}

ptsd.data = {}
ptsd.data.model = {}

ptsd.data.getModel = function(patient, name, sub){
  if(!ptsd.data.model[patient]){
    ptsd.data.model[patient] = {}
  }
  if(!ptsd.data.model[patient][name]){
    ptsd.data.model[patient][name] = {}
  }
  if(sub){
    if(!ptsd.data.model[patient][name][sub])
      ptsd.data.model[patient][name][sub] = []
    return ptsd.data.model[patient][name][sub]
  }
  else{
    return ptsd.data.model[patient][name]
  }
}

ptsd.data.push = function(model,data){
  //maybe we should validate here
  }

//create an object container for all of the filters
ptsd.data.filters = {}

//here we filter the data into a data model
ptsd.data.filters.meta = function(data){
  window.rawData = data
  console.log('rawData',window.rawData)
  if(data.result == 'failure'){
    ptsd.data.model = null
    return 
  }else{
    ptsd.data.model = {}
  }
  $.each(data,function(){
    $.each(this,function(){
      //ptsd.data.filters['patient'](this)   
      ptsd.data.filters.toolParticipation(this)
      var surveyId = this['survey_id']
      if(surveyId){
        if(ptsd.data.filters[surveyId])
          ptsd.data.filters[surveyId](this)
      }
    })
  })
  console.log('ptsd.data.model',ptsd.data.model)
}

//filter annotations
ptsd.data.filters.toolParticipation = function(data){
  if(data.survey_description){
    var datum = {}
    datum['timestamp'] = data['timestamp']
    datum['x'] = new Date( Date.parse(datum['timestamp'].replace(/-/g, " ")))
    datum['time'] = datum['x'].getTime()
    datum['patient'] = data['user']
    datum['responseText'] = data['survey_description']
    //datum.response = data.survey_title
    datum.min = 0
    datum.max = 1
    datum.y = 90
    datum.survey = "Tool Participation"
    datum.color = "green"
    var model = ptsd.data.getModel(datum.patient, 'Tool Participation', 'All')
    model.push(datum)
  }
}

//filter annotations
ptsd.data.filters.anotation = function(res){
  var model = []
  res = JSON.parse(res)
  $.each(res.data, function(){
    var datum = {}
    datum.text = this.text
    //  datum.y = 5
    datum.time = this.time
    datum.timestamp = new Date(this.time)
    datum.x = new Date(this.time)
    datum.timezone = this.timezone
    model.push(datum)
  })
  ptsd.data.model[$('#patientMenu').val()]['Annotation'] = model
}

ptsd.data.extend = function(parent, input){
  var o = {}
  o['surveyKey'] = parent['survey_key']
  o['patient'] = parent['user']
  o['timezone'] = parent['timezone']
  
  o['timestamp'] = parent['timestamp']
  
  o['x'] = new Date( Date.parse(o['timestamp'].replace(/-/g, " ")))
  o['time'] = o['x'].getTime()
  o['time'] = o['x'].getTime()
  
  o['index'] = input['prompt_index']
  o['choices'] = input['prompt_choice_glossary']
  o['question'] = input['prompt_text']
  o['response'] = input['prompt_response']
  o['strokeWidth'] = 3
  if(isInt(o['response'])){
    o['y'] = o['response']
  }
  if(o['choices']
    && o['choices'][input['prompt_response']] 
    && o['choices'][input['prompt_response']].label){
    o['responseText'] = o['choices'][input['prompt_response']].label
  }
  /*
  var datum = $.extend({},o)
  if(datum.y > 0){
    var model = ptsd.data.getModel(datum.patient, 'Tool Participation', 'All')
    datum.question = null
    datum.response = "User Responded"
    datum.min = 0
    datum.max = 1
    datum.y = 90
    datum.color = "green"
    model.push(datum)
  }
  */
  return o
}

//------------------------------------------------------------------------------
// Filter out users
//------------------------------------------------------------------------------
/*
ptsd.data.filters['patient'] = function(input){
  var model = ptsd.data.getModel('Patients')
  var patient = input.user
  if(!model[patient] && patient != undefined)
    model[patient] = patient
}
*/
//------------------------------------------------------------------------------
// Daily Assessment
//------------------------------------------------------------------------------

ptsd.data.filters['dailyAssessment'] = function(input){

  var filters = {}
 
  filters['How would you rate your overall mood today?'] = function(datum){
    var model = ptsd.data.getModel(datum.patient, 'Mood and Behaviors', 'Overall Mood')
    datum.survey = 'Mood and Behaviors';
    datum.min = 0
    datum.max = 4
    datum.color = '#D37FBB';
    model.push(datum)
  }

  filters['How well did you sleep last night?'] = function(datum){
    var model = ptsd.data.getModel(datum.patient, 'Mood and Behaviors', 'Sleep')
    datum.survey = 'Mood and Behaviors';
    datum.min = 0
    datum.max = 4
    datum.color = '#87D37F';
    model.push(datum)
  }
  
  filters['How much anger did you experience today?'] = function(datum){
    var model = ptsd.data.getModel(datum.patient, 'Mood and Behaviors', 'Anger')
    datum.survey = 'Mood and Behaviors';
    datum.min = 0
    datum.max = 4
    datum.color = '#D3BF7F';
    model.push(datum)
  }
  
  filters['How well did you get things today that you needed to do? '] = function(datum){
    var model = ptsd.data.getModel(datum.patient, 'Mood and Behaviors', 'Productivity')
    datum.survey = 'Mood and Behaviors';
    datum.min = 0
    datum.max = 4
    datum.color = '#5C8A99';
    model.push(datum)
  }
  
  filters['How much conflict with others did you have today?'] = function(datum){
    var model = ptsd.data.getModel(datum.patient, 'Mood and Behaviors', 'Conflict')
    datum.survey = 'Mood and Behaviors';
    datum.min = 0
    datum.max = 4
    datum.color = '#A6F461';
    model.push(datum)
  }
  
  filters['Did you have any situations today that you needed to try to cope with?'] = function(datum){
  //no op
  }
  filters['What situations happened today that you needed to try to cope with?'] = function(datum){
    var model = ptsd.data.getModel(datum.patient, 'Coping and Substance Use', 'Coping Situations')
    datum.survey = 'Coping and Substance Use';
    if (datum.response == 'NOT_DISPLAYED')return
    datum.min = 0
    datum.max = 1
    datum.y = 25
    datum.color = '#F461A6';
    model.push(datum)
  }
  
  filters['Overall, how well or poorly did you cope with things in the last 24 hours?'] = function(datum){
    var model = ptsd.data.getModel(datum.patient, 'Coping and Substance Use', 'Coping Ability')
    datum.survey = 'Coping and Substance Use';
    datum.min = 0
    datum.max = 4
    datum.color = '#61F4AF';
    model.push(datum)
  }
  
  filters['In the last 24 hours, which of the following coping tools did you use?'] = function(datum){
    var model = ptsd.data.getModel(datum.patient, 'Coping and Substance Use', 'Coping Tools')
    datum.survey = 'Coping and Substance Use';
    datum.min = 0
    datum.max = 1
    datum.color = '#61F0F4';
    if(datum.response.length > 0){
      datum.y = 40
      model.push(datum)
    }
  }
  
  filters['How was the support you got from other(s)?'] = function(datum){
    if(datum.response == 'NOT_DISPLAYED') return
    var model = ptsd.data.getModel(datum.patient, 'Support Types', 'Support from Others')
    datum.survey = 'Support Types';
    datum.min = 0
    datum.max = 4
    datum.color = '#F0F461';
    model.push(datum)
  }
  
  filters['Did you drink alcohol in the last 24 hours?'] = function(datum){
    if(datum.responseText != "Yes") return
    var model = ptsd.data.getModel(datum.patient, 'Coping and Substance Use', 'Alcohol')
    datum.survey = 'Coping and Substance Use';
    datum.min = 0
    datum.max = 1
    datum.y = 55
    datum.color = '#80337E';
    model.push(datum)
  }
  
  filters['How much did you drink? (One drink = 12oz of beer = one 6oz glass of wine = one 1.5oz shot of vodka or whiskey or gin)'] = function(datum){
    var model = ptsd.data.getModel(datum.patient, 'Coping and Substance Use', 'Alcohol Quantity')
    datum.survey = 'Coping and Substance Use';
    datum.min = 0
    datum.max = 6
    datum.color = '#80337E';
    model.push(datum)
  }
  
  filters['Did you take any non-prescribed drug in the last 24 hours?'] = function(datum){
    if(datum.responseText != "Yes") return
    var model = ptsd.data.getModel(datum.patient, 'Coping and Substance Use', 'Non-prescribed Drugs')
    datum.survey = 'Coping and Substance Use';
    datum.min = 0
    datum.max = 1
    datum.y = 70
    datum.color = '#F461F0';
    model.push(datum)
  }
  
  filters['Did you take your doctor-prescribed medication(s) today?'] = function(datum){
    var model = ptsd.data.getModel(datum.patient, 'Medications', 'All')
    datum.survey = 'Medications';
    datum.min = 0
    datum.max = 3
    datum.color = 'pink';
    model.push(datum)
  }
  
  filters['Did you experience any side effects?'] = function(datum){
    var model = ptsd.data.getModel(datum.patient, 'Medications', 'Side-Effects')
    if(!datum.response || datum.response != 1) return
    datum.survey = 'Medications';
    datum.min = 0
    datum.max = 1
    datum.y = 85
    datum.color = 'pink';
    model.push(datum)
  }
  
  $.each(input['responses'], function(){
    var i = ptsd.data.extend(input, this)
    if(filters[this['prompt_text']]) 
      filters[ this['prompt_text'] ](i)
  })
}

//------------------------------------------------------------------------------
// PTSD Symptoms, Plot 5
//------------------------------------------------------------------------------
ptsd.data.rgb2String = function(rgb){
  return 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')'
}

ptsd.data.pclClrs = {}
ptsd.data.pclClrs['pcl1'] = '#570000'
ptsd.data.pclClrs['pcl2'] = '#574100'
ptsd.data.pclClrs['pcl3'] = '#435700'
ptsd.data.pclClrs['pcl4'] = '#0D5700'
ptsd.data.pclClrs['pcl5'] = '#005357'
ptsd.data.pclClrs['pcl6'] = '#003C57'
ptsd.data.pclClrs['pcl7'] = '#002657'
ptsd.data.pclClrs['pcl8'] = '#2E0057'
ptsd.data.pclClrs['pcl9'] = '#540057'
ptsd.data.pclClrs['pcl10'] ='#570036' 
ptsd.data.pclClrs['pcl11'] ='#57000E' 
ptsd.data.pclClrs['pcl12'] ='#572948' 
ptsd.data.pclClrs['pcl13'] ='#512957' 
ptsd.data.pclClrs['pcl14'] ='#382957' 
ptsd.data.pclClrs['pcl15'] ='#292D57' 
ptsd.data.pclClrs['pcl16'] ='#294057' 
ptsd.data.pclClrs['pcl17'] ='#29574D' 

ptsd.data.filters['pclAssessment'] = function(input){
  var sum = 0;
  var raw
  $.each(input['responses'],function(k,v){
    raw = this
    datum = ptsd.data.extend(input,this)
    datum.min = 1
    datum.max = 5
    datum.color = ptsd.data.pclClrs[k]
    datum.y = datum.response
    datum.survey = 'PTSD Symptoms';
    ptsd.data.getModel(datum.patient, 'PTSD Symptoms', (1+k).toString()).push(datum)
    sum += datum.y
  })
  
  var datum = ptsd.data.extend(input, raw)
  datum.skip = 2
  datum.min = 17
  datum.max = 85
  datum.sum = sum
  datum.y = sum
  datum.alert = function(){
    return datum.y > 40
  }
  datum.question = null
  datum.responseText = null
  datum.color = 'black';
  datum.strokeWidth = 5;
  datum.survey = 'PTSD Symptoms';
  datum.path = [datum.patient, 'PTSD Symptoms', 'All']
  ptsd.data.getModel(datum.patient, 'PTSD Symptoms', 'All').push(datum)
}

//------------------------------------------------------------------------------
// PHQ 9, Plot 9
//------------------------------------------------------------------------------

ptsd.data.phqClrs = {}
ptsd.data.phqClrs['phq91'] = '#B95858'
ptsd.data.phqClrs['phq92'] = '#B99D58'
ptsd.data.phqClrs['phq93'] = '#8CB958'
ptsd.data.phqClrs['phq94'] = '#58B965'
ptsd.data.phqClrs['phq95'] = '#58B9B1'
ptsd.data.phqClrs['phq96'] = '#5895B9'
ptsd.data.phqClrs['phq97'] = '#5875B9'
ptsd.data.phqClrs['phq98'] = '#7C58B9'
ptsd.data.phqClrs['phq99'] = '#B958B6'

ptsd.data.filters['phq9Survey'] = function(input){
  var raw
  var sum = 0;
  var alert = false
  if(input['responses']['phq99']['prompt_response'].toString() === '3') alert = true
  $.each(input['responses'],function(k,v){
    raw = this
    datum = ptsd.data.extend(input,this)
    datum.alert = function(){
      return alert 
    }
    datum.min = 0
    datum.max = 3
    datum.y = datum.response
    datum.color = ptsd.data.phqClrs[k]
    if(!datum.y)datum.y = 0
    sum += datum.y
    datum.survey = 'Depression'
    ptsd.data.getModel(datum.patient, 'Depression', (1+k).toString()).push(datum)
  })

  var datum = ptsd.data.extend(input, raw)
  datum.strokeWidth = 5;
  datum.min = 0
  datum.max = 27
  datum.sum = sum
  datum.alert = function(){
    return alert || datum.y > 10
  }
  datum.color = "#808080"
  datum.y = sum
  datum.survey = 'Depression'
  ptsd.data.getModel(datum.patient, 'Depression', 'All').push(datum)
}

ptsd.data.filters['preExerciseSudsProbe'] = function(input){
  var datum = ptsd.data.extend(input,input)
  var model = ptsd.data.getModel(datum.patient, 'SUDs Ratings', 'Pre Exercise Ratings')
  
  datum.question = "Pre SUDs Score"
  datum.survey = 'SUDs';
  datum.min = 0
  datum.max = 10
  datum.color = '#D3BB7f';
  datum.response = input.responses.preExerciseSudsScore.prompt_response
  datum.y = datum.response
  model.push(datum)
}

ptsd.data.filters['postExerciseSudsProbe'] = function(input){
  var datum = ptsd.data.extend(input,input)
  var model = ptsd.data.getModel(datum.patient, 'SUDs Ratings', 'Post Exercise Ratings')
  
  datum.question = "Post SUDs Score"
  datum.survey = 'SUDs';
  datum.min = 0
  datum.max = 10
  datum.color = '#987f40';
  datum.response = input.responses.postExerciseSudsScore.prompt_response
  datum.y = datum.response
  model.push(datum)

}

//Utility functions

function isInt(value){ 
  if((parseFloat(value) == parseInt(value)) && !isNaN(value)){
    return true;
  } else { 
    return false;
  } 
}


