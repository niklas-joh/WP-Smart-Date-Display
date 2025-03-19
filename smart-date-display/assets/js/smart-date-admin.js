console.log('Smart Date Block initialization');

(function(blocks, element) {
    var el = element.createElement;
    
    blocks.registerBlockType('smart-date-display/date-block', {
        title: 'Smart Date Display',
        icon: 'calendar-alt',
        category: 'widgets',
        
        edit: function() {
            return el('div', { className: 'smart-date-block' },
                el('p', {}, 'Smart Date Display Block (Simple Version)')
            );
        },
        
        save: function() {
            return null;
        }
    });
})(
    window.wp.blocks,
    window.wp.element
);