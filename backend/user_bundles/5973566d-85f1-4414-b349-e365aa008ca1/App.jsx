fetch("http://localhost:8080/proxy/data?backend=http%3A%2F%2Flocalhost%3A5309%2F&requestId=ddd20cb7-6623-420a-ad42-557260f5d7c3")
  .then(res => res.json())
  .then(data => document.body.innerHTML = "<h1>" + data.msg + "</h1>")
  .catch(err => document.body.innerHTML = "<pre style='color:red'>" + err + "</pre>");