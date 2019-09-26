"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//
var fs = require('fs');
var logger = require('morgan');
var sqlite3 = require('sqlite3');
var dbfileName = "./app1.sqlite";
const libUtil_1 = require("./include/libUtil");
/********************************
*
*********************************/
function insert_db(db, item) {
    let sql = `INSERT INTO mdats (mdate, hnum, lnum, up_date) VALUES
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
function proc_arr_check(items) {
    items.forEach(function (item) {
        let date = item[0];
        //console.log( date.length );
        if (date.length > 0) {
            let util = new libUtil_1.libUtil("");
            let dateObj = util.convert_str2date(date);
            let dateStr = util.convert_date2yymmdd(dateObj);
            //console.log( dateObj );
            var hnum = item[1];
            var lnum = item[2];
            var arr = {
                "date": dateStr,
                "hnum": hnum,
                "lnum": lnum,
            };
            let db = new sqlite3.Database(dbfileName);
            insert_db(db, arr);
        }
    });
}
/********************************
*
*********************************/
function read_csvFile(input_file) {
    var rs = fs.createReadStream(input_file);
    var readline = require('readline');
    var rl = readline.createInterface(rs, {});
    var items = [];
    var i = 0;
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
        proc_arr_check(items);
    });
}
/********************************
* main
*********************************/
read_csvFile("./dat/import.csv");
