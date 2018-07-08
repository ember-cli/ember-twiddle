import Controller from '@ember/controller';
import config from '../config/environment';

export default Controller.extend({
  init() {
    this._super(...arguments);

    let closeAfter = config.environment === 'test' ? null : 5000;
    
    this.set('closeAfter', closeAfter);
  }
});
