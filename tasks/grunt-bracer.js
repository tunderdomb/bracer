/*
 * grunt-prender
 * https://github.com/tunderdomb/grunt-prender
 *
 * Copyright (c) 2014 tunderdomb
 * Licensed under the MIT license.
 */

'use strict';

var mustache = require("mustache")
  , path = require('path')

function merge( obj, extension ){
  var ret = {}
    , prop
  for( prop in obj ){
    ret[prop] = obj[prop]
  }
  for( prop in extension ){
    ret[prop] = extension[prop]
  }
  return ret
}

module.exports = function ( grunt ){

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  function getData( dataFinder ){
    switch( typeof dataFinder  ){
      case "string":
        var data = {}
        dataFinder = path.normalize(dataFinder)
        grunt.file.expand(dataFinder).forEach(function ( dataPath ){
          try {
            data[path.basename(dataPath, path.extname(dataPath))] = JSON.parse(grunt.file.read(dataPath))
          }
          catch ( e ) {}
        })
        return data
      case "function":
        return dataFinder()
      default :
        return dataFinder
    }
  }

  grunt.registerMultiTask("bracer", "Render mustache templates", function (){
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      partials: "",
      localPartials: "",
      data: "",
      localData: "",
      helpers: null
    })

    var extend = grunt.util._.extend

    var global = options.data ? getData(options.data) : {}

    if( options.helpers ) grunt.file.expand(options.helpers).forEach(function ( helper ){
      try {
        require(path.resolve(helper))(global, grunt)
      }
      catch ( e ) {}
    })

    this.files.forEach(function ( filePair ){
      // use original destination
      filePair.src.forEach(function ( src ){
        // Warn on and remove invalid source files (if nonull was set).
        if ( !grunt.file.exists(src) ) {
          grunt.log.warn('Source file "' + src + '" not found.')
          return
        }

        var context = global
          , content = grunt.file.read(src)
          , ext = path.extname(src)
          , dir = path.dirname(src)
          , dest = filePair.orig.expand
            ? filePair.dest
            : path.join(filePair.dest || dir, path.basename(src))

        if ( options.localData ) {
          var localData = getData(path.join(dir, options.localData))
          context = merge(global, localData)
        }

        grunt.file.write(dest, mustache.render(content, context, function ( name ){
          name += ext

          var partialPath = path.join(dir, options.localPartials, name)
          if ( grunt.file.exists(partialPath) ) {
            return grunt.file.read(partialPath)
          }

          switch ( typeof options.partials ) {
            case "string":
              partialPath = path.join(options.partials, name)
              if ( grunt.file.exists(partialPath) )
                return grunt.file.read(partialPath)
              console.warn("Partial not found '" + name + "'")
              break
            default:
              var partial = ""
              options.partials.some(function ( src ){
                partialPath = path.join(src, name)
                if ( grunt.file.exists(partialPath) ) {
                  partial = grunt.file.read(partialPath)
                  return true
                }
                return false
              }) || console.warn("Partial not found '" + name + "'")
          }
          return partial
        }))
        console.log("Rendered '" + filePair.dest + "'")
      })
    })
  })
};
