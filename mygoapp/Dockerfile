FROM golang:1.16

WORKDIR /app

COPY . .

RUN go mod download

CMD ["./github.com/danhol86/dhmessagesapi/main"]