const fs = require('fs').promises;
const path = require('path');
const { minify } = require('terser');
const CleanCSS = require('clean-css');
const htmlmin = require('html-minifier');

// Configuration
const config = {
  inputDir: '.',
  outputDir: 'dist',
  filesToCopy: ['index.html', 'lesson.html', 'assets/**/*'],
  cssFiles: ['css/reset.css', 'css/variables.css', 'css/style.css', 'css/animations.css', 'css/lesson.css'],
  jsFiles: ['js/main.js', 'js/lesson.js']
};

// Create output directory if it doesn't exist
async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

// Minify JavaScript
async function minifyJS(files) {
  console.log('Minifying JavaScript files...');
  const jsCode = await Promise.all(
    files.map(file => fs.readFile(file, 'utf8'))
  );
  
  const result = await minify(jsCode.join('\n'), {
    mangle: true,
    compress: true,
    format: {
      comments: false
    }
  });
  
  return result.code;
}

// Minify CSS
async function minifyCSS(files) {
  console.log('Minifying CSS files...');
  const cssCode = await Promise.all(
    files.map(file => fs.readFile(file, 'utf8'))
  );
  
  const result = new CleanCSS({
    level: 2
  }).minify(cssCode.join('\n'));
  
  return result.styles;
}

// Minify HTML
async function minifyHTML(file) {
  console.log(`Minifying ${file}...`);
  const content = await fs.readFile(file, 'utf8');
  
  return htmlmin.minify(content, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    minifyCSS: true,
    minifyJS: true
  });
}

// Copy files recursively
async function copyFiles(patterns) {
  console.log('Copying files...');
  // Simple implementation - in a real project, you might want to use a glob library
  for (const pattern of patterns) {
    if (pattern.includes('**/*')) {
      const dir = pattern.split('/**/*')[0];
      await copyDir(dir, path.join(config.outputDir, dir));
    } else {
      const dest = path.join(config.outputDir, pattern);
      await ensureDir(path.dirname(dest));
      await fs.copyFile(pattern, dest);
    }
  }
}

// Copy directory recursively
async function copyDir(src, dest) {
  await ensureDir(dest);
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

// Update HTML files with minified assets
async function updateHTML() {
  console.log('Updating HTML files with minified assets...');
  const htmlFiles = ['index.html', 'lesson.html'];
  
  for (const file of htmlFiles) {
    const content = await fs.readFile(file, 'utf8');
    let updated = content
      .replace(/<link[^>]+href="css\/[^"]+\.css"/g, '<link rel="stylesheet" href="styles.min.css"')
      .replace(/<script[^>]+src="js\/[^"]+\.js"/g, (match) => {
        return match.includes('main.js') || match.includes('lesson.js') 
          ? '<script src="bundle.min.js" defer></script>'
          : match;
      });
    
    await fs.writeFile(
      path.join(config.outputDir, file),
      updated,
      'utf8'
    );
  }
}

// Main build function
async function build() {
  try {
    console.log('Starting build process...');
    
    // Ensure output directory exists and is empty
    await fs.rm(config.outputDir, { recursive: true, force: true });
    await ensureDir(config.outputDir);
    
    // Process CSS
    const css = await minifyCSS(config.cssFiles);
    await ensureDir(path.join(config.outputDir, 'css'));
    await fs.writeFile(path.join(config.outputDir, 'css', 'styles.min.css'), css, 'utf8');
    
    // Process JavaScript
    const js = await minifyJS(config.jsFiles);
    await ensureDir(path.join(config.outputDir, 'js'));
    await fs.writeFile(path.join(config.outputDir, 'js', 'bundle.min.js'), js, 'utf8');
    
    // Copy other files
    await copyFiles(config.filesToCopy);
    
    // Update HTML files
    await updateHTML();
    
    console.log('Build completed successfully!');
    console.log(`Output directory: ${path.resolve(config.outputDir)}`);
    
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

// Run the build
build();
