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