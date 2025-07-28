#!/bin/bash
echo "Starting Backend on localhost:8001..."
cd /app/backend
mvn clean install -DskipTests
mvn spring-boot:run