if(typeof ptsd == 'undefined'){
  alert('ptsd.data_model.js requires ptsd.js.'+ 
    'Please include it in your document.');
}else{
  console.log('ptsd.ohmage.js initializing...')
}

ptsd.ohmage = {}

ptsd.ohmage.url = 'http://dev-ptsd.omh.io/app'
ptsd.ohmage.campaign = 'urn:campaign:va:ptsd_explorer1'

ptsd.ohmage.token = function(tok){
  if(tok)
    localStorage.setItem('ptsd.security.token',tok)
  return localStorage.getItem('ptsd.security.token')
}

ptsd.ohmage.login = function(user, password, callbacks){
  var url = ptsd.ohmage.url + '/user/auth_token'
  $.post(url,{
    user:user,
    password:password,
    client:'gwt'
  },function(res){
    res = $.parseJSON(res)
    if(res.result == 'success'){
      ptsd.ohmage.token(res.token)
      ptsd.ohmage.loadData()
      if(callbacks && callbacks.success)
        callbacks.success()
    //ptsd.ohmage.annotate("Hello Annotation System")
    //security.login.hide()
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
  localStorage.removeItem('ptsd.security.token')
  window.location.reload()
}

ptsd.ohmage.loadData = function(callback){
  var url = ptsd.ohmage.url +'/survey_response/read'
  var params = {
    auth_token:ptsd.ohmage.token(),
    campaign_urn:ptsd.ohmage.campaign,
    client:'ptsd_explorer',
    output_format:'json-rows',
    user_list:'urn:ohmage:special:all',
    column_list:'urn:ohmage:user:id,urn:ohmage:context:timestamp,urn:ohmage:context:timezone,urn:ohmage:context:location:latitude,urn:ohmage:context:location:longitude,urn:ohmage:context:location:status,urn:ohmage:survey:id,urn:ohmage:survey:title,urn:ohmage:survey:description,urn:ohmage:survey:privacy_state,urn:ohmage:prompt:response',
    survey_id_list:'urn:ohmage:special:all',
    return_id:'true',
    colapse:'true'
  }
  $.post(url, params, function(res){
    var data = JSON.parse(res)
    ptsd.data.filters.meta(data)
    if(ptsd.data.model != null){
      ptsd.ohmage.surveyKey = data.data[0].survey_key
    }
    if(callback)
      callback()
  })
}

//ptsd.ohmage.annotate = function(timestamp,annotation){
ptsd.ohmage.annotate = function(annotation){
  var url = ptsd.ohmage.url +'/annotation/survey_response/create'
  var timestamp  = new Date().getTime()
  var params = {
    auth_token:ptsd.ohmage.token(),
    survey_id :ptsd.ohmage.surveyKey,
    campaign_urn:ptsd.ohmage.campaign,
    client:'ptsd_explorer',
    time:timestamp,
    timezone:'GMT',
    annotation:annotation
  }
  $.post(url,params,function(res){
    console.log(res)
  })
}

ptsd.ohmage.getAnnotations = function(annotation){
  var url = ptsd.ohmage.url +'/annotation/survey_response/read'
  var timestamp  = new Date().getTime()
  var params = {
    auth_token:ptsd.ohmage.token(),
    survey_id :ptsd.ohmage.surveyKey,
    campaign_urn:ptsd.ohmage.campaign,
    client:'ptsd_explorer',
    time:timestamp,
    timezone:'GMT',
    annotation:annotation
  }
  
  $.post(url,params,function(res){
    console.log(res)
  })
  
}