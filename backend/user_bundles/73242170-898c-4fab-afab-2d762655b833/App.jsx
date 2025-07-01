fetch("http://127.0.0.1:8080/proxy/data?backend=http%3A%2F%2Flocalhost%3A5000&requestId=4b13daff-2acf-475a-86f6-e8ec45467fc3")
  .then(res => res.json())
  .then(data => document.body.innerHTML = "<h1>" + data.msg + "</h1>")
  .catch(err => document.body.innerHTML = "<pre style='color:red'>" + err + "</pre>");