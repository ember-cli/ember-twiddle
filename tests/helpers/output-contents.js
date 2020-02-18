import outputPane from './output-pane';

export default function(app, selector) {
  let output = outputPane();
  let outputDiv = output.document.querySelector('#root');
  if (selector) {
    return outputDiv.querySelector(selector).textContent.trim();
  }
  return outputDiv.textContent.trim();
}