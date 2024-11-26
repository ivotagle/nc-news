# Northcoders News API

For instructions, please head over to [L2C NC News](https://l2c.northcoders.com/courses/be/nc-news).
This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)

1. Once you have cloned the repo, please add your own copy of .env.development and .env.test in the root folder of the project in order to link correctly the databases. Use the following PGDATABASE=data_base_name and PGDATABASE=data_base_name_test respectively.

2. Setup DB:
   psql -f ./db/setup.sql

3. Seed tables:
   node ./db/seeds/run-seed.js

Dependencies to install:

0. Making sure npm has been initiated: npm init -y

1. Jest: npm install --save -dev jest
2. PSql: npm install pg
3. Express: npm install express --save
4. dotenv: npm install dotenv --save
5. Pg Format: npm install pg-format
6. Supertest: npm install -D supertest
