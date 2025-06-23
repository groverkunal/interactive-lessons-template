<div align="center">
  <h1>✨ Interactive Lessons Template</h1>
  <p>A lightweight, responsive, and interactive lesson template built with vanilla HTML, CSS, and JavaScript, enhanced with GSAP animations.</p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![GitHub stars](https://img.shields.io/github/stars/groverkunal/interactive-lessons-template?style=social)](https://github.com/groverkunal/interactive-lessons-template/stargazers)
  [![GitHub forks](https://img.shields.io/github/forks/groverkunal/interactive-lessons-template?style=social)](https://github.com/groverkunal/interactive-lessons-template/network/members)
</div>

## 🚀 Features

- 🎨 **Responsive Design**: Looks great on all devices from mobile to desktop
- 🌓 **Dark/Light Mode**: Built-in theme switching with smooth transitions
- 🎯 **Interactive Components**:
  - Decision Helper for guided choices
  - Interactive Word Cloud for visual learning
  - Code Editor with Syntax Highlighting
  - Engaging Quiz System
- 🚀 **Performance Optimized**: Fast loading with minimal dependencies
- 🛠 **Developer Friendly**: Well-documented and modular code structure
- 🎨 **Customizable**: Easy to style and extend with your own content
- 🔄 **GSAP Animations**: Smooth, performant animations for better engagement



## 🛠 Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [Git](https://git-scm.com/) (for version control)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- [Cloudflare account](https://dash.cloudflare.com/sign-up) (for deployment)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/groverkunal/interactive-lessons-template.git
   cd interactive-lessons-template
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   Your browser should automatically open to `http://localhost:8000`. If not, open it manually.

## 🚀 Deployment

### Option 1: Cloudflare Pages (Recommended)
1. Fork this repository
2. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. Go to Pages > Create a project
4. Connect your GitHub account and select this repository
5. In the build settings:
   - Framework preset: None
   - Build command: `npm run build`
   - Build output directory: `dist`
6. Click "Save and Deploy"

### Option 2: Self-hosting
1. Build the project:
   ```bash
   npm run build
   ```
2. Deploy the contents of the `dist` directory to your web server

## 🌐 Live Demo

Check out the live demo: [View Demo](https://interactive-lessons-template.pages.dev)

## 🛠 Development

### Project Structure

```
interactive-lessons/
├── css/                  # Stylesheets
│   ├── animations.css    # Animation keyframes
│   ├── lesson.css        # Lesson-specific styles
│   ├── reset.css         # CSS reset
│   ├── style.css         # Main styles
│   └── variables.css     # CSS variables and theming
├── js/                   # JavaScript files
│   ├── lesson.js         # Lesson logic
│   └── main.js           # Main application logic
├── index.html            # Main entry point
├── lesson.html           # Example lesson page
└── package.json          # Project configuration
```

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Lint source files

## 🔌 Integration Guide

### Option 1: Iframe Embed (Simplest)

```html
<iframe 
  src="/path/to/lesson.html" 
  style="width: 100%; height: 800px; border: none; border-radius: 8px;"
  title="Interactive Lesson"
  allowfullscreen>
</iframe>
```

### Option 2: Direct Integration

1. Copy the following files to your project:
   - `lesson.html`
   - `css/lesson.css`
   - `js/lesson.js`
   - Any assets (images, etc.)

2. Include the required dependencies in your HTML:

```html
<!-- In your HTML head -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/themes/prism-tomorrow.min.css">

<!-- Before closing body tag -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/prism.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/components/prism-javascript.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/components/prism-css.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/components/prism-markup.min.js"></script>
```

## 🎨 Customization

### Theming

Easily customize the look and feel by overriding CSS variables in your stylesheet:

```css
:root {
  /* Light Theme */
  --primary-color: #4a6fa5;
  --secondary-color: #6c757d;
  --background: #ffffff;
  --text-color: #212529;
  --card-bg: #f8f9fa;
  --border-color: #dee2e6;

  /* Dark Theme */
  @media (prefers-color-scheme: dark) {
    --background: #1a1a1a;
    --text-color: #f8f9fa;
    --card-bg: #2d2d2d;
    --border-color: #444;
  }
  --color-primary: #4f46e5;
  --color-primary-dark: #4338ca;
  --color-text: #1f2937;
  --color-text-light: #6b7280;
  --color-bg: #ffffff;
  --color-bg-secondary: #f9fafb;
  --color-border: #e5e7eb;
}

[data-theme="dark"] {
  --color-primary: #818cf8;
  --color-primary-dark: #6366f1;
  --color-text: #f3f4f6;
  --color-text-light: #9ca3af;
  --color-bg: #111827;
  --color-bg-secondary: #1f2937;
  --color-border: #374151;
}
```

### Adding New Lessons

1. Duplicate `lesson.html` and rename it (e.g., `machine-learning.html`)
2. Update the lesson content in the HTML
3. Add a new card to the lessons grid in `index.html`

## Performance Optimization

### Lazy Loading

Images and iframes are lazy-loaded by default. For additional performance:

```html
<img loading="lazy" src="image.jpg" alt="Description">
<iframe loading="lazy" src="content.html"></iframe>
```

### Preload Key Resources

```html
<link rel="preload" href="css/lesson.css" as="style">
<link rel="preload" href="js/lesson.js" as="script">
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚀 Deployment

Detailed deployment instructions are available in the [Deployment Guide](./DEPLOYMENT-GUIDE.md).

## 📄 License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
