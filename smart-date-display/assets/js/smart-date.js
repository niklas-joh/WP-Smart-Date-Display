/**
 * Smart Date Display Frontend Script
 * 
 * Automatically updates relative dates without page refresh
 */
(function($) {
    'use strict';
    
    /**
     * Update all relative date elements on the page
     */
    function updateRelativeDates() {
        $('.smart-date-display').each(function() {
            const $element = $(this);
            const timestamp = parseInt($element.data('timestamp'));
            const displayType = $element.data('display-type');
            
            // Skip if no timestamp or not relative display
            if (!timestamp || isNaN(timestamp) || displayType !== 'relative') {
                return;
            }
            
            const prefix = $element.data('prefix') || '';
            const suffix = $element.data('suffix') || 'ago';
            const locale = $element.data('locale') || 'en';
            
            // Calculate the relative date text
            const now = Math.floor(Date.now() / 1000);
            const diff = now - timestamp;
            
            // Skip future dates
            if (diff < 0) {
                return;
            }
            
            // Format the date
            let text = getRelativeTimeText(diff, locale);
            
            // Update the element content
            $element.text((prefix ? prefix + ' ' : '') + text + (suffix ? ' ' + suffix : ''));
        });
    }
    
    /**
     * Get relative time text based on time difference and locale
     * 
     * @param {number} diff Time difference in seconds
     * @param {string} locale Locale code
     * @return {string} Formatted relative time text
     */
    function getRelativeTimeText(diff, locale) {
        // Time units in seconds
        const minute = 60;
        const hour = 60 * minute;
        const day = 24 * hour;
        const week = 7 * day;
        const month = 30 * day;
        const year = 365 * day;
        
        // Basic localization
        const units = {
            'en': {
                just_now: 'just now',
                second: ['second', 'seconds'],
                minute: ['minute', 'minutes'],
                hour: ['hour', 'hours'],
                day: ['day', 'days'],
                week: ['week', 'weeks'],
                month: ['month', 'months'],
                year: ['year', 'years']
            },
            'sv': {
                just_now: 'just nu',
                second: ['sekund', 'sekunder'],
                minute: ['minut', 'minuter'],
                hour: ['timme', 'timmar'],
                day: ['dag', 'dagar'],
                week: ['vecka', 'veckor'],
                month: ['månad', 'månader'],
                year: ['år', 'år']
            }
        };
        
        // Default to English if locale not found
        if (!units[locale]) {
            locale = 'en';
        }
        
        // Format based on time difference
        if (diff < minute) {
            return units[locale].just_now;
        } else if (diff < hour) {
            const minutes = Math.floor(diff / minute);
            return `${minutes} ${minutes === 1 ? units[locale].minute[0] : units[locale].minute[1]}`;
        } else if (diff < day) {
            const hours = Math.floor(diff / hour);
            return `${hours} ${hours === 1 ? units[locale].hour[0] : units[locale].hour[1]}`;
        } else if (diff < week) {
            const days = Math.floor(diff / day);
            return `${days} ${days === 1 ? units[locale].day[0] : units[locale].day[1]}`;
        } else if (diff < month) {
            const weeks = Math.floor(diff / week);
            return `${weeks} ${weeks === 1 ? units[locale].week[0] : units[locale].week[1]}`;
        } else if (diff < year) {
            const months = Math.floor(diff / month);
            return `${months} ${months === 1 ? units[locale].month[0] : units[locale].month[1]}`;
        } else {
            const years = Math.floor(diff / year);
            return `${years} ${years === 1 ? units[locale].year[0] : units[locale].year[1]}`;
        }
    }
    
    // Run when DOM is ready
    $(document).ready(function() {
        // Update dates on page load
        updateRelativeDates();
        
        // Update dates every minute
        setInterval(updateRelativeDates, 60000);
    });
    
})(jQuery);