/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var moment = require('moment');

//load order route
var order = require('./routes/order'); 
var app = express();

var connection  = require('express-myconnection'); 
var mysql = require('mysql');

// all environments
app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/*------------------------------------------
    connection peer, register as middleware
    type koneksi : single,pool and request 
    Set db
-------------------------------------------*/

app.use(    
    connection(mysql,{        
        host: '127.0.0.1',
        user: 'root',
        password : 'root',
        port : 3306, //port mysql
        database:'nodeDB'
    },'pool') //or single
);


var db = mysql.createConnection({
	  host     : '127.0.0.1',
	  user     : 'user',
	  password : 'user',
	  database : 'nodeDB'
	});




app.get('/', routes.index);
app.get('/order', order.list);
app.get('/order/add', order.add);
app.post('/order/add', order.save);
app.get('/order/delete/:OrderNo', order.delete_order);
app.get('/order/edit/:OrderNo', order.edit);
app.post('/order/edit/:OrderNo',order.save_edit);

app.get('/GET', order.GET);
app.get('/order/GET', order.GET);

app.use(app.router);




//grid event
app.get('/data', function(req, res){
	db.query("SELECT * FROM books", function(err, rows){
		if (err) console.log(err);		
		res.send(rows);
	});
});

app.post('/data', function(req, res){
	var data = req.body;
	var mode = data["!nativeeditor_status"];
	var sid = data.gr_id;
	var tid = sid;

	var id = data.id;
	var sales  = data.sales;
	var author = data.author;
	var title  = data.title;
	var price  = data.price;
	var link  =  data.link;

	function update_response(err, result){
		if (err){
			console.log(err);
			mode = "error";
		}

		else if (mode == "inserted")
			tid = result.insertId;

		res.setHeader("Content-Type","text/xml");
		res.send("<data><action type='"+mode+"' sid='"+sid+"' tid='"+tid+"'/></data>");
	}

	if (mode == "updated")
		db.query("UPDATE books SET sales = ?, author = ?, title = ?, price = ? WHERE id = ?",
			[sales, author, title, price, sid],
			update_response);
	else if (mode == "inserted")
		db.query("INSERT INTO books(sales, author, title, price,link) VALUES (?,?,?,?,?)",
			[sales, author, title, price,link],
			update_response);
	else if (mode == "deleted")
		db.query("DELETE FROM books WHERE id = ?", [sid], update_response);
	else
		res.send("Not supported operation");
});

http.createServer(app).listen(app.get('port'), function(){
  console.log(moment().format('YYYYMMDD'));
  console.log('Express server listening on port ' + app.get('port'));
});
