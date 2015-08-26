import Ember from 'ember';

const { inject } = Ember;

export default Ember.Route.extend({
  notify: inject.service('notify'),

  beforeModel () {
    return this.session.fetch('github-oauth2').catch(function() {
      // Swallow error for now
    });
  },

  actions: {
    saveGist (gist) {
      var newGist = gist.get('isNew');
      if (!newGist && gist.get('ownerLogin') !== this.get('session.currentUser.login')) {
        this.send('fork', gist);
        return;
      }
      gist.save().then(() => {
        this.get('notify').info(`Saved to Gist ${gist.get('id')} on Github`);
        if(newGist) {
          this.transitionTo('gist.edit', gist).then(function() {
            this.send('setSaved');
          });
        } else {
          this.send('setSaved');
        }
      });
    },

    setSaved () {
      this.get('controller').set('unsaved', false);
    },

    fork (gist) {
      gist.fork().then((response) => {
        this.get('store').find('gist', response.id).then((newGist) => {
          gist.get('files').toArray().forEach((file) => {
            file.set('gist', newGist);
          });
          return newGist.save().then(() => {
            this.transitionTo('gist.edit', newGist);
          });
        });
      }).catch(this.catchForkError.bind(this));
    },

    signInViaGithub () {
      this.session.open('github-oauth2').catch(function(error) {
        alert('Could not sign you in: ' + error.message);
        throw error;
      });
    },

    signOut () {
      this.session.close();
    }
  },

  catchForkError(error) {
    if (error && error.errors) {
      let firstError = error.errors[0];
      if (firstError.code === "unprocessable" && firstError.field === "forks") {
        this.get('notify').info("You already own this gist.");
        return;
      }
    }
    throw error;
  }
});
