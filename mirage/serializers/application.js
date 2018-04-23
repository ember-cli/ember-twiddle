import { RestSerializer } from 'ember-cli-mirage';

export default RestSerializer.extend({
    root: false,
    embed: true
});
