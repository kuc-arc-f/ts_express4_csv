import {NextFunction, Request, Response} from "express";
var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3')
var dbfileName = "./app1.sqlite"

/* GET users listing. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
    res.send('respond with a resource-1234');
});
/******************************** 
* 
*********************************/
router.get('/tasks_index', function(req: Request, res: Response, next: NextFunction ) {
    let db = new sqlite3.Database( dbfileName )
    let items:any[] = [];
    db.serialize(function() {
        db.all('SELECT id,title, content FROM tasks order by id desc;', function(err: any, rows:any[] ) {
            rows.forEach( function (item:any[] ) {
                items.push(item  );
//                console.log(item )
            });
            var param = {"docs": items };
            res.json(param);
        });
    });
    db.close();
});
/******************************** 
* 
*********************************/
router.post('/tasks_new', (req: Request, res: Response, next: NextFunction) => {
    let data = req.body
//    console.log(data )
    var db = new sqlite3.Database( dbfileName )
    db.serialize(function() {
        var stmt = db.prepare('INSERT INTO tasks (title, content) VALUES (?, ?)')
        stmt.run(data.title, data.content )
        stmt.finalize()
        res.json(data);
    });
    db.close();
}); 
/******************************** 
* 
*********************************/
router.get('/tasks_show/:id', function(req: Request, res: Response, next: NextFunction) {
    var db = new sqlite3.Database( dbfileName )
    var items = []
    var sql = "SELECT id,title, content FROM tasks where id="+req.params.id
// console.log(sql);
    db.serialize(function() {
        db.all(sql, function(err: any, rows:any[]) {
           var param = {"docs": rows };
            res.json(param);
        });
    });
    db.close();
});
/******************************** 
* 
*********************************/
router.post('/tasks_update', (req: Request, res: Response, next: NextFunction) => {
    let data = req.body
    console.log(req.body )    
    var db = new sqlite3.Database( dbfileName )
    db.serialize(function() {
        var stmt = db.prepare('update tasks set title= ?, content =? where id= ?')
        stmt.run(data.title, data.content ,req.body.id)
        stmt.finalize()
        res.json(data);
    });
    db.close();
});
/******************************** 
* 
*********************************/
router.get('/tasks_delete/:id', function(req: Request, res: Response, next: NextFunction) {
    let  db = new sqlite3.Database( dbfileName )
    db.serialize(function() {
        var stmt = db.prepare('delete from tasks  where id= ?')
        stmt.run(req.params.id )
        stmt.finalize()   
        res.json({id : req.params.id})
    });
    db.close();
});
/******************************** 
* 
*********************************/
router.get('/test1', function(req: Request, res: Response, next: NextFunction ) {
    let db = new sqlite3.Database( dbfileName )
    let items:any[] = [];
    db.serialize(function() {
        db.all('SELECT id, mdate FROM mdats order by id desc;', function(err: any, rows:any[] ) {
            rows.forEach( function (item:any[] ) {
                items.push(item  );
                console.log(item )
            });
            var param = {"docs": items };
            console.log(items.length + " : leghth")
            res.json(param);
        });
    });
    db.close();
});

export {router as apiRouter}
