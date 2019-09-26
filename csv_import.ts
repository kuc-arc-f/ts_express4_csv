//
var fs = require('fs');
var logger = require('morgan');
var sqlite3 = require('sqlite3')
var dbfileName = "./app1.sqlite"

import { libUtil } from "./include/libUtil";
import { Imdat } from "./include/libData";
import { exists } from 'fs';

/******************************** 
* CsvImport class
*********************************/
class CsvImport{
    csv_fname: string;

    /******************************** 
    *
    *********************************/
    constructor(theName: string) { 
        this.csv_fname = theName; 
    }
    /******************************** 
    *
    *********************************/
    insert_db(db:any ,item : Imdat): void{
        let sql = `
        INSERT INTO mdats (mdate, hnum, lnum, up_date) VALUES
        (date('${ item.date }'), ?, ?, CURRENT_TIMESTAMP)
        `;
    //console.log( sql )
        let stmt = db.prepare(sql )
        stmt.run(
            item.hnum,
            item.lnum
        )
        stmt.finalize()
        db.close()
    }
    /******************************** 
    *
    *********************************/
    public proc_arr_check(items: any[] ){
        let self = this
        items.forEach(function (item: any) {
            let date:string = item[0]
            if(date.length > 0){
                let util = new libUtil("")
                let dateObj = util.convert_str2date( date )
                let dateStr = util.convert_date2yymmdd( dateObj )
//console.log( dateStr );
                var hnum = item[1]
                var lnum = item[2]
                var arr ={
                    "date" : dateStr,
                    "hnum" : hnum,
                    "lnum" : lnum,
                }
                let db = new sqlite3.Database( dbfileName )
                self.insert_db(db, arr)
            }
        });
    }
    /******************************** 
    *
    *********************************/
    public read_csvFile(): void{
        var items:any[] = []
        var rs = fs.createReadStream( this.csv_fname );
        var readline = require('readline');   
        var rl = readline.createInterface(rs, {});
    
        var i = 0;
        let self = this
        rl.on('line', function(line: string) {
            if(i > 0){
                if(line.length > 0){
                let col = line.split(",")
    //console.log( col.length );
                    if(col.length >= 3){
                        items.push( col )
                    }
                }
            }
            i += 1;
        })    
        .on('close', function() {
            self.proc_arr_check(items)
        }); 
    }

}
/******************************** 
* main
*********************************/
let csv = new CsvImport("./dat/import.csv")
csv.read_csvFile()

