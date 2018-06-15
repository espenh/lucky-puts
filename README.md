# Lucky puts
A simple scorekeeping application for one-put-per-day office minigolf.

![alt tag](https://github.com/espenh/lucky-puts/blob/master/docs/screenshots/lucky-puts_main.png)

See running version at: https://luckyputs-f03bf.firebaseapp.com

## How to run
Initial setup:
```
git clone https://github.com/espenh/lucky-puts.git
cd lucky-puts
npm install
```

### Run development server:
```
npm run start
```
Navigate to http://localhost:3000/.

### Build for production:
```
npm run build
```
Build output ends up in the `build` folder.

## Deployment
This project is configured for Firebase hosting.

### Install Firebase tools
```
npm install -g firebase-tools`
```

### Sign in
```
firebase login
```

### Deploy hosting
After building the project for production, you can deploy by running:
```
firebase deploy --only hosting
```

Example output:
```
=== Deploying to 'luckyputs-f03bf'...

i  deploying hosting
i  hosting: preparing build directory for upload...
+  hosting: 10 files uploaded successfully

+  Deploy complete!

Project Console: https://console.firebase.google.com/project/luckyputs-f03bf/overview
Hosting URL: https://luckyputs-f03bf.firebaseapp.com
```

## TODO
Possble features and improvements:
- Could start using https://github.com/prescottprue/react-redux-firebase/. Support for firestore is underway.
- Show score and trend for period (by month, year etc.). "Putter of the month!" kind of thing.
- Make it possible to rename and remove putter.
- Clean up styling. It's currently a messy mix of css and in-component styling.

### Widgets
- Total score
- Average score per round
- Weekly average (graph)


Lucky Puts
-----------------------------------------------------------------
    146        | Montly average
Total puts     | <sparkline>


Distance distribution
-----------------------------------------------------------------
        4
3       |   3
|   2   |   |    2
|   |   |   |    |
|   |   |   |    |
1 - 3 - 6 - 12 - 24

Distance distribution over time
-----------------------------------------------------------------
*  1
*  3
*  6   <linechart>
* 12
* 24
x: round
y: count

Department weekly score
-----------------------------------------------------------------
<stackedcolumnchart>
x: week
y: total score, grouped by score (distance)

Monthly winners
-----------------------------------------------------------------
       April *        |         March          
Svein  Erlend Marius  |  Erlend  Svein Marius  
 36      24     12    |   24      12     12    
 ***      !     ##    |   ###      &     ##    

- Fade 2. and 3. place points. 0.7 and 0.5 opacity perhaps.
- Highlight winner. Bold? Trophy icon?

Monthly winners (vertical)
------------------
APR  |  [Svein]
     |   36 ***
------------------
MAR  |  [Erlend]
     |   24 ###
------------------

- Add year subscript under month if first or last month in year and prev/next exists (transition).

Records
-----------------------------------------------------------------
* Best week:     24   Erlend | 13-20. dec. 2017
* Best month:    36   Svein  | feb. 2018
* Most puts:      9   Svein  |
* Average daily:  1.2 Marius |
* Longest streak: 3 Erlend   | **# from 12h dec. 2017 

- Streak. Try to ignore weekends and red days. Include red day if a score/round exists on that day.
- Highlight that most puts are in the cup, not just attempts. Cup icon?
- Support playoff puts (on same day). Highlight on put-bullet?
- Support multiple scores per day.
- Support putter photos + circle avatar.

----------
|        |
|   1 2  |
|        |
|   # #  |
|        |
----------


----------------------------------------------------------
| [gradient dark to light vertical]
| -----------------------------------
|        L U C K Y   P U T S 
| --- Statkraft Golf Championship ---
|
|---------------------------------------------------------------
| [white-ish]
|
|