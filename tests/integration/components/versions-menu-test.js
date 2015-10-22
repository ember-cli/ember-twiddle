import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('versions-menu', 'Integration | Component | versions menu', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  this.on("versionSelected", function(name, version) {
    assert.equal(name, 'ember');
    assert.equal(version, '1.2.3');
  });

  this.set('emberVersions', ['1.2.3']);
  this.render(hbs`{{versions-menu versionSelected=(action "versionSelected")
                                  emberVersions=emberVersions }}`);

  this.$('.test-set-ember-version:contains("1.2.3")').click();
});
