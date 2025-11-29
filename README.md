# Expo Navigation Tutorial App 📱

![Expo Navigation Banner](https://img.shields.io/badge/Expo-Navigation-blue?style=for-the-badge&logo=expo)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

An interactive, visual playground designed to help developers understand **Expo Router** navigation concepts. This web application visualizes how the navigation stack behaves with different actions like `navigate`, `push`, `replace`, and `dismissTo`.

## ✨ Features

- **3D Stack Visualization**: Watch screens push, pop, and replace in real-time with smooth Framer Motion animations.
- **Interactive Controls**: Manually trigger navigation actions to see exactly how they affect the stack.
- **Auto Tutorial Mode**: Run pre-configured scenarios (like a "Restaurant App" flow) to sit back and learn.
- **Live Activity Log**: Get a clear text explanation of every action that occurs (e.g., "Dismissed 2 screens to reach...").
- **Mock File System**: Visualizes how your file structure maps to routes in Expo Router.

## 🚀 Live Demo

[Check out the Live Demo here!](https://faymir.github.io/expo-stacks/) _(Replace with your actual URL after deployment)_

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, clsx, tailwind-merge
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React
- **Package Manager**: Bun

## 📦 Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/expo-stacks.git
    cd expo-stacks
    ```

2.  **Install dependencies**

    ```bash
    bun install
    # or
    npm install
    ```

3.  **Start the development server**
    ```bash
    bun dev
    # or
    npm run dev
    ```

## 🎮 Usage

### Manual Mode

Use the control panel on the right to:

- Select a target route from the dropdown.
- Add optional JSON parameters.
- Click **Navigate**, **Push**, **Replace**, or **DismissTo**.

### Auto Mode

1. Click the **Auto Tutorial** dropdown.
2. Select a scenario (e.g., "Full Restaurant Flow").
3. Click **Start Scenario** and watch the magic happen!

## 📚 Navigation Concepts

- **Navigate**: Moves to a screen. If it already exists in the stack, it pops back to it.
- **Push**: Always adds a new screen on top, even if it's a duplicate.
- **Replace**: Swaps the current screen with a new one (no history added).
- **DismissTo**: Pops screens off the stack until a specific route is reached. If not found, it replaces the current screen.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
