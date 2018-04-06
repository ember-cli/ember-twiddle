import { run } from '@ember/runloop';
import $ from 'jquery';
import wait from 'ember-test-helpers/wait';
import { find } from 'ember-native-dom-helpers';


function focus(el) {
  if (!el) {
    return;
  }
  let $el = $(el);
  if ($el.is(':input, [contenteditable=true]')) {
    let type = $el.prop('type');
    if (type !== 'checkbox' && type !== 'radio' && type !== 'hidden') {
      run(null, function() {
        // Firefox does not trigger the `focusin` event if the window
        // does not have focus. If the document doesn't have focus just
        // use trigger('focusin') instead.

        if (!document.hasFocus || document.hasFocus()) {
          el.focus();
        } else {
          $el.trigger('focusin');
        }
      });
    }
  }
}

export function nativeClick(element, options = {}) {
  let mousedown = new window.Event('mousedown', { bubbles: true, cancelable: true, view: window });
  let mouseup = new window.Event('mouseup', { bubbles: true, cancelable: true, view: window });
  let click = new window.Event('click', { bubbles: true, cancelable: true, view: window });
  Object.keys(options).forEach((key) => {
    mousedown[key] = options[key];
    mouseup[key] = options[key];
    click[key] = options[key];
  });
  run(() => element.dispatchEvent(mousedown));
  focus(element);
  run(() => element.dispatchEvent(mouseup));
  run(() => element.dispatchEvent(click));
}

function findElement(scope, selector) {
  if (!scope) {
    throw new Error('scope must be defined');
  }

  if (!scope.querySelector) {
    throw new Error('scope must be a DOM element');
  }

  let element = scope.querySelector(selector);
  if (!element) {
    throw new Error(`element '${selector}' not found in scope`);
  }

  return element;
}

export function clickOption(scope, index, options = {}) {
  nativeClick(findElement(scope, `[data-option-index="${index}"]`), options);
  return wait();
}

export function clickTrigger(selector, options = {}) {
  let scope = find(selector);
  if (scope && scope.classList.contains('ember-basic-dropdown-trigger')) {
    nativeClick(scope, options);
  } else {
    nativeClick(findElement(scope, '.ember-basic-dropdown-trigger'), options);
  }
  return wait();
}

export function selectOption(scope, index) {
  return wait()
    .then(() => clickTrigger(scope))
    .then(() => clickOption(document.querySelector('#ember-testing'), index));
}
