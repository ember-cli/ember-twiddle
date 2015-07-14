import Ember from "ember";
import config from '../config/environment';

export default Em.Controller.extend({
  emberCli: Em.inject.service('ember-cli'),
  version: config.version,
  revision: config.currentRevision.substring(0,7),

  /**
   * Output from the build, sets the `code` attr on the component
   * @type {String}
   */
  buildOutput: Ember.Object.create({ code: '', styles: ''}),
  isBuilding: false,
  activeEditor: null,
  col1File: null,
  col2File: null,
  col1Active: Em.computed.equal('activeEditor.col','1'),
  col2Active: Em.computed.equal('activeEditor.col','2'),

  /**
   * Errors during build
   * @type {Array}     Array of errors
   */
  buildErrors: null,

  /**
   * Build the application and set the iframe code
   */
  buildApp () {
    this.set('isBuilding', true);
    this.set('buildErrors', []);

    this.get('emberCli').compileGist(this.get('model')).then((buildOutput) => {
      this.set('isBuilding', false);
      this.set('buildOutput', buildOutput);
    })
    .catch((errors) => {
      this.set('isBuilding', false);
      this.set('buildErrors', errors);
      errors.forEach(error => {
        console.error(error);
      });
    });
  },

  /**
   * Set the initial file columns
   */
  initializeColumns: Em.observer('model', function() {
    var files = this.get('model.files');

    if(files.objectAt(0)) {
      this.set('col1File', files.objectAt(0));
    }

    if(files.objectAt(1)) {
      this.set('col2File', files.objectAt(1));
    }
  }),

  rebuildApp: Em.observer('model.files.@each.content', function() {
    Em.run.debounce(this, this.buildApp, 500);
  }),

  actions: {
    focusEditor (editor) {
      this.set('activeEditor', editor);
    },

    deleteGist (gist) {
      gist.destroyRecord();
      this.transitionToRoute('gist.new');
      this.notify.info('Gist %@ was deleted from Github'.fmt(gist.get('id')));
    },

    share () {
      prompt('Ctrl + C ;-)', window.location.href);
    },

    addFile (type) {
      var template = '';
      var filePath = '';
      if(type==='component-hbs') {
        template = '<b class="foo">{{yield}}</b>';
        filePath = 'templates/components/foo-component.hbs';
      }
      if(type==='component-js') {
        template = 'export default Ember.Component.extend({\n});';
        filePath = 'components/foo-component.js';
      }
      else if(type==='controller') {
        template = 'export default Ember.Controller.extend({\n});';
        filePath = 'controllers/foo.js';
      }
      else if(type==='template') {
        template = '<b>Hi!</b>';
        filePath = 'templates/foo.hbs';
      }

      filePath = prompt('File path', filePath);

      if (filePath) {
        if(this.get('model.files').findBy('filePath', filePath)) {
          alert('A file with the name %@ already exists'.fmt(filePath));
          return;
        }

        let file = this.store.createRecord('gistFile', {
          filePath: filePath,
          content: template
        });

        this.get('model.files').pushObject(file);
        this.notify.info('File %@ was added'.fmt(file.get('filePath')));
        this.set('col1File', file);
      }
    },

    renameFile (file) {
      let filePath = prompt('File path', file.get('filePath'));
      if (filePath) {
        if(this.get('model.files').findBy('filePath', filePath)) {
          alert('A file with the name %@ already exists'.fmt(filePath));
          return;
        }

        file.set('filePath', filePath);
        this.notify.info('File %@ was added'.fmt(file.get('filePath')));
      }
    },

    showErrors () {
      this.get('buildErrors').forEach((error) => {
        console.error(error);
      });
      this.notify.info('Errors were dumped to console');
    },

    fork (gist) {
      var newGistData = {
        description: 'Fork of %@'.fmt(gist.get('description'))
      };

      var filesBuffer = [];

      gist.get('files').forEach(file => {
        filesBuffer.pushObject({
          filePath: file.get('filePath'),
          content: file.get('content'),
        });
      });

      this.store.unloadAll('gistFile');

      var newGist = this.store.createRecord('gist', newGistData);
      filesBuffer.forEach(fileData => {
        newGist.get('files').pushObject(this.store.createRecord('gistFile', fileData));
      });

      this.controllerFor('gist').set('fork', newGist);
      this.notify.info('Succesfully created %@'.fmt(newGist.get('description')));
      this.transitionToRoute('gist.new');
    },

    removeFile (file) {
      if(confirm(`Are you sure you want to remove this file?\n\n${file.get('filePath')}`)) {
        file.deleteRecord();
        this.notify.info('File %@ was deleted'.fmt(file.get('filePath')));
        this._removeFileFromColumns(file);
      }
    }
  },

  _removeFileFromColumns (file) {
    if(this.get('col1File') === file) {
      this.set('col1File', null);
    }
    if(this.get('col2File') === file) {
      this.set('col2File', null);
    }
  }
});
