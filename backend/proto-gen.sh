#!/bin/bash

pnpm proto-loader-gen-types --grpcLib=@grpc/grpc-js --outDir=src/proto/ src/proto/*.proto