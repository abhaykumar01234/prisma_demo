docker-compose up -d

Register server for the first time

- server name should be the service name. In this case `pg_db`

bunx prisma init --datasource-provider postgresql

bunx prisma format
formats the \*.prisma files

bunx prisma migrate dev --name init

bunx prisma generate
