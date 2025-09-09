# Medical Chatbot Database Schema

## Collections

### ChatSession
Stores chat conversation sessions between users and the medical chatbot.

```javascript
{
  _id: ObjectId,
  sessionId: String (unique, required),
  userId: String (required),
  messages: [
    {
      role: String (enum: ['user', 'assistant'], required),
      content: String (required),
      timestamp: Date (default: Date.now),
      metadata: {
        confidence: Number,
        category: String,
        medicalTerms: [String],
        relatedTopics: [String]
      }
    }
  ],
  topic: String (default: 'general'),
  isActive: Boolean (default: true),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### MedicalKnowledge
Contains verified medical information for educational purposes.

```javascript
{
  _id: ObjectId,
  term: String (unique, required),
  category: String (enum: ['symptom', 'disease', 'medication', 'anatomy', 'procedure', 'general'], required),
  definition: String (required),
  description: String,
  synonyms: [String],
  relatedTerms: [String],
  severity: String (enum: ['low', 'medium', 'high', 'emergency']),
  commonCauses: [String],
  symptoms: [String],
  treatments: [String],
  prevention: [String],
  whenToSeeDoctor: String,
  medicalSpecialty: [String],
  ageGroup: [String],
  sources: [
    {
      name: String,
      url: String,
      reliability: String (enum: ['high', 'medium', 'low'])
    }
  ],
  lastUpdated: Date (default: Date.now),
  isVerified: Boolean (default: false)
}
```

## Indexes

### ChatSession Indexes
- `sessionId`: Unique index for fast session lookup
- `userId`: Index for user-specific queries
- `createdAt`: Index for temporal queries

### MedicalKnowledge Indexes
- `term`: Text index for search functionality
- `description`: Text index for content search
- `category`: Index for category-based filtering
- `isVerified`: Index for filtering verified content

## Data Relationships

### Session → Messages
- One-to-many relationship
- Each session contains multiple messages
- Messages are embedded documents for better performance

### Medical Knowledge → Chat Context
- Medical knowledge is referenced during chat processing
- Terms and categories are used for contextual responses
- Related terms create knowledge graphs for better suggestions

## Usage Patterns

### Chat Flow
1. Create new session with unique sessionId
2. Add user message to session.messages
3. Process message through medical analysis
4. Query MedicalKnowledge for context
5. Generate AI response with medical context
6. Add assistant response to session.messages

### Knowledge Lookup
1. Analyze user query for medical terms
2. Search MedicalKnowledge by term/category
3. Return relevant information
4. Update chat context with found knowledge

## Performance Considerations

### Indexing Strategy
- Text indexes on searchable fields
- Compound indexes for common query patterns
- TTL indexes for session cleanup (optional)

### Query Optimization
- Limit message history in responses
- Cache frequently accessed medical knowledge
- Use aggregation pipelines for complex queries

### Scaling Considerations
- Consider sharding by userId for horizontal scaling
- Implement read replicas for knowledge queries
- Archive old chat sessions periodically