cd jkanime-library
npm install
npm run build
npm link
cd ..
cd anime_api
npm install
npm link jkanime-library

npm run dev
npm run start:debug