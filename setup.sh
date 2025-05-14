// Running backend server
python manage.py runserver
// Running frontend server
npm run dev

# Initial Setup
python manage.py flush
rm db.sqlite3
rm -rf shop/migrations/00*.py
python manage.py makemigrations
python manage.py migrate
python manage.py runserver


#testing command 
npx playwright test tests/populateDb.test.js
npx playwright test tests/functional --workers=1
npx playwright test tests/metamorphic --workers=1
npx playwright test -g "MR4"
