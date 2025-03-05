# Gavel XYZ - Online Charity Auction Platform

## Project Overview
Gavel XYZ is an online auction platform dedicated to charity fundraising. The platform allows users to list items for auction, place bids, and connect with charitable causes. This project was developed as part of a group assignment for a Software Development HND course.

## Technology Stack
- **Frontend**: React with TypeScript, built using Vite
- **Backend**: Python with Flask
- **Database**: MongoDB Atlas

## Features
- User registration and authentication
- Auction item listing and management
- Bidding system
- Charity profiles and integration
- Review system for auction items
- Question and answer functionality
- Category-based browsing
- Search functionality

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
