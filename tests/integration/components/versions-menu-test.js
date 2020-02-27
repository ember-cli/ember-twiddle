import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | versions menu', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  hooks.beforeEach(function() {
    this.depResolverStub = Service.extend({
      init() {
        this._super(...arguments);
        this.emberVersions = ['1.2.3'];
      }
    });
    this.owner.register('service:dependency-resolver', this.depResolverStub);
    this.dependencyResolver = this.owner.lookup('service:dependency-resolver');
  });

  test('it renders', async function(assert) {
    assert.expect(2);

    this.actions.versionSelected = function(name, version) {
      assert.equal(name, 'ember');
      assert.equal(version, '1.2.3');
    };

    await render(hbs`{{versions-menu versionSelected=(action "versionSelected")}}`);

    this.$('.test-set-ember-version:contains("1.2.3")').click();
  });
});
