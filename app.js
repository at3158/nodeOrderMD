
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



app.get('/', routes.index);
app.get('/order', order.list);
app.get('/order/add', order.add);
app.post('/order/add', order.save);
app.get('/order/delete/:OrderNo', order.delete_order);
app.get('/order/edit/:OrderNo', order.edit);
app.post('/order/edit/:OrderNo',order.save_edit);


app.use(app.router);

http.createServer(app).listen(app.get('port'), function(){
  console.log(moment().format('YYYYMMDD'));
  console.log('Express server listening on port ' + app.get('port'));
});
