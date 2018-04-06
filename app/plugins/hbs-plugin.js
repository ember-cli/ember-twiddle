// Based on version 0.2.3

export default function(babel, _options) {
  var options = _options || {};

  function htmlbarsInlineCompilerPlugin(babel) {
    let t = babel.types;

    return {
      visitor: {
        ImportDeclaration: function(path, state) {
          let node = path.node;
          if (t.isLiteral(node.source, { value: "htmlbars-inline-precompile" })) {
            let first = node.specifiers && node.specifiers[0];
            if (!t.isImportDefaultSpecifier(first)) {
              let input = state.file.code;
              let usedImportStatement = input.slice(node.start, node.end);
              let msg = `Only \`import hbs from 'htmlbars-inline-precompile'\` is supported. You used: \`${usedImportStatement}\``;
              throw path.buildCodeFrameError(msg);
            }

            state.importId = state.importId || path.scope.generateUidIdentifierBasedOnNode(path.node.id);
            path.scope.rename(first.local.name, state.importId.name);
            path.remove();
          }
        },

        TaggedTemplateExpression(path, state) {
          if (!state.importId) { return; }

          let tagPath = path.get('tag');
          if (tagPath.node.name !== state.importId.name) {
            return;
          }

          if (path.node.quasi.expressions.length) {
            throw path.buildCodeFrameError("placeholders inside a tagged template string are not supported");
          }

          let template = path.node.quasi.quasis.map(quasi => quasi.value.cooked).join('');
          let compiledTemplateString = "Ember.HTMLBars.compile(`" + template + "`)";

          path.replaceWithSourceString(compiledTemplateString);
        },

        CallExpression(path, state) {
          if (!state.importId) { return; }

          let calleePath = path.get('callee');
          if (calleePath.node.name !== state.importId.name) {
            return;
          }

          let argumentErrorMsg = "hbs should be invoked with a single argument: the template string";
          if (path.node.arguments.length !== 1) {
            throw path.buildCodeFrameError(argumentErrorMsg);
          }

          let template = path.node.arguments[0].value;
          if (typeof template !== "string") {
            throw path.buildCodeFrameError(argumentErrorMsg);
          }

          let compiledTemplateString = `Ember.HTMLBars.template(${state.opts.precompile(template)})`;

          path.replaceWithSourceString(compiledTemplateString);
        },
      }
    };
  }

  // used by broccoli-babel-transpiler to bust the cache when
  // the template compiler being used changes
  htmlbarsInlineCompilerPlugin.cacheKey = function() {
    return options.cacheKey;
  };

  return htmlbarsInlineCompilerPlugin;
}
