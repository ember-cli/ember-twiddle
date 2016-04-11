/**
 * This is a factory definition for a gist file
 */
import Mirage/*, {faker} */ from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  type() {
    if (!this.filename) {
      return "";
    }
    let extension = this.filename.substring(this.filename.lastIndexOf("."), this.filename.length);
    switch (extension) {
      case ".hbs":
        return "text/plain";
      case ".css":
        return "text/css";
      case ".js":
        return "application/javascript";
      case ".json":
        return "application/json";
    }
  },
  language() {
    if (!this.filename) {
      return "";
    }
    let extension = this.filename.substring(this.filename.lastIndexOf("."), this.filename.length);
    switch (extension) {
      case ".hbs":
        return "Handlebars";
      case ".css":
        return "CSS";
      case ".js":
        return "JavaScript";
      case ".json":
        return "JSON";
    }
  },
  raw_url() {
    return `https://gist.githubusercontent.com/${this.login}/${this.gist_id}/raw/${this.commit}/${this.filename}`;
  },
  size() {
    return this.content && this.content.length;
  },
  truncated: false
});

/* Sample

"about.template.hbs": {
  "filename": "about.template.hbs",
  "type": "text/plain",
  "language": "Handlebars",
  "raw_url": "https://gist.githubusercontent.com/Gaurav0/35de43cb81fc35ddffb2/raw/b7332edd46bd97973c1dfebf495908b8abb9b301/about.template.hbs",
  "size": 17,
  "truncated": false,
  "content": "<p>About Page</p>"
},
 */
