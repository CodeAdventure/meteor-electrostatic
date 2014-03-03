
var appRootPath = process.env.PWD;
var recursiveReadDirectory = Npm.require('recursive-readdir');
var metaMarked = Npm.require('meta-marked');
var fileSystem = Npm.require('fs');

Electrostatic = {};

Electrostatic.generate = function(generateCallback) {

  var staticRootPath = appRootPath + '/private/static';

  var neededCollections = {};

  recursiveReadDirectory(staticRootPath, Meteor.bindEnvironment(function(error, files) {

    _.each(files, function(filePath) {

      var fileContent = fileSystem.readFileSync(filePath, { encoding: 'UTF-8' });
      var data = metaMarked(fileContent);

      var collection = neededCollections[data.meta.collection];

      if(collection) {
        collection.push(data);
      } else {
        neededCollections[data.meta.collection] = [data];
      }

    });

    _.each(neededCollections, Meteor.bindEnvironment(function(collection, name) {

      var meteorCollection = new Meteor.Collection(name);
      meteorCollection.remove({});

      _.each(collection, Meteor.bindEnvironment(function(item) {

        var doc = item.meta;
        doc.content = item.html;

        delete doc.collection;

        meteorCollection.insert(doc);

      }));

      Electrostatic[name] = meteorCollection;

    }));

    if(generateCallback) generateCallback();

  }));

};