# Use a base image with Python installed
FROM python:3.11-slim

# Set working directory inside the container
WORKDIR /app

# Copy the app code from host to the container
COPY . .


RUN pip install -r requirements.txt

# Start the Flask app
CMD ["python", "app.py"]
