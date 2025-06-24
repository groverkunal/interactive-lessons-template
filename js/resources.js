// Configuration
const NOTION_PAGE_ID = '13d9a8f8d51d805caaebf52befbb786a';
const NOTION_API_URL = `https://notion-api.splitbee.io/v1/table/${NOTION_PAGE_ID}`;

// DOM Elements
const resourcesGrid = document.getElementById('resourcesGrid');
const filterTagsContainer = document.getElementById('filterTags');
const searchInput = document.getElementById('searchInput');

// State
let resources = [];
let activeFilters = new Set();
let allTags = new Set();

// Initialize the page
async function init() {
    try {
        await fetchResources();
        renderResources();
        setupEventListeners();
    } catch (error) {
        console.error('Error initializing resources:', error);
        showError('Failed to load resources. Please try again later.');
    }
}

// Fetch resources from Notion
async function fetchResources() {
    try {
        const response = await fetch(NOTION_API_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        // Log the first item to debug the structure
        console.log('First item from Notion:', data[0]);
        
        // Process and filter the data
        resources = data
            .filter(item => {
                // Check if item has URL and Title properties
                const hasURL = item.URL && (typeof item.URL === 'string' || item.URL[0]?.[0]);
                const hasTitle = item.Title && (typeof item.Title === 'string' || item.Title[0]?.[0]);
                return hasURL && hasTitle;
            })
            .map(item => {
                // Handle different possible title formats
                let title = 'Untitled';
                if (typeof item.Title === 'string') {
                    title = item.Title;
                } else if (Array.isArray(item.Title) && item.Title[0]?.[0]) {
                    title = item.Title[0][0];
                } else if (item.Title) {
                    title = String(item.Title);
                }
                
                // Handle URL
                const url = typeof item.URL === 'string' ? item.URL : (item.URL?.[0]?.[0] || '');
                
                // Handle description
                let description = 'No description available';
                if (item.Description) {
                    if (typeof item.Description === 'string') {
                        description = item.Description;
                    } else if (Array.isArray(item.Description) && item.Description[0]?.[0]) {
                        description = item.Description[0][0];
                    }
                }
                
                return {
                    id: item.id,
                    title: title.trim(),
                    url: url.trim(),
                    description: description.trim(),
                    tags: Array.isArray(item.Tags) ? item.Tags : [],
                    thumbnail: getYouTubeThumbnail(url)
                };
            });
        
        // Extract all unique tags
        resources.forEach(resource => {
            if (resource.tags) {
                resource.tags.forEach(tag => allTags.add(tag));
            }
        });
        
        renderFilterTags();
    } catch (error) {
        console.error('Error fetching resources:', error);
        throw error;
    }
}

// Get YouTube thumbnail URL from video URL
function getYouTubeThumbnail(url) {
    if (!url) return 'https://via.placeholder.com/800x450?text=No+Thumbnail';
    
    try {
        // Handle URLs that might be missing protocol
        let urlStr = url.trim();
        if (!/^https?:\/\//i.test(urlStr)) {
            urlStr = 'https://' + urlStr;
        }
        
        const urlObj = new URL(urlStr);
        
        // Handle YouTube URLs
        if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
            let videoId = '';
            
            // Handle youtu.be links
            if (urlObj.hostname.includes('youtu.be')) {
                videoId = urlObj.pathname.split('/')[1];
            } 
            // Handle YouTube watch links
            else if (urlObj.pathname.includes('/watch')) {
                videoId = new URLSearchParams(urlObj.search).get('v');
            }
            // Handle YouTube embed links
            else if (urlObj.pathname.startsWith('/embed/')) {
                videoId = urlObj.pathname.split('/')[2];
            }
            
            // Clean up video ID (remove any query parameters or fragments)
            if (videoId) {
                videoId = videoId.split(/[?#]/)[0];
                // Try different thumbnail qualities, fallback to lower quality if needed
                return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            }
        }
        // Handle Vimeo URLs
        else if (urlObj.hostname.includes('vimeo.com')) {
            const videoId = urlObj.pathname.split('/').filter(Boolean).pop();
            if (videoId) {
                return `https://vumbnail.com/${videoId}.jpg`;
            }
        }
    } catch (e) {
        console.error('Error parsing URL:', e);
    }
    
    // Fallback to a placeholder if we couldn't generate a thumbnail
    return 'https://via.placeholder.com/800x450?text=No+Thumbnail';
}

// Render filter tags
function renderFilterTags() {
    filterTagsContainer.innerHTML = '';
    
    // Add 'All' filter
    const allTag = document.createElement('button');
    allTag.className = 'tag' + (activeFilters.size === 0 ? ' active' : '');
    allTag.textContent = 'All';
    allTag.addEventListener('click', () => {
        activeFilters.clear();
        renderResources();
        updateActiveTags();
    });
    filterTagsContainer.appendChild(allTag);
    
    // Add other tags
    Array.from(allTags).sort().forEach(tag => {
        const tagElement = document.createElement('button');
        tagElement.className = 'tag' + (activeFilters.has(tag) ? ' active' : '');
        tagElement.textContent = tag;
        tagElement.addEventListener('click', () => toggleTag(tag));
        filterTagsContainer.appendChild(tagElement);
    });
}

// Toggle tag filter
function toggleTag(tag) {
    if (activeFilters.has(tag)) {
        activeFilters.delete(tag);
    } else {
        activeFilters.add(tag);
    }
    renderResources();
    updateActiveTags();
}

// Update active tag styles
function updateActiveTags() {
    const tagElements = document.querySelectorAll('.tag');
    tagElements.forEach(tagEl => {
        const tagText = tagEl.textContent;
        if (tagText === 'All') {
            tagEl.classList.toggle('active', activeFilters.size === 0);
        } else {
            tagEl.classList.toggle('active', activeFilters.has(tagText));
        }
    });
}

// Filter and render resources
function renderResources() {
    const searchTerm = searchInput.value.toLowerCase();
    
    const filteredResources = resources.filter(resource => {
        // Filter by search term
        const matchesSearch = 
            resource.title.toLowerCase().includes(searchTerm) ||
            resource.description.toLowerCase().includes(searchTerm) ||
            resource.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        
        // Filter by active tags
        const matchesTags = 
            activeFilters.size === 0 || 
            resource.tags.some(tag => activeFilters.has(tag));
        
        return matchesSearch && matchesTags;
    });
    
    // Clear the grid
    resourcesGrid.innerHTML = '';
    
    // Show message if no resources found
    if (filteredResources.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
            <h3>No resources found</h3>
            <p>Try adjusting your search or filters</p>
        `;
        resourcesGrid.appendChild(noResults);
        return;
    }
    
    // Add resources to the grid
    filteredResources.forEach(resource => {
        const resourceCard = createResourceCard(resource);
        resourcesGrid.appendChild(resourceCard);
    });
}

// Create a resource card element
function createResourceCard(resource) {
    const card = document.createElement('div');
    card.className = 'resource-card';
    
    const tagsHtml = resource.tags.map(tag => 
        `<span class="card-tag">${tag}</span>`
    ).join('');
    
    card.innerHTML = `
        <div class="thumbnail-container">
            <img 
                src="${resource.thumbnail}" 
                alt="${resource.title}" 
                class="thumbnail"
                onerror="this.src='https://via.placeholder.com/800x450?text=No+Thumbnail'"
            >
            <div class="play-icon">
                <i class="fas fa-play"></i>
            </div>
        </div>
        <div class="card-content">
            <h3>${resource.title}</h3>
            <p>${resource.description}</p>
            <div class="card-tags">
                ${tagsHtml}
            </div>
        </div>
    `;
    
    // Open video in new tab when clicked
    card.addEventListener('click', (e) => {
        // Don't trigger if clicking on a tag or other interactive element
        if (e.target.closest('.card-tag')) return;
        window.open(resource.url, '_blank');
    });
    
    return card;
}

// Show error message
function showError(message) {
    resourcesGrid.innerHTML = `
        <div class="no-results">
            <i class="fas fa-exclamation-triangle" style="color: #ef4444; font-size: 2rem; margin-bottom: 1rem;"></i>
            <h3>Error Loading Resources</h3>
            <p>${message}</p>
            <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.375rem; cursor: pointer;">
                Try Again
            </button>
        </div>
    `;
}

// Set up event listeners
function setupEventListeners() {
    // Search input
    searchInput.addEventListener('input', debounce(renderResources, 300));
    
    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            renderResources();
        }
    });
}

// Debounce function for search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize the page when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
