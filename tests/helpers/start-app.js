import Application from '../../app';
import config from '../../config/environment';
import { run } from '@ember/runloop';
import { assign } from '@ember/polyfills';
import keyboardRegisterTestHelpers from './ember-keyboard/register-test-helpers';

export default function startApp(attrs) {
  let application;

  let attributes = assign({}, config.APP);
  attributes.autoboot = true;
  attributes = assign(attributes, attrs); // use defaults, but you can override;

  run(() => {
    application = Application.create(attributes);
    application.setupForTesting();
    keyboardRegisterTestHelpers();
    application.injectTestHelpers();
  });

  return application;
}
