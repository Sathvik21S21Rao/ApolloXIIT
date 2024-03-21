FROM python:3.9-slim

#
WORKDIR /app

COPY . /app

RUN pip install -r requirements.txt \
    pdf2image \
    google-cloud-translate==2.0.1 \
    google-cloud-vision \
    google-generativeai \
    google-cloud-aiplatform


CMD ["python3", "main.py"]