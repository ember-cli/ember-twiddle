import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('saved-state-indicator', 'Integration | Component | saved state indicator', {
  integration: true
});

test('it shows unsaved if unsaved, saved if not', function(assert) {
  assert.expect(2);

  this.set('unsaved', false);
  this.set('model', {
    files: ["a", "b", "c"],
    htmlUrl: "http://somewhere.com",
    currentRevision: "a1b2c3d4"
  });

  this.render(hbs`{{saved-state-indicator model=model unsaved=unsaved}}`);

  assert.equal(this.$('span.indicator').text().replace(/\s+/g, " ").trim(), "3 files Saved, rev a1b2c3d4");

  this.set('unsaved', true);

  assert.equal(this.$('span.indicator').text().trim(), "3 files Unsaved");
});
