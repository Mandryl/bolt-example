const NeDB = require("nedb");
const db = {};
const path = require("path");

module.exports.init = async () => {
  const tables = require("./config.json").table;
  return Promise.all(tables.map((name) => insertInitialData(name)));
};

const insertInitialData = (tableName) => {
  db[tableName] = new NeDB();
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

module.exports.settingOf = async (itemName) =>{
    if (itemName) {
        return new Promise((resolve, reject) => {
            db.setting.find({item_name:itemName},(error, docs)=>{
                if(error) reject(error);
                else resolve(docs[0].value);
            });
        });
    }else{
        return null;
    }
}
