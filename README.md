# Electrostatic

Generate database collections filled with content from static files.

## Install with Meteorite
Install the module with: `mrt add electrostatic`

## Documentation

Electrostatic is very simple content generator for Meteor that allows you to
manage a controlled set of MongoDB collections and documents via static files.

It recursively reads in all files under the `private/static` directory of
your app and parses them with [meta-marked](https://www.npmjs.org/package/meta-marked).

This makes it possible to define any content type like static pages, products or blog
articles as static markdown files with meta data:

Example for generating static pages:

```markdown
---
collection: pages
title: Welcome to Electrostatic
---

This is my static page content written in markdown!
```

Example for generating blog articles:

```markdown
---
collection: articles
author: Dominik Guzei
title: Introducing Electrostatic
slug: introducing-electrostatic
---

This is my first blog article about Electrostatic!
```

You have to define the `collection` meta data, as it defines in which collection
that specific document is inserted by Electrostatic. All other meta data is optional
and you can define any properties you want. All properties except `collection` are
copied over to the document that is inserted in the database.

On your server side you have to tell Electrostatic to generate the data:

```Javascript
if (Meteor.isServer) {
  Meteor.startup(function () {

    Electrostatic.generate(function() {

      // do something with the generated collections here like this:
      Electrostatic.pages.allow({ ... });
      Electrostatic.articles.deny({ ... });
    });

  });
}
```

On your client side you can use the generated collections as usual:

```Javascript
if (Meteor.isClient) {

  var Pages = new Meteor.Collection('pages');
  var Articles = new Meteor.Collection('articles');

  Template.pages_index.helpers({
    pages: Pages.find()
  });

  Template.blog_index.helpers({
    articles: Articles.find()
  });
}
```

Be aware that Electrostatic always removes all documents from its managed collections
before inserting the existing ones again. There is no algorithm that checks if the
document actually changed or anything. So you won't be able to reference the document
by id, because it will change everytime Electrostatic runs.

## Examples
You can look through a [simple example app that uses Electrostatic](https://github.com/CodeAdventure/meteor-electrostatic-example).

## Release History
* 0.1.4 - Praying to the gods of Atmosphere (versioning problems)
* 0.1.3 - Improving API / make it work on server side too
* 0.1.2 - Fixing issues with Atmosphere
* 0.1.1 - First release

## License
Copyright (c) 2013 Code Adventure
Licensed under the MIT license.
