# Old Head App

This repository contains a production‑ready React Native application that implements the core of the **Old Head** mobile experience.  The app is designed to help hunters and anglers in the United States plan trips, track conditions and collaborate with their friends.  It uses Supabase for authentication and data storage, Mapbox for mapping, various public APIs for environmental data and OpenAI for AI‑assisted suggestions.

## Features

* **Magic‑link Authentication** – users authenticate via email using Supabase Auth; no passwords are stored or required.
* **Dashboard** – shows AI‑driven suggestions for upcoming trips and a list of saved fishing or hunting locations.
* **Interactive Map** – built with Mapbox, allowing users to view their location and (in a full implementation) drop pins, view offline tiles and track a breadcrumb trail while travelling.
* **AI Chat** – a chat interface backed by OpenAI GPT‑4o for answering questions such as “Where should I fish tomorrow?”  Messages are stored locally in component state.
* **Trip Planner** – choose your mode (fishing or hunting) and duration, then generate a detailed itinerary (placeholder alert currently).
* **Groups** – browse your groups and enter an invite code to join a new group.  Join requests are sent to a Supabase Edge Function named `join_group` (not included here).
* **Environmental Data Services** – a set of functions for retrieving weather forecasts, streamflow measurements, tide predictions and sunrise/sunset times.  These functions are ready to be wrapped by react‑query for caching and offline support.

## Getting Started

This project uses **Expo** to simplify development and distribution.  To run the application locally you need to have Node.js and the Expo CLI installed.  You must also supply a set of API keys via environment variables – the app will not function without them.

### 1. Install dependencies

```sh
npm install
```

The `package.json` lists all libraries used in this project.  If you add new modules you should run `npm install` again to update your lockfile.  Because this repository does not include node modules, you need internet access to install them.

### 2. Configure environment variables

Create a file named `.env` at the root of the project (or use your preferred method) and define the following variables:

```env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
EXPO_PUBLIC_MAPBOX_TOKEN=your-mapbox-public-token
OPENAI_API_KEY=your-openai-api-key
WEATHER_API_KEY=your-weatherapi-key
```

* **Supabase URL & key** – available in your Supabase project settings.  These allow the app to read and write to your Postgres database and handle authentication.
* **Mapbox token** – a public key from your Mapbox account that enables map rendering and offline tile downloads.
* **OpenAI key** – used to call GPT‑4o in the AI chat and suggestion services.  Your key is never checked into version control.
* **WeatherAPI key** – used to fetch weather forecasts for pin drops and trip planning.

When building with Expo the `EXPO_PUBLIC_` prefix makes the variables accessible to the JavaScript bundle.  Do not include secrets without this prefix.

### 3. Prepare your Supabase schema

This app assumes the existence of several tables in your Supabase database along with appropriate Row Level Security (RLS) policies.  Create these tables by executing SQL similar to the following:

```sql
-- Users table is managed by supabase.auth.users

create table groups (
  id serial primary key,
  admin_id uuid not null references auth.users on delete cascade,
  name text not null,
  invite_code text not null
);

create table join_requests (
  id serial primary key,
  user_id uuid not null references auth.users on delete cascade,
  group_id integer not null references groups on delete cascade,
  status text not null default 'pending'
);

create table pins (
  id serial primary key,
  location geography(point, 4326) not null,
  visibility text not null,
  created_by uuid not null references auth.users on delete cascade,
  group_id integer references groups on delete cascade,
  type text not null
);

-- Additional tables: logs, comments, preferences, species as described in the
-- instructions file.  Set up RLS policies to restrict visibility to users
-- within the same group or to public pins.
```

You must also implement a **`join_group`** Supabase Edge Function which accepts an `inviteCode` and inserts a record into `join_requests`.  The Groups screen in this app calls that function when a user enters a code.

### 4. Run the app

Once dependencies and environment variables are configured, start the Expo development server:

```sh
npm start
```

You can then open the app on an Android emulator, iOS simulator or your physical device via the Expo Go app.  As you develop, the app will automatically reload when you change files.

### 5. Run tests

After installing dependencies, run unit tests with:

```sh
npm test
```

## Notes & Next Steps

* The current implementation provides a functional skeleton that aligns with the specification in the “Old Head Agent Instructions” file.  Many features, such as offline caching with WatermelonDB, interactive pin management, real AI suggestions and detailed trip planning, are placeholders that require further development.
* To add offline support, wrap API calls with `react-query` and configure a WatermelonDB database for local persistence.  You can queue writes to Supabase when the device is offline.
* The chat and trip planning screens rely on the OpenAI API.  Be mindful of rate limits and costs when integrating these features into production.  Consider proxying requests through your own backend to enforce usage quotas.
* For maps, integrate the Mapbox SDK fully by handling long presses to create pins, displaying offline tile packs and showing user location and compass headings.  See the Mapbox React Native documentation for details.

We hope this project serves as a solid foundation for building your hunting and fishing companion app.  Tighten up the user experience, secure your API keys and extend the functionality to deliver an exceptional tool for outdoor enthusiasts.