const { registerBlockType } = wp.blocks;
const { InspectorControls } = wp.blockEditor;
const { 
    PanelBody, 
    SelectControl, 
    TextControl, 
    DateTimePicker 
} = wp.components;
const { Fragment } = wp.element;
const { __ } = wp.i18n;

registerBlockType('smart-date-display/date-block', {
    title: 'Smart Date Display',
    icon: 'calendar-alt',
    category: 'widgets',
    keywords: ['date', 'relative', 'time'],
    
    attributes: {
        date: {
            type: 'string',
            default: ''
        },
        displayType: {
            type: 'string',
            default: 'relative'
        },
        format: {
            type: 'string',
            default: 'Y-m-d H:i'
        },
        prefix: {
            type: 'string',
            default: ''
        },
        suffix: {
            type: 'string',
            default: 'ago'
        },
        locale: {
            type: 'string',
            default: 'en'
        }
    },
    
    edit: function(props) {
        const { attributes, setAttributes } = props;
        const { date, displayType, format, prefix, suffix, locale } = attributes;
        
        // Function to preview the date format based on current settings
        const previewDate = () => {
            if (!date) return 'Please select a date';
            
            const timestamp = Date.parse(date) / 1000;
            const now = Math.floor(Date.now() / 1000);
            const diff = now - timestamp;
            
            if (displayType === 'absolute') {
                // This is just a basic preview - server-side will use proper formatting
                const dateObj = new Date(timestamp * 1000);
                return `${prefix} ${dateObj.toLocaleString()} ${suffix}`;
            } else {
                // Basic relative date preview
                if (diff < 0) return `${prefix} Date is in the future ${suffix}`;
                
                const seconds = diff;
                const minutes = Math.floor(diff / 60);
                const hours = Math.floor(diff / 3600);
                const days = Math.floor(diff / 86400);
                const weeks = Math.floor(diff / 604800);
                const months = Math.floor(diff / 2592000);
                const years = Math.floor(diff / 31536000);
                
                if (seconds < 60) return `${prefix} ${seconds} seconds ${suffix}`;
                if (minutes < 60) return `${prefix} ${minutes} minute${minutes !== 1 ? 's' : ''} ${suffix}`;
                if (hours < 24) return `${prefix} ${hours} hour${hours !== 1 ? 's' : ''} ${suffix}`;
                if (days < 7) return `${prefix} ${days} day${days !== 1 ? 's' : ''} ${suffix}`;
                if (weeks < 4) return `${prefix} ${weeks} week${weeks !== 1 ? 's' : ''} ${suffix}`;
                if (months < 12) return `${prefix} ${months} month${months !== 1 ? 's' : ''} ${suffix}`;
                return `${prefix} ${years} year${years !== 1 ? 's' : ''} ${suffix}`;
            }
        };
        
        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody title="Date Settings" initialOpen={true}>
                        <DateTimePicker
                            currentDate={date}
                            onChange={(newDate) => setAttributes({ date: newDate })}
                            is12Hour={true}
                        />
                        
                        <SelectControl
                            label="Display Type"
                            value={displayType}
                            options={[
                                { label: 'Relative', value: 'relative' },
                                { label: 'Absolute', value: 'absolute' }
                            ]}
                            onChange={(value) => setAttributes({ displayType: value })}
                        />
                        
                        {displayType === 'absolute' && (
                            <TextControl
                                label="Date Format"
                                value={format}
                                help="PHP date format (e.g., Y-m-d H:i)"
                                onChange={(value) => setAttributes({ format: value })}
                            />
                        )}
                        
                        <TextControl
                            label="Prefix"
                            value={prefix}
                            onChange={(value) => setAttributes({ prefix: value })}
                        />
                        
                        <TextControl
                            label="Suffix"
                            value={suffix}
                            onChange={(value) => setAttributes({ suffix: value })}
                        />
                        
                        <SelectControl
                            label="Language"
                            value={locale}
                            options={[
                                { label: 'English', value: 'en' },
                                { label: 'Swedish', value: 'sv' }
                                // Add more languages as needed
                            ]}
                            onChange={(value) => setAttributes({ locale: value })}
                        />
                    </PanelBody>
                </InspectorControls>
                
                <div className="relative-date-block">
                    <div className="preview">
                        <strong>Preview:</strong> {previewDate()}
                    </div>
                    <div className="settings-summary">
                        <p>Display: {displayType === 'relative' ? 'Relative' : 'Absolute'}</p>
                        <p>Language: {locale === 'en' ? 'English' : 'Swedish'}</p>
                    </div>
                </div>
            </Fragment>
        );
    },
    
    save: function() {
        // Dynamic block, server-side rendering
        return null;
    }
});
