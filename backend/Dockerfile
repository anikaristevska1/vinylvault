# ===== Stage 1: Build the application =====
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /build

# Install Maven (Alpine doesn't include it by default)
RUN apk add --no-cache maven

# Copy pom.xml first for better layer caching
COPY pom.xml ./

# Download dependencies (cached unless pom.xml changes)
RUN mvn dependency:go-offline -B

# Copy source code and build the JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# ===== Stage 2: Runtime =====
FROM eclipse-temurin:21-jre-alpine

# Create non-root user for security (best practice)
RUN addgroup -S vinyl && adduser -S vinyl -G vinyl

WORKDIR /app

# Create uploads directory with proper ownership
RUN mkdir -p /app/uploads && chown -R vinyl:vinyl /app

# Copy the JAR from builder stage
COPY --from=builder --chown=vinyl:vinyl /build/target/*.jar app.jar

USER vinyl

EXPOSE 8080

# Health check for container orchestration platforms (Docker/Kubernetes)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

ENTRYPOINT ["java", "-jar", "/app/app.jar"]