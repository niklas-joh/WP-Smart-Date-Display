/**
 * Smart Date Display Frontend Script
 * Automatically updates relative dates on the frontend without page refresh
 */
jQuery(document).ready(function($) {
    // Find all elements with the smart-date-display class and update them periodically
    function updateRelativeDates() {
        $('.smart-date-display').each(function() {
            var $this = $(this);
            var timestamp = parseInt($this.data('timestamp'));
            
            // Skip if no timestamp data
            if (!timestamp || isNaN(timestamp)) return;
            
            // Get display attributes from data attributes if available
            var displayType = $this.data('display-type') || 'relative';
            var prefix = $this.data('prefix') || '';
            var suffix = $this.data('suffix') || 'ago';
            var locale = $this.data('locale') || 'en';
            
            // Only update if it's a relative date
            if (displayType === 'relative') {
                var now = Math.floor(Date.now() / 1000);
                var diff = now - timestamp;
                
                // Skip future dates or invalid timestamps
                if (diff < 0 || isNaN(diff)) return;
                
                // Get the appropriate text based on locale
                var text = getRelativeText(diff, locale);
                
                // Update the element content
                $this.text((prefix ? prefix + ' ' : '') + text + (suffix ? ' ' + suffix : ''));
            }
        });
    }
    
    // Helper function to get relative text based on time difference and locale
    function getRelativeText(diff, locale) {
        // Language units
        var units = {
            'en': {
                second: ['second', 'seconds'],
                minute: ['minute', 'minutes'],
                hour: ['hour', 'hours'],
                day: ['day', 'days'],
                week: ['week', 'weeks'],
                month: ['month', 'months'],
                year: ['year', 'years'],
                today: 'today',
                yesterday: 'yesterday'
            },
            'sv': {
                second: ['sekund', 'sekunder'],
                minute: ['minut', 'minuter'],
                hour: ['timme', 'timmar'],
                day: ['dag', 'dagar'],
                week: ['vecka', 'veckor'],
                month: ['månad', 'månader'],
                year: ['år', 'år'],
                today: 'idag',
                yesterday: 'igår'
            }
        };
        
        // Default to English if locale not available
        if (!units[locale]) locale = 'en';
        
        // Calculate the appropriate time unit
        if (diff < 60) {
            return diff + ' ' + (diff === 1 ? units[locale].second[0] : units[locale].second[1]);
        }
        
        var minutes = Math.floor(diff / 60);
        if (minutes < 60) {
            return minutes + ' ' + (minutes === 1 ? units[locale].minute[0] : units[locale].minute[1]);
        }
        
        var hours = Math.floor(diff / 3600);
        if (hours < 24) {
            return hours + ' ' + (hours === 1 ? units[locale].hour[0] : units[locale].hour[1]);
        }
        
        var days = Math.floor(diff / 86400);
        if (days === 0) {
            return units[locale].today;
        } else if (days === 1) {
            return units[locale].yesterday;
        } else if (days < 7) {
            return days + ' ' + (days === 1 ? units[locale].day[0] : units[locale].day[1]);
        }
        
        var weeks = Math.floor(diff / 604800);
        if (weeks < 4) {
            return weeks + ' ' + (weeks === 1 ? units[locale].week[0] : units[locale].week[1]);
        }
        
        var months = Math.floor(diff / 2592000);
        if (months < 12) {
            return months + ' ' + (months === 1 ? units[locale].month[0] : units[locale].month[1]);
        }
        
        var years = Math.floor(diff / 31536000);
        return years + ' ' + (years === 1 ? units[locale].year[0] : units[locale].year[1]);
    }
    
    // Update on page load
    updateRelativeDates();
    
    // Update every minute
    setInterval(updateRelativeDates, 60000);
});