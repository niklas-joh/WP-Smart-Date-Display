/**
 * Smart Date Display Block
 * 
 * WordPress Gutenberg block for displaying dates in relative or absolute format.
 */

// Import WordPress dependencies
const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;
const { InspectorControls, useBlockProps } = wp.blockEditor || wp.editor;
const { 
    PanelBody, 
    SelectControl, 
    TextControl, 
    DateTimePicker,
    ToggleControl
} = wp.components;
const { Fragment } = wp.element;

/**
 * Register the block
 */
registerBlockType('smart-date-display/date-block', {
    // Block properties defined in block.json
    
    /**
     * Block edit function
     */
    edit: function(props) {
        const { attributes, setAttributes } = props;
        const { 
            date,
            displayType,
            format,
            prefix,
            suffix,
            locale
        } = attributes;
        
        // Support for block props in WP 5.6+
        const blockProps = useBlockProps ? useBlockProps() : {};
        
        /**
         * Preview the date based on current settings
         */
        const getPreviewText = () => {
            if (!date) {
                return __('Select a date to display', 'smart-date-display');
            }
            
            const timestamp = Date.parse(date) / 1000;
            const now = Math.floor(Date.now() / 1000);
            const diff = now - timestamp;
            
            if (displayType === 'absolute') {
                // Show formatted date based on format
                const formattedDate = new Date(timestamp * 1000).toLocaleString();
                return `${prefix ? prefix + ' ' : ''}${formattedDate}${suffix ? ' ' + suffix : ''}`;
            } else {
                // Show relative date (basic preview version)
                if (diff < 0) {
                    return __('Date is in the future', 'smart-date-display');
                }
                
                // Convert seconds to appropriate time unit
                let timeText = '';
                const minute = 60;
                const hour = 60 * minute;
                const day = 24 * hour;
                const week = 7 * day;
                const month = 30 * day;
                const year = 365 * day;
                
                if (diff < minute) {
                    timeText = __('Just now', 'smart-date-display');
                } else if (diff < hour) {
                    const minutes = Math.floor(diff / minute);
                    timeText = `${minutes} ${minutes === 1 ? __('minute', 'smart-date-display') : __('minutes', 'smart-date-display')}`;
                } else if (diff < day) {
                    const hours = Math.floor(diff / hour);
                    timeText = `${hours} ${hours === 1 ? __('hour', 'smart-date-display') : __('hours', 'smart-date-display')}`;
                } else if (diff < week) {
                    const days = Math.floor(diff / day);
                    timeText = `${days} ${days === 1 ? __('day', 'smart-date-display') : __('days', 'smart-date-display')}`;
                } else if (diff < month) {
                    const weeks = Math.floor(diff / week);
                    timeText = `${weeks} ${weeks === 1 ? __('week', 'smart-date-display') : __('weeks', 'smart-date-display')}`;
                } else if (diff < year) {
                    const months = Math.floor(diff / month);
                    timeText = `${months} ${months === 1 ? __('month', 'smart-date-display') : __('months', 'smart-date-display')}`;
                } else {
                    const years = Math.floor(diff / year);
                    timeText = `${years} ${years === 1 ? __('year', 'smart-date-display') : __('years', 'smart-date-display')}`;
                }
                
                return `${prefix ? prefix + ' ' : ''}${timeText}${suffix ? ' ' + suffix : ''}`;
            }
        };
        
        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody title={__('Date Settings', 'smart-date-display')} initialOpen={true}>
                        <div className="smart-date-picker-wrapper">
                            <p>{__('Select Date and Time:', 'smart-date-display')}</p>
                            <DateTimePicker
                                currentDate={date}
                                onChange={(newDate) => setAttributes({ date: newDate })}
                                is12Hour={false}
                            />
                        </div>
                    </PanelBody>
                    
                    <PanelBody title={__('Display Settings', 'smart-date-display')} initialOpen={true}>
                        <SelectControl
                            label={__('Display Type', 'smart-date-display')}
                            value={displayType}
                            options={[
                                { label: __('Relative', 'smart-date-display'), value: 'relative' },
                                { label: __('Absolute', 'smart-date-display'), value: 'absolute' }
                            ]}
                            onChange={(value) => setAttributes({ displayType: value })}
                        />
                        
                        {displayType === 'absolute' && (
                            <TextControl
                                label={__('Date Format', 'smart-date-display')}
                                value={format}
                                help={__('PHP date format (e.g. F j, Y)', 'smart-date-display')}
                                onChange={(value) => setAttributes({ format: value })}
                            />
                        )}
                        
                        <TextControl
                            label={__('Prefix', 'smart-date-display')}
                            value={prefix}
                            onChange={(value) => setAttributes({ prefix: value })}
                        />
                        
                        <TextControl
                            label={__('Suffix', 'smart-date-display')}
                            value={suffix}
                            onChange={(value) => setAttributes({ suffix: value })}
                        />
                        
                        <SelectControl
                            label={__('Language', 'smart-date-display')}
                            value={locale}
                            options={[
                                { label: __('English', 'smart-date-display'), value: 'en' },
                                { label: __('Swedish', 'smart-date-display'), value: 'sv' }
                            ]}
                            onChange={(value) => setAttributes({ locale: value })}
                        />
                    </PanelBody>
                </InspectorControls>
                
                <div {...blockProps} className="smart-date-display">
                    {getPreviewText()}
                </div>
            </Fragment>
        );
    },
    
    /**
     * Save function
     * Returns null for server-side rendering
     */
    save: function() {
        return null;
    }
});