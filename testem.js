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

// I need this on Ubuntu Linux 16.04 LTS due to bugs
if (process.env.TESTEM_CHROME_NO_SANDBOX) {
  options.browser_args = {
    Chrome: [
      '--no-sandbox',
      '--disable-gpu'
    ]
  };
}

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
