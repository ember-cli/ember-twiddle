# Contributing

### Issues / milestones

We try to prioritize issues by assigning them to milestones. The closer a milestone is, the more priority an issue has. When an issue doesn't have a milestone it's not prioritized yet.

### Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS 2](http://phantomjs.org/)
* [Gatekeeper](https://github.com/prose/gatekeeper)

### Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`
* Create a new github application
  - Go to github.com
  - click top right portrait
  - click on 'Settings'
  - select 'Applications'
  - click the 'Developer Applications' tab
  - click 'Register New Appliction' button
  - name it whatever you want (ember-twiddle-dev if you can't think of anything)
  - set the homepage url to any valid URL (http://google.com, since it doesn't actually matter)
  - set the 'Authorization callback URL' to: http://localhost:4200/
  - click 'Register application'
  - leave this tab open, we're going to need to id and secret later
* [Install gatekeeper](https://github.com/prose/gatekeeper)
* Edit the gatekeeper config.json to have the client_id and client_secret from your new github application
* Edit the config/environment.js in ember twiddle (find the apiKey and set it to the client_id of your github application)

### Running / Development

* `node server.js` from your gatekeeper folder
* `ember server` from ember twiddle folder
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Design

* Follow the Ember styleguide.
* Do not use any Ember trademarked items, including:
  * Tomster
  * Ember logo
* Otherwise, try to keep the overall theme as close to other Ember websites as possible.

