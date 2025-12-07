Milestone 1: Physical AI Textbook Platform & Chapter Structure

## Intent
Build the core web platform for the "Physical AI & Humanoid Robotics" interactive textbook using Docusaurus. This includes the landing page, the content architecture for future chapters, and a functional "Hands-on Lab" template. The goal is to have a deployable site where users can read "Chapter 1" and interact with a simulated code block.

## User Stories
* **As a Learner**, I want to visit a landing page that clearly explains the "Sim-to-Real" concept so I understand the book's value.
* **As a Developer**, I want a standard "Chapter Template" (MDX) that includes a Theory section, a Code Block, and a "Chat with Agent" placeholder so I can easily add new chapters.
* **As a Reader**, I want to toggle between "English" and "Urdu" on the landing page (UI mock-up only for now) to see accessibility features.

## Functional Requirements
1. **Landing Page:**
   - Hero section with title: "Physical AI: From Simulation to Reality".
   - Feature grid highlighting: ROS 2, Isaac Sim, and RAG Chatbot.
   - "Start Learning" button linking to the Introduction.
2. **Content Engine (Docusaurus):**
   - Sidebar navigation organized by: Part 1 (Fundamentals), Part 2 (Simulation), Part 3 (Real World).
   - Theme configuration customized with a "Robotics/Cyberpunk" clean aesthetic (dark mode default).
3. **Chapter 1 (Skeleton):**
   - Title: "Introduction to Embodied Intelligence".
   - Content: Brief text explaining the difference between AI Agents and Physical Robots.
   - Component: A React component inside MDX that displays a mock "System Status: Online" for a robot.

## Implementation Constraints (Derived from Constitution)
*   **Platform:** Web content platform leveraging modern JavaScript frameworks.
*   **Language:** Typed JavaScript for interactive components, Markdown for textual content.
*   **Styling:** Utility-first CSS framework for custom components.
*   **Deployment:** Static site generation compatible with web hosting platforms.

## Success Criteria (SMART)
*   **Verify:** Landing page displays without visible errors.
*   **Verify:** Navigation from the landing page to introductory content functions as expected.
*   **Verify:** The mock "System Status" component in Chapter 1 renders correctly.
*   **Verify:** Automated accessibility audit (e.g., Lighthouse) score consistently exceeds 90.

## Non-Goals
* Integrating the actual RAG Chatbot backend (UI placeholder only).
* Writing the full content for Chapters 2-10.
* Configuring the real ROS 2 simulation backend (content only).