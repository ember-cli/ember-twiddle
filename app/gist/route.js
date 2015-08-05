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
        var id = response.id;
        gist.set('id', id);
        return gist.save().then(() => {
          this.transitionToRoute('gist.edit', id);
        });
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
