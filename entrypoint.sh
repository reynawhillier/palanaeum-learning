npm install

node ace migration:run

# use await Table.firstOrCreate (
#     { primaryKey: keyinformation },
#     {   other attribute : value,
#         other attribute : value
#     }
# )
node ace db:seed

npm run dev