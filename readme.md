# WebShop Project

## Author

**Name:** Md Hasibul Haque Zahid  
**Email:** md.zahid@abo.fi
**Student ID:** 2302302

## Repository
GitHub: [webshopproject2024-Xahidian](https://github.com/AA-IT-WebTechCourse/webshopproject2024-Xahidian)

## Implemented Requirements
### ✅ Mandatory Requirements (24 points)

1. **Project Folder Structure** 
   - Root folder with README
   - Backend folder with `requirements.txt`
   - Frontend folder with `package.json`

2. **Backend** 
   - Django backend with API
   - Serves JSON to shop and HTML for landing page
   - Uses SQLite database

3. **Frontend** 
   - Implemented using React

4. **Automatic Database Population**
   - Button on landing page to:
     - Clear DB
     - Add 6 users (3 sellers with 10 items each)
     - Show confirmation message

5. **Browse Items**
   - Any user can view items for sale
   - Item includes:
     - Title
     - Description
     - Price
     - Date added

6. **Create Account**
   - Users can sign up with username, password, and email

7. **Login**
   - Registered users can log in with credentials

8. **Add Item**
   - Authenticated users can add items with title, description, price
   - Creation date saved automatically

9. **Add to Cart**
   - Authenticated users can add other users’ items to cart
   - Users cannot add their own items

---

### ✅ Optional Requirements (18 points)

10. **Search**
    - Users can search items by title
    - Each search sends API request

11. **Remove from Cart**
    - Buyers can remove items from their cart

12. **Pay** 
    - Buyers see cart and can press "Pay" (**You need to go back to the cart to see the updated price & again you can proceed to checkout, if you are agree with the new price**)
    - Validations:
      - Halt if price changes; notify user
      - Halt if item unavailable; notify user (**will show a toast message about the demanding quantity is unavailable**)
      - On success, items marked as SOLD and added to buyer's purchased list (**The item should  be no longer available in the frontpage for buying and you can see the item in the buyer purchase list**)

13. **Routing (SPA)**
    - Navigation through:
      - `/`(Shop)
      - `/signup`
      - `/login`
      - `/account`
      - `/myitems`

14. **Edit Account**
    - Authenticated user can change password with old and new values

15. **Display Inventory**
    - Authenticated user sees:
      - On sale items
      - Sold items
      - Purchased items

16. **Edit Item**
    - Sellers can edit price of their available items (even if added to cart by others)

17. **Nice UI**
    - Web pages are visually pleasing and easy to use on desktop screens

---

**Total Points Implemented: 42 / 42**

## How to Run the Project

### ✅ Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **npm 9+**

---

### 1. Backend Setup
cd backend

# Create and activate virtual environment
python -m venv env
source env/bin/activate     # Windows: env\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start Django server
python manage.py runserver

Server will be running at: http://127.0.0.1:8000

### 2. Frontend Setup
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm run dev

Frontend runs at: http://localhost:5173