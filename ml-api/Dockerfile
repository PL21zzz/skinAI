FROM python:3.10-slim

WORKDIR /app

# 1. Cài thư viện hệ thống cần thiết
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 2. CÀI TORCH BẢN CPU (Siêu nhẹ, không treo máy)
RUN pip install --no-cache-dir torch==2.0.1+cpu torchvision==0.15.2+cpu --extra-index-url https://download.pytorch.org/whl/cpu

# 3. Cài các thư viện còn lại
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy code và chạy
COPY . .
EXPOSE 8000
ENV PYTHONPATH=/app
CMD ["python", "app/main.py"]
