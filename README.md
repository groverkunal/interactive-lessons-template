# Interactive Lessons

A lightweight, responsive, and interactive lesson template built with vanilla HTML, CSS, and JavaScript, enhanced with GSAP animations. Deploy effortlessly to Cloudflare Pages with just a few clicks.

## Features

- 🎨 **Responsive Design**: Works on all device sizes
- 🌓 **Dark/Light Mode**: Built-in theme switching
- 🎯 **Interactive Components**:
  - Decision Helper
  - Interactive Word Cloud
  - Code Editor with Syntax Highlighting
  - Interactive Quiz
- 🚀 **Performance Optimized**: Fast loading with minimal dependencies
- 🛠 **Easy to Customize**: Well-documented and modular code

## 🚀 Quick Start

1. **Preview Locally**
   ```bash
   # Install dependencies
   npm install
   
   # Start local server
   npm start
   ```
   Open http://localhost:8000 in your browser

2. **Deploy to Cloudflare Pages**
   - See our [Deployment Guide](./DEPLOYMENT-GUIDE.md) for step-by-step instructions
   - Takes less than 5 minutes to go live!

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js (v14+ recommended)
- Git (for version control)
- Cloudflare account (free)

### Installation

1. Clone or download this repository
2. Serve the files using a local web server

```bash
# Using Python's built-in server
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## 🌐 Live Demo

Check out the live demo: [https://interactive-lessons.pages.dev](https://interactive-lessons.pages.dev)

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

## Customization

### Theming

Customize colors by overriding CSS variables in your stylesheet:

```css
:root {
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
