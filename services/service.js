const sql = require("../db_connection.js");

class Service {
    constructor(model, table) {
        this.model = model
        this.table = table
    }

    create(modelInstance, callback) {
        sql.query(`INSERT INTO ${this.table} SET ?`, modelInstance, (err, res) => {
            if (err) {
                // console.log("error: ", err);
                callback(err, null);
                return;
            }

            const docs = { id: res.id, ...modelInstance }
            // console.log(`Created element in ${this.table}: `, docs);
            callback(null, docs);
        });
    }


    getElement(id, callback) {
        sql.query(`SELECT * FROM ${this.table} WHERE id = ${id}`, (err, res) => {
            if (err) {
                console.log("error: ", err);
                callback(err, null);
                return;
            }

            if (res.length) {
                console.log("found element: ", res[0]);
                callback(null, res[0]);
                return;
            }

            console.log(err);
            // not found element with the id
            callback({ kind: "not_found" }, null);
        });
    }


    getAll(callback) {
        sql.query(`SELECT * FROM ${this.table}`, (err, res) => {
            if (err) {
                console.log("error: ", err);
                callback(null, err);
                return;
            }

            console.log("Elements: ", res);
            callback(null, res);
        });
    }


    update(id, modelInstance, callback) {
        const fields = Object.keys(modelInstance);
        const values = Object.values(modelInstance);
        let query_string = "";

        for (const field of fields)
            query_string += `${field} = ?, `

        // query_string = query_string.substring(0, query_string.length - 1)

        sql.query(
            `UPDATE ${this.table} SET ${query_string} updated_at = NOW() WHERE id = ?`,
            [...values, id],
            (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    callback(err, null);
                    return;
                }

                if (res.affectedRows == 0) {
                    // not found element with the id
                    callback({ kind: "not_found" }, null);
                    return;
                }

                console.log("updated element: ", { id: id, ...modelInstance });
                callback(null, { id: id, ...modelInstance });
            }
        );
    }


    remove(id, callback) {
        // sql.query(`DELETE FROM ${this.table} WHERE id = ?`, id, (err, res) => {
        //     if (err) {
        //         console.log("error: ", err);
        //         callback(null, err);
        //         return;
        //     }

        //     if (res.affectedRows == 0) {
        //         // not found element with the id
        //         callback({ kind: "not_found" }, null);
        //         return;
        //     }

        //     console.log("deleted element with id: ", id);
        //     callback(null, res);
        // });

        sql.query(
            `UPDATE ${this.table} SET is_delete = 1 WHERE id = ${id}`,
            (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    callback(err, null);
                    return;
                }

                if (res.affectedRows == 0) {
                    callback({ kind: "not_found" }, null);
                    return;
                }

                console.log('deleted');
                callback(null, { message: id });
            }
        );
    }


    purge(callback) {
        // sql.query(`DELETE FROM ${this.table}`, (err, res) => {
        //     if (err) {
        //         console.log("error: ", err);
        //         callback(null, err);
        //         return;
        //     }

        //     console.log(`deleted ${res.affectedRows}`);
        //     callback(null, res);
        // });

        sql.query(
            `UPDATE ${this.table} SET is_delete = 1`,
            (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    callback(err, null);
                    return;
                }

                console.log('deleted');
                callback(null, { message: 'deleted' });
            }
        );
    }
}


module.exports = Service;