export default Em.Component.extend({
  actions: {
    selectFile (file) {
      this.set('file', file);
    }
  }
});