# 🚌 Alameda CTC GRH Reimbursement Chatbot

This project implements a chat-based interface for employees to submit Guaranteed/Emergency Ride Home (GRH) reimbursement claims. It showcases robust state management (XState) and a full-stack, containerized architecture.

## ⚙️ Technology Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend/API** | **Node.js** with **Express.js** | Handles routing, serves the frontend, and manages the mock API endpoint. |
| **State Management** | **XState** (State Machine) | Manages the complex conversational flow, ensures strict step-by-step progress, and handles validation. |
| **Templating** | **Pug (formerly Jade)** | Provides a clean, minimalist syntax for structuring the HTML frontend. |
| **Containerization** | **VS Code Dev Containers / Docker** | Ensures a consistent development environment including Node, PostgreSQL, and Redis (for future use). |

***

## 🚀 Environment Setup & Installation

This project is configured to run fully within a **VS Code Dev Container** to provide a consistent environment with all necessary services (Node, Postgres, Redis) already linked.

### Prerequisites

1.  **Docker Desktop** (or equivalent Docker engine)
2.  **VS Code**
3.  **VS Code Remote - Containers Extension**

### Installation Steps

1.  **Clone the Repository:**
    ```bash
    git clone [repository-url]
    cd [repository-name]
    ```

2.  **Open in Container:**
    * Open the project folder in VS Code.
    * VS Code should prompt: **"Folder contains a Dev Container configuration file. Reopen in Container?"**
    * Click **"Reopen in Container."**
    * *The container will build (using the provided `devcontainer.json` and `docker-compose.yml`), install dependencies (`npm install`), and connect to the Postgres and Redis services.*

3.  **Start the Server:**
    Once VS Code is connected to the container, open the integrated terminal (`Ctrl+\` or `Terminal > New Terminal`).

    ```bash
    npm start
    ```

4.  **Access the Application:**
    The Express server will be running inside the container on port `3000`. Access the application on your host machine:

    👉 **[http://localhost:3000](http://localhost:3000)**

***

## 💡 Approach and Architecture

Given the strict 60-minute time constraint, the priority was establishing a **robust architecture** that separates concerns.

### 1. Conversational UX via XState (The "Brain")

The entire conversational flow is modeled as a **Finite State Machine** using **XState**. This design uses:

* **States:** Each required piece of information (e.g., `date`, `origin`, `cost`) is its own state.
* **Guards (`cond`):** Handle **basic validation** (e.g., checking date/cost validity) before allowing a state transition.
* **Context:** Stores the aggregated `formData` object used for the final API payload structure. 

### 2. Full-Stack Demonstration

The solution establishes a live **Express API endpoint** (`/api/submit-reimbursement`) that:

* Uses **Multer** to correctly handle file uploads (receipts).
* Mocks the process of saving the file to the local `uploads/` directory inside the container.
* Aggregates the final data payload before simulating a successful submission.

***

## ⏳ Features to Add With More Time

The following features were prioritized for future development to address edge cases and enhance the user experience:

* **"Go Back" / Edit Functionality:** Implement a `BACK` event in the XState machine to allow users to return to a previous step and edit answers without restarting.
* **Postgres Integration:** Integrate the application logic to persist submission metadata into the running **PostgreSQL** database service, rather than just logging it.
* **Date Range Validation:** Implement a guard to ensure the trip date is within the program's specific reimbursement window.
* **File Type/Size Limits:** Add both client-side and server-side checks to enforce limits on receipt file size and acceptable formats.