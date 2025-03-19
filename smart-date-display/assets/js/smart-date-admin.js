console.log('Smart Date Display block script loaded');
const { registerBlockType } = wp.blocks;
const { InspectorControls, PanelColorSettings } = wp.blockEditor;
const { 
    PanelBody, 
    SelectControl, 
    TextControl, 
    DateTimePicker,
    RangeControl,
    ToggleControl,
    TabPanel,
    FontSizePicker
} = wp.components;
const { Fragment } = wp.element;
const { createElement: el } = wp.element;
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
        },
        // Style attributes
        textColor: {
            type: 'string',
            default: ''
        },
        backgroundColor: {
            type: 'string',
            default: ''
        },
        fontSize: {
            type: 'number',
            default: 16
        },
        textAlign: {
            type: 'string',
            default: 'left'
        },
        padding: {
            type: 'number',
            default: 0
        },
        margin: {
            type: 'number',
            default: 0
        },
        borderWidth: {
            type: 'number',
            default: 0
        },
        borderRadius: {
            type: 'number',
            default: 0
        },
        borderColor: {
            type: 'string',
            default: ''
        },
        isBold: {
            type: 'boolean',
            default: false
        },
        isItalic: {
            type: 'boolean',
            default: false
        }
    },
    
    edit: function(props) {
        const { attributes, setAttributes } = props;
        const { 
            date, displayType, format, prefix, suffix, locale,
            textColor, backgroundColor, fontSize, textAlign, padding, margin,
            borderWidth, borderRadius, borderColor, isBold, isItalic
        } = attributes;
        
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
        
        // Apply styles to the preview element
        const getStyles = () => {
            return {
                color: textColor || undefined,
                backgroundColor: backgroundColor || undefined,
                fontSize: fontSize + 'px',
                textAlign: textAlign,
                padding: padding + 'px',
                margin: margin + 'px',
                borderWidth: borderWidth + 'px',
                borderStyle: borderWidth > 0 ? 'solid' : 'none',
                borderColor: borderColor || '#ddd',
                borderRadius: borderRadius + 'px',
                fontWeight: isBold ? 'bold' : 'normal',
                fontStyle: isItalic ? 'italic' : 'normal',
                display: 'block'
            };
        };
        
        // Create inspector controls with tabs
        const inspectorControls = el(InspectorControls, {},
            el(TabPanel, {
                className: 'smart-date-tabs',
                activeClass: 'is-active',
                tabs: [
                    {
                        name: 'content',
                        title: 'Content',
                        className: 'tab-content',
                    },
                    {
                        name: 'style',
                        title: 'Style',
                        className: 'tab-style',
                    }
                ]
            }, (tab) => {
                if (tab.name === 'content') {
                    return el(Fragment, {},
                        // Date Picker Panel
                        el(PanelBody, { 
                            title: "Date Selection", 
                            initialOpen: true 
                        },
                            el('div', { className: 'smart-date-picker-wrapper' },
                                el(DateTimePicker, {
                                    currentDate: date,
                                    onChange: (newDate) => setAttributes({ date: newDate }),
                                    is12Hour: false, // Use 24-hour format
                                    isInvalidDate: () => false, // Allow all dates
                                    firstDayOfWeek: 1 // Start week on Monday (0 = Sunday, 1 = Monday)
                                })
                            )
                        ),
                        
                        // Display Settings Panel
                        el(PanelBody, { 
                            title: "Display Settings", 
                            initialOpen: false 
                        },
                            el(SelectControl, {
                                label: "Display Type",
                                value: displayType,
                                options: [
                                    { label: 'Relative', value: 'relative' },
                                    { label: 'Absolute', value: 'absolute' }
                                ],
                                onChange: (value) => setAttributes({ displayType: value })
                            }),
                            
                            displayType === 'absolute' ? el(TextControl, {
                                label: "Date Format",
                                value: format,
                                help: "PHP date format (e.g., Y-m-d H:i)",
                                onChange: (value) => setAttributes({ format: value })
                            }) : null
                        ),
                        
                        // Text Options Panel
                        el(PanelBody, { 
                            title: "Text Options", 
                            initialOpen: false 
                        },
                            el(TextControl, {
                                label: "Prefix",
                                value: prefix,
                                onChange: (value) => setAttributes({ prefix: value })
                            }),
                            
                            el(TextControl, {
                                label: "Suffix",
                                value: suffix,
                                onChange: (value) => setAttributes({ suffix: value })
                            })
                        ),
                        
                        // Language Panel
                        el(PanelBody, { 
                            title: "Language", 
                            initialOpen: false 
                        },
                            el(SelectControl, {
                                label: "Locale",
                                value: locale,
                                options: [
                                    { label: 'English', value: 'en' },
                                    { label: 'Swedish', value: 'sv' }
                                ],
                                onChange: (value) => setAttributes({ locale: value })
                            })
                        )
                    );
                } else if (tab.name === 'style') {
                    return el(Fragment, {},
                        // Text options
                        el(PanelBody, { 
                            title: "Text", 
                            initialOpen: true 
                        },
                            el(SelectControl, {
                                label: "Text Alignment",
                                value: textAlign,
                                options: [
                                    { label: 'Left', value: 'left' },
                                    { label: 'Center', value: 'center' },
                                    { label: 'Right', value: 'right' }
                                ],
                                onChange: (value) => setAttributes({ textAlign: value })
                            }),
                            
                            el(RangeControl, {
                                label: "Font Size",
                                value: fontSize,
                                min: 10,
                                max: 36,
                                onChange: (value) => setAttributes({ fontSize: value })
                            }),
                            
                            el(ToggleControl, {
                                label: "Bold",
                                checked: isBold,
                                onChange: (value) => setAttributes({ isBold: value })
                            }),
                            
                            el(ToggleControl, {
                                label: "Italic",
                                checked: isItalic,
                                onChange: (value) => setAttributes({ isItalic: value })
                            })
                        ),
                        
                        // Color options
                        el(PanelBody, { 
                            title: "Colors", 
                            initialOpen: false 
                        },
                            el(PanelColorSettings, {
                                title: "",
                                initialOpen: true,
                                colorSettings: [
                                    {
                                        value: textColor,
                                        onChange: (value) => setAttributes({ textColor: value }),
                                        label: "Text Color"
                                    },
                                    {
                                        value: backgroundColor,
                                        onChange: (value) => setAttributes({ backgroundColor: value }),
                                        label: "Background Color"
                                    }
                                ]
                            })
                        ),
                        
                        // Spacing options
                        el(PanelBody, { 
                            title: "Spacing", 
                            initialOpen: false 
                        },
                            el(RangeControl, {
                                label: "Padding",
                                value: padding,
                                min: 0,
                                max: 50,
                                onChange: (value) => setAttributes({ padding: value })
                            }),
                            
                            el(RangeControl, {
                                label: "Margin",
                                value: margin,
                                min: 0,
                                max: 50,
                                onChange: (value) => setAttributes({ margin: value })
                            })
                        ),
                        
                        // Border options
                        el(PanelBody, { 
                            title: "Border", 
                            initialOpen: false 
                        },
                            el(RangeControl, {
                                label: "Border Width",
                                value: borderWidth,
                                min: 0,
                                max: 10,
                                onChange: (value) => setAttributes({ borderWidth: value })
                            }),
                            
                            el(RangeControl, {
                                label: "Border Radius",
                                value: borderRadius,
                                min: 0,
                                max: 50,
                                onChange: (value) => setAttributes({ borderRadius: value })
                            }),
                            
                            borderWidth > 0 ? el(PanelColorSettings, {
                                title: "",
                                initialOpen: true,
                                colorSettings: [
                                    {
                                        value: borderColor,
                                        onChange: (value) => setAttributes({ borderColor: value }),
                                        label: "Border Color"
                                    }
                                ]
                            }) : null
                        )
                    );
                }
            })
        );
        
        // Create the clean preview display with applied styles
        const preview = el('div', { 
            className: 'smart-date-display',
            style: getStyles()
        }, previewDate());
        
        // Return both the inspector controls and preview
        return el(Fragment, {}, [inspectorControls, preview]);
    },
    
    save: function() {
        // Dynamic block, server-side rendering
        return null;
    }
});