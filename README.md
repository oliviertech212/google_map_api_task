# Google Maps API Transportation Tracker

This project is a React application that leverages the Google Maps API to help with transportation tasks by:

\*Visualizing the entire route: See your planned route displayed clearly on the map, with stops marked for reference.
Real-time driver tracking: Track the driver's current location as they progress through the route.
Estimated Time of Arrival (ETA) calculation: Get an estimate of how long it will take to reach the next stop, providing valuable insight for trip planning.

# ️ Technology Stack

- React.js: A popular JavaScript library for building dynamic and user-friendly web interfaces.
- Google Maps API: A suite of tools from Google that enables developers to integrate interactive maps into their applications.

# Key Features

- Clear route visualization: The application displays the entire route on the map, including marked stops for easy identification.
- Live driver tracking: The driver's current location is dynamically tracked as they move along the route, providing real-time visibility.
- Next stop ETA calculation: Get an estimate of the time it will take to reach the next stop on the route, helping with planning and coordination.

# Getting Started

- 1.  Setting Up Your Google Maps API Key:

To use the full functionality of this application, you'll need a Google Maps API key. Here's how to obtain one:

Visit the Google Cloud Console:` https://console.cloud.google.com/`
Create a new project (or select an existing one).
Enable the following APIs for your project:
`Maps JavaScript API`
`Directions API`
Once enabled, create an API key by navigating to the "Credentials" section in the Cloud Console.

- 2.  Project Setup:

Clone this repository using Git:` git clone https://github.com/oliviertech212/google_map_api_task`
Install the application's dependencies: `npm install`

- 3. Configuration:

Create a file named `.env` in the project's root directory.
Copy the contents of `.env.example` into `.env`.
Replace the `VITE_GOOGLE_MAP_API_KEY` placeholder with your actual Google Maps API key from `step 1`.

- 4. Running the Application:

* Start the development server: npm run dev
* The application should now be accessible in your browser, typically at` http://localhost:{port}/`. You can then explore the features and visualize your transportation routes.

# Testing

You can thoroughly test the application locally using the steps above.
Additionally, a deployed version of the application is available for testing at:
`https://google-map-api-task.vercel.app/`

# Small Screen

![alt text](image.png)

# Large Screen

![alt text](image-1.png)
