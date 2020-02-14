import Component from '@ember/component';

export default Component.extend({
  attributeBindings: ['type', 'value', 'checked', 'disabled', 'id'],
  tagName: 'input',
  type: 'checkbox',
  checked: false,
  disabled: false,

  change() {
    this.set('checked', this.element.checked);
    this.action(this.checked);
  }
});
