"use strict";
//
var fs = require('fs');
var sqlite3 = require('sqlite3');
var dbfileName = "./app1.sqlite";
/********************************
*
*********************************/
function write_csvFile(out_fname) {
    var text = "date,H,L,\n";
    var db = new sqlite3.Database(dbfileName);
    var sql = "SELECT id, hnum ,lnum ,date(mdate, '+9 hours') as mdate FROM mdats order by mdate";
    db.serialize(function () {
        db.all(sql, function (err, rows) {
            rows.forEach(function (item) {
                var hnum = item.hnum;
                var lnum = item.lnum;
                var date = item.mdate;
                text += date + "," + hnum + "," + lnum + "\n";
            });
            console.log(text);
            try {
                fs.writeFileSync(out_fname, text);
                console.log('write end');
            }
            catch (e) {
                console.log(e);
            }
        });
    });
    db.close();
}
/********************************
* main
*********************************/
write_csvFile("dat/outout.csv");
