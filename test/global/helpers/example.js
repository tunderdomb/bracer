exports = function( global, grunt ){
  global.bold = function(  ){
    return function(text, render) {
      return "<b>" + render(text) + "</b>"
    }
  }
}