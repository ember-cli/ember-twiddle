'use strict';

let options = {
  test_page: 'tests/index.html?hidepassed',
  disable_watching: true,
  launch_in_ci: [
    'Chrome'
  ],
  launch_in_dev: [
    'Chrome'
  ]
};

if (process.env.TRAVIS) {
  options.browser_args = {
    Chrome: [
      // --no-sandbox is needed when running Chrome inside a container
      '--no-sandbox',
      '--disable-gpu',
      '--headless',
      '--remote-debugging-port=0',
      '--window-size=1440,900'
    ].filter(Boolean)
  };
}

module.exports = options;
