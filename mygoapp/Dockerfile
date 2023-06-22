FROM golang:1.20

WORKDIR /app

COPY . .

WORKDIR /app/dhmessagesapi

RUN go mod tidy

CMD [ "go", "test" ]