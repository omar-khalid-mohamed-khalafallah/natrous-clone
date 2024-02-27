const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // fs.readFile("text.txt","utf-8", (err, data) => {
  //     if(err) console.log(err);
  //     else res.end(data);
  // })
  // SOl #2
  // const readable = fs.createReadStream("tet.txt");
  // readable.on("data",chunk =>{
  //     res.write(chunk);
  // })
  // readable.on("end",()=>{
  //     res.end()
  // })
  // readable.on("error", err => {
  //     res.end("File Not Found");
  // })
  // Sol #3
  const readable = fs.createReadStream('text.txt');
  readable.on('error', () => {
    res.end('FILE NOT FOUND');
  });
  readable.pipe(res);
});

server.listen(3001, '127.0.0.1', () => {
  console.log('server created');
});
