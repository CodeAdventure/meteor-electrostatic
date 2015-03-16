Package.describe({
  summary: 'Generate database collections filled with content from static files.',
  name: 'codeadventure:electrostatic',
  version: '1.3.3',
  git: 'https://github.com/CodeAdventure/meteor-electrostatic.git'
});

Npm.depends({
  "meta-marked": "0.3.1",
  "recursive-readdir": "0.0.2"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");

  api.add_files(['source/electrostatic.js'], 'server');
  api.export('Electrostatic');

});
