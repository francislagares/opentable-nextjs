# OpenTable Next.js 13 Clone Project

OpenTable is an online restaurant reservation service company. 

<p>
  <a href='https://nextjs.org/'>
		<img src='https://img.shields.io/badge/nextjs-FFF?style=for-the-badge&logo=nextdotjs&logoColor=black' />
	</a>
  &nbsp;
  <a href='https://react.dev/learn'>
		<img src='https://img.shields.io/badge/react-61DAFB?logoWidth=30&labelColor=black&style=for-the-badge&logo=react' />
	</a>
  &nbsp;
  <a href='https://www.typescriptlang.org/'>
    <img src="https://img.shields.io/badge/typescript-007ACC.svg?&style=for-the-badge&logo=typescript&logoColor=white" />
  </a>
  &nbsp;
  
  <a href='https://www.prisma.io/'>
		<img src='https://img.shields.io/badge/prisma-2D3748?logoWidth=30&labelColor=black&style=for-the-badge&logo=prisma' />
	</a>
  &nbsp;
  <a href='https://www.postgresql.org/'>
		<img src='https://img.shields.io/badge/postgresql-316192?logoWidth=30&style=for-the-badge&logo=postgresql&logoColor=white' />
	</a>
  &nbsp;
  <a href='https://supabase.com/'>
		<img src='https://img.shields.io/badge/supabase-3FCF8E?logoWidth=30&labelColor=black&style=for-the-badge&logo=supabase&logoColor=white' />
	</a>
</p>

![Image](https://res.cloudinary.com/chatty-app/image/upload/v1690129369/OpenTable_l1me9p.png)
## WIP: How to Run this Project

First, clone the repository from github:

```bash
git clone https://github.com/francislagares/opentable-nextjs.git
```

Navigate inside root directory

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