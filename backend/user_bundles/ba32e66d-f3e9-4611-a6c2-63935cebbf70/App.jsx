fetch("http://localhost:8080/proxy/daa?backend=http%3A%2F%2Flocalhost%3A5300%2F&requestId=e015fce0-8162-46a3-a2a8-ce4816d41a5e")
  .then(res => res.json())
  .then(data => document.body.innerHTML = "<h1>" + data.msg + "</h1>")
  .catch(err => document.body.innerHTML = "<pre style='color:red'>" + err + "</pre>");