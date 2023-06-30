# Northcoders News API

This is my portfolio project based on Northcoders' tasks. It's a news website API.

# A link to the hosted API:
https://northcoders-news-jduz.onrender.com/api

# How to fork and clone repo:

1. Press "Fork" to create a copy of this repo on your GitHub page;
2. Copy a link to your fork;
3. Open Terminal on your machine, cd to desired directory, create a new folder to store the repo if needed;
4. Type "git clone https://github.com/linktoyourfork" in the Terminal;

# Installing dependencies

All the developer dependencies to install you can find in package.json file in the root directory (see "devDependencies");
Also see "scripts" to seed test or dev databases;

# To run this project locally you need:
1. Create two .env files: .env.test and .env.development;
2. Depending on the .env file name set the PGDATABASE to: db_name_test (to run in the test mode) or db_name (to run in the dev environment);
You can find DB names in the ./db/setup.sql file. Good luck!

# Required:
Node v20.2.0;
PostgreSQL 14.8;