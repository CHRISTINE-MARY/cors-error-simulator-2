fetch("http://localhost:8080/proxy/dta?backend=http%3A%2F%2Flocalhost%3A5553%2F")
  .then(res => res.json())
  .then(data => document.body.innerHTML = "<h1>" + data.msg + "</h1>")
  .catch(err => document.body.innerHTML = "<pre style='color:red'>" + err + "</pre>");