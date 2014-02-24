module.exports = function ( grunt ){

  grunt.initConfig({
    bracer: {
      options: {
        partials: "test/global/partials/",
        data: "test/global/data/*.json",
        helpers: "test/global/helpers/*.js"
      },
      render: {
        options: {
          localPartials: "partials/",
          localData: "data/*.json"
        },
        expand: true,
        cwd: "test/template/",
        src: "*.mustache",
        dest: "test/rendered/",
        ext: ".html"
      }
    }
  })

  grunt.loadTasks("tasks")

  grunt.registerTask("default", "", function(  ){
    console.log("Grunt~~")
    grunt.task.run("bracer")
  })
};