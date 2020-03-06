import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { helper } from '@ember/component/helper';


module('Integration | Component | sidebar-layout', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('helper:route-action', helper(function noop() {
      return () => {};
    }));
    this.owner.register('helper:transition-to', helper(function noop() {
      return () => {};
    }));
    this.owner.register('template:components/test-sidebar', hbs`test sidebar`);
  });

  test('it toggles', async function(assert) {
    this.set('isSidebarOpen', true);
    await render(hbs`
      <SidebarLayout
        @sidebarComponent={{component "test-sidebar"}}
        @isSidebarOpen={{this.isSidebarOpen}}
        @onSidebarUpdated={{fn (mut this.isSidebarOpen)}}
      as |sidebar|>
        {{#if sidebar.isSidebarOpen}}
          <button class="close" {{on "click" sidebar.hideSidebar}}>Close</button>
        {{else}}
          <button class="open" {{on "click" sidebar.showSidebar}}>Open</button>
        {{/if}}
        Content Here
      </SidebarLayout>
    `);

    assert.dom('.sidebar').hasText('Close Menu test sidebar Sign in Help GitHub Issue tracker');
    assert.dom('.content').hasText('Close Content Here');
    await click('.close');
    assert.dom('.sidebar-open').doesNotExist();
    assert.dom('.content').hasText('Open Content Here');
    await click('.open');
    assert.dom('.content').hasText('Close Content Here');
  });
});
