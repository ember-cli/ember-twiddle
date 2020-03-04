import Mixin from '@ember/object/mixin';
import { camelize } from '@ember/string';

export default Mixin.create({
  ensureTestHelperExists() {
    this._ensureExists('tests/test-helper.js', 'test-helper');
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
    let camelizedName = camelize(name);
    camelizedName = setCharAt(camelizedName, 0, name[0].toUpperCase());
    return { filePath, name, camelizedName };
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
      moduleName: name,
      friendlyTestDescription: 'TODO: put something here',
      routePathName: name,
      controllerPathName: name,
      servicePathName: name,
    });

    if (this.isPathInvalid(blueprint, filePath)) {
      return;
    }
    this.createFile(filePath, fileProperties);
  },

  createIntegrationTestFile(type) {
    this.ensureTestHelperExists();
    const blueprint = type + '-test';
    const { filePath, camelizedName } = this.calculateFileVarsForTests(blueprint);

    let openComponent = descriptor => `<${descriptor}>`;
    let closeComponent = descriptor => `</${descriptor}>`;
    let selfCloseComponent = descriptor => `<${descriptor} />`;
    let hbsImportStatement = `import hbs from 'htmlbars-inline-precomipile';`;

    const fileProperties = this.emberCli.buildProperties(blueprint, {
      testType: 'integration',
      componentName: camelizedName,
      friendlyTestDescription: 'TODO: put something here',
      openComponent,
      closeComponent,
      selfCloseComponent,
      hbsImportStatement
    });

    if (this.isPathInvalid(blueprint, filePath)) {
      return;
    }
    this.createFile(filePath, fileProperties);
  },

  createAcceptanceTestFile() {
    this.ensureTestHelperExists();
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

function setCharAt(str, index, char) {
  if(index > str.length-1) return str;
  return str.substr(0,index) + char + str.substr(index+1);
}
