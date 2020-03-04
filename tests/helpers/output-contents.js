import outputPane from './output-pane';

export default function(selector) {
  let output = outputPane();
  let outputDiv = output.document.querySelector('#main');
  if (selector) {
    return outputDiv.querySelector(selector).textContent.trim();
  }
  return outputDiv.textContent.trim();
}
