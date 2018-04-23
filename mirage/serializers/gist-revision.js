import GistSerializer from './gist';

export default GistSerializer.extend({
  include: ['owner', 'files']
});
