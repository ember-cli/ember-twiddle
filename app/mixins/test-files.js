import Mixin from '@ember/object/mixin';

export default Mixin.create({
  ensureTestHelperExists() {
    this._ensureExists('tests/test-helper.js', 'test-helper');
  },

  ensureTestStartAppHelperExists() {
    this._ensureExists('tests/helpers/start-app.js', 'test-start-app');
  },

  ensureTestDestroyAppHelperExists() {
    this._ensureExists('tests/helpers/destroy-app.js', 'test-destroy-app');
  },

  ensureTestModuleForAcceptanceHelperExists() {
    this._ensureExists('tests/helpers/module-for-acceptance.js', 'test-module-for-acceptance');
  },

  _ensureExists(filePath, blueprint) {
    if (!this.hasPath(filePath)) {
      const fileProperties = this.emberCli.buildProperties(blueprint);
      this.createFile(filePath, fileProperties);
    }
  },

  calculateFileVarsForTests(blueprint) {
    const fileProperties = this.emberCli.buildProperties(blueprint);
    const filePath = prompt('File path', fileProperties.filePath);
    const splitFilePath = filePath.split('/');
    const file = splitFilePath[splitFilePath.length - 1];
    const name = file.replace('-test.js', '');
    return { filePath, name };
  },

  ensureTestingEnabled() {
    return this.emberCli.ensureTestingEnabled(this.model);
  },

  createUnitTestFile(type) {
    this.ensureTestHelperExists();
    const blueprint = type + "-" + 'test';
    const { filePath, name } = this.calculateFileVarsForTests(blueprint);

    const fileProperties = this.emberCli.buildProperties(blueprint, {
      dasherizedModuleName: name,
      friendlyTestDescription: 'TODO: put something here'
    });

    if (this.isPathInvalid(blueprint, filePath)) {
      return;
    }
    this.createFile(filePath, fileProperties);
  },

  createIntegrationTestFile(type) {
    this.ensureTestHelperExists();
    const blueprint = type + '-test';
    const { filePath, name } = this.calculateFileVarsForTests(blueprint);

    const fileProperties = this.emberCli.buildProperties(blueprint, {
      testType: 'integration',
      componentPathName: name,
      friendlyTestDescription: 'TODO: put something here'
    });

    if (this.isPathInvalid(blueprint, filePath)) {
      return;
    }
    this.createFile(filePath, fileProperties);
  },

  createAcceptanceTestFile() {
    this.ensureTestHelperExists();
    this.ensureTestStartAppHelperExists();
    this.ensureTestDestroyAppHelperExists();
    this.ensureTestModuleForAcceptanceHelperExists();
    const blueprint = 'acceptance-test';
    const { filePath, name } = this.calculateFileVarsForTests(blueprint);

    const fileProperties = this.emberCli.buildProperties(blueprint, {
      testFolderRoot: '../..',
      dasherizedModuleName: name,
      friendlyTestName: 'TODO: put something here'
    });

    if (this.isPathInvalid(blueprint, filePath)) {
      return;
    }
    this.createFile(filePath, fileProperties);
  }
});
