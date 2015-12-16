 //Dependencies
    var cluster = require('cluster');
    
    if(cluster.isMaster) {
        var numWorkers = require('os').cpus().length;
    
        console.log('Master cluster setting up ' + numWorkers + ' workers...');
    
        for(var i = 0; i < numWorkers; i++) {
            cluster.fork();
        }
    
        cluster.on('online', function(worker) {
            console.log('Worker ' + worker.process.pid + ' is online');
        });
    
        cluster.on('exit', function(worker, code, signal) {
            console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
            console.log('Starting a new worker');
            cluster.fork();
        });
    } else {   
    var bodyParser = require('body-parser');
    var config     = require('./config'); // get our config file
    var morgan     = require('morgan');   
    var mongoose   = require('mongoose');

   //MongoDB
    mongoose.connect(config.database);  
    //Express
    var app	=require('express')();
    
    app.set('port', process.env.PORT || 3000);
    
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
    
    // use morgan to log requests to the console
    app.use(morgan('dev'));
    
    app.use('*', function(req, res, next){        
        console.log(' ACTIVE PROCESS ID :: '+ process.pid);      
        next();
    });
    // Account routes
    app.use('/account', require('./routes/account'));
    
    // Secured Routes
    app.use('/api', require('./routes/api'));
    
    //Start server
    app.listen(app.get('port'), function(){
        console.log('Api is running on port '+ app.get('port')+ ' with processid: '+process.pid );
    });
 }