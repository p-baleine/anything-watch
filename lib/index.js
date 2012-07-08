var watch = require('nodewatch')
  , log = console.log.bind(console)
  , Updator = require('./updator');

/**
 * output file path
 */
var out = process.env.HOME + '/.emacs.d/anything-filelist/all.filelist';

/**
 * watching directories
 */
var targets = [
    '/home/tajima-junpei/Documents/github'
  , '/home/tajima-junpei/Documents/git'
  ];

/**
 * exclude patterns
 */
var excludes = [
    /\.git/
  , /^\.#/
  ];

/**
 * interval
 */
var interval = 1000;

/**
 * task depot
 */
var tasks = [];

var updator = new Updator({
  targets: targets
, excludes: excludes
, out : out
});
updator.on('change', updator.listDirs.bind(updator));

targets.forEach(function(target) {
  watch.add(target, true);
});

watch.onChange(function(file) {
  tasks.push(file);
});

setInterval(function() {
  log(tasks);
  if (0 != tasks.length) {
    tasks = [];
    log('emit');
    updator.emit('change');
  }
}, interval);