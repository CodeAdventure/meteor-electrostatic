Package.describe({
  summary: 'Generate database collections filled with content from static files.'
});

Npm.depends({
  "meta-marked": "0.3.1",
  "recursive-readdir": "0.0.2"
});

Package.on_use(function(api) {

  api.add_files(
    ['source/electrostatic.js'],
    ['server']
  );

  api.export('Electrostatic');

});