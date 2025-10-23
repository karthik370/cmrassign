# 📝 Handwriting PDF Generator

A complete full-stack web application that allows users to convert their handwriting to custom fonts and apply them to PDF documents. Built with Next.js, TypeScript, Supabase, and Cloudinary.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)

## ✨ Features

### Core Features
- **Custom Handwriting Fonts**: Upload fonts created on Calligraphr.com (FREE tier)
- **Multi-Page PDF Editor**: Edit up to 12 pages with intuitive interface
- **Smart Text Placement**: Automatically respects PDF boundaries and lines
- **Auto-Save**: Changes save automatically every 2 seconds
- **Color Options**: Choose between black and blue ink
- **Font Size Control**: Adjust font size from 8pt to 20pt
- **Character Counter**: Real-time character count per field
- **Page Navigation**: Easy navigation with thumbnails and keyboard shortcuts

### User Management
- Email/password authentication via Supabase
- Protected routes with middleware
- User-specific data isolation with RLS
- Profile management

### Font Management
- Upload `.ttf` and `.otf` font files
- Font validation (magic number checking)
- Font preview with custom text
- Manage multiple fonts
- Delete unused fonts

### Project Management
- Create unlimited projects
- Track project status (draft, processing, completed)
- View project history
- Delete projects with cleanup

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **React PDF** - PDF rendering
- **PDF.js** - PDF parsing

### Backend
- **Next.js API Routes** - Serverless functions
- **Supabase** - PostgreSQL database & authentication
- **Cloudinary** - File storage & CDN
- **pdf-lib** - PDF manipulation

### Infrastructure
- **Vercel** - Hosting & deployment
- **Supabase Auth** - User authentication
- **Row Level Security** - Database security

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn
- Supabase account (free tier)
- Cloudinary account (free tier)
- Vercel account (for deployment)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd hw
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Set Up Database

1. Create a Supabase project
2. Go to SQL Editor
3. Run the schema from `database/schema.sql`

### 5. Run the Application

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📖 Detailed Setup

For detailed setup instructions, see [SETUP.md](./SETUP.md)

## 🎯 User Flow

### 1. Create Handwriting Font
- Visit [Calligraphr.com](https://www.calligraphr.com)
- Create a FREE account
- Download template (75 characters)
- Fill template with your handwriting
- Upload to Calligraphr and build font
- Download `.ttf` file

### 2. Upload Font to App
- Sign up / Log in
- Go to Fonts → Upload Font
- Select your `.ttf` file
- Name your font
- Upload

### 3. Create Project
- Go to Projects → New Project
- Select your font
- Upload PDF (max 12 pages, 50MB)
- App analyzes PDF structure

### 4. Edit PDF
- Multi-page editor loads
- Type in text fields using your handwriting font
- Choose ink color (black/blue)
- Adjust font size
- Changes auto-save

### 5. Generate & Download
- Click "Generate PDF"
- Wait for processing
- Download completed PDF with handwriting

## 📁 Project Structure

```
handwriting-pdf-app/
├── app/                        # Next.js app directory
│   ├── api/                   # API routes
│   │   ├── font/             # Font management APIs
│   │   ├── pdf/              # PDF processing APIs
│   │   └── project/          # Project management APIs
│   ├── auth/                  # Authentication pages
│   ├── dashboard/             # User dashboard
│   ├── fonts/                 # Font management pages
│   ├── projects/              # Project pages
│   ├── instructions/          # Instructions page
│   └── layout.tsx             # Root layout
├── components/                 # React components
│   ├── auth/                  # Auth components
│   ├── editor/                # PDF editor components
│   ├── fonts/                 # Font components
│   ├── layout/                # Layout components
│   ├── pdf/                   # PDF components
│   ├── project/               # Project components
│   └── ui/                    # UI components
├── lib/                        # Utility libraries
│   ├── cloudinary.ts          # Cloudinary setup
│   ├── supabase.ts            # Supabase client
│   ├── font-validator.ts      # Font validation
│   ├── font-loader.ts         # Font loading
│   ├── pdf-analyzer.ts        # PDF analysis
│   ├── pdf-generator.ts       # PDF generation
│   └── utils.ts               # Helper functions
├── types/                      # TypeScript types
├── hooks/                      # Custom React hooks
├── database/                   # Database schema
└── public/                     # Static assets
```

## 🔒 Security Features

- **Row Level Security (RLS)**: Database-level access control
- **Authentication**: Supabase Auth with email/password
- **File Validation**: Magic number validation for fonts
- **Protected Routes**: Middleware-based route protection
- **Secure API Keys**: Environment variable management
- **CORS Protection**: Proper CORS configuration

## 🎨 Key Components

### PDFEditor
The main editor component that orchestrates:
- PDF canvas rendering
- Text input fields
- Page navigation
- Auto-save functionality
- Font loading

### FontUploader
Handles font file uploads with:
- Drag & drop support
- File validation
- Upload progress
- Error handling

### CanvasRenderer
Renders PDF pages with:
- react-pdf for display
- Overlay text input fields
- Custom font application

## 🧪 Testing

### Manual Testing Checklist
- [ ] User can sign up
- [ ] User can log in
- [ ] Font upload works (.ttf and .otf)
- [ ] Invalid files are rejected
- [ ] PDF upload works (up to 12 pages)
- [ ] Editor displays correctly
- [ ] Text input works with custom font
- [ ] Auto-save functions
- [ ] PDF generation works
- [ ] Download works
- [ ] User can delete fonts
- [ ] User can delete projects

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project on Vercel
3. Add environment variables
4. Deploy

See [SETUP.md](./SETUP.md) for detailed deployment instructions.

## 💰 Cost Breakdown

### Free Tier (Recommended for Start)
- **Vercel**: Free (100GB bandwidth)
- **Supabase**: Free (500MB database, 1GB storage)
- **Cloudinary**: Free (25 credits/month)
- **Total**: $0/month

### Paid Tier (If you scale)
- **Vercel Pro**: $20/month
- **Supabase Pro**: $25/month
- **Cloudinary Plus**: $89/month
- **Total**: $134/month

## 📊 Features Roadmap

### Phase 1 (MVP) ✅
- [x] User authentication
- [x] Font upload & management
- [x] PDF upload & analysis
- [x] Multi-page editor
- [x] PDF generation
- [x] Auto-save

### Phase 2 (Enhancements)
- [ ] Advanced PDF text detection
- [ ] Multiple fonts per project
- [ ] Template library
- [ ] Collaborative editing
- [ ] Mobile app

### Phase 3 (Premium)
- [ ] Calligraphr API integration
- [ ] Auto font generation
- [ ] Unlimited PDFs
- [ ] Priority support
- [ ] Team workspaces

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Cloudinary](https://cloudinary.com/) - Media management
- [Calligraphr](https://www.calligraphr.com/) - Font generation
- [pdf-lib](https://pdf-lib.js.org/) - PDF manipulation
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide](https://lucide.dev/) - Icons

## 📧 Support

For support, email support@yourapp.com or open an issue on GitHub.

## ⭐ Show Your Support

If you find this project helpful, please give it a star on GitHub!

---

**Built with ❤️ using Next.js and TypeScript**
