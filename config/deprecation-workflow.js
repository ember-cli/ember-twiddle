self.deprecationWorkflow = self.deprecationWorkflow || {};
self.deprecationWorkflow.config = {
  workflow: [
    { handler: "silence", matchId: "ember-runtime.deprecate-copy-copyable" },
    { handler: "silence", matchId: "ember-data:method-calls-on-destroyed-store" },
    { handler: "silence", matchId: "ember-component.send-action" }
  ]
};
