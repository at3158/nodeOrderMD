
/**
 * Module dependencies.
 */
var moment = require('moment');

/*
 Set Paras
 */
var dtnow=moment().format('YYYYMMDD');
/*
 * GET users listing.
 */

exports.list = function(req, res){
  req.getConnection(function(err,connection){       
        var query = connection.query('SELECT * FROM TBOrderM',function(err,rows)
        {            
            if(err)
                console.log("Error Selecting : %s ",err );     
            res.render('order',{page_title:"order - Node.js",data:rows});   
         });         
         //console.log(query.sql);
    });
  
};

exports.add = function(req, res){
  res.render('add_order',{page_title:"Add order - Node.js",datenow:dtnow});
};

exports.edit = function(req, res){    
    var OrderNo = req.params.OrderNo;    
    //var OrderNo='12312';
    req.getConnection(function(err,connection){       
        var query = connection.query('SELECT * FROM TBOrderM WHERE OrderNo = ?',[OrderNo],function(err,rows)
        {            
            if(err)
                console.log("Error Selecting : %s ",err );     
            res.render('edit_order',{page_title:"Edit order - Node.js",data:rows});    
         });         
         //console.log(query.sql);
    }); 
};

/*Save the order*/
exports.save = function(req,res){    
    var input = JSON.parse(JSON.stringify(req.body));    
    req.getConnection(function (err, connection) {        
        var data = {            
        	OrderNo    : input.OrderNo,
        	Orderdate : input.Orderdate,
        	TotalMoney   : input.TotalMoney,
        	Remark   : input.Remark
        };
        
        var query = connection.query("INSERT INTO TBOrderM set ? ",data, function(err, rows)
        {  
          if (err)
              console.log("Error inserting : %s ",err );         
          res.redirect('/order');          
        });        
       // console.log(query.sql); get raw query    
    });
};

exports.save_edit = function(req,res){    
    var input = JSON.parse(JSON.stringify(req.body));
    var OrderNo = req.params.OrderNo;    
    req.getConnection(function (err, connection) {        
        var data = {            
            	OrderNo    : input.OrderNo,
            	Orderdate : input.Orderdate,
            	TotalMoney   : input.TotalMoney  ,
            	Remark   : input.Remark
        };
        
        connection.query("UPDATE TBOrderM set ? WHERE OrderNo = ? ",[data,OrderNo], function(err, rows)
        {  
          if (err)
              console.log("Error Updating : %s ",err );         
          res.redirect('/order');          
        });    
    });
};


exports.delete_order = function(req,res){          
     var OrderNo = req.params.OrderNo;    
     req.getConnection(function (err, connection) {        
        connection.query("DELETE FROM TBOrderM  WHERE OrderNo = ? ",[OrderNo], function(err, rows)
        {            
             if(err)
                 console.log("Error deleting : %s ",err );            
             res.redirect('/order');             
        });        
     });
};


