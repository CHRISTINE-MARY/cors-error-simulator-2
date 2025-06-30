fetch("http://localhost:8080/proxy/data?backend=http%3A%2F%2Flocalhost%3A5533%2F&requestId=e2bea489-13d8-4874-884e-1c9b7e0fe8ca")
  .then(res => res.json())
  .then(data => document.body.innerHTML = "<h1>" + data.msg + "</h1>")
  .catch(err => document.body.innerHTML = "<pre style='color:red'>" + err + "</pre>");