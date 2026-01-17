
# VidMark 🎥📝

**Capture, annotate, and learn from YouTube videos like never before**

VidMark is a powerful YouTube video annotation and organization tool that helps you capture insights, write notes, and track your learning progress from videos. With AI-powered summarization, and organization features, VidMark transforms passive viewing into active learning.

---

## ✨ Features

* **Video Annotation & Note-taking** - Capture key insights directly from YouTube videos
* **AI-Powered Summarization** - Automatically generate video summaries using GenKit AI
* **Progress Analytics** - Track your learning progress with statistics
* **Dark/Light Mode** - Customizable UI for comfortable viewing
* **Responsive Design** - Works seamlessly on desktop and mobile devices

---

## 🛠️ Tech Stack

**Core Technologies:**
- **Frontend:** Next.js 15 (App Router), TypeScript, React 19
- **State Management:** Zustand
- **Styling:** Tailwind CSS, shadcn/ui component library
- **Authentication:** Clerk
- **Database:** Convex (serverless database)
- **AI Integration:** GenKit with Google AI
- **Video Processing:** YouTube API

**Additional Tools:**
- Framer Motion (animations)
- Sonner (toast notifications)
- React Hooks (custom hooks)
- Convex (real-time database)
- Vercel (hosting)

## 📦 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- pnpm (recommended) or npm/yarn
- Git
- A modern browser (Chrome, Firefox, Edge, or Safari)

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/vid-mark.git
   cd vid-mark
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add the following variables:
   ```env
   NEXT_PUBLIC_CONVEX_URL=your-convex-url
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
   ```

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

5. **Open the application:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.


## 🎯 Usage

### Basic Usage

#### Adding Videos
```typescript
// Example of how to add a video programmatically
const addVideo = useMutation(api.video.addVideo);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const videoId = extractVideoId(url);

  if (!videoId) return toast.error("Invalid YouTube URL");

  await toast.promise(
    async () => {
      const data = await fetchYouTubeData(videoId);
      const channelData = await fetchChannel(data.channelId);

      if (!user) throw new Error("You must be logged in");

      await addVideo({
        ...data,
        channelPicture: channelData.thumbnail,
      });

      setUrl("");
    },
    {
      loading: "Adding video...",
      success: "Video added!",
      error: (err) => err.message || "Something went wrong",
    }
  );
};
```

#### Filtering Videos
```typescript
// Filter videos by status
const [filter, setFilter] = useState<"all" | "completed" | "watching" | "stared">("all");

const allVideos = useQuery(api.video.listByUser, {});
const completedVideos = useQuery(api.video.GetCompletedVideos);
const watchingVideos = useQuery(api.video.GetisWatchingVideos);
const staredVideos = useQuery(api.video.GetStaredVideos);

let videos = allVideos;
if (filter === "completed") videos = completedVideos;
else if (filter === "watching") videos = watchingVideos;
else if (filter === "stared") videos = staredVideos;
```

### Advanced Usage

#### AI-Powered Summarization
VidMark integrates with GenKit AI to automatically generate video summaries. This feature is available in the video detail view.

#### Video Progress Tracking
```typescript
// Example of tracking video progress
const getPercentage = (videoDuration: number, isProgressed: number) => {
  if (videoDuration === 0) return 0;
  return Math.min(Math.round((isProgressed / videoDuration) * 100), 100);
};

// Usage in your component
<Progress value={getPercentage(video.duration, video.progress)} />
```

---

## 📁 Project Structure

```
vid-mark/
├── app/
│   ├── (main)/
│   │   ├── _components/          # Main application components
│   │   ├── (routes)/             # Route-specific components
│   │   ├── layout.tsx             # Main layout
│   │   └── ...
│   ├── (marketing)/              # Marketing pages
│   │   ├── _components/          # Marketing components
│   │   ├── layout.tsx             # Marketing layout
│   │   └── page.tsx               # Home page
│   ├── globals.css                # Global styles
│   └── layout.tsx                 # Root layout
├── components/
│   ├── modals/                   # Modal components
│   ├── providers/                # Provider components
│   ├── search-command.tsx        # Search command component
│   ├── ui/                       # UI components
│   └── ...
├── convex/                       # Convex database schema and functions
├── hooks/                        # Custom hooks
├── lib/                          # Utility functions and libraries
├── public/                       # Static assets
├── styles/                       # CSS files
├── .env.local                    # Environment variables
├── .gitignore                    # Git ignore rules
├── package.json                  # Project dependencies
└── README.md                     # This file
```

---

## 🔧 Configuration

### Environment Variables

| Variable                     | Description                                                                 |
|------------------------------|-----------------------------------------------------------------------------|
| `NEXT_PUBLIC_CONVEX_URL`     | Your Convex application URL                                                 |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for authentication |

### Customization Options

VidMark uses shadcn/ui for its component library, which allows for easy customization:

1. **Tailwind CSS:** Modify `app/globals.css` for global styles
2. **Theme:** Change the theme in `components/ui/theme-provider.tsx`
3. **Components:** Customize components in the `components/ui` directory

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can contribute to VidMark:

### Development Setup

1. Fork the repository
2. Clone your fork locally
3. Install dependencies using `pnpm install`
4. Set up your environment variables
5. Run the development server with `pnpm dev`

### Code Style Guidelines

- Use TypeScript for type safety
- Follow the existing code style and patterns
- Write clear, concise, and well-documented code
- Ensure all code passes the ESLint checks

### Pull Request Process

1. Create a new branch for your feature or bug fix
2. Make your changes and commit them with descriptive messages
3. Push your branch to your fork
4. Open a pull request against the main branch

---

## 🗺️ Roadmap

### Planned Features

- **Video Chunking:** Break videos into segments for more granular tracking
- **Collaborative Features:** Allow sharing notes and annotations with others
- **Export Options:** Export notes and summaries in various formats
- **Advanced AI Features:** More sophisticated AI-powered analysis and recommendations
- **Mobile App:** Native mobile application for iOS and Android

### Future Improvements

- Performance optimizations
- Additional integrations with educational platforms
- Enhanced analytics and reporting
- Community-driven feature requests
