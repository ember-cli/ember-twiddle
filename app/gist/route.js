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
        let id = response.id;
        let newGist = this.duplicate(gist);
        return newGist.save().then(() => {
          this.transitionTo('gist.edit', id);
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
  },

  duplicate(gist) {
    var newGistJson = gist.toJSON();
    Object.keys(newGistJson).forEach((key) => {
      if (newGistJson[key] !== gist.get(key)) {
        newGistJson[key] = gist.get(key);
      }
    });
    newGistJson.id = undefined;
    var newGist = this.get('store').createRecord('gist', newGistJson);
    gist.get('files').currentState.forEach((file) => {
      file.record.set('gist', newGist);
    });
    return newGist;
  }
});
