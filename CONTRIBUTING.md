# Development Guidelines

This document outlines the coding standards and best practices for the Interactive Lessons project.

## Core Principles

1. **Always Show Loading States**
   - Any dynamic content or asynchronous operation must show a loading state
   - Use skeleton loaders for content that takes time to load
   - Show progress indicators for actions that take more than 200ms
   - Handle and display error states appropriately

2. **Performance First**
   - Optimize for the slowest connection speeds
   - Implement lazy loading for images and non-critical resources
   - Minimize JavaScript bundle size
   - Use semantic HTML for better accessibility and performance

3. **Accessibility (a11y)**
   - All interactive elements must be keyboard navigable
   - Use proper ARIA attributes
   - Ensure sufficient color contrast
   - Provide text alternatives for non-text content

## Loading States Implementation

### Required Loading States

1. **Initial Page Load**
   - Show a skeleton loader for the main content area
   - Display a loading spinner for the page
   - Show a progress bar for the overall page load

2. **Data Fetching**
   - Show loading state while fetching data from APIs
   - Display skeleton loaders in place of dynamic content
   - Show an error state if the request fails

3. **User Actions**
   - Show loading state for form submissions
   - Disable interactive elements during async operations
   - Provide feedback for long-running operations

### Implementation Example

```javascript
// Show loading state
function showLoading(container) {
    container.innerHTML = `
        <div class="skeleton-loader">
            <div class="skeleton-thumbnail"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text skeleton-text--half"></div>
        </div>
    `;
}

// Hide loading state
function hideLoading(container, content) {
    container.innerHTML = content;
}

// Error state
function showError(container, message) {
    container.innerHTML = `
        <div class="error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
            <button class="btn btn--primary" onclick="window.location.reload()">
                Try Again
            </button>
        </div>
    `;
}
```

## Code Style

- Use 4 spaces for indentation
- Use single quotes for strings
- Use camelCase for variables and functions
- Use PascalCase for component names
- Always include semicolons
- Comment complex logic
- Keep functions small and focused

## Git Workflow

1. Create a new branch for each feature/fix
2. Write clear, descriptive commit messages
3. Keep commits small and focused
4. Rebase your branch before creating a PR
5. Request code reviews for all changes

## Testing

- Write tests for new features
- Update tests when fixing bugs
- Run tests before committing
- Ensure cross-browser compatibility

## Performance Budget

- Keep page weight under 500KB
- Aim for First Contentful Paint under 1.5s on 3G
- Keep Time to Interactive under 5s on 3G
- Ensure all pages pass Lighthouse performance audit

## Browser Support

- Latest 2 versions of modern browsers
- IE 11+ (if required)
- Mobile Safari (latest)
- Chrome for Android (latest)

## Accessibility Standards

- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Reduced motion preferences
- Color contrast ratio of at least 4.5:1

## Code Review Guidelines

- Check for performance implications
- Verify accessibility compliance
- Ensure cross-browser compatibility
- Review for security vulnerabilities
- Check for proper error handling

## Deployment Process

1. Create a release branch from main
2. Update version number
3. Update CHANGELOG.md
4. Create a pull request
5. After approval, merge to main
6. Create a GitHub release
7. Deploy to production
