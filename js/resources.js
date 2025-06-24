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
        
        // Process and filter the data
        resources = data
            .filter(item => item.URL && item.Title) // Only include items with URL and Title
            .map(item => ({
                id: item.id,
                title: item.Title[0]?.[0] || 'Untitled',
                url: item.URL,
                description: item.Description?.[0]?.[0] || 'No description available',
                tags: item.Tags || [],
                thumbnail: getYouTubeThumbnail(item.URL)
            }));
        
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
    if (!url) return '';
    
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
            let videoId;
            
            if (urlObj.hostname.includes('youtu.be')) {
                videoId = urlObj.pathname.slice(1);
            } else {
                videoId = new URLSearchParams(urlObj.search).get('v');
            }
            
            if (videoId) {
                return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            }
        }
    } catch (e) {
        console.error('Error parsing URL:', e);
    }
    
    return '';
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
