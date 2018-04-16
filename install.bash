#!/bin/bash

#Note that the website will only work if hosted on port 10770

echo "Enter your uTorID for database: "
read name
echo "Enter password for database(your last 5 digit of student card): "
read pass

export PGPASSWORD=$pass

sed "s/\[utorid\]/$name/g" expressBackup.js > express-static.js
sed -i "s/\[pass\]/$pass/g" express-static.js

echo "Run the servers by typing:"
echo "nodejs express-static &"
echo "nodejs serverBroadcast.js"