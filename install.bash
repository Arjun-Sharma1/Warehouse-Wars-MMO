#!/bin/bash

# Note that the website will only work if hosted on port 10770
echo "Must have your own mongo database and replace it on line 6 in express-static.js"
# Currently using database given to us by school

echo "Enter your uTorID for database: "
read name
echo "Enter password for database(your last 5 digit of student card): "
read pass

export PGPASSWORD=$pass

sed "s/\[utorid\]/$name/g" expressBackup.js > express-static.js
sed -i "s/\[pass\]/$pass/g" express-static.js

echo "Install modules by typing:"
echo "npm install"
echo "Run the server and game by typing:"
echo "npm start"
echo "It should now be running on localhost:10770"
