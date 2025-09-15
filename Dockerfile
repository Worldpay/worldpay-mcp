FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --production
COPY ./dist /app

EXPOSE 3001

# Set environment variables (override in docker run or compose as needed)
# ENV WORLDPAY_USERNAME=iZ2qwadFYIavikAm
# ENV WORLDPAY_PASSWORD=xD79xpgUkGErn7v6dtXWuGVZFcCFweydMoFprIeeriot5G1OcrcsOsLMsu2o0Y73
# ENV WORLDPAY_URL=https://try.access.worldpay.com

CMD ["node", "server-http.js"]
