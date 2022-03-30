# Nodejs Expressjs MongoDB Countdown website API Project

## Getting started

This is a API server written in JavaScript ES2015. It supports front website as well as admin paenl.

This project will run on **NodeJs** using **MongoDB** as database. I had tried to maintain the code structure easy as any beginner can also adopt the flow and start building an API. Project is open for suggestions, Bug reports and pull requests.

## Software Requirements

- Node.js **8+**
- MongoDB **3.6+** (Recommended **4+**)

## How to install

### Using manual download ZIP

1.  Download repository
2.  Uncompress to your desired directory

### Install npm dependencies after installing (Git or manual download)

```bash
cd countdown-backend
npm install
```

### Setting up environments

1. You will find a file named `.env` on root directory of project.

2. Create database named `countdown_db` in your server and check database connection port.

   ```bash
   MONGODB_URL=mongodb://127.0.0.1:27017/coutdown_db
   ```

3. Edit socket server port.
   ```bash
   SOCKET_PORT=5000
   ```

4. If you test this code in your local, the API server will be running on port 3002.

5. Edit fake countdown name .

   ```bash
   FAKE_COUNTDOWN_NAME="IWANTII"
   ```

   

## How to run

### Running API server locally

```bash
npm run dev
```

You will know server is running by checking the output of the command `npm run dev`

```bash
Socket server running on port 5000
API Server running on port 3002
Connected to mongodb://127.0.0.1:27017/coutdown_db
App is running ... 

Press CTRL + C to stop the process. 
```



## ESLint

### Running Eslint

```bash
npm run lint
```

You can set custom rules for eslint in `.eslintrc.json` file, Added at project root.

## Bugs or improvements

Every project needs improvements, Feel free to report any bugs or improvements. Pull requests are always welcome.

## License

This project is open-sourced software licensed under the MIT License. See the LICENSE file for more information.
