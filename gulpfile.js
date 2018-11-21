const gulp = require('gulp')
const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const rollup = require('rollup')
const plugins = require('gulp-load-plugins')
const $$ = plugins()
const ip = require('ip')
const detectPort = require('detect-port')
const execa = require('execa')
const tools = require('./scripts/tools')
const paths = require('./scripts/paths')
const rollupConfig = require('./config/rollup.config')

const editStatus = tools.getEditStatus()

if (editStatus === null) {
  console.log('当前并未在编辑任何组件!')
  return
}

const srcUtilTestDir = paths.testDir

const getPlatform = _dir => {
  return fs.readdirSync(_dir)
    .filter(_file => {
      return fs.statSync(path.join(_dir, _file)).isDirectory()
    })
}

const platforms = getPlatform(srcUtilTestDir)

const runPath = platforms.map(platform => ({
  platform,
  srcPath: path.join(srcUtilTestDir, platform),
  distPath: path.join(paths.distTestDir, platform)
}))

gulp.task('clean', () => {
  return gulp.src([paths.distTestDir], {
      read: false
    })
    .pipe($$.clean())
})

gulp.task('js', () => {
  return runPath.map(obj => {
    const config = rollupConfig(path.join(obj.srcPath, `index.js`))
    return rollup.rollup({
      input: config.input,
      plugins: config.plugins
    }).then(bundle => {
      return bundle.write({
        file: path.join(obj.distPath, 'index.js'),
        format: config.output.format,
      })
    })
  })
})

gulp.task('html', () => {
  return runPath.map(obj => {
    return gulp.src(path.join(obj.srcPath, 'index.html'))
      .pipe($$.plumber())
      .pipe($$.cached('htmling'))
      .pipe($$.rename({
        extname: '.html'
      }))
      .pipe(gulp.dest(obj.distPath))
  })
})

gulp.task('watch', function () {
  gulp.watch([path.resolve(__dirname, 'src/**/*.scss')], ['js'])
  gulp.watch([path.resolve(__dirname, 'src/**/*.js')], ['js'])
  gulp.watch([path.resolve(__dirname, 'src/**/*.html')], ['html'])
  $$.livereload.listen()
  gulp.watch(['dist/**']).on('change', $$.livereload.changed)
})

gulp.task('server', () => {
  return detectPort(20480).then(_mockport => {
    const url = `http://${ip.address()}:${_mockport}/`
    execa.shell(`${path.resolve(__dirname, 'node_modules', 'json-server' , 'bin', 'index.js')} --watch ${paths.mockJSON} --port ${_mockport} -H ${ip.address()}`)
    console.log(`Mock server is running at ${url}`)
    setTimeout(() => {
      runPath.map(obj => {
        return detectPort(10240).then((_port) => { 
          if (!fse.existsSync(obj.distPath)) {
            fse.mkdirpSync(obj.distPath)
          }
          return gulp.src(obj.distPath)
            .pipe($$.serverLivereload({
              host: `${ip.address()}`,
              port: _port,
              defaultFile: 'index.html',
              livereload: {
                enable: true,
                port: _port + 20,
              },
              open: true,
              directoryListing: {
                enable: false,
                path: obj.distPath,
              },
              proxies: [{
                source: '/mock/ajax/',
                target: url,
              }]
            }))
        })
      })
    }, 1000)
  })
})

gulp.task('dev',['clean'], _cb => {
  $$.sequence(
    'js', 'html', [ 'watch', 'server' ]
  )(_cb)
})
