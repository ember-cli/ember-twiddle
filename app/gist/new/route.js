import GistRoute from "ember-twiddle/routes/gist-base-route";
import config from "../../config/environment";

export default GistRoute.extend({
  model () {
    this.store.unloadAll('gistFile');

    var model = this.store.createRecord('gist', {description: 'New Twiddle'});
    model.get('files').pushObject(this.store.createRecord('gistFile', {
      filePath: 'templates/application.hbs',
      content: '<h1>Welcome to {{appName}}</h1><br><br>{{outlet}}<br><br>'
    }));
    model.get('files').pushObject(this.store.createRecord('gistFile', {
      filePath: 'controllers/application.js',
      content: 'import Ember from \'ember\';\n\nexport default Ember.Controller.extend({\n  appName:\'Ember Twiddle\'\n});'
    }));
    model.get('files').pushObject(this.store.createRecord('gistFile', {
      filePath: 'styles/app.css',
      content: 'body { margin: 12px 16px }'
    }));
    model.get('files').pushObject(this.store.createRecord('gistFile', {
      filePath: 'router.js',
      content: 'import Ember from \'ember\';\nvar Router = Ember.Router.extend({\n  location: \'none\'\n});\n\nRouter.map(function() {\n});\n\nexport default Router;\n'
    }));
    model.get('files').pushObject(this.store.createRecord('gistFile', {
      filePath: 'twiddle.json',
      content: '{\n  "version": "' + config.APP.version + '",\n  "dependencies": {\n    "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.js",\n    "ember": "https://cdnjs.cloudflare.com/ajax/libs/ember.js/1.13.5/ember.js",\n    "ember-data": "https://cdnjs.cloudflare.com/ajax/libs/ember-data.js/1.13.5/ember-data.js"\n  }\n}'
    }));

    return model;
  }
});
