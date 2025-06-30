fetch("http://localhost:8080/proxy/data?backend=http%3A%2F%2Flocalhost%3A5309%2F&requestId=bc31454a-5265-4f96-92f3-d155137ee19f")
  .then(res => res.json())
  .then(data => document.body.innerHTML = "<h1>" + data.msg + "</h1>")
  .catch(err => document.body.innerHTML = "<pre style='color:red'>" + err + "</pre>");