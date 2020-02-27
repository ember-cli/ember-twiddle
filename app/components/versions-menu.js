import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  emberCli: service('ember-cli'),
  dependencyResolver: service(),
  classNames: ['versions-menu'],

  versions: readOnly('dependencyResolver.emberVersions'),
  dataVersions: readOnly('dependencyResolver.emberDataVersions'),

  actions: {
    versionSelected(dependency, version) {
      let gist = this.model;
      let emberCli = this.emberCli;

      emberCli.updateDependencyVersion(gist, dependency, version).then(() => {
        this.onVersionChanged();
      });
    }
  }
});
