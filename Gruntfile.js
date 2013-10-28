/* jshint node: true */
module.exports = function (grunt) {
  'use strict';

  // Load package.json
  var pkg = grunt.file.readJSON('package.json');

  // Automatically load npm tasks from package.json
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: pkg,

    clean: ["dist", "screenshots"],

    template: {
      options: {
        'data': {
          code: (function () {
            // search for code between @@ start @@ and @@ end @@
            var code = grunt.file.read('src/' + pkg.name + '.js');
            code = code.replace(/^[\s\S]*\/\/\s*@@\s*start[^\n]*\n/g, '');
            code = code.replace(/\/\/\s*@@\s*end[\s\S]*$/g, '');
            return code;
          }())
        }
      },
      // Build only the jquery wrapper
      jquery: {
        files: [
          {src: ['src/wrapper/jquery.js'], dest: 'dist/<%= pkg.name %>.dev.js'}
        ]
      },
      // Build the amd wrapper
      amd: {
        files: [
          {src: ['src/wrapper/amd.js'], dest: 'dist/other/<%= pkg.name %>.amd.js'}
        ]
      },
      // Build the Zepto wrapper
      zepto: {
        files: [
          {src: ['src/wrapper/zepto.js'], dest: 'dist/other/<%= pkg.name %>.zepto.js'}
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
        compilerFile: 'closure_compiler/compiler.jar',
        compilerOpts: {
          compilation_level: 'ADVANCED_OPTIMIZATIONS',
          externs: ['closure_compiler/externs/**/*.js'],
          warning_level: 'verbose',
          output_wrapper: '"/*! <%= pkg.copyright %> */\n(function(){%output%}());"',
          create_source_map: 'dist/<%= pkg.name %>.min.js.map',
          source_map_format: 'V3'
        },
        execOpts: {
          maxBuffer: 999999 * 1024
        }

      },
      jquery: {
        src: 'dist/<%= pkg.name %>.dev.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      },
      amd: {
        src: 'dist/other/<%= pkg.name %>.amd.js',
        dest: 'dist/other/<%= pkg.name %>.amd.min.js'
      },
      zepto: {
        src: 'dist/other/<%= pkg.name %>.zepto.js',
        dest: 'dist/other/<%= pkg.name %>.zepto.min.js'
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
          'dist/**/*.js'
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
    },

    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: [
          {
            src: ['src/themes/minimal.scss'],
            dest: 'dist/<%= pkg.name %>.layout.css'
          },
          {
            src: ['src/themes/default.scss'],
            dest: 'dist/<%= pkg.name %>.theme.css'
          },
          {
            src: ['src/themes/responsive.scss'],
            dest: 'dist/<%= pkg.name %>.responsive.css'
          }
        ]
      }
    },

    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 2 version', 'ie 8', 'ie 7']
      },
      dist: {
        expand: true,
        src: 'dist/*.css'
      }
    },


    cssmin: {
      minify: {
        files: {
          'dist/<%= pkg.name %>.min.css': ['dist/<%= pkg.name %>.theme.css']
        }
      }
    }

  });


  // Default task(s).
  grunt.registerTask('default', [
    'clean',
    'template:jquery',
    'jshint',
    'closureCompiler:jquery',
    'sass',
    'autoprefixer',
    'cssmin',
    'bytesize'
  ]);

  // Full build and test
  grunt.registerTask('build', [
    'clean',
    'template:jquery',
    'template:amd',
    'template:zepto',
    'jshint',
    'closureCompiler:amd',
    'closureCompiler:zepto',
    'closureCompiler:jquery',
    'sass',
    'autoprefixer',
    'cssmin',
    'explainjs',
    'connect',
    'casper',
    'bytesize'
  ]);

  // Test only
  grunt.registerTask('test', [
    'default',
    'connect',
    'casper'
  ]);

};