fetch("http://localhost:8080/proxy/data?backend=http%3A%2F%2Flocalhost%3A5533%2F&requestId=4d63a914-84da-44e3-97b0-b3535f167b05")
  .then(res => res.json())
  .then(data => document.body.innerHTML = "<h1>" + data.msg + "</h1>")
  .catch(err => document.body.innerHTML = "<pre style='color:red'>" + err + "</pre>");