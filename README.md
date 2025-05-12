# Gavel XYZ - Setup and Installation Guide

## Hardware Requirements

### Minimum Requirements
- **Processor**: Dual-core 2.0 GHz or higher
- **RAM**: 4GB (8GB recommended for development)
- **Storage**: 1GB free disk space for application code and dependencies
- **Internet Connection**: Broadband connection required for MongoDB Atlas access

### Recommended Requirements
- **Processor**: Quad-core 2.5 GHz or higher
- **RAM**: 8GB or more
- **Storage**: 2GB+ free disk space
- **Internet Connection**: High-speed broadband connection

## Software Requirements

### Development Environment
- **Operating System**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+ recommended)
- **Code Editor**: Visual Studio Code, WebStorm, or any preferred IDE
- **Version Control**: Git 2.30.0+
- **Web Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+ (for testing and development)

### Backend Requirements
- **Python**: Version 3.8 or higher
- **pip**: Latest version
- **Virtual Environment**: virtualenv or venv recommended

### Frontend Requirements
- **Node.js**: Version 16.0 or higher
- **npm**: Version 7.0 or higher (included with Node.js)

### Database
- **MongoDB Atlas**: Free tier account or higher
- **MongoDB Compass**: (Optional) For visual database management


## Installation Guide

### Step 1: Clone the Repository
```bash
git clone https://github.com/Cache-me-if-u-can/AuctionWebsite.git
cd AuctionWebsite
```

### Step 2: Backend Setup
1. Navigate to the Python directory:
   ```bash
   cd PythonPart
   ```

2. Create and activate a virtual environment:
   ```bash
   # For Windows
   python -m venv venv
   venv\Scripts\activate

   # For macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

5. Start the Flask server:
   ```bash
   python app.py
   ```
   The backend server should now be running at http://localhost:8080

### Step 3: Frontend Setup
1. Open a new terminal window
   
2. Navigate to the React directory:
   ```bash
   cd ReactPart
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend application should now be running at http://localhost:5173
