'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    express: {
      options: {
        port: process.env.PORT || 9011
      },
      dev: {
        options: {
          script: 'index.js'
        }
      },
      prod: {
        options: {
          script: 'index.js',
          'node_env': 'production'
        }
      }
    },

    watch: {
      express: {
        files: [
          'index.js',
          'app/**/*.js',
          'app/**/**/*.js'
        ],
        tasks: ['express:dev'],
        options: {
          livereload: true,
          nospawn: true //Without this option specified express won't be reloaded
        }
      },
      gruntfile: {
        files: ['Gruntfile.js']
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        'src/{,*/}*.js'
      ]
    },

    shell: {
      mongo: {
        command: 'mongod --dbpath db --smallfiles',
        options: {
          async: true
        }
      }
    },
  });

  grunt.registerTask('dev', ['shell:mongo', 'express:dev', 'watch']);
};