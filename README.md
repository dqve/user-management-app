# User Management App

## Overview

This Angular-based User Management App allows users to sign up, submit user information through a REST API, and view and manage users based on their admin approval. The app includes features such as secure session management for user data and other features.

## Features

1. **User Signup:**
   - Users can sign up by filling out the registration form.
   - Submitted user information is sent to a mocked REST API for processing.
   - Once a user is registered, a user key is generated, allowing the user to log in.

2. **Admin Approval:**
   - The default user "admin" has the authority to approve the first user.
   - Once a user is approved, the user is able to log in.
   - Subsequent users automatically become admins when approved by the last user before them.

3. **User Authentication:**
   - Users can only log in after being approved by an admin.
   - Secure session management is implemented using LocalStorage.

4. **CRUD Operations:**
   - Users can perform CRUD operations only on the records they are admins for.
   - They cannot remove or update their own records.


## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/user-management-app.git
2. **Navigate to the project directory:**

   ```bash
   cd user-management-app
3. **Install dependencies:**

   ```bash
   npm install
## Running the App

1. **Start the Angular development server:**

   ```bash
   ng serve
The app will be accessible at http://localhost:4200/ by default.

2. **Open Cypress for end-to-end testing::**

   ```bash
   npm run cypress:open
## Additional Details


### Default Admin Info
- Email: daddy@admin.com
- User ID: 1



## What Was Achieved
- Used Angular to structure the application with components, services, and routing.
   - Integrated spartan/ui for UI components.
   - Developed a highly responsive web App, while using the spartan/ui library to create a modern and beautifull product.
   - Set up unit tests and end-to-end tests to ensure correctness and security.
   - Used HttpClient to make API calls to a [personally hosted JSON server](https://user-management-json-server-two.vercel.app/) with proper response and error handlers.
     - **UI:**
     - Implemented Dark and Light mode.
     - Made good use of UI elements to greatly ensure excelent User Experience.
     - Added pagination to the table.
     - Added filters to the table.
     - Added search fields, row counts and Column determiners to the table etc.


## Issues Encountered
No particular issues were faced, but with more time, here is a list of things I would have loved to implement:
- Declare clearer types.
- Create more intricate tests.
- Implement a more robust server.
  - name, password and email validation.
  - Status codes depending on the responses.
- Create a central api request handler to make error and success handling general.
- Add mobile view side bar (very low risk).
- Add a central export for shared and individual components to improve verbosity.
- Create more shared components for reusable code.
- Add dialog box for table actions.
- Add loading segment for table actions.
- Add actions for updating users on user list.
- Create a url and request library for all urls and request.

## Additional Details
- Users can sign up without logging in initially.
- Admin approval is required for login.
- Admin status is automatically granted to the last user who approves a new user.
- Users can perform CRUD operations only on the records they are admins for.
- Data is temporarily stored in LocalStorage for the current session.
- Development followed Angular and web security best practices.

## Running and Reviewing the Assessment
- Clone the repository and run `ng serve` to start the development server.
- Access the application in a web browser at `http://localhost:4200`.
- Follow the application flow as described in the requirements.

.
.

# Application workspace details


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.1.1.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

`Feel free to customize this Markdown as needed based on your specific project structure and requirements.`
