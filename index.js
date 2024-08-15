const http = require('http')
const fs = require("fs")
const url = require("url")

const port = process.env.port || 8000

// Create a local server to receive data from
const server = http.createServer((req, res) => {

  if(req.url ==="/favicon.ico") return res.end();
  const myurl = url.parse(req.url,true);
  console.log(myurl)

  log = `${Date.now()} :path - ${req.url} : New Request Recieved : Method : ${req.method}\n`;
  
  fs.appendFile("log.txt", log, (err, data)=>{
    switch(myurl.pathname)
    {
      case "/" : 
      res.end("HomePage")
      break

      case "/about" :
        const username = myurl.query.name
        res.end(`Hello , ${username} from Server.`)
        break

      case "/signup":
        if(req.method === "GET") {
          return res.end("Welcome to sign up!")
        }
        else if(req.method === "POST"){
          // Put data to DB
          return res.end("Data read and processing..");
        }
        else if(req.method === "DELETE"){
          // Query and delete
          return res.end("Successfully Deleted!");
        }else{
          return res.end("You called either PUT or PATCH.");
        }
        break;

      default :
      res.end("404 Unknown Path")
      break
    }
  })
    
  });
  


server.listen(port, ()=>{
    console.log(`Server Started at Port : ${port}`)
})