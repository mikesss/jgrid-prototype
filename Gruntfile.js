module.exports = function(grunt) {
  grunt.initConfig({
    browserify: {
      js: {
        // A single entry point for our app
        src: 'app/js/app.js',
        // Compile to a single file to add a script tag for in your HTML
        dest: 'dist/js/app.js',
      }
    },
    watch: {
      js: {
        files: 'app/js/**/*.js',
        tasks: ['browserify']
      }
      
    }
  });

  // Load the npm installed tasks
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // The default tasks to run when you type: grunt
  grunt.registerTask('default', ['browserify']);
  grunt.registerTask('dev', ['watch']);
}