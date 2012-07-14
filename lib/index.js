var _ = require('underscore')
  , fs = require('fs')
  , path = require('path')
  , watch = require('watch')
  , log = console.log.bind(console)
  , root = '/home/tajima-junpei/Documents'
  , outfile = '/home/tajima-junpei/.emacs.d/anything-filelist/all.filelist'
  , opts = { ignoreDotFiles: true }
  , interval = 5000
  , homeRegexp = new RegExp(process.env.HOME)
  , excludes = [/\.#/, /#.+#$/]
  , growl = require('growl');

function formatName(files) {
  var res = [];
  _.each(files, function(stat, f) {
    if (stat && stat.isDirectory()) f += '/';
    f = f.replace(homeRegexp, '~');
    res.push(f);
  });
  return res;
}

watch.createMonitor(root, opts, function(monitor) {
  var files = monitor.files
    , tasks = [];

  // monitor events
  _.each(['created', 'removed'], function(e) {
    monitor.on(e, function(f) {
      if (_.any(excludes, function(p) { return f.match(p); })) return;
      log(f);
      tasks.push(f);
    });
  });

  // wait for updateing of many files at once
  setInterval(function() {
    var out;

    if (0 == tasks.length) return;
    tasks = [];
    out = fs.createWriteStream(outfile, { flags: 'w'});
    out.write(formatName(files).join('\n'));
    // for debug...
    growl('emacs updated');
  }, interval);

  log('start monitoring');
});

// TODO refactor
// DONE ignore `.#`file
// TODO refactor watcher
// TODO watch's filter
// TODO remove event not emitted when new file which is created after process run is removed.
