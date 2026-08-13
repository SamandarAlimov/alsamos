FROM golang:1.26-alpine AS build
WORKDIR /src

# Keep module resolution deterministic and include every Go source file in the gateway.
COPY go.mod go.sum ./
RUN go mod download
COPY *.go ./

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /out/alsamos-gateway .

FROM alpine:3.20
RUN adduser -D -H -u 10001 app
USER app
COPY --from=build /out/alsamos-gateway /alsamos-gateway
EXPOSE 8080
ENTRYPOINT ["/alsamos-gateway"]
