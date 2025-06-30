fetch("http://localhost:8080/proxy/data?backend=http%3A%2F%2Flocalhost%3A5849%2F&requestId=9b6fd1c8-2d63-425b-b601-a10786373445")
  .then(res => res.json())
  .then(data => document.body.innerHTML = "<h1>" + data.msg + "</h1>")
  .catch(err => document.body.innerHTML = "<pre style='color:red'>" + err + "</pre>");