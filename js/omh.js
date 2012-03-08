/*******************************************************************************
 * This file provides a base for all dpu scripts to extend 
 ******************************************************************************/
/*******************************************************************************
 * Make sure jQuery and JSON scripts are loaded.
 ******************************************************************************/

if(typeof jQuery == 'undefined'){
  alert('dpu.js requires jQuery version 1.7 or above.'+ 
    'Please include it in your document.');
}else{
  console.log("jquery is loaded, sweet!")
}

/*******************************************************************************
 *
 * This little bit of utility code allows us to set defaults for 
 * function arg values. It's super fun, you can do this:
 * var foo = function(a, b){console.log(a,b)}.defaults(42, 'default_b')
 *
 ******************************************************************************/

Function.prototype.defaults = function() {
  var _f = this;
  var _a = Array(_f.length-arguments.length).concat(
    Array.prototype.slice.apply(arguments));
  return function(){
    return _f.apply(_f, Array.prototype.slice.apply(arguments).concat(
      _a.slice(arguments.length, _a.length)));
  }
}

// Implement array.each
if (!Array.prototype.each) {
  Array.prototype.each = function(fun /*, thisp*/) {
    var len = this.length >>> 0;
    if (typeof fun != "function")
      throw new TypeError();

    var thisp = arguments[1];
    for (var i = 0; i < len; i++) {
      if (i in this)
        fun.call(thisp, this[i], i, this);
    }
  };
}

var omh = function(){
  return {
    /***************************************************************************
     * 
     * Implement a range function
     * USE:    
     *   omh.range(0,10).each(function(i){
     *     console.log("i=",i)
     *   })
     *           
     **************************************************************************/ 
    range:function(){
      if (!arguments.length) {
        return [];
      }
      var min, max, step;
      if (arguments.length == 1) {
        min  = 0;
        max  = arguments[0]-1;
        step = 1;
      }
      else {
        // default step to 1 if it's zero or undefined
        min  = arguments[0];
        max  = arguments[1]-1;
        step = arguments[2] || 1;
      }
      // convert negative steps to positive and reverse min/max
      if (step < 0 && min >= max) {
        step *= -1;
        var tmp = min;
        min = max;
        max = tmp;
        min += ((max-min) % step);
      }
      var a = [];
      for (var i = min; i <= max; i += step) {
        a.push(i);
      }
      return a;
    }
  }
}