import ApplicationSerializer from "./application";

export default ApplicationSerializer.extend({
  keyForRelationship() {
    return "history";
  }
});
