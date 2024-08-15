const http = require('http')

const port = process.env.port || 8000

// Create a local server to receive data from
const server = http.createServer((req, res) => {
    res.end(req.statusCode)
  });
  


server.listen(port, ()=>{
    console.log(`Server Started at Port : ${port}`)
})