const server = require('./api/server');

const port = 5000;

// START YOUR SERVER HERE
server.listen(port, () => { // only one program can use 5000 at a time
    //success
    console.log('listening on port 5000! Yaaaaaas!')
})
