// Map initialization
let map;
let markers = [];
let google; // Declare google
let wordCount; // Declare wordCount

function initMap() {
    // Check if Google Maps API is loaded
    if (typeof google === 'undefined') {
        console.error("Google Maps API not loaded");
        document.getElementById("map").innerHTML = "<p>Map could not be loaded. Please check your internet connection.</p>";
        return;
    }

    // Create a map centered on a default location
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 40.7128, lng: -74.0060 }, // New York City coordinates
        zoom: 13,
    });

    // Sample healing pod locations
    const locations = [
        { name: "Tranquil Cafe", type: "cafe", lat: 40.7128, lng: -74.0060, description: "A quiet cafe with ambient music and private corners." },
        { name: "Central Park Meditation Spot", type: "park", lat: 40.7193, lng: -73.9654, description: "A secluded area in the park perfect for meditation." },
        { name: "Mindful Studio", type: "meditation", lat: 40.7214, lng: -73.9877, description: "Guided meditation sessions available throughout the day." },
        { name: "Serenity Garden", type: "park", lat: 40.7069, lng: -74.0113, description: "A peaceful garden with water features and comfortable seating." },
        { name: "Calm Waters Cafe", type: "cafe", lat: 40.7308, lng: -73.9973, description: "Specializes in calming herbal teas and has a no-phone policy." },
    ];

    // Add markers for each location
    locations.forEach(location => {
        addMarker(location);
    });
}

function addMarker(location) {
    if (typeof google === 'undefined') return;
    
    const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.name,
    });

    // Create info window for each marker
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div class="info-window">
                <h3>${location.name}</h3>
                <p>${location.description}</p>
                <p><strong>Type:</strong> ${location.type}</p>
                <button onclick="getDirections(${location.lat}, ${location.lng})">Get Directions</button>
            </div>
        `
    });

    // Add click event to marker
    marker.addListener("click", () => {
        infoWindow.open(map, marker);
    });

    markers.push({ marker, type: location.type });
}

function getDirections(lat, lng) {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
}

// Filter map markers based on checkbox selection
document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('.filter-options input');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterMarkers);
    });

    // Set up event listeners for modals
    setupModalListeners();
    
    // Set up story input word counter
    setupStoryInput();
    
    // Set up initial mood resources
    updateMoodResources();
});

function setupModalListeners() {
    // Get all close buttons
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Add event listeners to all close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Find the parent modal
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.add('hidden');
            }
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
    
    // Add keyboard event to close modals with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const modals = document.querySelectorAll('.modal:not(.hidden)');
            modals.forEach(modal => {
                modal.classList.add('hidden');
            });
        }
    });
}

function setupStoryInput() {
    const storyInput = document.getElementById('story-input');
    if (storyInput) {
        const wordCount = document.getElementById('word-count');
        
        storyInput.addEventListener('input', function() {
            const words = this.value.trim().split(/\s+/).filter(Boolean).length;
            wordCount.textContent = `${words}/200 words`;
            
            if (words > 200) {
                wordCount.style.color = 'red';
            } else {
                wordCount.style.color = 'inherit';
            }
        });
    }
}

function filterMarkers() {
    const checkboxes = document.querySelectorAll('.filter-options input');
    const selectedTypes = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.nextSibling.textContent.trim().toLowerCase());

    markers.forEach(({ marker, type }) => {
        if (selectedTypes.includes(type)) {
            marker.setVisible(true);
        } else {
            marker.setVisible(false);
        }
    });
}

// Update mood resources
function updateMoodResources() {
    const moodSelect = document.getElementById('mood-select');
    if (!moodSelect) return;
    
    const mood = moodSelect.value;
    const promptElement = document.getElementById('calming-prompt');
    
    // Different prompts based on mood
    const prompts = {
        anxious: "Close your eyes and take five deep breaths. With each exhale, imagine releasing tension from your shoulders and chest. You are safe in this moment.",
        sad: "It's okay to feel your emotions. Acknowledge your sadness without judgment. Remember a time when you felt joy - it will come again.",
        overwhelmed: "Focus on just one thing right now. Break down what you need to do into small, manageable steps. You don't have to solve everything at once.",
        stressed: "Place your hand on your heart. Feel its steady rhythm. Your body knows how to find balance. Give yourself permission to take a break."
    };
    
    promptElement.textContent = prompts[mood];
    
    // Animation to draw attention to the new prompt
    promptElement.classList.add('highlight');
    setTimeout(() => {
        promptElement.classList.remove('highlight');
    }, 1000);
}

// Story submission functionality
function submitStory() {
    const storyInput = document.getElementById('story-input');
    if (!storyInput) return;
    
    const storyText = storyInput.value.trim();
    
    if (storyText.length === 0) {
        alert('Please write a story before submitting.');
        return;
    }
    
    const words = storyText.split(/\s+/).filter(Boolean).length;
    if (words > 200) {
        alert('Your story is too long. Please keep it under 200 words.');
        return;
    }
    
    // In a real application, this would send the story to a server
    // For this demo, we'll just add it to the page
    const storyFeed = document.querySelector('.story-feed');
    if (!storyFeed) return;
    
    // Create a new story card
    const storyCard = document.createElement('div');
    storyCard.className = 'story-card';
    
    // Get current time for timestamp
    const timeString = 'Just now';
    
    // Create story content
    storyCard.innerHTML = `
        <div class="story-header">
            <span class="author">You</span>
            <span class="timestamp">${timeString}</span>
        </div>
        <p class="story-content">${storyText}</p>
        <div class="story-footer">
            <button class="reaction-btn">❤️ 0</button>
            <button class="reaction-btn">🤗 0</button>
        </div>
    `;
    
    // Add the new story to the top of the feed
    storyFeed.insertBefore(storyCard, storyFeed.firstChild);
    
    // Clear the input
    storyInput.value = '';
    const wordCount = document.getElementById('word-count');
    if (wordCount) {
        wordCount.textContent = '0/200 words';
    }
    
    // Show confirmation
    alert('Your story has been shared with the community!');
}

// Conversation starter functionality
function refreshConversationStarter() {
    const starters = [
        "What small moment brought you unexpected joy this week?",
        "Share a time when a stranger's kindness made a difference to you.",
        "What's a simple pleasure that always lifts your mood?",
        "Describe a place where you feel most at peace.",
        "What's something you're looking forward to in the coming days?",
        "Share a personal ritual that helps you feel grounded.",
        "What's a lesson you learned from a difficult experience?",
        "Describe a sound, smell, or taste that brings back a powerful memory."
    ];
    
    const starterElement = document.querySelector('.ai-conversation-starter p');
    if (!starterElement) return;
    
    const randomStarter = starters[Math.floor(Math.random() * starters.length)];
    
    starterElement.textContent = randomStarter;
    
    // Animation to draw attention to the new starter
    starterElement.classList.add('highlight');
    setTimeout(() => {
        starterElement.classList.remove('highlight');
    }, 1000);
}

// Mental health tools functionality
function openTool(toolName) {
    const modal = document.getElementById(`${toolName}-modal`);
    if (modal) {
        // Close any other open modals first
        const openModals = document.querySelectorAll('.modal:not(.hidden)');
        openModals.forEach(m => m.classList.add('hidden'));
        
        // Open the requested modal
        modal.classList.remove('hidden');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Breathing exercise functionality
function startBreathing() {
    const circle = document.querySelector('.breathing-circle');
    const instruction = document.getElementById('breath-instruction');
    const startButton = document.querySelector('#breathing-modal .primary-btn');
    
    if (!circle || !instruction || !startButton) return;
    
    startButton.disabled = true;
    
    // Breathing cycle: inhale (4s), hold (4s), exhale (6s), repeat
    const breathingCycle = async () => {
        // Inhale
        instruction.textContent = 'Breathe in...';
        circle.style.transform = 'scale(1.5)';
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        // Hold
        instruction.textContent = 'Hold...';
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        // Exhale
        instruction.textContent = 'Breathe out...';
        circle.style.transform = 'scale(1)';
        await new Promise(resolve => setTimeout(resolve, 6000));
    };
    
    // Run 3 breathing cycles
    (async () => {
        for (let i = 0; i < 3; i++) {
            await breathingCycle();
        }
        instruction.textContent = 'Well done!';
        startButton.disabled = false;
    })();
}

// Sentiment analysis functionality
function analyzeSentiment() {
    const sentimentInput = document.getElementById('sentiment-input');
    if (!sentimentInput) return;
    
    const sentimentText = sentimentInput.value.trim();
    
    if (sentimentText.length === 0) {
        alert('Please share how you\'re feeling first.');
        return;
    }
    
    // In a real application, this would send the text to an NLP service
    // For this demo, we'll use simple keyword matching
    const text = sentimentText.toLowerCase();
    const resourceList = document.getElementById('resource-list');
    const resultsSection = document.getElementById('sentiment-results');
    
    if (!resourceList || !resultsSection) return;
    
    // Clear previous results
    resourceList.innerHTML = '';
    
    // Simple keyword-based analysis
    const resources = [];
    
    if (text.includes('anxious') || text.includes('anxiety') || text.includes('worried') || text.includes('stress')) {
        resources.push('Guided anxiety reduction exercises');
        resources.push('Grounding techniques for anxiety');
    }
    
    if (text.includes('sad') || text.includes('depressed') || text.includes('unhappy') || text.includes('down')) {
        resources.push('Mood-lifting activities');
        resources.push('Depression support resources');
    }
    
    if (text.includes('lonely') || text.includes('alone') || text.includes('isolated')) {
        resources.push('Community connection opportunities');
        resources.push('Social support resources');
    }
    
    if (text.includes('tired') || text.includes('exhausted') || text.includes('sleep')) {
        resources.push('Sleep hygiene tips');
        resources.push('Energy management techniques');
    }
    
    // If no specific keywords matched, provide general resources
    if (resources.length === 0) {
        resources.push('General wellness resources');
        resources.push('Mindfulness practices');
        resources.push('Self-care activities');
    }
    
    // Add resources to the list
    resources.forEach(resource => {
        const li = document.createElement('li');
        li.textContent = resource;
        resourceList.appendChild(li);
    });
    
    // Show results
    resultsSection.classList.remove('hidden');
}

// Find local support functionality
function findLocalSupport() {
    // In a real application, this would use geolocation and a database of support resources
    // For this demo, we'll just show a message
    alert('This feature would use your location to find mental health support resources near you. In a real application, it would connect to a database of verified support providers.');
}

// Smooth scrolling for navigation
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        window.scrollTo({
            top: section.offsetTop - 80,
            behavior: 'smooth'
        });
    }
}