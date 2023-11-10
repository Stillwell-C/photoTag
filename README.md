# PhotoTag

This repository is the frontend for Photo-Tag, a PERN stack photo tagging game.

I originally made this while following the React course from [The Odin Project's](https://www.theodinproject.com/) curriculum as a front end only app. I updated it to be a full stack application to practice a number of technologies, notably Typescript, Tailwind CSS, and PostgreSQL.

The MERN stack implementation of this app can be found on the main branch [here](https://github.com/Stillwell-C/photoTag).

## Demo

The application is live at https://photo-tag-sql.vercel.app/

## Backend code

View the backend code [here](https://github.com/Stillwell-C/photoTagApi/tree/postgreSQL)

## Description

### Overview

- Built using PERN stack / postgreSQL / REST API
- Reponsive, mobile-first UI
- Tailwind CSS
- Front/Back end written in Typescript
- Font end tested with Jest / React Testing Library
- Find all characters to submit your name and time
- The fastest 5 times for each map are displayed on the leaderboards page

### Detailed Description

This application was as a simple photo tagging puzzle game.

#### UI

The UI was made to be responsive with a mobile-first design and should function on both mobile devices and web browsers with larger screens. Tailwind CSS was used to style all components. There is a dark and light mode that is toggled through the user's system preference.

#### API

Once users have finished finding all characters on a given map, they have the option to submit their name. If they are within the 5 fastest times, their time will be displayed on the leaderboards page.

There are some minor differences between the postgreSQL and MongoDB implementations of this app beyond the database query code, such as variable capitalization. However, the majority of the code is the same.

The [cors](https://www.npmjs.com/package/cors) package is used to only allow requests from specific origins. In this case, I am only allowing requests originating from the frontend.

## Built with

### Frontend

- ReactJS
- Typescript
- React Router
- Axios
- Tailwind CSS

### Backend

- NodeJS
- ExpressJS
- PostgreSQL
- Cloudinary (image storage)
