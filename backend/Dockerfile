# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy file package để cài thư viện trước (tận dụng cache)
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ code vào
COPY . .

# Mở port 5000 (hoặc port bạn dùng trong server.js)
EXPOSE 5000

# Correct syntax with comma
CMD ["npm", "start"]
