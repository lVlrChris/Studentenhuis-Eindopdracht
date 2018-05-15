
const express = require('express');
const app = express();

let maaltijd_routes = require('./routes/maaltijd_routes');
let studenten_routes = require('./routes/studentenHuis_routes');
let port = process.env.PORT || 3000;


app.use(maaltijd_routes);
app.use(studenten_routes);





app.use('/api', function (request, response) {
	response.json({
		"msg": "Welkom"
	})
})

app.use('*', function(req, res, next){
    console.log('The super endpoint was called');
    let message = {
        'error: ' : 'deze endpoint bestaat niet'
    };
    next(message);
});

app.listen(port, function(){
    console.log(`Server app is listening on port: ${port}`);
});






