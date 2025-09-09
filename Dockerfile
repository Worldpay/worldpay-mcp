FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --production
COPY ./dist /app

EXPOSE 3001

# Set environment variables (override in docker run or compose as needed)
# ENV WORLDPAY_USERNAME=your_username
# ENV WORLDPAY_PASSWORD=your_password

CMD ["node", "server-http.js"]
