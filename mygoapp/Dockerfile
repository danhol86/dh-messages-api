FROM golang:1.16

WORKDIR /app

COPY . .

RUN go mod download

CMD ["./mygoapp/github.com/danhol86/main"]