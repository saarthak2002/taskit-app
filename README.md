# task.it App

Task.it is a task management platform that allows teams to collaborate effectively and finish things on time. Users can create projects, set tasks for each project, filter tasks by user-defined categories, and add other users as collaborators on their projects. The goal of task.it is to enhance the productivity of individuals and teams for all projects, small or large. See [here](https://github.com/saarthak2002/taskit-backend) for backend code.

![Grid of screenshots](/screenshots/grid-screenshots.png)

The essential features of the platform can be accessed on the go using the [task.it mobile app](https://github.com/saarthak2002/taskit-mobile) built with Flutter.

![task it mobile app cover](/screenshots/taskit-mobile-cover.png)

# Development
Task.it uses React with Material UI for the frontend web application. The data is served to the frontend from a Flask REST API in the backend. The app uses a Firebase database for email/password or Google OAuth 2.0 based authentication and authorization and a PostgreSQL database for stroing user data. The backend source code can be found [here](https://github.com/saarthak2002/taskit-backend).

# Dashboard

The dashboard is the first page the user sees after logging in. It shows you overall stats using charts and progress bars, like the percentage of all tasks completed, the number of tasks completed each day in the last 7-days, and the number of complete and total tasks per project. The dashboard also displays project cards for the five most recent projects that show information like a progress indicator to show how many tasks are completed in each project, the project title, description, date of creation, owner name, etc. There is a shortcut button for creating a new project in the top-right corner.

![Dashboard](/screenshots/dashboard.png)

# Project Details

Clicking on a project card (or a view button on the "Projects" page) opens the project details view. Each task added to the project is displayed as an expandable card, and tasks can be filtered by many parameters. Users can add tasks, collaborators, and user-defined categories from this page. The overall completion status of the project is shown as a circular progress meter at the top, and a donut chart shows how tasks are distributed across various categories.

![Project Details page](/screenshots/project_details.png)

## Modals

Three pop-ups allow users to perform the main interactions with their projects. The Collaborators screen shows existing collaborators and also enables the removal of collaborators. Users can add any other user on the platform as a collaborator by searching for their username. Users can define new categories from the Add Category screen by selecting a name and color or delete existing categories (the backend automatically handles setting all tasks with that category to default values). To add tasks to the project, the user can use the Add Task screen by inputting a title, category (from a dropdown of user-defined categories), and task description.

![Project Details Modals](/screenshots/project_details_modals.png)

## Filters and Task Cards

A task can be marked as completed by clicking the green checkmark button, and a completed task can be made pending again by clicking the red cross button. The tasks displayed can be filtered by status (Pending or Completed) as well as custom categories set by the user using the pill-shaped filter buttons (at the top of the tasks view) that are color-coded by the task category colors. The task card, in its non-expanded form, shows the name, status, a complete or pending button, a task category, and the initials of the user who has created or completed the task. On expanding, details like the description, buttons to edit or delete the task, when the task was created, who created it, when it was completed, and who completed it are shown.

![Project Details Filters](/screenshots/filters.png)

# Projects

The Projects tab presents a tabular summary of all the projects the user has created in an expandable table. Information like the project name, description, total tasks, completed tasks, creation date, and a link to the project details page is shown. On expanding a row, every task added to the project is shown in a table with its name, description, category, and status.

![Projects view](/screenshots/projects.png)

Projects can be created using the create project form, which users can access from the Dashboard or the Projects tab.

![Create Project](/screenshots/create_project.png)

# Collaborate

The Collaborate tab shows you project cards for all the projects you have been invited to collaborate on by other users, along with information like who owns the project, description, title, etc.

![Collaborate page](/screenshots/collab.png)

Clicking a card brings up a slightly different project details page that states you are a collaborator on that project and does not let a collaborating user edit the collaborators. Only project owners can edit collaborators. Collaborators can perform all other actions like adding and modifying Tasks and Task Categories, which will be reflected for all users on that project.

![Collab Project details](/screenshots/collab-details.png)

# Profile

The profile view allows users to edit their username on the platform, which is helpful for users who logged in with a social app, as their username is auto-generated by default. It also shows useful information like the projects the user is working on, the other users they have collaborated with, and their email, username, name, and profile picture. The edit username modal offers real-time feedback on if a username is available as the user is typing.

![Profile Page](/screenshots/profile.png)

# Login

The Login page allows existing users to log in with their email and password or continue with Google auth (new user or existing). Firebase is used in the backend to authenticate users, and the unique id provided by Firebase is used to set up relevant table entries in the Postgres database to store user info.

![Login](/screenshots/login.png)

# Landing Page and On-boarding

Users can create an account on the Register page if they wish to use an email/password to authenticate to the application. The form also collects information like name and username to store in the database. The username field offers real-time feedback about whether a username is available by querying the backend. Form validation ensures all fields are populated correctly, displaying relevant error messages in a banner if needed.

![Register](/screenshots/register.png)

The landing page is what unauthenticated users see when they first visit the site.

![Landing page](/screenshots/landing.png)

# Author
This application was created by Saarthak Gupta Ⓒ 2023.