fetch("http://localhost:8080/proxy/data?backend=http%3A%2F%2Flocalhost%3A5300%2F&requestId=d17a4c8a-faff-4aad-b1d5-38ce2739e2b4")
  .then(res => res.json())
  .then(data => document.body.innerHTML = "<h1>" + data.msg + "</h1>")
  .catch(err => document.body.innerHTML = "<pre style='color:red'>" + err + "</pre>");