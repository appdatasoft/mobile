import SQLite from "react-native-sqlite-storage";

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "Barcode.db";
const database_version = "1.0";
const database_displayname = "SQLite Barcode Database";
const database_size = 200000;

export default class Database {
    initDB() {
        let db;
        return new Promise((resolve) => {
            console.log("Plugin integrity check ...");
            SQLite.echoTest()
                .then(() => {
                    console.log("Integrity check passed ...");
                    console.log("Opening database ...");
                    SQLite.openDatabase(
                        database_name,
                        database_version,
                        database_displayname,
                        database_size
                    )
                        .then(DB => {
                            db = DB;
                            console.log("Database OPEN");
                            db.executeSql('SELECT 1 FROM Barcode LIMIT 1').then(() => {
                                console.log("Database is ready ... executing query ...");
                            }).catch((error) => {
                                console.log("Received error: ", error);
                                console.log("Database not yet ready ... populating data");
                                db.transaction((tx) => {
                                    tx.executeSql('CREATE TABLE IF NOT EXISTS Barcode (id, code, name, price)');
                                }).then(() => {
                                    console.log("Table created successfully");
                                }).catch(error => {
                                    console.log(error);
                                });
                            });
                            resolve(db);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                })
                .catch(error => {
                    console.log("echoTest failed - plugin not functional");
                });
        });
    };


    closeDatabase(db) {
        if (db) {
          console.log("Closing DB");
          db.close()
            .then(status => {
              console.log("Database CLOSED");
            })
            .catch(error => {
              this.errorCB(error);
            });
        } else {
          console.log("Database was not OPENED");
        }
      };

      listBarcode() {
        return new Promise((resolve) => {
          const barcodes = [];
          this.initDB().then((db) => {
            db.transaction((tx) => {
              tx.executeSql('SELECT p.id, p.code, p.name, p.price FROM Barcode p', []).then(([tx,results]) => {
                console.log("Query completed");
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                  let row = results.rows.item(i);
                  console.log(`Barcode ID: ${row.id}, Barcode Name: ${row.name}`)
                  const { id, code, name, price } = row;
                  barcodes.push({
                    id, code, name, price
                  });
                }
                console.log(barcodes);
                resolve(barcodes);
              });
            }).then((result) => {
              // this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
            });
          }).catch((err) => {
            console.log(err);
          });
        });  
      }

      addBarcode(barcode) {
        return new Promise((resolve) => {
          this.initDB().then((db) => {
            db.transaction((tx) => {
              tx.executeSql('INSERT INTO Barcode VALUES (?, ?, ?, ?)', [barcode.id, barcode.code, barcode.name, barcode.price]).then(([tx, results]) => {
                resolve(results);
              });
            }).then((result) => {
              // this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
            });
          }).catch((err) => {
            console.log(err);
          });
        });  
      }

      deleteBarcode(id) {
        return new Promise((resolve) => {
          this.initDB().then((db) => {
            db.transaction((tx) => {
              tx.executeSql('DELETE FROM Barcode WHERE id = ?', [id]).then(([tx, results]) => {
                console.log(results);
                resolve(results);
              });
            }).then((result) => {
              // this.closeDatabase(db);
              console.log('qwert')
            }).catch((err) => {
              console.log(err);
            });
          }).catch((err) => {
            console.log(err);
          });
        });  
      }
      barcodeById(id) {
        console.log(id);
        return new Promise((resolve) => {
          this.initDB().then((db) => {
            db.transaction((tx) => {
              tx.executeSql('SELECT * FROM Barcode WHERE id = ?', [id]).then(([tx,results]) => {
                console.log(results);
                if(results.rows.length > 0) {
                  let row = results.rows.item(0);
                  resolve(row);
                }
              });
            }).then((result) => {
              // this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
            });
          }).catch((err) => {
            console.log(err);
          });
        });  
      }
}