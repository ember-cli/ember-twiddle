import Ember from "ember";
import { task, timeout } from "ember-concurrency";

export default Ember.Mixin.create({

  /**
   * Build the application and set the iframe code
   */
  buildApp: task(function *() {
    this.set('isBuilding', true);
    this.set('buildErrors', []);
    this.set('model.initialRoute', this.get('route'));

    try {
      const buildOutput = yield this.get('emberCli').compileGist(this.get('model'));
      this.set('isBuilding', false);
      this.set('buildOutput', buildOutput);
    } catch(errors) {
      this.set('isBuilding', false);
      if (Ember.isArray(errors)) {
        this.set('buildErrors', errors);
        errors.forEach(error => {
          console.error(error);
        });
      } else if (errors) {
        console.error(errors);
      }
    }
  }),

  rebuildApp: task(function *() {
    if (this.get('isLiveReload')) {
      yield timeout(500);
      yield this.get('buildApp').perform();
    }
  }).restartable()
});
