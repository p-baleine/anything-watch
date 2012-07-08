var fs = require('fs')
  , util = require('util')
  , log = console.log.bind(console)
  , home = new RegExp(process.env.HOME);

function Updator(config) {
  this.targets = config.targets;
  this.excludes = config.excludes;
  this.out = fs.createWriteStream(config.out);
}

util.inherits(Updator, process.EventEmitter);

Updator.prototype.listFile = function(dir) {
  var dirs = []
    , self = this;

  fs.readdir(dir, function(err, files) {
    files.forEach(function(file) {
      if (self.excludes.some(function(e) { return e.test(file); })) return;

      file = dir + '/' + file;
      if (fs.statSync(file).isDirectory()) {
        dirs.push(file);
      }
      // log(file.replace(home, '~'));
      self.out.write(file.replace(home, '~') + '\n');
    });

    // recursively list files
    dirs.forEach(function(dir) { this.listFile(dir); }.bind(self));
  });
};

Updator.prototype.listDirs = function() {
  this.targets.forEach(function(dir) {
    this.listFile(dir);
  }.bind(this));
};

exports.Updator = Updator;
