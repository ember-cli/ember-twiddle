# [ember-twiddle](http://ember-twiddle.com) [![Build Status][travis-badge]][travis-badge-url]

An ember cli like web based javascript sharing tool. http://ember-twiddle.com

* Ember Twiddle uses [Github Gists](https://gist.github.com) as persistence layer. Once you hit `Save` on a newly created Twiddle, it will create a public Gist under your Github account.
* Right now, Ember Twiddle only runs Ember 1.13 code, but we're in the process of making that customizable.
* If you'd like to help out, check out [CONTRIBUTING.md](CONTRIBUTING.md)

### Roadmap

At the moment, active development is going on and there's a pretty big list of issues we want to nail before calling it a `1.0`. If you have ideas we should add, please [open an issue](https://github.com/alexspeller/ember-twiddle/issues) if it's not on the list yet.

There are a few major items on the roadmap for 1.0. This list is prioritized because the issues are more or less blocking each other.

#### #38 [Configurable dependencies](https://github.com/alexspeller/ember-twiddle/issues/38)

Basically the option to specify which version of `ember` and `ember-data` should be used. Right now, your Twiddle will use the same version as Ember Twiddle (1.13 at the moment).


#### #11 [Support routing](https://github.com/alexspeller/ember-twiddle/issues/11)

Right now, routing is not supported is your twiddle because it's not possible to define your own router.


#### #10 [Major UX iteration (filetree)](https://github.com/alexspeller/ember-twiddle/issues/10)

A next iteration on the UX, adding a filetree column and polising the interface.


#### #13 [Embed support](https://github.com/alexspeller/ember-twiddle/issues/13)

Offering an easy way to embed a twiddle into your own site.


[travis-badge]: https://travis-ci.org/alexspeller/ember-twiddle.svg?branch=master
[travis-badge-url]: https://travis-ci.org/alexspeller/ember-twiddle
