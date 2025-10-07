# Otto's Math Adventure 🐙 - AI-Powered Math Tutor

An interactive, AI-powered math problem generator designed for Primary 5 students (Singapore curriculum). Features an engaging octopus character named Otto who provides personalized tutoring, adaptive difficulty levels, and real-time feedback using Google's Gemini AI.

## 🌟 Live Demo & Credentials

**Live Demo URL**: [Your Vercel Deployment URL]

### Supabase Project Credentials (For Testing)

```
SUPABASE_URL: [Your Supabase Project URL]
SUPABASE_ANON_KEY: [Your Supabase Anon Key]
```

## 📚 Tech Stack

- **Frontend**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS with custom gradient designs
- **AI Integration**: Google Generative AI (Gemini 2.5 Flash)
- **Database**: Supabase (PostgreSQL)
- **UI Libraries**: react-hot-toast for notifications
- **Deployment**: Vercel

## ✨ Key Features

### 🎯 Core Functionality

1. **AI-Powered Problem Generation**
   - Dynamic word problem generation using Gemini AI
   - Aligned with Singapore Primary 5 Mathematics curriculum
   - Real-world contexts (shopping, travel, measurements, school scenarios)

2. **Adaptive Difficulty Levels**
   - **Easy**: 1-2 step problems, simple numbers (<100), basic operations
   - **Medium**: 2-3 step problems, mixed operations, fractions with mixed numbers
   - **Hard**: 3-4 step problems, complex scenarios, advanced topics

3. **Multiple Problem Types**
   - Mixed (all operations)
   - Addition-focused
   - Subtraction-focused
   - Multiplication-focused
   - Division-focused

4. **Intelligent Feedback System**
   - AI-generated personalized feedback for each answer
   - Encouragement for correct answers
   - Gentle guidance and explanations for incorrect answers
   - Context-aware responses based on student performance

### 🐙 Otto the Octopus - AI Tutor Companion

5. **Dynamic Personality System**
   - Time-based greetings (morning/afternoon/evening)
   - Streak-aware motivation messages
   - Score-based encouragement
   - Interactive chat interface

6. **Interactive Features**
   - Floating chat avatar with animations
   - Real-time motivational messages
   - Math tips and pro strategies
   - Fun octopus facts and personality
   - App walkthrough and FAQ buttons

### 📊 Progress Tracking

7. **Comprehensive Analytics**
   - Score tracking (10 points per correct answer)
   - Streak counter with fire emoji 🔥
   - Problem history (last 10 attempts)
   - Detailed review of past problems with correct answers

8. **Local Persistence**
   - All progress saved to localStorage
   - User name persistence
   - Score, streak, and history preservation
   - Settings (difficulty, problem type) saved
   - Tutorial completion status tracking

### 🎓 Interactive Tutorial System

9. **First-Time User Onboarding**
   - Automatic tutorial on first visit
   - 7-step guided tour of all features
   - Mock data preview (sample problems and history)
   - Smart tab navigation (mobile) / adaptive positioning (desktop)

10. **Tutorial Features**
    - **Step 1**: Score & Streak tracking explained
    - **Step 2**: Difficulty level and problem type customization
    - **Step 3**: New problem generation button
    - **Step 4**: Answer input field and submission
    - **Step 5**: Hint button functionality
    - **Step 6**: Solution steps display
    - **Step 7**: Problem history review
    - Purple spotlight highlighting on active elements
    - Dynamic modal positioning to avoid covering buttons
    - Skip, Previous, and Next navigation
    - Progress indicators with step dots
    - "Show Tutorial" button available anytime (mobile & desktop)

### 🎨 User Experience

11. **Responsive Design**
    - Mobile-first approach with tab navigation
    - Desktop sidebar layout with all info visible
    - Smooth animations and transitions
    - Gradient backgrounds and modern UI
    - Touch-friendly buttons for mobile

12. **Helpful Learning Tools**
    - Hint system for each problem
    - Step-by-step solution display
    - Visual feedback with color-coded responses
    - Toast notifications for all actions

13. **User Customization**
    - Name personalization with edit option
    - Progress reset with confirmation modal
    - Real-time difficulty switching
    - Problem type filtering

14. **Modal System**
    - **Confirmation Modal**: Safe progress reset with warning
    - **Problem Detail Modal**: Deep dive into past problems with hints and solutions
    - **Tutorial Modal**: Interactive onboarding experience
    - Smart backdrop overlays and animations

## 🏗️ Architecture & Implementation

### Frontend Structure

```
app/
├── page.tsx              # Main application component with tutorial integration
├── layout.tsx            # Root layout with Toaster
├── globals.css           # Global styles and animations
└── api/
    └── math-problem/
        ├── route.ts      # Problem generation endpoint
        └── submit/
            └── route.ts  # Answer submission endpoint

components/
├── OttoTutor.tsx         # Interactive tutor chat component
├── ConfirmModal.tsx      # Reusable confirmation dialog
├── ProblemDetailModal.tsx # Detailed problem review modal
└── TutorialModal.tsx     # Interactive tutorial system

lib/
├── ottoPersonality.ts    # Otto's personality and messages
├── supabaseClient.ts     # Supabase configuration
└── types.ts              # TypeScript type definitions
```

### API Routes

#### POST /api/math-problem
- Generates new math problems using Gemini AI
- Accepts: `{ difficulty, problemType }`
- Returns: `{ session_id, problem_text, hint, solution_steps }`
- Saves problem to database with correct answer

#### POST /api/math-problem/submit
- Validates user answers and generates feedback
- Accepts: `{ session_id, user_answer }`
- Returns: `{ is_correct, feedback_text, correct_answer }`
- Stores submission with timestamp and feedback

### Database Schema

#### math_problem_sessions
```sql
- id (uuid, primary key)
- problem_text (text)
- correct_answer (numeric)
- created_at (timestamp)
```

#### math_problem_submissions
```sql
- id (uuid, primary key)
- session_id (uuid, foreign key)
- user_answer (numeric)
- is_correct (boolean)
- feedback_text (text)
- created_at (timestamp)
```

## 💡 Implementation Highlights

### 1. **AI Prompt Engineering**

I invested significant effort in crafting comprehensive prompts for Gemini AI:

- **Problem Generation**: Detailed prompts with difficulty-specific requirements, topic guidance (Primary 5 curriculum), and structured JSON output format
- **Feedback Generation**: Context-aware prompts that consider the problem, both answers, and correctness to generate age-appropriate, encouraging feedback
- **Curriculum Alignment**: Prompts explicitly reference Singapore Math topics (fractions, decimals, percentage, rate, ratio, area, volume)

### 2. **Otto's Personality System**

Created a rich personality layer that makes learning engaging:

- **Dynamic Message Selection**: Randomly selected messages prevent repetition
- **Context-Aware Responses**: Different messages based on streak, score, time of day, and performance
- **Encouragement Tiers**: Graduated praise system (3+ streak, 5+ streak, 10+ streak)
- **Educational Tips**: Built-in math learning strategies and problem-solving tips
- **App Walkthrough**: Comprehensive feature explanation available on demand
- **FAQ System**: Common questions answered through Otto's chat

### 3. **Interactive Tutorial System**

Implemented a comprehensive onboarding experience:

- **First-Visit Detection**: Automatically triggers for new users after name entry
- **Mock Data Preview**: Shows sample problems and history during tutorial so users understand features before generating their first problem
- **Smart Navigation**: Automatically switches mobile tabs to show relevant features
- **Adaptive Positioning**: Modal moves between left/right on desktop to never cover highlighted elements
- **Visual Highlighting**: Purple spotlight with dark overlay creates clear focus
- **Tutorial Mode State**: Disables interactions during tutorial to prevent confusion
- **Replay Capability**: "Show Tutorial" button available anytime for returning users
- **LocalStorage Integration**: Tracks tutorial completion to avoid repeated interruptions

### 4. **State Management & Persistence**

Implemented robust client-side state management:

- **localStorage Integration**: All user progress persists across sessions
- **Initialization Guard**: Prevents unnecessary saves on mount
- **Type Safety**: Full TypeScript implementation with interfaces
- **Optimistic Updates**: Immediate UI feedback with backend sync
- **Tutorial State**: Separate tutorial mode flag to show mock data
- **Mock Data Display**: Smart switching between real and sample data during tutorial

### 5. **Responsive Design Patterns**

Two distinct layouts for optimal UX:

- **Mobile**: Tab-based navigation (Problem/Settings/History) with sticky header
- **Desktop**: Sidebar layout with all information visible simultaneously
- **Adaptive Components**: Components adjust behavior based on screen size
- **Touch-Friendly**: Large buttons and tap targets for mobile users
- **Tutorial Adaptation**: Modal positioning optimized for both mobile (bottom) and desktop (side)

### 6. **Modal Architecture**

Built a flexible modal system with multiple use cases:

- **Confirmation Modal**: Reusable component for destructive actions (reset progress)
- **Problem Detail Modal**: Rich review of past attempts with full context
- **Tutorial Modal**: Complex multi-step experience with navigation and highlighting
- **Smart Overlays**: Backdrop clicks close modals, ESC key support
- **Z-Index Management**: Proper layering (backdrop z-100, spotlight z-101, modal z-102)
- **Animation System**: Smooth fade-in/fade-out transitions

### 7. **User Experience Details**

Small touches that enhance the experience:

- **Toast Notifications**: Non-intrusive feedback for all actions
- **Loading States**: Clear indicators during AI processing
- **Animations**: Smooth transitions, fade-ins, and Otto's bounce animation
- **Color Psychology**: Green for success, orange/red for errors, purple/blue for branding
- **Disabled States**: Buttons properly disabled during loading or after submission

### 8. **Error Handling & Validation**

Comprehensive error management:

- **API Error Catching**: Try-catch blocks with user-friendly error messages
- **Input Validation**: Type checking and required field enforcement
- **Database Error Handling**: Graceful failures with informative feedback
- **Session Validation**: Checks for valid session IDs before submission

## 🎓 Design Decisions & Rationale

### Why Google Gemini 2.5 Flash?

- **Speed**: Fast response times for real-time problem generation
- **Quality**: Excellent at structured JSON output and following complex instructions
- **Cost-Effective**: Free tier suitable for prototyping and assessment
- **Reliability**: Consistent formatting and appropriate content generation

### Why Supabase?

- **Rapid Setup**: Quick database provisioning with real-time capabilities
- **Built-in Auth**: Ready for future user authentication features
- **Row Level Security**: Built-in security policies
- **PostgreSQL**: Reliable, proven database technology
- **Free Tier**: Generous limits for assessment and small-scale deployment

### Why localStorage Over Database for Progress?

- **No Authentication**: Simplified user experience without login requirements
- **Privacy**: No personal data stored on servers
- **Performance**: Instant load times and updates
- **Offline Capability**: Progress tracking works without internet (after first load)
- **Demo-Friendly**: Easy for assessors to test without account creation

### Why Build an Interactive Tutorial?

- **Reduced Learning Curve**: New users understand all features immediately
- **Higher Engagement**: Interactive walkthrough is more engaging than static instructions
- **Feature Discovery**: Users discover advanced features (hints, solutions) they might miss
- **Confidence Building**: Mock data preview shows what to expect without pressure
- **Reduced Support Needs**: Self-service onboarding reduces confusion
- **Professional Touch**: Polished tutorial experience creates positive first impression

### Tutorial Design Decisions

1. **Mock Data Strategy**: Show sample problems/history during tutorial so users can see features before generating their first problem
2. **Smart Positioning**: Modal moves dynamically to never cover highlighted buttons
3. **Skip Option**: Respects user's time while offering thorough walkthrough
4. **Step Navigation**: Both forward/backward navigation and direct step jumping
5. **Visual Highlighting**: Purple glow makes it crystal clear what's being explained
6. **Replay Access**: Tutorial button always available for reference or new feature discovery

### Architecture Patterns

1. **Server Components by Default**: Next.js App Router with 'use client' only where needed
2. **API Route Handlers**: Clean separation of concerns between frontend and backend
3. **Type Safety**: Comprehensive TypeScript interfaces prevent runtime errors
4. **Component Composition**: Reusable components (OttoTutor, ConfirmModal)
5. **Single Source of Truth**: State managed in parent component, props passed down

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ottodot-coding-task-full-stack
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a free account at [https://supabase.com](https://supabase.com)
2. Create a new project
3. Go to SQL Editor and run the contents of `database.sql`
4. Get your Project URL and Anon Key from Settings → API

### 4. Get Google AI API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key for Gemini

### 5. Configure Environment Variables

Create `.env.local` in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_API_KEY=your_google_gemini_api_key
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📦 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in project settings
4. Deploy!

Vercel automatically detects Next.js and configures build settings.

## 🎯 Challenges Faced & Solutions

### Challenge 1: Consistent AI Output Format

**Problem**: Gemini sometimes returned markdown code blocks or inconsistent JSON
**Solution**: Implemented robust text cleaning with regex to strip markdown formatting before JSON parsing

```typescript
const cleanedText = text.trim().replace(/```json\n?|\n?```/g, '');
```

### Challenge 2: Mobile Navigation Complexity

**Problem**: Desktop sidebar layout didn't work well on mobile
**Solution**: Created separate mobile tab-based navigation system with conditional rendering based on screen size

### Challenge 3: State Persistence on Initial Load

**Problem**: localStorage saves triggered on initial mount, overwriting saved values
**Solution**: Implemented `isInitialized` flag to prevent saves until after initial data load

### Challenge 4: Engaging User Experience

**Problem**: Standard math practice apps can be boring
**Solution**: Created Otto's personality system with dynamic messages, animations, and a chat interface to make learning fun

### Challenge 5: Curriculum Alignment

**Problem**: Ensuring problems matched Primary 5 Singapore curriculum
**Solution**: Researched curriculum and created detailed prompts with specific topic lists and difficulty requirements

### Challenge 6: Tutorial Element Highlighting

**Problem**: Tutorial modal was covering the elements it was meant to highlight
**Solution**: Implemented dynamic positioning system that moves the modal to the left side for hint/solution buttons and right side for other features, with adaptive behavior for mobile (bottom) vs desktop (side)

### Challenge 7: Tutorial Mock Data Display

**Problem**: New users can't see tutorial features (history, hints, solutions) without first generating problems
**Solution**: Created mock problem and history data that displays only during tutorial mode, giving users a complete preview of all features before their first real problem

### Challenge 8: Mobile vs Desktop Tutorial Experience

**Problem**: Desktop shows sidebar with all features visible, mobile uses tabs - tutorial needs to work differently
**Solution**: Implemented `onStepChange` callback that automatically switches mobile tabs to show the feature being explained, while desktop tutorial just positions the modal appropriately

## 🌟 Features I'm Proud Of

1. **Interactive Tutorial System** - The 7-step guided tour with mock data preview and smart positioning creates an exceptional onboarding experience
2. **Otto's Personality System** - The dynamic, context-aware messaging creates a genuine tutoring experience
3. **Comprehensive Mobile UX** - The tab-based mobile interface works smoothly and intuitively
4. **AI Prompt Engineering** - The detailed prompts consistently generate high-quality, curriculum-aligned problems
5. **Modal Architecture** - Flexible, reusable modal system handles multiple use cases elegantly
6. **Progress Persistence** - localStorage implementation creates a seamless experience without authentication
7. **Responsive Design** - Single codebase adapts beautifully from mobile to desktop
8. **Type Safety** - Full TypeScript implementation prevents bugs and improves development experience
9. **Hint & Solution System** - Pedagogically sound approach to help students learn, not just get answers
10. **Adaptive Tutorial Positioning** - Modal intelligently moves to never obstruct highlighted features

## 🔮 Future Enhancements

If I had more time, I would add:

- [ ] User authentication with Supabase Auth
- [ ] Parent dashboard with detailed analytics
- [ ] Multiplayer mode (compete with friends)
- [ ] Achievement badges and rewards system
- [ ] Print worksheet feature
- [ ] Voice input for answers
- [ ] Adaptive AI that learns from student mistakes
- [ ] Topic-specific practice modes
- [ ] Timer challenges
- [ ] Leaderboards
- [ ] Otto avatar customization
- [ ] Dark mode support
- [ ] Tutorial videos embedded in each step
- [ ] Gamification elements (XP, levels, unlockables)
- [ ] Social sharing of achievements

## 📊 Performance Considerations

- **Code Splitting**: Next.js automatically splits code for optimal loading
- **Server-Side AI**: Heavy AI processing happens on server, keeping client fast
- **Optimized Images**: Modern image formats with lazy loading
- **Minimal Dependencies**: Only essential libraries included
- **Caching**: API responses could be cached for repeated problems (future enhancement)

## 🧪 Testing Recommendations

### Manual Testing Checklist

- [ ] Generate problems at each difficulty level
- [ ] Test all problem types (mixed, addition, subtraction, etc.)
- [ ] Submit correct and incorrect answers
- [ ] Verify hint and solution display
- [ ] Check progress tracking (score, streak)
- [ ] Test history display
- [ ] Reset progress and confirm
- [ ] Change user name
- [ ] Test on mobile device
- [ ] Test Otto chat interactions
- [ ] Verify localStorage persistence (refresh page)
- [ ] **Complete tutorial as first-time user**
- [ ] **Test tutorial navigation (next, previous, skip)**
- [ ] **Verify tutorial element highlighting on all steps**
- [ ] **Replay tutorial using "Show Tutorial" button**
- [ ] **Confirm mock data displays only during tutorial**
- [ ] **Test tutorial modal positioning (doesn't cover buttons)**
- [ ] **Verify tutorial completion is saved**

## 📝 Notes

- **Singapore Curriculum Focus**: All problems align with Primary 5 math standards
- **Age-Appropriate**: Language and feedback suitable for 10-11 year olds
- **Privacy First**: No user data collected or stored on servers
- **Accessibility**: High contrast colors and clear typography
- **Progressive Enhancement**: Works without JavaScript for basic content
- **Tutorial Persistence**: Tutorial completion status saved to prevent repetition
- **Mobile-First Tutorial**: Tutorial adapts seamlessly between mobile and desktop experiences

## 🙏 Acknowledgments

- **OpenAI**: For inspiring conversational AI interfaces
- **Singapore Ministry of Education**: For comprehensive Primary math curriculum
- **Vercel**: For excellent Next.js documentation and hosting
- **Supabase**: For making database setup incredibly simple
- **Google**: For providing powerful, accessible AI models
- **UX Best Practices**: Inspired by modern onboarding experiences from Duolingo, Khan Academy, and other ed-tech leaders

---

**Built with ❤️ and 🐙 for Ottodot Assessment**

*Making math fun, one problem at a time!*
````
</copilot-edited-file>