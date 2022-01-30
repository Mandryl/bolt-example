const nedb = require("nedb");
const db = {};
const path = require("path");

module.exports.init = async () => {
  const tables = require("./config.json").table;
  return Promise.all(tables.map((name) => insertInitialData(name)));
};

const insertInitialData = (tableName) => {
  db[tableName] = new nedb();
  const data = require(path.join(__dirname, "initialData", tableName));
  data.forEach((d) => {
    db[tableName].insert(d);
  });
};

module.exports.getDB = (tableName) => {
  if (tableName) return db[tableName];
  else return db;
};

module.exports.insertTo = async (tableName, doc) => {
  if (tableName || db[tableName] === void 0) {
    return new Promise((resolve, reject) => {
      db[tableName].insert(doc, (error, doc) => {
        if (error) reject(error);
        else resolve(doc);
      });
    });
  } else {
    return null;
  }
};

module.exports.findFrom = async (tableName, query) => {
  if (tableName || db[tableName] === void 0) {
    return new Promise((resolve, reject) => {
      db[tableName].find(query, (error, docs) => {
        if (error) reject(error);
        else resolve(docs);
      });
    });
  } else {
    return null;
  }
};

module.exports.updateTo = async (tableName, query, update) => {
  if (tableName || db[tableName] === void 0) {
    return new Promise((resolve, reject) => {
      db[tableName].update(query, update, (error, numAffected) => {
        if (error) reject(error);
        else resolve(numAffected);
      });
    });
  } else {
    return null;
  }
};

module.exports.removeFrom = async (tableName, query) => {
  if (tableName || db[tableName] === void 0) {
    return new Promise((resolve, reject) => {
      db[tableName].remove(query, (error, numRemoved) => {
        if (error) reject(error);
        else resolve(numRemoved);
      });
    });
  } else {
    return null;
  }
};

module.exports.settingOf = (channelID) => {
  if (channelID) {
    return {
      set: async (item) => {
        return new Promise((resolve, reject) => {
          const updateDoc = {...item};
          updateDoc.channel_id = channelID;

          db.setting.update(
            { channel_id: channelID },
            { $set: updateDoc },
            { upsert: true,
              returnUpdatedDocs: true },
            (error, numAffected, affectedDocuments) => {
              if (error) reject(error);
              else resolve(affectedDocuments);
            }
          );
        });
      },
      setAll: async (docs) => {
        return new Promise((resolve, reject) => {
          const updateDoc = {...docs};
          updateDoc.channel_id = channelID;

          db.setting.update(
            { channel_id: channelID },
            updateDoc,
            { 
              upsert: true,
              returnUpdatedDocs: true 
            },
            (error, numAffected, affectedDocuments) => {
              if (error) reject(error);
              else resolve(affectedDocuments);
            }
          );
        });
      },
      get: async (item) => {
        return new Promise((resolve, reject) => {
          db.setting.findOne({ channel_id: channelID }, (error, doc) => {
            if (error) reject(error);
            else resolve(doc[item]);
          });
        });
      },
      getAll: async () => {
        return new Promise((resolve, reject) => {
          db.setting.findOne({ channel_id: channelID }, (error, doc) => {
            if (error) reject(error);
            else resolve(doc);
          });
        });
      },
    };
  } else {
    return null;
  }
};
