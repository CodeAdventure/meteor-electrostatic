
var appRootPath = process.env.PWD;
var recursiveReadDirectory = Npm.require('recursive-readdir');
var metaMarked = Npm.require('meta-marked');
var fileSystem = Npm.require('fs');

Electrostatic = {};

Electrostatic.generate = function(context, generateCallback) {

  if(!context) {
    throw new Error("Please provide the global app namespace to Electrostatic::generate.")
  }

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

      var meteorCollection = null;

      // check for existing collections (we can only create them once in Meteor)
      if(context[name]) {
        // use the existing one
        meteorCollection = context[name];
      } else {
        // create a new one and assign it to the app namespace
        context[name] = meteorCollection = new Meteor.Collection(name);
      }

      // remove all existing data from the collection
      meteorCollection.remove({});

      // parse all static content documents and insert the data into the collections
      _.each(collection, Meteor.bindEnvironment(function(item) {

        var doc = item.meta;
        doc.content = item.html;

        delete doc.collection;

        meteorCollection.insert(doc);

      }, function onException() {}));

    }, function onException() {}));

    if(generateCallback) generateCallback();

  }, function onException() {}));

};