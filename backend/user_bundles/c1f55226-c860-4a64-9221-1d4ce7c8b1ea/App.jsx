fetch("http://localhost:8080/proxy/data?backend=http%3A%2F%2Flocalhost%3A5300%2F&requestId=c4b7be05-c0dc-4254-bfc4-a4daa672c324")
  .then(res => res.json())
  .then(data => document.body.innerHTML = "<h1>" + data.msg + "</h1>")
  .catch(err => document.body.innerHTML = "<pre style='color:red'>" + err + "</pre>");