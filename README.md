
<div align="center">

  # 🌅 Sunshine News API
  
*A REST API that enables users to perform CRUD operations on a database.*

 </div>

  ## How is it built?

  The goal of this project was to create and deploy an API that allows application data to be accessed programmatically. It provides server-side rendering for my next project: the front-end of Sunshine News. 

  📝 **Written in JavaScript, runs on the Node.js runtime environment**
  - Allowed me to develop non-blocking, asynchronous code by deploying promises, ensuring Sunshine News API runs smoothly. For further consideration, building end-to-end software in JavaScript will facilitate code re-usability and simplify front-end development. 

  🚀 **Utilises Express.js**
  - Simplified routing and handling client requests, improving the efficiency and readability of my code. 

  📈 **Assembles databases by using PSQL and Postgres**
  - United JavaScript and PSQL through Postgres, which allowed for the building, seeding and querying of databases from a Node.js application. 
  
  🔒 **Mobilises Jest and Supertest for TDD**
   - Supertest provided a way of writing integration tests of endpoints, while Jest provided useful matchers, and a simple but robust framework for unit testing.  

  ⚙️ **Employs branching and Pull Requests**
  - Provided experience of working in a professional setting and on larger projects.  

  💡 **Applies the MVC pattern**
  - Due to Express' unopinionated nature, this project follows a MVC pattern to ensure a maintainable directory structure by organising controllers and models separately.

   🗒️ **Planned workflow using a Kanban Board**
   - As the project became more complex, I made use of a Kanban Board to better help roadmap building specific functionalities. 

  <img width="1449" alt="Screenshot 2023-11-25 at 16 29 41" src="https://github.com/nicomaz/news-api/assets/139277771/15df2e9d-a031-4c8a-9446-a8b032d6a545">
  
  ## Requirements
  — To run this, you need Node.js `20.9.0` or above, and  Postgres `8.11.3` or above.

  ## Project Set up 
  ### Cloning
  - Run `git clone <url>` to clone this repo onto your machine
  - Run `code news-api` to open Sunshine News API 

  ### Dependencies 
  - Run `npm install` to install dependencies 
    - This project uses `dotenv`, `express`, `pg`, `pg-format`, `jest`, `jest-extended`, `jest-sorted` and `supertest`
    
  ### Database
  - If you want to re-name the databases, do this in `setup-sql`, in the `db` folder
  - Run `node run setup-dbs` to create the local databases

 ### Environment Variables
  - Create files  `env.test` and `env.development` at the top level
  - Add `PGDATABASE=<db>` to both files, replacing `<db>` with the correct database name for each
  - Ensure the `.gitignore` file has `node_modules` and `.env.*`

 ## Testing 
All tests can be found in the `__tests__` folder. 
  - Run `npm run test` to run all tests
  - Run `npm test app` or `npm test utils` to run specific test files
   
Running the `app.test` file will seed the test database after each test. 

Now you can experiment with the code and tests!

## Sunshine News API in action 
Check out the hosted version of [Sunshine API](https://sunshine-news.onrender.com/api) 
  
  

  
