"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//
var fs = require('fs');
var logger = require('morgan');
var sqlite3 = require('sqlite3');
var dbfileName = "./app1.sqlite";
const libUtil_1 = require("./include/libUtil");
/********************************
* CsvImport class
*********************************/
class CsvImport {
    /********************************
    *
    *********************************/
    constructor(theName) {
        this.csv_fname = theName;
    }
    /********************************
    *
    *********************************/
    insert_db(db, item) {
        let sql = `
        INSERT INTO mdats (mdate, hnum, lnum, up_date) VALUES
        (date('${item.date}'), ?, ?, CURRENT_TIMESTAMP)
        `;
        //console.log( sql )
        let stmt = db.prepare(sql);
        stmt.run(item.hnum, item.lnum);
        stmt.finalize();
        db.close();
    }
    /********************************
    *
    *********************************/
    proc_arr_check(items) {
        let self = this;
        items.forEach(function (item) {
            let date = item[0];
            if (date.length > 0) {
                let util = new libUtil_1.libUtil("");
                let dateObj = util.convert_str2date(date);
                let dateStr = util.convert_date2yymmdd(dateObj);
                //console.log( dateStr );
                var hnum = item[1];
                var lnum = item[2];
                var arr = {
                    "date": dateStr,
                    "hnum": hnum,
                    "lnum": lnum,
                };
                let db = new sqlite3.Database(dbfileName);
                self.insert_db(db, arr);
            }
        });
    }
    /********************************
    *
    *********************************/
    read_csvFile() {
        var items = [];
        var rs = fs.createReadStream(this.csv_fname);
        var readline = require('readline');
        var rl = readline.createInterface(rs, {});
        var i = 0;
        let self = this;
        rl.on('line', function (line) {
            if (i > 0) {
                if (line.length > 0) {
                    let col = line.split(",");
                    //console.log( col.length );
                    if (col.length >= 3) {
                        items.push(col);
                    }
                }
            }
            i += 1;
        })
            .on('close', function () {
            self.proc_arr_check(items);
        });
    }
}
/********************************
* main
*********************************/
let csv = new CsvImport("./dat/import.csv");
csv.read_csvFile();
