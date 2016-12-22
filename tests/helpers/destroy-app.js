import Ember from 'ember';

export default function destroyApp(application) {
  server.shutdown();
  Ember.run(application, 'destroy');
}
