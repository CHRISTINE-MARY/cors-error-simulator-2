fetch("http://127.0.0.1:8080/proxy/data?backend=http%3A%2F%2Flocalhost%3A5000&requestId=18831ba7-5732-4527-bc6f-b842fe26395f")
  .then(res => res.json())
  .then(data => document.body.innerHTML = "<h1>" + data.msg + "</h1>")
  .catch(err => document.body.innerHTML = "<pre style='color:red'>" + err + "</pre>");