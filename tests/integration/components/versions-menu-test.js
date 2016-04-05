import Ember from "ember";
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('versions-menu', 'Integration | Component | versions menu', {
  integration: true,

  beforeEach() {
    this.depResolverStub = Ember.Service.extend({
      emberVersions: ['1.2.3']
    });
    this.register('service:dependency-resolver', this.depResolverStub);
    this.inject.service('dependency-resolver', { as: 'dependencyResolver' });
  }
});

test('it renders', function(assert) {
  assert.expect(2);

  this.on("versionSelected", function(name, version) {
    assert.equal(name, 'ember');
    assert.equal(version, '1.2.3');
  });

  this.render(hbs`{{versions-menu versionSelected=(action "versionSelected")}}`);

  this.$('.test-set-ember-version:contains("1.2.3")').click();
});
