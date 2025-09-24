FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --production
COPY ./dist /app

EXPOSE 3001

# Set environment variables (override in docker run or compose as needed)
# ENV WORLDPAY_USERNAME=
# ENV WORLDPAY_PASSWORD=
# ENV WORLDPAY_URL=https://try.access.worldpay.com

CMD ["node", "server-http.js"]
