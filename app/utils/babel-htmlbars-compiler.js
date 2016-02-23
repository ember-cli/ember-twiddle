import Ember from "ember";

const compiler = Ember.HTMLBars;

export default function(babel) {

  // Taken from https://github.com/pangratz/babel-plugin-htmlbars-inline-precompile/blob/master/index.js

  const t = babel.types;

  var replaceNodeWithPrecompiledTemplate = function(node, template) {
    var compiledTemplateString = "Ember.HTMLBars.template(" + compiler.precompile(template) + ")";

    // Prefer calling replaceWithSourceString if it is present.
    // this prevents a deprecation warning in Babel 5.6.7+.
    //
    // TODO: delete the fallback once we only support babel >= 5.6.7.
    if (node.replaceWithSourceString) {
      node.replaceWithSourceString(compiledTemplateString);
    } else {
      return compiledTemplateString;
    }
  };


  return new babel.Transformer('htmlbars-inline-precompile', {
    ImportDeclaration: function(node, parent, scope, file) {
      if (t.isLiteral(node.source, { value: "htmlbars-inline-precompile" })) {
        var first = node.specifiers && node.specifiers[0];
        if (t.isImportDefaultSpecifier(first)) {
          file.importSpecifier = first.local.name;
        } else {
          var input = file.code;
          var usedImportStatement = input.slice(node.start, node.end);
          var msg = "Only `import hbs from 'htmlbars-inline-precompile'` is supported. You used: `" + usedImportStatement + "`";
          throw file.errorWithNode(node, msg);
        }

        // Prefer calling dangerouslyRemove instead of remove (if present) to
        // suppress a deprecation warning.
        //
        // TODO: delete the fallback once we only support babel >= 5.5.0.
        if (typeof this.dangerouslyRemove === 'function') {
          this.dangerouslyRemove();
        } else {
          this.remove();
        }
      }
    },

    CallExpression: function(node, parent, scope, file) {
      if (t.isIdentifier(node.callee, { name: file.importSpecifier })) {
        var argumentErrorMsg = "hbs should be invoked with a single argument: the template string";
        if (node.arguments.length !== 1) {
          throw file.errorWithNode(node, argumentErrorMsg);
        }

        var template = node.arguments[0].value;
        if (typeof template !== "string") {
          throw file.errorWithNode(node, argumentErrorMsg);
        }

        return replaceNodeWithPrecompiledTemplate(this, template);
      }
    },

    TaggedTemplateExpression: function(node, parent, scope, file) {
      if (t.isIdentifier(node.tag, { name: file.importSpecifier })) {
        if (node.quasi.expressions.length) {
          throw file.errorWithNode(node, "placeholders inside a tagged template string are not supported");
        }

        var template = node.quasi.quasis.map(function(quasi) {
          return quasi.value.cooked;
        }).join("");

        return replaceNodeWithPrecompiledTemplate(this, template);
      }
    }
  });
}
