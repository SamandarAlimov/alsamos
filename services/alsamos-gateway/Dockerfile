FROM golang:1.23-alpine AS build
WORKDIR /src
COPY go.mod ./
COPY main.go ./
RUN go mod tidy && CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /out/alsamos-gateway .

FROM alpine:3.20
RUN adduser -D -H -u 10001 app
USER app
COPY --from=build /out/alsamos-gateway /alsamos-gateway
EXPOSE 8080
ENTRYPOINT ["/alsamos-gateway"]
