// Taken from https://github.com/travis-ci/travis-web/pull/1173/files
export function removeInternalModels(store, type, id) {
  let recordMap = store._internalModelsFor(type);
  let internalModel = recordMap.get(id);
  if (internalModel) {
    recordMap.remove(internalModel, id);
  }
}

// Taken from https://gist.github.com/runspired/96618af26fb1c687a74eb30bf15e58b6/
export function pushDeletion(store, type, id) {
  let record = store.peekRecord(type, id);

  if (record !== null) {
    let relationships = {};
    let hasRelationships = false;

    record.eachRelationship((name, { kind }) => {
      hasRelationships = true;
      relationships[name] = {
        data: kind === 'hasMany' ? [] : null
      };
    });

    if (hasRelationships && !record.get('isDeleted')) {
      store.push({
        data: {
          type,
          id,
          relationships
        }
      });
    }

    record.unloadRecord();

    removeInternalModels(store, type, id);
  }
}

export function pushDeleteAll(store, type) {
  let records = store.peekAll(type);
  records.forEach(record => pushDeletion(store, type, record.get('id')));
}
