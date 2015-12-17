BIYBL / TheBible.at 
===================

Welcome to BIYBL (Bible in your best language) the open source project that powers TheBible.at - giving everyone the bible in their own language right when they need it.

A live public access version of this application is available at [theBible.at](http://thebible.at) where you can sign up as an organisation and provide the tool to your members free of charge.  However, as always with open source projects, you can also download the code, install and set up your own application. This README will help you do that.

### Pre-requisites:

This application runs on MEANSTACK. You will need to install [node.js](https://nodejs.org/en/) along with development tools [Bower](http://bower.io/) and [Grunt](http://gruntjs.com/).  You will also require [MongoDB](https://www.mongodb.org/) for datastorage.

Once you have these installed on the development / production machine you can get the application with a few simple commands.

> Side Note:  If you want to create a production install, we recommend [Digital Ocean](http://www.digitalocean.com).  You can set up a NODE ready vps in minutes to run your application.

### Download and install

To get a copy of the application you will need to clone the repository and install the required packages. Do the following on the command line:

> `git clone https://github.com/biybl/biybl.git`   
> `cd biybl`  
> `npm install`  
> `bower install`  

Your app is now ready to run.

## Running the app

You can run a development version of the app by simply typing `grunt serve`.  You can also build a production release version of the application by running `grunt build`.  This will create a minified distribution ready front end version in the dist folder.  You can deploy this to a server for users to access.  (Please note: a backend API will still need to be running to perform server side actions).


### Developing the code

The code is built on the [yeoman](http://yeoman.io/) generator and framework implementation developed by [DaftMonk](https://github.com/daftmonk) and you can expand the app using the help available on that [GitHub page](https://github.com/angular-fullstack/generator-angular-fullstack).