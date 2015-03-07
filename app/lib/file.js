import Path from 'npm:path';
import Babel from "npm:babel";

export default Em.Object.extend({
  errorMessage: null,

  compileJs () {
    return this.tryCompile(() =>
      Babel.transform(this.get('content')).code);
  },

  compileHbs() {
    return this.tryCompile(() =>
      Em.HTMLBars.compile(this.get('content') || ''));
  },

  tryCompile(compile) {
    try {
      var result = compile();
      this.set('errorMessage', null);
      return result;
    } catch (e) {
      this.set('isError', true);
      this.set('errorMessage', e.message);
    }
  },

  compiled: Em.computed('content', 'extension', function () {
    switch(this.get('extension')) {
      case '.js':
        return this.compileJs();
      case '.hbs':
        return this.compileHbs();
      default:
        return '<Unknown file type>';
    }
  }),

  extension: Em.computed('name', function () {
    return Path.extname(this.get('name'));
  }),

  nameWithModule: Em.computed('name', function () {
    let name = this.get('name');

    return Path.join('demo-app',
      Path.dirname(name), Path.basename(name, Path.extname(name)));
  })
});