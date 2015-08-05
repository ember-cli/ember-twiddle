import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel () {
    return this.session.fetch('github-oauth2').catch(function() {
      // Swallow error for now
    });
  },

  actions: {
    saveGist (gist) {
      var newGist = gist.get('isNew');
      gist.save().then(() => {
        this.notify.info('Saved to Gist %@ on Github'.fmt(gist.get('id')));
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
          return newGist.save().then((response) => {
            this.transitionTo('gist.edit', response.id);
          });
        });
      }).catch((error) => {
        if (error && error.errors) {
          let firstError = error.errors[0];
          if (firstError.code === "unprocessable" && firstError.field === "forks") {
            this.notify.info("You already own this gist.");
            return;
          }
        }
        throw error;
      });
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
  }
});
