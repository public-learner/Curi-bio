interface DatabaseInterface {
    [key: string]: object
}

const database: DatabaseInterface = {
  "default": {
    dialect: "sqlite",
    storage: "./db/database.sqlite"
  },
  "development": {
    dialect: "sqlite",
    storage: "../db/database.sqlite"
  },
  "test": {
    dialect: "sqlite",
    storage: ":memory"
  },
  "production": {
    dialect: "sqlite",
    storage: "../db/database.sqlite"
  }
};

export default database;