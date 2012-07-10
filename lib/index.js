var log = console.log.bind(console)
  , watch = require('watch')
  , Updator = require('./updator').Updator;

/**
 * output file path
 */
var out = process.env.HOME + '/.emacs.d/anything-filelist/all.filelist';

/**
 * the root directory
 */
var root = '/home/tajima-junpei/Documents';

/**
 * exclude patterns
 */
var excludes = [
      /iir-w3/
    , /\.#.+/
    , /#.+#$/
    ];

/**
 * interval
 */
var interval = 3000;

var updator = new Updator({
      root: root
    , excludes: excludes
    , out : out
    })
  , tasks = []
  , opts = {
      ignoreDotFiles: true
     // , filter: function(f) {
     //     return excludes.some(function(e) { return !e.test(f); });
     //   }
  };

setInterval(function() {
  if (0 == tasks.length) return;
  tasks = [];
  updator.emit('update');
}, interval);

watch.createMonitor(root, opts, function(monitor) {
  // log('monitoring ' + _.size(monitor.files) + ' files.');
  ['created', 'changed', 'removed'].forEach(function(event) {
    monitor.on(event, function(f) {
      log(event + ' on ' + f);
      tasks.push(f);
    });
  });
});
