/*jshint strict:false asi:true curly:false node:true */
/*global module:false*/

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      banner: '/* Zepto <%= meta.version %> - zeptojs.com/license */',
      version: '1.0rc1'
    },
    qunit: {
      files: ['test/**/*.html']
    },
    build: {
        modules: ['polyfill','zepto','event','detect','fx','ajax','form'],
        dest: 'dist/zepto.js'
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:build.dest>'],
        dest: 'dist/zepto.min.js'
      }
    },
    watch: {
      files: ['src/*.js'],
      tasks: 'qunit'
    }
  })

  grunt.registerTask('default', 'build')
  grunt.registerTask('test', 'qunit')

  grunt.registerTask('modules', 'List available modules.', function(){
    var modules = grunt.config('build.modules'),
        files = grunt.file.expand('src/*.js'),
        fileregex = /\/(.*)\.js/, file
        console.log('\nAvailable modules:')
        for ( var i = 0, ii = files.length; i < ii; i++ ) {
          file = fileregex.exec(files[i])[1]
          console.log(' - ' + file + (modules.indexOf(file)>-1?'*':''))
        }
        console.log('\n* included in default build')
  })

  grunt.registerTask('build', 'Build and minify zepto.js.', function(){

    var src, item, find, mod, version = grunt.config('meta.version'),
        modules = grunt.config('build.modules'),
        dest = grunt.config('build.dest')

    if (this.args.length > 0) {

      // if build has 'min' as the first argument, remove all preset modules
      if(this.args[0] === 'min') {
        modules = []
        this.args = this.args.slice(1,this.args.length)
      }

      for( var i = 0, ii = this.args.length; i < ii; i++ ) {
        // remove and/or add modules based on build arguments.
        item = this.args[i]
        if(item.substr(0,1) === '-') {
          find = modules.indexOf(item.substr(1))
            if(find > -1) {
              modules = Array.prototype.concat(
                modules.slice(0,find),
                modules.slice(find+1,modules.length)
              )
            }
        } else {
          modules.push(item)
        }
      }
    }

    if(modules.length > 0) {
      mod = modules.join(' ')
      console.log('Building Zepto with the following libraries: '+mod)
      grunt.config('meta.banner','/* Zepto '+version+' '+mod+' - zeptojs.com/license */')
      for( var j = 0, jj = modules.length; j < jj; j++ )
        modules[j] = '<file_strip_banner:src/'+modules[j]+'.js>'
      modules.unshift('<banner:meta.banner>')
      src = grunt.helper('concat', modules)
      grunt.file.write(dest, src)
      grunt.task.run('min')
    }

  })

}
