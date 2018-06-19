import Application from '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

// adds "toggleCommentIndented" command to codemirror for default keymap

if (CodeMirror) {
  CodeMirror.keyMap.default['Cmd-/'] = 'toggleCommentIndented';
}

const App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;
