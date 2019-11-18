# Overview
Codenamed *dev-project-1* is a web application for professors and TA's at the University of Delaware's CS department to create exams in a more efficient and programmatic way. This project is currently still in the alpha phase of development so many features are still in the works. The final version will only be in use by the university but the plan is to release the platform itself as an open source thing hopefully if they let us(?)

# Installation
To install just: `git clone https://github.com/devyboy/dev-project-1 && npm install`

The Firebase credentials are imported from a config file that (obviously) is ignored by git. To make this work with Firebase, you would need to do the following:
1. Go to Firebase and make a new project, then make a new Firebase web app and fill out all the stuff.
2. Click "Authentication" and enable Google sign in, and also go to Database and enable Firestore.
3. Then click "Project Settings" in the top left and scroll down until you find the SDK snippet, it should look like this:
```
var firebaseConfig = {
    apiKey: "<redacted>",
    authDomain: "<redacted>",
    databaseURL: "<redacted>",
    projectId: "<redacted>",
    storageBucket: "<redacted>",
    messagingSenderId: "<redacted>",
    appId: "<redacted>"
  };
```
4. Copy that config snippet with all your API keys, then go to the `/src` folder of the project and paste it into a file called `config.js`.
5. Type `export { firebaseConfig };` at the bottom of the file. 
Now at this point it still won't work because it's imported as `yeet` in `App.js`, so just change that to `firebaseConfig` and boom you're all set up.

# Name ideas
Not sure what to name it yet, theres a file called `names.txt` in which some name ideas were tossed into. Might as well put them here too. 

```
Normal:	
    PAPER: Project for the Authenticated Partitioning of Automated Exams and Responses
    CODE: Compilation Of Dedicated Exams
    QUEST: Question and Exam System for Testing
    BYTE: Basically You Tabulate Exams
    COMPILE: Collection of Operations to Manage, Produce, and Implement Logical Exams

Recursive:
    CORE: CORE Organizes Rational Exams
    PHOTON: PHOTON Helps Organize Tests On a Network
    CUBE: CUBE Unifies Brilliant Exams

Greek:
    LAMBDA: Logical Application to Manage, Build and Distribute Assessments
    DELTA: Develop Exams for Logical Assessment
    SIGMA: System to Implement, Generate, and Manage Assessments
    OMEGA: Optimized Management of Exam Generating Applications
    THETA: Tool that Handles Exam Tweaking and Administration
```
