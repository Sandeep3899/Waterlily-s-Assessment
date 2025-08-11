# Waterlily's Assessment

A survey application built using React, Vite, Tailwind CSS, and Supabase. This app allows users to fill out surveys, store responses, and review submissions.

## 🚀 Features

- Fetch surveys and questions from Supabase
- Render questions dynamically based on type
- Submit responses with validation
- Review submitted responses
- Tailwind CSS styling
- Supabase as backend for data storage

## 📂 Project Structure

src/
├── lib/ # Supabase client setup
├── features/survey/ # Survey feature components & API logic
│ ├── api.ts # Supabase queries (fetch, create, review)
│ ├── types.ts # TypeScript interfaces for data
│ ├── FieldRenderer.tsx # Component to render different question types
│ ├── SurveyForm.tsx # Handles form display & validation
│ ├── Review.tsx # Displays submitted answers
│ ├── SurveyPage.tsx # Main page handling flow
├── assets/ # Static assets
├── App.tsx # Root app component
├── index.css # TailwindCSS imports
├── main.tsx # App entry point

## 📦 Installation & Setup

### 🥇 Clone the repository

```bash
git clone https://github.com/Sandeep3899/Waterlily-s-Assessment.git
cd Waterlily-s-Assessment
```

### 📦 Install dependencies

```bash
npm install
```

### ⚙️ Environment variables

Create a `.env` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 🗄️ Download the Database Schema (Supabase CLI)

Run the following command from your project directory to download the SQL schema file:

```bash
supabase snippets download b81ad1d1-cbdc-4365-b6ab-3dd1c7c6d383 > schema.sql
```

This will save the database schema as `schema.sql` in your project directory. You can then apply it to your Supabase project using the CLI or Supabase dashboard.

### ▶️ Run the application

```bash
npm run dev
```

## 🛠 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + API + Auth)
- **Language**: TypeScript

## 📋 Usage

1. Visit the app and answer the survey questions.
2. Submit your answers.
3. View your submitted responses on the review page.

---

## 🔒 Security & RLS

Row Level Security is enabled:

- **Anyone** can read survey/questions/responses.
- **Anyone** can insert a new response and answers.
- Updates and deletes are restricted.

---

## 🛠 Possible Improvements

- User Authentication (sign-in, track user submissions)
- Single-question navigation with progress indicator
- More advanced form validation
- Admin dashboard for creating/editing surveys
- Mobile-first UI enhancements

---

## 💡 Why Supabase?

Supabase provides:

- A hosted PostgreSQL database
- Automatic API generation
- Row Level Security
- Real-time subscriptions
- Easy integration with modern frontend frameworks

This means no need to manually build a backend for our survey app, while still using a relational SQL database.
