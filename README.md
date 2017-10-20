# Lucky puts
A simple scorekeeping application for one-put-per-day office minigolf.

[TODO - Screenshot]

## How to run
Initial setup:
```bash
git clone https://github.com/espenh/lucky-puts.git
cd lucky-puts
npm install
```

### Run development server:
```bash
npm run start
```
Navigate to http://localhost:3000/.

### Build for production:
```bash
npm run build
```
Build output ends up in the `build` folder.

## Deployment
This project is configured for Firebase hosting.

### Install Firebase tools
```bash
npm install -g firebase-tools`
```

### Sign in
```bash
firebase login
```

### Deploy hosting
After building the project for production, you can deploy by running:
```bash
firebase deploy --only hosting
```

Example output:
```bash
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