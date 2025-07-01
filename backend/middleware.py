from flask import Flask, request, Response,jsonify
import requests


request_statuses = {}

def proxy(path):
    backend_url = f"{request.args.get('backend')}/{path}"
    request_id = request.args.get("requestId")
    method = request.method
    headers = {key: value for key, value in request.headers if key.lower() != 'host'}

    try:
        # Forward the request to the actual backend
        backend_response = requests.request(
            method=method,
            url=backend_url,
            headers=headers,
            data=request.get_data(),
            allow_redirects=False,
        )

        cors_missing = not backend_response.headers.get("Access-Control-Allow-Origin")
        is_error_status = backend_response.status_code >= 400

        if cors_missing:

            request_statuses[request_id] = "CORS Error"
            return

        elif is_error_status:
            request_statuses[request_id] = "Other Error"
            return

        else:
            request_statuses[request_id] = "Connection OK"
        

        # Forward valid response
        excluded = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
        response_headers = [(k, v) for k, v in backend_response.headers.items() if k.lower() not in excluded]
        return Response(backend_response.content, backend_response.status_code, response_headers)

    except Exception as e:
        return Response(f"❌ Proxy Error: {str(e)}", status=500)
    


def get_status(request_id):
    print("dfdg",request_statuses.get(request_id))
    return jsonify({"status": request_statuses.get(request_id, "Unknown")})