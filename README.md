# PhotoTag

This repository is the frontend for Photo-Tag, a MERN stack photo tagging game.

I originally made this while following the React course from [The Odin Project's](https://www.theodinproject.com/) curriculum as a front end only app. I updated it to be a full stack application to practice a number of technologies, notably Typescript, Tailwind CSS, and postgreSQL.

The postgreSQL implementation of this app can be found on the postgreSQL branch [here](https://github.com/Stillwell-C/photoTag/tree/postgreSQL).

## Demo

The application is live at https://photo-tag.vercel.app/

## Backend code

View the backend code [here](https://github.com/Stillwell-C/photoTagApi)

## Description

### Overview

- Built using MERN stack / REST API
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
- MongoDB/Mongoose
- Cloudinary (image storage)

## Screenshots

### Desktop

#### Homepage

<img src="./ProjectImages/HomePageLight.png" alt="homepage light" >
<img src="./ProjectImages/HomepageDark.png" alt="homepage dark" >

#### Game

<img src="./ProjectImages/SelectCharacter.png" alt="select character modal during gameplay" >

#### Name Submission

<img src="./ProjectImages/SubmitName.png" alt="submit name for completing game modal" >

#### Leaderboard

<img src="./ProjectImages/LeaderboardsLight.png" alt="leaderboards light mode" >
<img src="./ProjectImages/LeaderboardsDark.png" alt="leaderboard dark mode" >

### Mobile

#### Homepage

<img src="./ProjectImages/MobileHomepage.PNG" alt="mobile homepage" height="500">

#### Leaderboards

<img src="./ProjectImages/MobileLeaderboards.PNG" alt="mobile leaderboards" height="500">

#### Game Screen Size Warning

<img src="./ProjectImages/MobileScreenSizeWarning.PNG" alt="screen size warning for small screens" height="500">

#### Game in Landscape

<img src="./ProjectImages/MobileGameHorizontal.PNG" alt="game on mobile screen in landscape resolution" >

#### 2X Zoom Option with Game in Landscape

<img src="./ProjectImages/MobileGameHorizontalZoom.PNG" alt="mobile game screen with 2 times zoom option" >
