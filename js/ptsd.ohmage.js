if(typeof ptsd == 'undefined'){
  alert('ptsd.data_model.js requires ptsd.js.'+ 
    'Please include it in your document.');
}else{
  console.log('ptsd.ohmage.js initializing...')
}

ptsd.ohmage = {}

ptsd.ohmage.url = window.location.toString()+'/app'
ptsd.ohmage.client = 'ptsd_explorer'

ptsd.ohmage.token = function(tok){
  if(tok)
    localStorage.setItem('ptsd.ohmage.token',tok)
  return localStorage.getItem('ptsd.ohmage.token')
}
ptsd.ohmage.username = function(tok){
  if(tok)
    localStorage.setItem('ptsd.ohmage.username',tok)
  return localStorage.getItem('ptsd.ohmage.username')
}

ptsd.ohmage.login = function(user, password, callbacks){
  ptsd.ohmage.username(user)
  var url = ptsd.ohmage.url + '/user/auth_token'
  $.post(url,{
    user:user,
    password:password,
    client:ptsd.ohmage.client
  },function(res){
    res = $.parseJSON(res)
    if(res.result == 'success'){
      ptsd.ohmage.token(res.token)
      ptsd.ui.hideLoginDialog()
      ptsd.ohmage.userInfo(user,function(){ 
        })
    }
    else{
      $.each(res.errors,function(){
        console.log(this)
      })
      if(callbacks && callbacks.failure)
        callbacks.failure()
    }
  })
}

ptsd.ohmage.logout = function(){
  var url = ptsd.ohmage.url + '/user/logout'
  var params = {
    auth_token:ptsd.ohmage.token(),
    client:ptsd.ohmage.client
  }
  $.ajax({
    url: url,
    data:params,
    type:'POST',
    success: function(res) {
      localStorage.removeItem('ptsd.ohmage.token')
      localStorage.removeItem('ptsd.ohmage.username')
      window.location.reload()
    }
  });
}

ptsd.ohmage.userInfo = function(callback) {
  ptsd.ui.msg('Loading User Info...')  
  var url = ptsd.ohmage.url + '/user_info/read'
  $.post(url,{
    user:ptsd.ohmage.username(),
    auth_token:ptsd.ohmage.token(),
    client:ptsd.ohmage.client
  },function(res){
    res = $.parseJSON(res)
    ptsd.ui.msg('')  
    if(res.result == 'success'){
      $.each(res.data[ptsd.ohmage.username()].campaigns,function(k,v){
        $('#campaignMenu').append($('<option>').attr('name',k).val(k).text(v))
      })
      ptsd.ohmage.loadPatients()
    }else{
      ptsd.ohmage.logout()
    }
  })
}

ptsd.ohmage.loadPatients = function(){
  ptsd.ui.msg('Loading Patient Info...')  
  var url = ptsd.ohmage.url +'/survey_response/read'
  var params = {
    auth_token:ptsd.ohmage.token(),
    campaign_urn:$('#campaignMenu').val(),
    client:ptsd.ohmage.client,
    output_format:'json-rows',
    user_list:'urn:ohmage:special:all',
    column_list:'urn:ohmage:user:id',
    survey_id_list:'urn:ohmage:special:all',
    return_id:'false',
    colapse:'true'
  }
  $.ajax({
    url: url,
    data:params,
    type:'POST',
    success: function(res) {
      ptsd.ui.msg('')
      res = JSON.parse(res)
      var patients = []
      $.each(res.data,function(){
        if($.inArray(this['user'], patients) == -1){
          patients.push(this['user'])
        }
      })
      patientMenu = $('#patientMenu')
      patientMenu.html('')
      $.each(patients, function(){
        patientMenu.append($('<option>').attr('name',''+this).text(''+this))
      })
      ptsd.ui.populateSurveyMenu()
    }
  });
}

ptsd.ohmage.surveyID = {
  "PTSD Symptoms":"pclAssessment"
}

ptsd.ohmage.loadData = function(patient, callback){
  ptsd.ui.msg('Downloading data from Ohmage...')
  var url = ptsd.ohmage.url +'/survey_response/read'
  var params = {
    auth_token:ptsd.ohmage.token(),
    campaign_urn:$('#campaignMenu').val(),
    client:ptsd.ohmage.client,
    output_format:'json-rows',
    user_list:patient,
    column_list:'urn:ohmage:user:id,urn:ohmage:context:timestamp,urn:ohmage:context:timezone,urn:ohmage:context:location:latitude,urn:ohmage:context:location:longitude,urn:ohmage:context:location:status,urn:ohmage:survey:id,urn:ohmage:survey:title,urn:ohmage:survey:description,urn:ohmage:survey:privacy_state,urn:ohmage:prompt:response',
    survey_id_list:'urn:ohmage:special:all',
    return_id:'true',
    colapse:'true'
  }
  $.ajax({
    url: url,
    data:params,
    type:'POST',
    success: function(res) {
      ptsd.ui.msg('')
      var data = JSON.parse(res)
      if(data.result === "failure"){
        alert('No Data Available')
        return
      }
      ptsd.ohmage.surveyKey = data.data[0].survey_key
      ptsd.data.filters.meta(data)
      if(callback)
        callback()
    }
  });
}

ptsd.ohmage.annotate = function(annotation, timestamp, callback){
  var url = ptsd.ohmage.url +'/annotation/survey_response/create'
  var params = {
    auth_token:ptsd.ohmage.token(),
    survey_id :ptsd.ohmage.surveyKey,
    campaign_urn:$('#campaignMenu').val(),
    client:ptsd.ohmage.client,
    time:timestamp,
    timezone:'GMT',
    annotation:annotation
  }
  $.post(url,params,function(res){
    callback(res)
  })
}

ptsd.ohmage.getAnnotations = function(callback){
  var url = ptsd.ohmage.url +'/annotation/survey_response/read'
  var params = {
    auth_token:ptsd.ohmage.token(),
    client:ptsd.ohmage.client,
    survey_id : ptsd.ohmage.surveyKey
  }
  if(callback){
    $.post(url, params, function(res){
      callback(res)
    })
  }
    
}