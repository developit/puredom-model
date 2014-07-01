module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uglify: {
			main : {
				options: {
					banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n'
				},
				files: {
					'puredom.Model.min.js': [
						'puredom.Model.js'
					]
				}
			}
		},

		jshint : {
			options : {
				'browser' : true
			},
			main : {
				options : {
					'-W041' : true,
					'-W030' : true
				},
				src : ['puredom.Model.js']
			},
			test : {
				options : {
					'-W030' : true
				},
				src : [
					'test/**/*.js',
					'!test/js/**/*'
				]
			}
		},

		connect : {
			test : {
				options : {
					port : 9092,
					base : '.'
				}
			}
		},

		mocha : {
			test : {
				options : {
					run : true,
					reporter : 'Spec',
					urls : [
						'http://localhost:9092/test/index.html'
					]
				}
			}
		},

		watch : {
			options : {
				interrupt : true
			},
			src : {
				files : ['puredom.Model.js'],
				tasks : ['default']
			},
			test : {
				files : ['test/**/*'],
				tasks : ['test']
			}
		}
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('default', [
		'build',
		'test'
	]);

	grunt.registerTask('build', [
		'jshint:main',
		'uglify:main'
	]);

	grunt.registerTask('test', [
		'jshint:test',
		'connect:test',
		'mocha:test'
	]);
	
};
