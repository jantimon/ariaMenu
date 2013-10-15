/* global module: false */
module.exports = function (grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    replace: {
      dist: {
        options: {
          patterns: [
            {
              // search for // @@ code @@ //
              match: /\/\/\s*@+\s*code.*/,
              // replace it with the inner code
              replacement: function(){
                // search for code between @@ start @@ and @@ end @@
                var code = grunt.file.read('src/' + grunt.config.data.pkg.name + '.js');
                code = code.replace(/^[\s\S]*\/\/\s*@@\s*start[^\n]*\n/g, '');
                code = code.replace(/\/\/\s*@@\s*end[\s\S]*$/g, '');
                return code;
              }
            }
          ]
        },
        files: [
          {src: ['src/wrapper.js'], dest: 'dist/<%= pkg.name %>.dev.js'}
        ]
      }
    },

    jshint: {
      files: ["src/<%= pkg.name %>.js", "dist/<%= pkg.name %>.dev.js"],
      options: {
        jshintrc: ".jshintrc"
      }
    },

    closureCompiler: {
      options: {
        // [REQUIRED] Path to closure compiler
        compilerFile: 'closure_compiler/compiler.jar',

        // [OPTIONAL] set to true if you want to check if files were modified
        // before starting compilation (can save some time in large sourcebases)
        checkModified: false,

        // [OPTIONAL] Set Closure Compiler Directives here
        compilerOpts: {
          compilation_level: 'ADVANCED_OPTIMIZATIONS',
          externs: ['closure_compiler/externs/**/*.js'],
          warning_level: 'verbose',
          output_wrapper: '"/*! <%= pkg.copyright %> */(function(){%output%})();"',
          create_source_map: 'dist/<%= pkg.name %>.min.js.map',
          source_map_format: 'V3'
      },
        // [OPTIONAL] Set exec method options
        execOpts: {
          /**
           * Set maxBuffer if you got message "Error: maxBuffer exceeded."
           * Node default: 200*1024
           */
          maxBuffer: 999999 * 1024
        }

      },

      // any name that describes your task
      targetName: {

        // [OPTIONAL] Target files to compile. Can be a string, an array of strings
        // or grunt file syntax (<config:...>, *)
        src: 'dist/<%= pkg.name %>.dev.js',

        // [OPTIONAL] set an output file
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },

    // Generate documentation
    explainjs: {
      dist: {
        options: {
          showFilename: true // default is false
        },
        files: [
          {
            src: ['dist/ariaMenu.dev.js'],
            dest: 'docs/explain.html'
          }
        ]
      }
    },

    // Output bytesize
    bytesize: {
      all: {
        src: [
          'dist/*.js'
        ]
      }
    },

    // Webserver for PhantomJS
    connect: {
      www: {
        options: {
          base: './',
          port: 4545
        }
      }
    },

    // Phantom JS
    casper: {
        options: {
          test: true
        },
        test: {
          options: {
            port: '<%= connect.www.options.port %>'
          },
          src: ['tests/casper/<%= pkg.name %>.js']
        }
    }

  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-casper');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-closure-tools');
  grunt.loadNpmTasks('grunt-explainjs');
  grunt.loadNpmTasks('grunt-bytesize');

  // Default task(s).
  grunt.registerTask('default', [
    'replace',
    'jshint',
    'closureCompiler',
    'explainjs',
    'connect',
    'casper',
    'bytesize'
  ]);

  grunt.registerTask('test', [
    'replace',
    'jshint',
    'connect',
    'casper'
  ]);

};