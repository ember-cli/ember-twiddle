import Ember from "ember";
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('saved-twiddles-row', 'Integration | Component | saved twiddles row', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(5);

  this.file1 = Ember.Object.create({
    filePath: "some-path.js"
  });

  this.file2 = Ember.Object.create({
    filePath: "some/path.js"
  });

  this.file3 = Ember.Object.create({
    filePath: "some/long/path.js"
  });

  this.set('gist', Ember.Object.create({
    id: '74bae9a34142370ff5a3',
    updatedAt: new Date(2015, 3, 1),
    description: "Test Description",
    files: [this.file1, this.file2, this.file3],
    history: [],
    ownerLogin: 'Gaurav0',
    isNew: false
  }));

  this.render(hbs`{{saved-twiddles-row gist=gist}}`);

  assert.equal(this.$('.test-gist-id').text().trim(), '74bae9a34142370ff5a3');
  assert.equal(this.$('.test-gist-updated-at').text().trim(), 'Wed Apr 1 2015');
  assert.equal(this.$('.test-gist-numfiles').text().trim(), '3 files');
  assert.equal(this.$('.test-gist-numfiles').attr('title').trim(), 'some-path.js\nsome/path.js\nsome/long/path.js');
  assert.equal(this.$('.test-gist-description').text().trim(), "Test Description");
});
