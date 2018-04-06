import Ember from 'ember';

const { inject, computed } = Ember;

export default Ember.Component.extend({
  session: inject.service(),
  classNames: ['gist-card'],

  // show fork option only if does not belong to user and is not a revision, otherwise show copy
  // Github api does not permit forking if you own the gist already
  // Github does not provide api for forking a revision
  showFork: computed('gist.{ownerLogin,isNew}', 'session.currentUser.login', 'isRevision', function() {
    let isNew = this.get('gist.isNew');
    let notRevision = !this.get('isRevision');
    let notOwner = this.get('gist.ownerLogin') !== this.get('session.currentUser.login');

    return !isNew && notRevision && notOwner;
  }),

  actions: {
    share() {
      prompt('Ctrl + C ;-)', window.location.href);
    },

    embed() {
      let src = window.location.href.split('?')[0];
      src += '?fullScreen=true';
      let responsive = document.createElement('div');
      responsive.style.cssText = 'position:relative;height:0;overflow:hidden;max-width:100%;padding-bottom:56.25%;'; // 16:9
      let iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;';
      responsive.appendChild(iframe);
      let embedCode = responsive.outerHTML;
      prompt('Ctrl + C ;-)', embedCode);
    }
  }
});
