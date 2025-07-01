fetch("http://127.0.0.1:8080/proxy/data?backend=http%3A%2F%2Flocalhost%3A5000&requestId=dd7f0814-eef2-42d4-a567-6d8a749958bb")
  .then(res => res.json())
  .then(data => document.body.innerHTML = "<h1>" + data.msg + "</h1>")
  .catch(err => document.body.innerHTML = "<pre style='color:red'>" + err + "</pre>");