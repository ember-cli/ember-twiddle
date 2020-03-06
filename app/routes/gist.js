import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';
import Route from '@ember/routing/route';
import $ from 'jquery';
import RSVP from 'rsvp';
import config from '../config/environment';
import { saveAs } from 'file-saver';

const CONFIRM_MSG = "Unsaved changes will be lost.";

export default Route.extend({
  toriiProvider: config.toriiProvider,
  notify: service(),
  app: service(),

  titleToken: readOnly('controller.model.description'),

  beforeModel() {
    return this.session.fetch(this.toriiProvider).catch(function() {
      // Swallow error for now
    });
  },

  activate() {
    this.set('boundConfirmUnload', this.confirmUnload.bind(this));
    $(window).on('beforeunload', this.boundConfirmUnload);
  },

  deactivate() {
    var gist = this.controller.get('model');
    if (gist.get('isNew')) {
      this.store.unloadRecord(gist);
    }
    $(window).off('beforeunload', this.boundConfirmUnload);
  },

  confirmUnload(event) {
    if (this.get('controller.unsaved') === true) {
      if (!window.confirm(CONFIRM_MSG)) {
        event.preventDefault();
      }
      return CONFIRM_MSG; // for Chrome
    }
  },

  actions: {
    saveGist(gist) {
      var newGist = gist.get('isNew');
      let controller = this.controller;
      if (!newGist && gist.get('ownerLogin') !== this.get('session.currentUser.login')) {
        this.send('fork', gist);
        return;
      }
      controller.set('isGistSaving', true);
      gist.save().then(() => {
        this.notify.info(`Saved to Gist ${gist.get('id')} on Github`);
        this.send('setSaved');
        if(newGist) {
          gist.set('gistId', gist.get('id'));
          this.transitionTo('gist.edit', gist);
        }
      }).catch((this.catchSaveError.bind(this)))
      .finally(() => controller.set('isGistSaving', false));
    },

    deleteGist(gist) {
      if(confirm(`Are you sure you want to remove this gist from Github?\n\n${gist.get('description')}`)) {
        gist.destroyRecord();
        this.transitionTo('gist.new').then(() => {
          this.notify.info(`Gist ${gist.get('id')} was deleted from Github`);
        });
      }
    },

    setSaved() {
      this.controller.set('unsaved', false);
    },

    fork(gist) {
      gist.fork().then((response) => {
        this.store.find('gist', response.id).then((newGist) => {
          gist.get('files').toArray().forEach((file) => {
            file.set('gist', newGist);
          });
          newGist.set('gistId', response.id);
          return newGist.save().then(() => {
            this.send('setSaved');
            return this.transitionTo('gist.edit', newGist);
          });
        });
      }).catch(this.catchForkError.bind(this));
    },

    copy() {
      this.transitionTo('gist.new', {
        queryParams: {
          copyCurrentTwiddle: true
        }
      });
    },

    signInWithGithub() {
      this.session.open(this.toriiProvider).catch(function(error) {
        if (alert) {
          alert('Could not sign you in: ' + error.message);
        }
        throw error;
      });
    },

    signOut() {
      this.session.close();
    },

    urlChanged(newUrl) {
      this.app.postMessage({ newUrl });
    },

    downloadProject() {
      return new RSVP.Promise(resolve => {
        this.downloadJSZip().then(() => {
          const zip = new window.JSZip();

          this.controller.get('model.files')
          .toArray()
          .forEach(function(f) {
            zip.file(
              'ember-twiddle/' + f.get('filePath'),
              f.get('content')
            );
          });

          zip.generateAsync({type:'blob'}).then(function(content) {
            resolve(saveAs(content, 'ember-twiddle.zip'));
          });
        });
      });
    }
  },

  catchForkError(error) {
    if (error && error.errors) {
      let firstError = error.errors[0];
      if (firstError.code === "unprocessable" && firstError.field === "forks") {
        this.notify.error("You already own this gist.");
        return;
      }
    }
    this.notify.error("Something went wrong. The gist was not forked.");
    throw error;
  },

  catchSaveError(error) {
    if (error && error.errors) {
      let firstError = error.errors[0];
      if (firstError.code === "unprocessable") {
        this.notify.error("The gist is invalid, and could not be saved.");
        return;
      }
      if (firstError.code === "missing_field") {
        this.notify.error("The contents of a file is completely empty, so the gist could not be saved.");
        return;
      }
    }
    this.notify.error("Something went wrong. The gist was not saved.");
    throw error;
  },

  downloadJSZip() {
    return new RSVP.Promise(function(resolve) {
      if(window.JSZip) { resolve(); }

      $.getScript(
        'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js',
        resolve
      );
    });
  }
});
