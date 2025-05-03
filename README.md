# Gavel XYZ - Online Charity Auction Platform

## Project Overview
Gavel XYZ is a fully-featured online auction platform dedicated to charity fundraising. The platform connects donors with charitable causes through a secure, real-time bidding system. Built with TypeScript and Python, it features a modern React frontend and a robust Flask backend, with real-time notifications and automated auction management.

## Technology Stack
- **Frontend**: React with TypeScript, built using Vite
- **Backend**: Python with Flask
- **Database**: MongoDB Atlas

## Features
### User Management
- User registration and authentication with JWT-based security
- Separate customer and charity account types
- Profile management with image upload
- Remember-me functionality for login
- CSRF protection implemented

### Auction System
- Real-time bidding with immediate price updates
- Anonymous bidding option
- Automated auction status management
- Scheduled checks for auction end dates
- Top bidders tracking
- Multiple sorting options (end date, current bid)
- Auction status tracking (active, completed, hidden)

### Charity Integration
- Dedicated charity profiles
- Custom charity dashboards
- Auction management for charities
- Integrated notification system

### Additional Features
- Advanced search and filtering
- Category-based browsing
- Review system
- Q&A functionality
- Real-time notifications
- Image handling for items and profiles

## Project Structure
The project is organized into two main directories:

### ReactPart
Contains the frontend React application with the following structure:
- `src/components`: Reusable UI components
- `src/pages`: Page-level components
- `src/types`: TypeScript type definitions
- `src/context`: React context providers
- `src/routes`: Routing configuration
- `src/assets`: Static resources like images

### PythonPart
Contains the backend Python application with the following structure:
- Data models (customer.py, auctionItem.py, etc.)
- Repository classes for database operations
- API endpoints in app.py
- Database connection management

## Setup and Installation

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- MongoDB Atlas account

### Backend Setup
1. Navigate to the PythonPart directory:
   ```
   cd PythonPart
   ```
2. Install required Python packages:
   ```
   pip install -r requirements.txt
   ```
3. Configure your MongoDB connection in bdConnection.py
4. Start the Flask server:
   ```
   python app.py
   ```

### Frontend Setup
1. Navigate to the ReactPart directory:
   ```
   cd ReactPart
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Team Members
- Stefanos
- Dominic
- Oliver
- Viktoriia
- Roman

## License
This project is intended for academic purposes only.
