// ================================
// SOUND & ANIMATION MANAGER
// ================================
// Global sound management system for RMS Dashboard
// Handles click sounds, graph animation sounds, and mute/unmute functionality

class SoundManager {
    constructor() {
        // Initialize mute state from localStorage (default: unmuted)
        this.isMuted = localStorage.getItem('soundMuted') === 'true';
        
        // Audio contexts for different sound types
        this.audioContext = null;
        this.clickBuffer = null;
        this.graphBuffer = null;
        
        // Initialize audio context
        this.initAudioContext();
        
        // Create sound generators
        this.createSounds();
        
        // Add click listeners to all interactive elements
        this.attachClickListeners();
    }
    
    // Initialize Web Audio API
    initAudioContext() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }
    }
    
    // Generate pleasant click sound using oscillator
    createClickSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Pleasant click sound - short beep
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }
    
    // Generate pleasant graph animation sound - sweet chime
    createGraphSound() {
        if (!this.audioContext) return;
        
        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Sweet harmonious chime - C major chord
        oscillator1.frequency.value = 523.25; // C5
        oscillator2.frequency.value = 659.25; // E5
        
        oscillator1.type = 'sine';
        oscillator2.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);
        
        oscillator1.start(this.audioContext.currentTime);
        oscillator2.start(this.audioContext.currentTime);
        oscillator1.stop(this.audioContext.currentTime + 0.8);
        oscillator2.stop(this.audioContext.currentTime + 0.8);
    }
    
    // Generate sounds (placeholder for future enhancements)
    createSounds() {
        // Sounds are generated on-the-fly using Web Audio API
        // No need to preload
    }
    
    // Play click sound
    playClickSound() {
        if (this.isMuted) return;
        
        // Resume audio context if suspended (browser autoplay policy)
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        this.createClickSound();
    }
    
    // Play graph animation sound
    playGraphSound() {
        if (this.isMuted) return;
        
        // Resume audio context if suspended
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        this.createGraphSound();
    }
    
    // Toggle mute/unmute
    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('soundMuted', this.isMuted);
        this.updateMuteButton();
        return this.isMuted;
    }
    
    // Set mute state
    setMute(muted) {
        this.isMuted = muted;
        localStorage.setItem('soundMuted', this.isMuted);
        this.updateMuteButton();
    }
    
    // Update mute button appearance (if exists)
    updateMuteButton() {
        const muteBtn = document.getElementById('soundToggle');
        if (muteBtn) {
            muteBtn.innerHTML = this.isMuted ? '🔇' : '🔊';
            muteBtn.title = this.isMuted ? 'Unmute Sounds' : 'Mute Sounds';
            muteBtn.style.opacity = this.isMuted ? '0.5' : '1';
        }
    }
    
    // Attach click listeners to all interactive elements
    attachClickListeners() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.addClickListeners());
        } else {
            this.addClickListeners();
        }
    }
    
    // Add click listeners to buttons, links, and interactive elements
    addClickListeners() {
        // Add listeners to all buttons
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            // Check if clicked element is interactive
            if (target.tagName === 'BUTTON' || 
                target.tagName === 'A' || 
                target.classList.contains('stat-card') ||
                target.classList.contains('action-btn') ||
                target.classList.contains('upload-icon') ||
                target.classList.contains('export-btn') ||
                target.closest('button') ||
                target.closest('a') ||
                target.closest('.stat-card') ||
                target.closest('.action-btn') ||
                target.closest('.export-btn')) {
                
                // Don't play sound if it's the mute button itself
                if (target.id !== 'soundToggle' && !target.closest('#soundToggle')) {
                    this.playClickSound();
                }
            }
        }, true);
        
        // Add canvas click listeners (for chart interactions)
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            canvas.addEventListener('click', () => {
                this.playClickSound();
            });
        });
    }
    
    // Initialize mute button on main page
    createMuteButton() {
        const muteBtn = document.getElementById('soundToggle');
        if (muteBtn) {
            this.updateMuteButton();
            muteBtn.addEventListener('click', () => {
                this.toggleMute();
            });
        }
    }
}

// Create global sound manager instance
let soundManager;

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        soundManager = new SoundManager();
        soundManager.createMuteButton();
    });
} else {
    soundManager = new SoundManager();
    soundManager.createMuteButton();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SoundManager;
}

// ================================
// CHART ANIMATION ENHANCER
// ================================
// Add motion animations and sounds to all Chart.js charts

class ChartAnimationEnhancer {
    constructor(soundManager) {
        this.soundManager = soundManager;
        this.originalChartCreate = null;
        this.enhanceChartJS();
    }
    
    // Override Chart.js to add enhanced animations
    enhanceChartJS() {
        // Wait for Chart.js to be available
        const checkChartJS = setInterval(() => {
            if (typeof Chart !== 'undefined') {
                clearInterval(checkChartJS);
                this.interceptChartCreation();
            }
        }, 100);
    }
    
    interceptChartCreation() {
        // Store original Chart constructor
        this.originalChartCreate = Chart;
        
        // Override default animation options for all charts
        Chart.defaults.animation = {
            duration: 2000,
            easing: 'easeInOutQuart',
            onProgress: function(animation) {
                // Add elastic bounce effect at the end
                if (animation.currentStep === 1) {
                    // Animation starting
                } else if (animation.currentStep === animation.numSteps) {
                    // Animation complete
                }
            },
            onComplete: function(animation) {
                // Play sound when animation completes
                if (soundManager && typeof soundManager.playGraphSound === 'function') {
                    soundManager.playGraphSound();
                }
            }
        };
        
        // Enhanced animations for different chart types
        Chart.defaults.datasets.bar = Chart.defaults.datasets.bar || {};
        Chart.defaults.datasets.bar.animation = {
            duration: 1500,
            easing: 'easeOutBounce', // Bouncy bars
            delay: function(context) {
                // Stagger animation for bars
                return context.dataIndex * 100;
            }
        };
        
        Chart.defaults.datasets.pie = Chart.defaults.datasets.pie || {};
        Chart.defaults.datasets.pie.animation = {
            animateRotate: true,
            animateScale: true,
            duration: 2000,
            easing: 'easeOutElastic' // Elastic pie slices
        };
    }
    
    // Add spring animation to chart elements
    addSpringAnimation(chart) {
        if (!chart || !chart.config) return;
        
        const originalOptions = chart.config.options || {};
        chart.config.options = chart.config.options || {};
        
        // Add enhanced animation with spring effect
        chart.config.options.animation = {
            ...originalOptions.animation,
            duration: 2000,
            easing: 'easeInOutQuart',
            onComplete: () => {
                // Play sound when animation completes
                if (this.soundManager) {
                    setTimeout(() => {
                        this.soundManager.playGraphSound();
                    }, 100);
                }
            }
        };
    }
}

// Initialize chart enhancer when sound manager is ready
let chartEnhancer;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            if (soundManager) {
                chartEnhancer = new ChartAnimationEnhancer(soundManager);
            }
        }, 500);
    });
} else {
    setTimeout(() => {
        if (soundManager) {
            chartEnhancer = new ChartAnimationEnhancer(soundManager);
        }
    }, 500);
}
