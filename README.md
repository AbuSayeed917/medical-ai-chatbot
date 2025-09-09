# MedBot - AI Medical Education Chatbot

A comprehensive AI chatbot designed to help medical students learn about basic health issues, symptoms, diseases, anatomy, and medications. This educational tool provides interactive learning experiences while emphasizing that it's for educational purposes only and not a replacement for professional medical advice.

## 🏥 Features

### Core Functionality
- **Interactive Chat Interface**: Natural language conversations about medical topics
- **Medical Knowledge Base**: Comprehensive database of symptoms, diseases, medications, and anatomy
- **Educational Focus**: Designed specifically for medical students and healthcare education
- **Real-time Responses**: Powered by OpenAI GPT for intelligent, contextual responses
- **Medical Context Integration**: Provides relevant medical information based on query analysis

### Educational Tools
- **Suggested Questions**: Topic-based question suggestions to guide learning
- **Medical Search**: Direct search functionality for medical terms and concepts
- **Quiz System**: Interactive quizzes on various medical topics
- **Related Topics**: Suggestions for further study based on current conversations

### Safety & Ethics
- **Educational Disclaimer**: Clear messaging about educational purpose only
- **Professional Guidance**: Consistent reminders to consult healthcare professionals
- **Verified Information**: Medical knowledge base with verified, reliable sources
- **Appropriate Scope**: Focus on basic health issues suitable for educational purposes

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AIChatbot
   ```

2. **Set up Backend**
   ```bash
   cd backend
   npm install
   cp ../.env.example .env
   # Edit .env with your configuration
   ```

3. **Set up Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Set up Database**
   ```bash
   cd ../database/seeds
   node medicalKnowledge.js
   ```

### Configuration

1. **Environment Variables**
   Copy `.env.example` to `.env` and configure:
   ```bash
   MONGODB_URI=mongodb://localhost:27017/medical-chatbot
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```

2. **Database Setup**
   - Install MongoDB locally or use MongoDB Atlas
   - Run the seed script to populate medical knowledge base

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend Application**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`
   - API Health Check: `http://localhost:5000/api/health`

## 📁 Project Structure

```
AIChatbot/
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── server.js       # Main server file
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── config/         # Configuration files
│   └── package.json
├── frontend/               # Next.js frontend
│   ├── app/                # Next.js app directory
│   │   ├── page.tsx        # Home page
│   │   ├── layout.tsx      # Root layout
│   │   └── search/         # Search page
│   ├── components/         # React components
│   ├── contexts/           # React contexts
│   ├── lib/                # Utility functions
│   ├── styles/             # Global styles
│   ├── next.config.js      # Next.js configuration
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── package.json
├── database/
│   ├── schemas/            # Database schema documentation
│   ├── seeds/              # Database seed files
│   └── migrations/         # Database migrations
├── docs/                   # Documentation
├── tests/                  # Test files
└── README.md
```

## 🔧 API Endpoints

### Chat Endpoints
- `POST /api/chat/message` - Send message to chatbot
- `GET /api/chat/history/:sessionId` - Get chat history
- `DELETE /api/chat/history/:sessionId` - Clear chat history
- `GET /api/chat/suggestions` - Get suggested questions

### Medical Information Endpoints
- `GET /api/medical/symptoms/:symptom` - Get symptom information
- `GET /api/medical/diseases/:disease` - Get disease information
- `GET /api/medical/medications/:medication` - Get medication information
- `GET /api/medical/anatomy/:organ` - Get anatomy information
- `GET /api/medical/search` - Search medical terms
- `GET /api/medical/quiz/:category` - Get quiz questions

## 🎓 Educational Use Cases

### For Medical Students
- **Symptom Analysis**: Learn about common symptoms and their implications
- **Disease Understanding**: Comprehensive information about various medical conditions
- **Medication Knowledge**: Drug information, interactions, and usage guidelines
- **Anatomy Review**: Structural and functional information about body systems

### For Study Groups
- **Interactive Learning**: Group discussions facilitated by AI responses
- **Quiz Sessions**: Collaborative quizzing on medical topics
- **Case Discussions**: Explore medical scenarios and differential diagnoses

### For Self-Study
- **Guided Learning**: Follow suggested topics and questions
- **Knowledge Testing**: Self-assessment through interactive quizzes
- **Research Starting Point**: Begin research with reliable medical information

## ⚕️ Medical Disclaimer

**IMPORTANT**: This chatbot is designed for educational purposes only and is intended to support medical education. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare providers with any questions you may have regarding medical conditions.

### Key Points:
- Information provided is for educational purposes only
- Not intended for diagnostic or treatment purposes
- Always consult healthcare professionals for medical advice
- Emergency situations require immediate professional medical attention
- The chatbot emphasizes these points in all interactions

## 🛠️ Technology Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **OpenAI API**: AI-powered responses
- **Socket.IO**: Real-time communication

### Frontend
- **Next.js**: React framework with SSR/SSG support
- **React**: UI library
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animations
- **Axios**: HTTP client
- **React Hot Toast**: Notifications
- **Lucide React**: Modern icon library
- **TypeScript**: Type safety

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Integration tests
cd tests
npm run test:integration
```

### Test Coverage
- Unit tests for services and utilities
- Integration tests for API endpoints
- Component tests for React components
- End-to-end tests for critical user flows

## 📚 Development Guidelines

### Code Style
- ESLint configuration for consistent code style
- Prettier for code formatting
- Clear commenting and documentation
- Modular, reusable components

### Security Considerations
- Input validation and sanitization
- Rate limiting on API endpoints
- Secure handling of sensitive data
- CORS configuration for frontend-backend communication

### Performance Optimization
- Efficient database queries
- Response caching where appropriate
- Code splitting in frontend
- Image and asset optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with appropriate tests
4. Ensure all tests pass
5. Submit a pull request

### Development Setup
```bash
# Backend setup
cd backend
npm install
npm run dev

# Frontend setup (in new terminal)
cd frontend
npm install
npm run dev

# Database seeding
cd database/seeds
node medicalKnowledge.js
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Medical professionals who provided educational content guidance
- Open-source medical databases and resources
- The medical education community for feedback and requirements
- Contributors who helped build and improve the system

## 📞 Support

For questions, issues, or contributions:
- Create an issue in the repository
- Contact the development team
- Refer to the documentation in the `docs/` directory

---

**Remember**: This is an educational tool designed to support learning. Always consult qualified healthcare professionals for actual medical advice and treatment.