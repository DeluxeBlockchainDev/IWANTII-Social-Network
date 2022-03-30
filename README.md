

This project was developed by requests of Ivy Nemesis in Israel.

## Description

In the project directory, you can run:

A website where user first inputs name and request, once live visitors is above 100 live visitors the website countdown begins, live name switching happens.
Once countdown ended (last username switched is the winner), random user wins and his request is shown up until its over and the same cycle begins again, new requests new countdown new random winner.

Live counter of users / anons / visitors that are currently on the site is shown in HUGE font

then it says 100 visitors MINIMUM required for the countdown to begin

user writes his name and at first what he wants exactly if he wins the countdown: (duplicates not allowed)

once 100 visitors is reached a countdown begins

during countdown all of the requests of what the users want are displayed temporarily as question marks grid style (there is precomment before there is a winner) with usernames and reputation likes / dislikes of the user and his question mark request displayed on homepage

if visitors count drops under 100 then countdown ends, restart happens

once there are 100+ or more visitors a countdown begins there is 1 hour countdown left until a winner wins

(countdown will have switching names randomly live HUGE FONT) last second switched name wins. (amount of how many times each user that has been switched during countdown is shown)

once countdown ends everyone sends that winner money or whatever he asks users to do (request)

the rest of requests that did not win are shown under

users / anons can like / dislike / comment about the countdown

users / anons can like / dislike / comment about the winner user / anon

There is a I LIKE THE (WINNER - I DISLIKE THE (WINNER) 

- Comment box - with comments likes and dislikes

once finished another countdown starts but of course it needs minimum 100 live users on page for it to begin. the cycle begins again.

so live users is always shown (By country and ip stats preferable)

pages required:
Live stats on each page
HOMEPAGE (current live users)
HOMEPAGE (current countdown) (countdown will have switching names randomly live with HUGE FONT) last second switched name wins. How many times users has been switched during countdown is shown
HOMEPAGE All of the requests with a question mark up until countdown ends all requests are shown including the winning one.


Homepage:
How many users requests
How many users requests / countdowns won
COUNTDOWN LIKES
COUNTDOWN DISLIKES
COUNTDOWN COMMENTS
COUNTDOWN STATS
REQUEST LIKES
REQUEST DISLIKES
REQUEST COMMENTS
REQUEST STATS
LIKE USER
DISLIKE USER
COMMENT about USER
Most Liked anonymous / user / countdown
Most Disliked anonymous / user / countdown
Most Popular anonymous / user / countdown
Most Commented anonymous / user / countdown
HIGHEST RATED COMMENT
HIGHEST RATED COMMENTATOR

admin pages and functionalities:
boost amount of live visitors on old countdowns new countdowns and boost current live visitors on homepage
How Many minimum users required for a countdown to begin
How long a countdown runs
How long to allow users to do what the winner asked for (how long the request is being requested runs up until the next countdown)
MAX COMMENT LENGTH
full admin features: add fake countdowns that did not happen to fill the website and make it look like it's not empty.
build fake request pages with fake stats
boost likes, dislikes, add comments boost comments likes dislikes, boost countdown likes dislikes boost all statistics.
generate fake users
admin section needs to be clean and so is the homepage website, it needs to be live responsive and everything needs to make sense with easy to understand design.

https://www.iwantii.com/

https://admin.iwantii.com



## Software Requirements

- Node.js **16.0.0+**
- MongoDB **3.6+** (Recommended **4+**)



## Software Configuration

1. You will find a file named `api.js` on `countdown_front/src/api` directory.

2. Edit base URL of the countdown backend API server.

   ```javascript
   export const BASE_URL = 'http://127.0.0.1:3002/api';
   ```

3. You will find a file named `consts.js` on `countdown_admin/app/api` directory.

4. Edit base URL of the countdown backend API server.

   ```javascript
   export const BASE_URL = 'http://localhost:3002/api';
   ```

5. In the `countdown_backend`, `countdown_admin` and `countdown_front`directory, you can run:

   ### `npm start`

7. Open [http://localhost:3000](http://localhost:3000) to view countdown client site in the browser.
8. Open [http://localhost:3002](http://localhost:3000) to view countdown admin site in the browser.