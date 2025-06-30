fetch("http://localhost:8080/proxy/data?backend=http%3A%2F%2Flocalhost%3A5300%2F&requestId=7c03fe4d-dfdc-4492-bcdd-6ab3f32ec324")
  .then(res => res.json())
  .then(data => document.body.innerHTML = "<h1>" + data.msg + "</h1>")
  .catch(err => document.body.innerHTML = "<pre style='color:red'>" + err + "</pre>");