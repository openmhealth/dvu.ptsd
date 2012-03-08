/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var dataGen = function(){
  var self = $.extend(omh(), {
    dateArrayWeelky:function(start_date,len){
      var year = start_date.getFullYear()
      var month = start_date.getMonth()
      var day = start_date.getDay()
      var dates = [start_date]
      self.range(0,len).each(function(i){
        dates.push(new Date(year,month,day+(i*7)))
      })
      return dates
    },
    dateArrayDaily:function(start_date, len){
      var year = start_date.getFullYear()
      var month = start_date.getMonth()
      var day = start_date.getDay()
      var dates = []
      self.range(0,len).each(function(i){
        dates.push(new Date(year,month,day+i))
      })
      return dates
    },
    randInts:function(start, length, min, max){
      var ints = []
      self.range(start, start+length).each(function(i){
        ints.push(Math.round(min + Math.random()*max))
      })
      return ints;
    },
    dataBundle:function(start_date, day_inc, minY, maxY, len , auxY){
      var data = []
      var year = start_date.getFullYear()
      var month = start_date.getMonth()
      var day = start_date.getDay()
      var data_bundle = {
        length:len,
        min_y:minY,
        max_y:maxY,
        aux_y:auxY
      }
      console.log("day",day)
      var format = d3.time.format("%m/%d/%Y")
      self.range(0,len).each(function(i){
        var x = new Date(year,month,day+(i*day_inc))
        var y = Math.round(minY + Math.random()*(maxY-minY))
        data.push({
          i: i,
          x: x,
          y: y,
          minY:minY,
          maxY:maxY,
          aux_y:auxY,
          info:format(x)+" : "+y
        })
      })
      data_bundle.start_date = data[0]['x']
      data_bundle.end_date = data[data.length-1]['x']
      data_bundle.data = data
      data_bundle.strokeWidth = 7
      return data_bundle
    }
  })
  return self;
}

var ptsdDataGen = function(){
  var self = $.extend(dataGen(), {
    call:function(name){
      console.log('call calling '+name)
      if(name == 'Tool Participation'){
        return self.toolParticipation()
      }
      else if(name == 'SUDS Ratings'){
        return self.sudsRatings()
      }else if(name == 'Symptom Severity'){
        return self.symptomSeverity()
      }else if(name == 'Support Types'){
        return self.supportTypes()
      }else if(name == 'PTSD Symptoms'){
        return self.ptsdSymptoms()
      }else if(name == 'PTSD Symptoms Sub'){
        return self.ptsdSymptoms_sub()
      }else if(name == 'Mood and Behaviors'){
        return self.mood()
      }else if(name == 'Coping and Substance Use'){
        return self.coping()
      }else if(name == 'Medications'){
        return self.meds()
      }else if(name == 'Depression'){
        return self.depression()
      }else if(name == 'Notes'){
        return self.notes()
      }
    },
    startDate:function(){
      return new Date(2012,3,-5)
    },
    notes:function(){
      console.log('calling notes')
      var data_bundle = self.dataBundle(self.startDate(), 1, 0, 1,90, 10)
      //data_bundle['data'] = []
      data_bundle['type'] = 'line'
      data_bundle['color'] = '#FFCC00'
      //$.each(data_bundle.data,function(){
      //  this.note = "This is a note"
      //})
      return data_bundle
    },
    toolParticipation:function(){
      console.log('calling toolParticipation')
      var data_bundle = self.dataBundle(self.startDate(), 1, 0, 1,90,10)
      data_bundle['icon'] = 'M43.101,0H7.837C3.509,0,0,3.508,0,7.836v84.327C0,96.491,3.509,100,7.837,100h35.264c4.328,0,7.837-3.509,7.837-7.837 V7.836C50.938,3.508,47.429,0,43.101,0z M21.615,8.315h7.708c0.576,0,1.043,0.467,1.043,1.044c0,0.576-0.467,1.043-1.043,1.043 h-7.708c-0.577,0-1.044-0.467-1.044-1.043C20.571,8.782,21.038,8.315,21.615,8.315z M17.123,7.915c0.687,0,1.244,0.557,1.244,1.244 c0,0.687-0.557,1.244-1.244,1.244c-0.687,0-1.244-0.557-1.244-1.244C15.879,8.472,16.437,7.915,17.123,7.915z M25.469,95.772 c-2.705,0-4.898-2.192-4.898-4.897c0-2.706,2.193-4.898,4.898-4.898s4.897,2.192,4.897,4.898 C30.366,93.58,28.174,95.772,25.469,95.772z M47.019,82.489h-43.1V17.511h43.1V82.489z'
      data_bundle['type'] = 'line'
      data_bundle['color'] = '#E92324'
      return data_bundle
    },
    sudsRatings:function(){
      console.log('calling sudsRatings')
      var data_bundle = self.dataBundle(self.startDate(), 7, 0, 10,12)
      data_bundle['type'] = 'path'
      data_bundle['color'] = '#573B9F'
      data_bundle['title'] = 'Suds Ratings'
      return data_bundle
    },
    symptomSeverity:function(){
      console.log('calling symptomSeverity')
      var data_bundle = self.dataBundle(self.startDate(), 7, 0, 10,12)
      data_bundle['type'] = 'path'
      data_bundle['color'] = '#FC2F94'
      data_bundle['title'] = 'Symptom Severity'
      return data_bundle
    },
    supportTypes:function(){
      console.log('calling supportTypes')
      var data_bundle = self.dataBundle(self.startDate(), 1, 0, 1,40, 20)
      data_bundle['icon'] = 'M43.101,0H7.837C3.509,0,0,3.508,0,7.836v84.327C0,96.491,3.509,100,7.837,100h35.264c4.328,0,7.837-3.509,7.837-7.837 V7.836C50.938,3.508,47.429,0,43.101,0z M21.615,8.315h7.708c0.576,0,1.043,0.467,1.043,1.044c0,0.576-0.467,1.043-1.043,1.043 h-7.708c-0.577,0-1.044-0.467-1.044-1.043C20.571,8.782,21.038,8.315,21.615,8.315z M17.123,7.915c0.687,0,1.244,0.557,1.244,1.244 c0,0.687-0.557,1.244-1.244,1.244c-0.687,0-1.244-0.557-1.244-1.244C15.879,8.472,16.437,7.915,17.123,7.915z M25.469,95.772 c-2.705,0-4.898-2.192-4.898-4.897c0-2.706,2.193-4.898,4.898-4.898s4.897,2.192,4.897,4.898 C30.366,93.58,28.174,95.772,25.469,95.772z M47.019,82.489h-43.1V17.511h43.1V82.489z'
      data_bundle['type'] = 'line'
      data_bundle['color'] = '#4A4A4C'
      data_bundle['title'] = 'Support Types'
      return data_bundle
    },
    ptsdSymptoms:function(){
      console.log('calling ptsdSymptoms')
      var data_bundle = self.dataBundle(self.startDate(), 7, 17, 85,12)
      data_bundle['type'] = 'path'
      data_bundle['color'] = '#111111'
      data_bundle['title'] = 'PTSD Symptoms'
      return data_bundle
    },
    ptsdSymptoms_sub:function(){
      console.log('calling ptsdSymptoms')
      var data_bundle = self.dataBundle(self.startDate(), 7, 1, 5,12)
      data_bundle['type'] = 'path'
      data_bundle['color'] = '#111111'
      data_bundle['strokeWidth'] = '3'
      data_bundle['title'] = 'PTSD Symptoms'
      return data_bundle
    },
    mood:function(){
      console.log('calling mood')
      var data_bundle = self.dataBundle(self.startDate(), 7, 0, 4,12)
      data_bundle['type'] = 'path'
      data_bundle['color'] = '#0A899C'
      data_bundle['title'] = 'Mood and Behaviors'
      return data_bundle
    },
    coping:function(){
      console.log('calling coping')
      var data_bundle = self.dataBundle(self.startDate(), 1, 0, 1,90, 30)
      data_bundle['icon'] = 'M43.101,0H7.837C3.509,0,0,3.508,0,7.836v84.327C0,96.491,3.509,100,7.837,100h35.264c4.328,0,7.837-3.509,7.837-7.837 V7.836C50.938,3.508,47.429,0,43.101,0z M21.615,8.315h7.708c0.576,0,1.043,0.467,1.043,1.044c0,0.576-0.467,1.043-1.043,1.043 h-7.708c-0.577,0-1.044-0.467-1.044-1.043C20.571,8.782,21.038,8.315,21.615,8.315z M17.123,7.915c0.687,0,1.244,0.557,1.244,1.244 c0,0.687-0.557,1.244-1.244,1.244c-0.687,0-1.244-0.557-1.244-1.244C15.879,8.472,16.437,7.915,17.123,7.915z M25.469,95.772 c-2.705,0-4.898-2.192-4.898-4.897c0-2.706,2.193-4.898,4.898-4.898s4.897,2.192,4.897,4.898 C30.366,93.58,28.174,95.772,25.469,95.772z M47.019,82.489h-43.1V17.511h43.1V82.489z'
      data_bundle['type'] = 'line'
      data_bundle['color'] = '#3355ff'
      data_bundle['title'] = 'Coping'
      return data_bundle
    },
    meds:function(){
      console.log('calling meds')
      var data_bundle = self.dataBundle(self.startDate(), 7, 0, 3,12)
      data_bundle['type'] = 'path'
      data_bundle['color'] = '#F97101'
      data_bundle['title'] = 'Medications'
      return data_bundle
    },
    depression:function(){
      console.log('calling mood')
      var data_bundle = self.dataBundle(self.startDate(), 7, 0, 27,12)
      data_bundle['type'] = 'path'
      data_bundle['color'] = '#D2D2D2'
      data_bundle['title'] = 'Depression'
      //data_bundle['color'] = '#E5BF00'
      return data_bundle
    }
  })
  return self
}
