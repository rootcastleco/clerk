# Clerk - Multi-Platform Message Composer

## Overview

Clerk is an intelligent AI-powered message composition assistant that enables users to draft a single message and automatically adapts it for multiple communication platforms. Built with modern web technologies and powered by Google's Gemini AI, Clerk streamlines cross-platform communication by handling the nuances of tone, length, and formatting specific to each platform.

The application serves as a productivity tool for professionals, businesses, and individuals who need to communicate the same intent across different channels while maintaining platform-appropriate etiquette and constraints.

---

## Table of Contents

1. [Features](#features)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Usage Guide](#usage-guide)
7. [API Reference](#api-reference)
8. [Project Structure](#project-structure)
9. [Platform Rules](#platform-rules)
10. [Type Definitions](#type-definitions)
11. [Development](#development)
12. [Contributing](#contributing)
13. [License](#license)
14. [Developers](#developers)

---

## Features

### Core Capabilities

- **Unified Message Drafting**: Write your message intent once and let Clerk generate platform-optimized versions automatically.

- **Multi-Platform Support**: Generate tailored messages for Email, SMS, WhatsApp, Telegram, Slack, Discord, LinkedIn DM, and X (Twitter) DM.

- **AI-Powered Adaptation**: Leverages Google Gemini 2.5 Flash model to intelligently adapt tone, length, and formatting based on platform requirements.

- **Constraint Awareness**: Automatically respects character limits, emoji policies, markdown support, and link handling for each platform.

- **Quality Assurance**: Built-in quality checks verify intent preservation, platform fit, and data privacy compliance.

- **Safety First**: Implements guardrails to prevent harmful content generation including harassment, scams, and impersonation attempts.

### User Interface Features

- **Intuitive Form Design**: Clean, step-by-step input form with logical groupings for goal, audience, context, and targets.

- **Real-Time Preview**: View all generated message variants in a tabbed interface with character counts.

- **One-Click Copy**: Easily copy generated messages to clipboard for quick use.

- **Responsive Design**: Fully responsive layout that works seamlessly on desktop, tablet, and mobile devices.

- **Loading States**: Visual feedback during AI processing with informative status messages.

- **Error Handling**: Graceful error handling with user-friendly error messages.

---

## Architecture

Clerk follows a component-based architecture with clear separation of concerns:

```
                    +------------------+
                    |     App.tsx      |
                    |  (Main Container)|
                    +--------+---------+
                             |
              +--------------+--------------+
              |                             |
    +---------v---------+         +---------v---------+
    |   InputForm.tsx   |         | ResultDisplay.tsx |
    | (User Input Form) |         | (Results Viewer)  |
    +--------+----------+         +-------------------+
             |
             v
    +-------------------+
    | geminiService.ts  |
    | (AI Integration)  |
    +--------+----------+
             |
             v
    +-------------------+
    | Google Gemini API |
    +-------------------+
```

### Data Flow

1. User fills out the input form with their communication goal, audience details, message context, and target platforms.
2. Form data is structured according to the `ClerkInput` type schema.
3. The Gemini service sends the structured input to Google's Gemini AI with a specialized system prompt.
4. AI generates platform-optimized message variants with quality checks.
5. Results are displayed in the `ResultDisplay` component with copy functionality.

---

## Technology Stack

### Frontend Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.3 | UI component library |
| TypeScript | 5.8.2 | Type-safe JavaScript |
| Vite | 6.2.0 | Build tool and dev server |

### Styling

| Technology | Purpose |
|------------|---------|
| Tailwind CSS | Utility-first CSS framework (via CDN) |
| Inter Font | Primary typography |

### AI Integration

| Technology | Version | Purpose |
|------------|---------|---------|
| @google/genai | 1.33.0 | Google Gemini AI SDK |
| Gemini 2.5 Flash | - | AI model for message generation |

### UI Components

| Technology | Version | Purpose |
|------------|---------|---------|
| Lucide React | 0.561.0 | Icon library |

### Development Tools

| Technology | Purpose |
|------------|---------|
| @vitejs/plugin-react | React plugin for Vite |
| @types/node | Node.js type definitions |

---

## Installation

### Prerequisites

Before installing Clerk, ensure you have the following:

- Node.js (version 18.0.0 or higher)
- npm (version 9.0.0 or higher) or yarn (version 1.22.0 or higher)
- A Google AI Studio API key for Gemini access

### Step-by-Step Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/rootcastleco/clerk.git
   cd clerk
   ```

2. **Install Dependencies**

   Using npm:
   ```bash
   npm install
   ```

   Using yarn:
   ```bash
   yarn install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the root directory:
   ```bash
   touch .env
   ```

   Add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Start Development Server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

---

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Your Google AI Studio API key for Gemini access |

### Obtaining a Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Navigate to the API keys section
4. Create a new API key
5. Copy the key and add it to your `.env` file

### Vite Configuration

The `vite.config.ts` file contains the build configuration:

```typescript
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
```

---

## Usage Guide

### Basic Workflow

1. **Define Your Goal**
   - Enter your communication objective in natural language
   - Example: "Tell my client we need to move tomorrow's meeting by 30 minutes"

2. **Set Audience Parameters**
   - **Relationship**: Select the relationship type (customer, coworker, boss, friend, public, other)
   - **Tone**: Choose the desired tone (formal, friendly, urgent, apologetic, salesy, neutral)
   - **Language**: Specify the language code (e.g., "en" for English)

3. **Provide Message Context**
   - **Topic**: Brief description of the message topic
   - **Key Points**: Main points to convey (one per line)
   - **Must Include**: Required content that must appear in the message
   - **Must Avoid**: Content or topics to exclude
   - **Dates/Times**: Any relevant temporal information

4. **Configure Target Platforms**
   - Add one or more target platforms
   - For each target, specify:
     - Platform type (Email, SMS, WhatsApp, etc.)
     - Recipient name
     - Recipient address/handle
   - Platform-specific constraints are auto-populated

5. **Optional Settings**
   - **Draft**: Include an existing draft for refinement
   - **Sign-off**: Your preferred message closing
   - **Brand Voice Notes**: Additional guidelines for tone consistency

6. **Generate Messages**
   - Click the generate button to create platform-optimized variants
   - Review quality checks and any clarifying questions
   - Copy messages directly to clipboard

### Example Use Cases

**Business Communication**
- Rescheduling meetings across email and Slack
- Sending project updates to stakeholders on multiple platforms
- Following up with clients via email and WhatsApp

**Marketing and Sales**
- Crafting outreach messages for LinkedIn and email
- Announcing promotions across social channels
- Customer engagement across messaging platforms

**Personal Communication**
- Event invitations via multiple channels
- Important announcements to different contact groups
- Coordinating plans across messaging apps

---

## API Reference

### ClerkInput Schema

The input structure sent to the AI service:

```typescript
interface ClerkInput {
  user_goal: string;              // The user's communication objective
  audience: {
    relationship: Relationship;   // Recipient relationship type
    tone: Tone;                   // Desired message tone
    language: string;             // Language code
  };
  message_context: {
    topic: string;                // Message topic
    key_points: string[];         // Main points to convey
    must_include: string[];       // Required content
    must_avoid: string[];         // Content to exclude
    dates_times: string[];        // Temporal information
    links: string[];              // URLs to include
  };
  targets: Target[];              // Target platforms and recipients
  draft?: string;                 // Optional existing draft
  user_preferences: {
    sign_off: string;             // Message closing
    brand_voice_notes: string;    // Brand guidelines
  };
}
```

### ClerkResponse Schema

The response structure returned by the AI service:

```typescript
interface ClerkResponse {
  clarifying_questions: string[];  // Questions for ambiguity resolution
  assumptions: string[];           // Assumptions made by the AI
  message_variants: MessageVariant[];  // Generated messages
  safety_notes: string[];          // Safety warnings if applicable
  quality_checks: {
    intent_preserved: boolean;     // Whether intent is maintained
    platform_fit: boolean;         // Platform appropriateness
    no_private_data_leak: boolean; // Data privacy compliance
  };
}
```

### MessageVariant Schema

Individual message variant structure:

```typescript
interface MessageVariant {
  platform: string;                // Target platform
  recipient: {
    name: string;                  // Recipient name
    handle_or_address: string;     // Email/handle/phone
  };
  subject: string;                 // Subject line (for email)
  body: string;                    // Message content
  char_count: number;              // Character count
  send_payload: {
    platform: string;
    to: string;
    subject: string;
    text: string;
  };
}
```

---

## Project Structure

```
clerk/
|-- App.tsx                 # Main application component
|-- index.tsx               # React application entry point
|-- index.html              # HTML template with Tailwind CSS
|-- types.ts                # TypeScript type definitions
|-- package.json            # Project dependencies and scripts
|-- tsconfig.json           # TypeScript configuration
|-- vite.config.ts          # Vite build configuration
|-- metadata.json           # Application metadata
|-- README.md               # Project documentation
|
|-- components/
|   |-- InputForm.tsx       # Message input form component
|   |-- ResultDisplay.tsx   # Message results display component
|
|-- services/
    |-- geminiService.ts    # Google Gemini AI integration
```

### File Descriptions

| File | Description |
|------|-------------|
| `App.tsx` | Root component managing application state, routing between input and results views |
| `index.tsx` | React DOM entry point, mounts the App component to the DOM |
| `index.html` | HTML template including Tailwind CSS, Inter font, and import maps |
| `types.ts` | Comprehensive TypeScript definitions for all data structures |
| `components/InputForm.tsx` | Multi-section form for collecting user input with validation |
| `components/ResultDisplay.tsx` | Tabbed interface for viewing and copying generated messages |
| `services/geminiService.ts` | AI service layer handling Gemini API communication |

---

## Platform Rules

Clerk applies specific rules for each supported platform to ensure appropriate message formatting:

### Email
- Include a clear subject line
- Use proper greeting
- Organize content in short paragraphs
- Include sign-off when appropriate
- Maximum character limit: 10,000
- Supports: Links, Emojis

### SMS
- Ultra-compact messaging
- Minimal punctuation
- Links only when essential
- Maximum character limit: 160
- No markdown support

### WhatsApp
- Friendly, readable format
- Short line breaks
- Light emoji usage when allowed
- Maximum character limit: 1,000
- Supports: Links, Emojis, Markdown

### Telegram
- Similar to WhatsApp with extended limits
- Maximum character limit: 4,096
- Full markdown support
- Supports: Links, Emojis, Markdown

### Slack
- Concise, professional tone
- Bullet points for lists
- Maximum character limit: 4,000
- Full markdown support

### Discord
- Casual, community-friendly tone
- Maximum character limit: 2,000
- Full markdown support
- Supports: Links, Emojis

### LinkedIn DM
- Professional, polite tone
- Clear call-to-action
- No excessive marketing language
- Maximum character limit: 2,000
- Supports: Links, Emojis

### X (Twitter) DM
- Very short and direct
- Single action focus
- Maximum character limit: 1,000
- Supports: Links, Emojis

---

## Type Definitions

### Enumerations

```typescript
type Relationship = 'customer' | 'friend' | 'coworker' | 'boss' | 'public' | 'other';

type Tone = 'friendly' | 'formal' | 'urgent' | 'apologetic' | 'salesy' | 'neutral' | 'other';

type Platform = 'email' | 'sms' | 'whatsapp' | 'telegram' | 'slack' | 'discord' | 'linkedin_dm' | 'x_dm';
```

### Core Interfaces

```typescript
interface Recipient {
  name: string;
  handle_or_address: string;
}

interface TargetConstraint {
  max_chars: number;
  allow_emojis: boolean;
  allow_markdown: boolean;
  allow_links: boolean;
}

interface Target {
  id: string;
  platform: Platform;
  recipient: Recipient;
  constraints: TargetConstraint;
}
```

---

## Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |

### Development Server

The development server runs on `http://localhost:3000` with hot module replacement enabled. The server is configured to accept connections from any host (`0.0.0.0`), making it suitable for development in containerized environments.

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` directory.

### Code Style Guidelines

- Use TypeScript for all source files
- Follow React functional component patterns with hooks
- Use Tailwind CSS utility classes for styling
- Maintain type safety with proper interface definitions
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

---

## Contributing

We welcome contributions to Clerk. Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and ensure code quality
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Pull Request Guidelines

- Provide a clear description of the changes
- Reference any related issues
- Ensure all existing tests pass
- Add tests for new functionality
- Update documentation as needed

### Code Review Process

All submissions require review. We use GitHub pull requests for this purpose. Consult GitHub Help for more information on using pull requests.

---

## License

This project is proprietary software developed by Rootcastle Engineering Innovation. All rights reserved.

---

## Developers

### Rootcastle Engineering Innovation

Clerk is developed and maintained by Rootcastle Engineering Innovation, a technology company focused on building innovative solutions that enhance productivity and streamline communication workflows.

Website: [https://rootcastle.com](https://rootcastle.com)

### Batuhhan Ayribasi

Lead Developer and Creator of Clerk. Batuhhan is a software engineer at Rootcastle Engineering Innovation with expertise in full-stack web development, AI integration, and user experience design.

---

## Support

For support, feature requests, or bug reports, please open an issue on the GitHub repository or contact the development team at Rootcastle Engineering Innovation.

---

## Acknowledgments

- Google AI Studio team for the Gemini API
- React team for the excellent UI library
- Tailwind CSS team for the utility-first CSS framework
- Lucide team for the beautiful icon library
- All contributors who help improve Clerk

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 0.0.0 | 2025 | Initial release with core functionality |

---

## Roadmap

Future enhancements planned for Clerk:

- Integration with messaging APIs for direct sending
- Message scheduling functionality
- Template library for common message types
- Analytics dashboard for message performance
- Team collaboration features
- Browser extension for quick access
- Mobile application
- Multi-language AI model support
- Custom platform configuration
- API access for third-party integrations

---

This documentation is maintained by the Clerk development team at Rootcastle Engineering Innovation.