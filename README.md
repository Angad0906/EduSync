# EduSync - Dynamic Scheduler

A comprehensive educational scheduling system with AI-powered optimization, designed to streamline academic timetable management for educational institutions.

## 🚀 Features

### Core Functionality
- **Dynamic Timetable Generation** - Automated schedule creation with conflict resolution
- **AI-Powered Optimization** - Machine learning algorithms for optimal resource allocation
- **Real-time Schedule Management** - Live updates and modifications
- **Multi-role Support** - Admin, instructor, and student dashboards
- **Conflict Detection** - Automatic identification and resolution of scheduling conflicts

### Advanced Features
- **Genetic Algorithm Optimization** - Advanced scheduling algorithms for complex constraints
- **PDF Export** - Generate printable timetables and reports
- **Analytics Dashboard** - Comprehensive insights and performance metrics
- **Teaching Practice Management** - Specialized scheduling for practical sessions
- **Field Work Coordination** - External activity scheduling and tracking
- **Scenario Planning** - Multiple schedule versions and what-if analysis

### User Experience
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Drag & Drop Interface** - Intuitive schedule manipulation
- **Real-time Notifications** - Instant updates on schedule changes
- **Dark/Light Mode** - Customizable interface themes
- **Multi-language Support** - Internationalization ready

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Headless UI** - Accessible UI components
- **Heroicons** - Beautiful SVG icons
- **DnD Kit** - Drag and drop functionality
- **Axios** - HTTP client for API requests
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### AI/ML Components
- **TensorFlow.js** - Machine learning library
- **Genetic Algorithms** - Optimization algorithms
- **Schedule Optimization** - Custom ML models for timetabling

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Angad0906/EduSync.git
cd EduSync
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the server directory:
```env
MONGODB_URI=mongodb://localhost:27017/dynamic-scheduler
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dynamic-scheduler

JWT_SECRET=your-super-secret-jwt-key
ADMIN_ID=your-admin-id
PORT=3001
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```

### 4. Start the Application

#### Development Mode
Start the backend server:
```bash
cd server
npm run dev
```

Start the frontend development server:
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

#### Production Mode
Build the frontend:
```bash
cd client
npm run build
```

Start the production server:
```bash
cd server
npm start
```

## 🔧 Configuration

### Environment Variables

#### Server (.env)
```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key
ADMIN_ID=your-admin-identifier
PORT=3001
NODE_ENV=production
```

### Database Setup
The application will automatically create the necessary collections and indexes when you first run it. Make sure your MongoDB instance is running and accessible.

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/verify` - Token verification

### Schedule Management
- `GET /api/schedule/latest` - Get latest schedules
- `POST /api/schedule/generate` - Generate new schedule
- `PUT /api/schedule/:id` - Update schedule
- `DELETE /api/schedule/:id` - Delete schedule

### User Management
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Analytics
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/reports` - Generate reports

## 🎯 Usage

### For Administrators
1. **Login** with admin credentials
2. **Manage Users** - Add instructors and students
3. **Create Courses** - Set up subjects and requirements
4. **Generate Schedules** - Use AI optimization for timetables
5. **Monitor Analytics** - Track system performance

### For Instructors
1. **View Schedules** - Check assigned classes and timings
2. **Update Availability** - Set preferred time slots
3. **Manage Teaching Practices** - Schedule practical sessions
4. **Export Timetables** - Download PDF schedules

### For Students
1. **View Personal Schedule** - Check class timetables
2. **Track Field Work** - Monitor external activities
3. **Receive Notifications** - Get updates on changes
4. **Export Schedule** - Download personal timetable

## 🤖 AI Features

### Genetic Algorithm Optimization
The system uses genetic algorithms to optimize schedules by:
- Minimizing conflicts between classes
- Maximizing resource utilization
- Balancing instructor workloads
- Optimizing room assignments

### Machine Learning Models
- **Conflict Prediction** - Predicts potential scheduling conflicts
- **Resource Optimization** - Optimizes classroom and equipment usage
- **Performance Analytics** - Analyzes scheduling efficiency

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt encryption for user passwords
- **Role-based Access Control** - Different permissions for different user types
- **Input Validation** - Server-side validation for all inputs
- **CORS Protection** - Configured cross-origin resource sharing

## 🧪 Testing

Run the test suite:
```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

## 📦 Deployment

### Using Docker (Recommended)
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Manual Deployment
1. Build the frontend: `npm run build` in client directory
2. Set production environment variables
3. Start the server: `npm start` in server directory
4. Configure reverse proxy (nginx recommended)

### Environment-specific Configurations
- **Development**: Hot reloading, detailed error messages
- **Production**: Optimized builds, error logging, security headers

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Angad** - *Initial work* - [Angad0906](https://github.com/Angad0906)

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Inspired by modern educational management needs
- Built with love for the education community

## 📞 Support

If you encounter any issues or have questions:

1. **Check** the [Issues](https://github.com/Angad0906/EduSync/issues) page
2. **Create** a new issue if your problem isn't already reported
3. **Provide** detailed information about your environment and the issue

## 🗺️ Roadmap

### Upcoming Features
- [ ] Mobile application (React Native)
- [ ] Advanced analytics with charts
- [ ] Integration with external calendar systems
- [ ] Automated email notifications
- [ ] Multi-campus support
- [ ] Advanced reporting features
- [ ] API rate limiting
- [ ] Comprehensive audit logging

### Version History
- **v1.0.0** - Initial release with core scheduling features
- **v1.1.0** - Added AI optimization and analytics
- **v1.2.0** - Enhanced UI/UX and mobile responsiveness

---

**Made with ❤️ for educational institutions worldwide**