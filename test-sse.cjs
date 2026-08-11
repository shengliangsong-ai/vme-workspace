const http = require('http');

http.get('http://localhost:3000/api/jobs/orchestrate?command=test', (res) => {
  console.log('Status Code:', res.statusCode);
  res.on('data', (chunk) => {
    console.log('Data:', chunk.toString());
  });
  res.on('end', () => {
    console.log('End');
  });
});
