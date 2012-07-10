var fs = require('fs')
  , util = require('util')
  , log = console.log.bind(console)
  , home = new RegExp(process.env.HOME);

function Updator(config) {
  this.root = config.root;
  // this.excludes = config.excludes;
  this.out = fs.createWriteStream(config.out);
  this.on('update', this.listDirs.bind(this));
}

util.inherits(Updator, process.EventEmitter);

// TODO 結局watchの方で似たようなディレクトリの探索が行われている。
// watchは非公式だけどwalk関数をexportしてくれている、
// walkはコールバック関数にfilesを渡してくれるので、
// このfilesをもとにファイルリストを構築したほうが効率が良い
// どうやって処理を分担するかが肝
Updator.prototype.listFile = function(dir) {
  var dirs = []
    , self = this;

  fs.readdir(dir, function(err, files) {
    files.forEach(function(file) {
      // if (self.excludes.some(function(e) { return e.test(file); })) return;

      file = dir + '/' + file;

      // TODO watchに習ってsyncで実装
      try {
        if (fs.statSync(file).isDirectory()) {
          dirs.push(file);
        }
      } catch (x) {
        // file is dissapeared
      }

      // log(file.replace(home, '~'));
      self.out.write(file.replace(home, '~') + '\n');
    });

    // recursively list files
    dirs.forEach(function(dir) { this.listFile(dir); }.bind(self));
  });
};

Updator.prototype.listDirs = function() {
  this.listFile(this.root);
};

exports.Updator = Updator;
