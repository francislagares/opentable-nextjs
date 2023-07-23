# OpenTable Next.js 13 Clone Project

OpenTable is an online restaurant reservation service company. 
## Getting Started

First, clone the repository from github:

```bash
git clone https://github.com/francislagares/opentable-nexjts.git
```

Navigate inside app directory

  ```bash
  cd opentable-nextjs
  ```

Install dependencies:

```bash
yarn install
```
Run the development server:

```bash
yarn dev
```
Right after, you first need to seed the database with all the data for the application to work.

With the server up and running just hit the api route http://localhost:3000/api/db/seed

It will take a little to load until you see printed in your browser screen `"Seeding completed!"`

At this point you can go and open [http://localhost:3000](http://localhost:3000) with your browser to see the home screen with all restaurants listing
results.

## Create Database in Supabase

TODO...