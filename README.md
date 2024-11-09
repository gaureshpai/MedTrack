# MedTrack - Patient Medical History Management System

**MedTrack** is a comprehensive web application designed to securely manage and streamline patient medical history for healthcare providers, government officials, and patients. By centralizing health records, MedTrack improves access to crucial medical data, facilitates better patient care, and enables informed decision-making for healthcare policy.

## Key Features
- **Role-Based Access Control**: Supports four roles with tailored permissions:
  - **Patients**: Read-only access to their medical history.
  - **Doctors & Hospitals**: Read and update permissions, allowing them to provide and review treatment data seamlessly.
  - **Government Officials**: Read access to view patient history based on Aadhaar (or passport for non-Indian residents), check health trends, and analyze district-wise disease data for proactive healthcare measures.
  
- **Disease Data Analysis**: Generates district-wise visualizations and trend graphs for disease data, helping officials identify patterns, potential outbreaks, and regional healthcare needs.

- **Secure Identification System**: Uses Aadhaar number as the unique identifier for Indian citizens and passport numbers for non-Indian residents in India, ensuring secure and reliable patient identification.

- **User-Friendly Dashboard**: An intuitive interface providing quick access to patient details, medical history updates, and administrative insights. 

## Tech Stack
- **Frontend**: Next.js, Tailwind CSS for a modern, responsive UI.
- **Backend**: Node.js and a secure database for storing and managing patient information.
- **Authentication**: Secure role-based login for all users.

## Goals
- Enhance accessibility to critical health data while maintaining privacy.
- Empower healthcare providers with comprehensive, up-to-date patient data.
- Support government health monitoring and proactive healthcare planning.
