# [ember-twiddle](http://ember-twiddle.com)

[![Build Status][travis-badge]][travis-badge-url] [![Code Climate](https://codeclimate.com/github/ember-cli/ember-twiddle/badges/gpa.svg)](https://codeclimate.com/github/ember-cli/ember-twiddle)

An ember cli like web based javascript sharing tool. http://ember-twiddle.com

* Ember Twiddle uses [Github Gists](https://gist.github.com) as persistence layer. Once you hit `Save` on a newly created Twiddle, it will create a public Gist under your Github account.
* If you'd like to help out, check out [CONTRIBUTING.md](CONTRIBUTING.md)

### Browser support

To make using Ember Twiddle secure, we use the [sandbox](http://caniuse.com/#feat=iframe-sandbox) and [srcdoc](http://caniuse.com/#feat=iframe-srcdoc) attributes of the `<iframe>` element. Especially `srcdoc` is not supported by any version of IE at the moment and older versions of other browsers also lack support for `sandbox`. Furthermore, the sandbox prohibits the use of cookies, localStorage, IndexedDB, Web Workers, etc.

We are planning to move to a secure solution with better compatibility soon (most likely one where the twiddle is run on a different domain).

## Feedback

You can use the [issue tracker](https://github.com/ember-cli/ember-twiddle/issues) to provide feedback, suggest features or report bugs.  Before you open an issue though, make sure you check [canary.ember-twiddle.com](http://canary.ember-twiddle.com) to see whether it's not already fixed on `master`. Of course, you should also check whether an issue doesn't exist already (if it does, use the comments to provide additional input).

#### Security-related issues

If you run into a security-related issue, please **do not** open an issue for it but instead email security@emberjs.com (preferably with a twiddle demonstrating the issue).

[travis-badge]: https://travis-ci.org/ember-cli/ember-twiddle.svg?branch=master
[travis-badge-url]: https://travis-ci.org/ember-cli/ember-twiddle
