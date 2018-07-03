export function initialize(/* application */) {
  // adds "toggleCommentIndented" command to codemirror for default keymap

  if (CodeMirror) {
    CodeMirror.keyMap.default['Cmd-/'] = 'toggleCommentIndented';
  }
}

export default {
  initialize
};
