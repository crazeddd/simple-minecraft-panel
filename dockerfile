FROM oven/bun:canary-alpine

ADD api .

ADD client .

RUN <<EOF
cd api 
bun i
bun build
EOF

RUN <<EOF
cd client 
bun i
bun build
EOF

#WIP