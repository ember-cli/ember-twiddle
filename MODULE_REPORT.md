## Module Report
### Unknown Global

**Global**: `Ember.inject`

**Location**: `app\components\versions-menu.js` at line 4

```js
import DropdownSubmenuFixMixin from "../mixins/dropdown-submenu-fix";

const { computed, inject } = Ember;

export default Ember.Component.extend(DropdownSubmenuFixMixin, {
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app\mixins\gist-controller.js` at line 3

```js
import Ember from "ember";

const { inject, run } = Ember;

export default Ember.Mixin.create({
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app\routes\gist-base-route.js` at line 5

```js
const CONFIRM_MSG = "Unsaved changes will be lost. Are you sure?";

const { inject } = Ember;

export default Ember.Route.extend({
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app\routes\gist.js` at line 4

```js
import config from '../config/environment';

const { inject, $, RSVP } = Ember;

const CONFIRM_MSG = "Unsaved changes will be lost.";
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app\components\dummy-app.js` at line 5

```js
import $ from 'jquery';

const { inject } = Ember;

export default Ember.Component.extend(ResizeMixin, {
```

### Unknown Global

**Global**: `Ember.testing`

**Location**: `app\components\dummy-app.js` at line 35

```js
    let supportsSrcDoc = ('srcdoc' in ifrm);

    if (!Ember.testing && supportsSrcDoc) {
      ifrm.sandbox = 'allow-scripts allow-forms allow-modals';
      ifrm.srcdoc = this.get('html');
```

### Unknown Global

**Global**: `Ember.testing`

**Location**: `app\components\dummy-app.js` at line 42

```js
    this.element.appendChild(ifrm);

    if(!supportsSrcDoc && !Ember.testing) {
      ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
      ifrm.document.open();
```

### Unknown Global

**Global**: `Ember.testing`

**Location**: `app\components\dummy-app.js` at line 51

```js
    this.get('app').setCurrentIFrame(ifrm);

    if (Ember.testing) {
      ifrm = ifrm.contentWindow;
      ifrm.document.open();
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app\components\main-gist.js` at line 9

```js
import { keyDown, EKMixin } from 'ember-keyboard';

const { inject, computed, run, on } = Ember;

export default Ember.Component.extend(AppBuilderMixin, ColumnsMixin, FilesMixin, TestFilesMixin, EKMixin, {
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app\components\twiddle-panes.js` at line 3

```js
import Ember from 'ember';

const { inject, run } = Ember;

export default Ember.Component.extend({
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app\adapters\application.js` at line 5

```js
import config from '../config/environment';

const { computed, inject } = Ember;

export default DS.RESTAdapter.extend({
```

### Unknown Global

**Global**: `Ember.testing`

**Location**: `app\services\dependency-resolver.js` at line 7

```js
import compareVersions from 'compare-versions';
import { deprecate } from '@ember/application/deprecations';
const { computed, inject, RSVP, testing } = Ember;

const EMBER_VERSIONS = ['3.8.1', '3.7.3', '3.6.1', '3.5.1', '3.4.3', '3.3.2', '3.2.2', '3.1.4', '3.0.0', '2.18.2', '2.17.2', '2.16.2', '2.15.3', '2.14.1', '2.13.0', '2.12.0'];
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app\services\dependency-resolver.js` at line 7

```js
import compareVersions from 'compare-versions';
import { deprecate } from '@ember/application/deprecations';
const { computed, inject, RSVP, testing } = Ember;

const EMBER_VERSIONS = ['3.8.1', '3.7.3', '3.6.1', '3.5.1', '3.4.3', '3.3.2', '3.2.2', '3.1.4', '3.0.0', '2.18.2', '2.17.2', '2.16.2', '2.15.3', '2.14.1', '2.13.0', '2.12.0'];
```

### Unknown Global

**Global**: `Ember.testing`

**Location**: `app\services\ember-cli.js` at line 11

```js
import { pushDeletion } from 'ember-twiddle/utils/push-deletion';

const { computed, inject, RSVP, run, $, testing } = Ember;
const twiddleAppName = 'twiddle';
const oldTwiddleAppNames = ['demo-app', 'app'];
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app\services\ember-cli.js` at line 11

```js
import { pushDeletion } from 'ember-twiddle/utils/push-deletion';

const { computed, inject, RSVP, run, $, testing } = Ember;
const twiddleAppName = 'twiddle';
const oldTwiddleAppNames = ['demo-app', 'app'];
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app\services\resizeable-columns.js` at line 3

```js
import Ember from "ember";

const { $, inject, run } = Ember;

export default Ember.Service.extend({
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app\services\twiddle-json.js` at line 4

```js
import blueprints from '../lib/blueprints';

const { inject, RSVP } = Ember;

const requiredDependencies = [
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app\torii-adapters\application.js` at line 4

```js
import config from '../config/environment';

const { inject, isBlank, RSVP } = Ember;

export default Ember.Object.extend({  /**
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app\routes\gist\new.js` at line 5

```js
import { pushDeleteAll } from "ember-twiddle/utils/push-deletion";

const { inject, run } = Ember;

export default GistRoute.extend({
```

### Unknown Global

**Global**: `Ember.Test`

**Location**: `tests\acceptance\routing-test.js` at line 5

```js
import moduleForAcceptance from 'ember-twiddle/tests/helpers/module-for-acceptance';

const { Test } = Ember;

moduleForAcceptance('Acceptance | routing', {
```

### Unknown Global

**Global**: `Ember.Test`

**Location**: `tests\helpers\wait-for-unloaded-iframe.js` at line 5

```js
import RSVP from 'rsvp';

const { Test, run } = Ember;

function hasNoIframe() {
```
