self.deprecationWorkflow = self.deprecationWorkflow || {};
self.deprecationWorkflow.config = {
  workflow: [
    { handler: "silence", matchId: "deprecate-router-events" },
    { handler: "silence", matchId: "ember-runtime.deprecate-copy-copyable" },
    { handler: "silence", matchId: "ember-polyfills.deprecate-merge" },
    { handler: "silence", matchId: "ember-data:method-calls-on-destroyed-store" },
    { handler: "silence", matchId: "ember-component.send-action" },
    { handler: "silence", matchId: "ember-views.curly-components.jquery-element" },
    { handler: "silence", matchId: "ember-test-helpers.rendering-context.jquery-element" }
  ]
};
