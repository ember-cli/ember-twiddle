# Contributing

### Issues / milestones

We try to prioritize issues by assigning them to milestones. The closer a milestone is, the more priority an issue has. When an issue doesn't have a milestone it's not prioritized yet.

### Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Yarn](https://yarnpkg.com)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS 2](http://phantomjs.org/)
* [Gatekeeper](https://github.com/prose/gatekeeper)

### Installation

* `git clone <repository-url>` this repository
* change into the new directory
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
  * **Note:** If you are going to use Docker setup, instead of editing config/environment.js, open the docker-compose.yml
  and under environment change `CHANGEME` with your key

### Running / Development Without Docker (Recommended)

* `node index.js` from your gatekeeper folder
* `yarn` from ember twiddle folder
* `bower install` from ember twiddle folder
* `ember server` from ember twiddle folder
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Running / Development With Docker (OPTIONAL)

#### Additional Dependencies

* [Docker](https://docs.docker.com/install/) (Optional)
* [Docker Compose](https://docs.docker.com/compose/install/) (Optional)

#### Instructions

* `node index.js` from your gatekeeper folder
* `docker-compose up` from ember twiddle folder
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

### Suggestions

* Try to only fix one issue and/or upgrade one version. You are more likely to be able to succeed.
* Upgrading the ember-cli version is extremely difficult, because we are using private apis. Try to upgrade in small pieces. Consider forking ember-cli during the upgrade process to upgrade its dependencies one by one. Don't forget to revert to a standard ember-cli version when done.
* Add tests with your PR.
* Upgrading ember-cli is usually not necessary to upgrade Ember or Ember Data.
* New Ember versions will not work without upgrades to the [backend](https://github.com/joostdevries/twiddle-backend).
* The backend does not have tests. Until it does, please test by actually compiling addons with Docker and an AWS account before submitting PRs.
* If you are going to use a local backend, make changes to environment.js using [`git update-index skip-worktree [<file>...]`](https://medium.com/@igloude/git-skip-worktree-and-how-i-used-to-hate-config-files-e84a44a8c859) so that changes to your environment.js are not accidentally committed.
