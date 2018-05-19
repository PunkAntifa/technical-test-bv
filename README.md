# technical-test-bv
Repository for Been Verified technical test

## App Installation
This app has been created with Nodejs, Express and Sqlite3.

### Requirements: 
* Internet connection
* Install Nodejs: get it from [Nodejs web page](https://nodejs.org/es/download/)

### Follow the next steps to run the application:

* Clone repository
* Open your terminal/bash/cmd
* Access to directory where the repository was cloned
* Run: **npm install** (to verify all packages are done)
* Execute application by running: **node app.js**
* If show some **error** related with sqlite3, just run: **npm install sqlite3** and execute the application again. 

        This error is generated if the Operative System is different to Windows (module on repository is for Windows). A Different module is used for Mac and Linux. Is for this reason, recomend install the module again in the machine who will run the app. 
        
* When the application is running, it display two messages on console: 

        Listening on PORT 3000
        Connected to the bvde database.

* Once this message is visualized, open the browser, and set the url: localhost:3000
* A page will be displayed to set the filters

        Artist: set artist name you want to search (leave blank to get all records)
        Title: set song title you want to search (leave blank to get all records)
        Genre: select genre from the list to get all songs that match with that genre

* Click on Search, and the json will be displayed