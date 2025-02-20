FROM oven/bun:latest
WORKDIR /app
COPY bun.lock package.json ./
RUN bun install
#will specifiy path to build file later
COPY . .
#temp run command
CMD bun dev 
