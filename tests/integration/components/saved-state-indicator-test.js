import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | saved state indicator', function(hooks) {
  setupRenderingTest(hooks);

  test('it shows unsaved if unsaved, saved if not', async function(assert) {
    assert.expect(2);

    this.set('unsaved', false);
    this.set('model', {
      files: ["a", "b", "c"],
      htmlUrl: "http://somewhere.com",
      currentRevision: "a1b2c3d4"
    });

    await render(hbs`{{saved-state-indicator model=model unsaved=unsaved}}`);

    assert.equal(find('span.indicator').textContent.replace(/\s+/g, " ").trim(), "3 files saved to Gist, rev a1b2c3d4");

    this.set('unsaved', true);

    assert.dom('span.indicator').hasText('Unsaved');
  });
});
