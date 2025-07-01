fetch("http://127.0.0.1:8080/proxy/data?backend=http%3A%2F%2Flocalhost%3A5000&requestId=b8b29df9-2880-46e7-a10f-a889851668f7")
  .then(res => res.json())
  .then(data => document.body.innerHTML = "<h1>" + data.msg + "</h1>")
  .catch(err => document.body.innerHTML = "<pre style='color:red'>" + err + "</pre>");