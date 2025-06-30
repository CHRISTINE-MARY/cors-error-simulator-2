# Use a base image with Python installed
FROM python:3.11-slim

# Set working directory inside the container
WORKDIR /app

# Copy the app code from host to the container
COPY . .

# Install Flask and flask-cors
RUN pip install flask flask-cors

# Start the Flask app
CMD ["python", "app.py"]
