import os

def build_css():
    """Concatenates all CSS files into a single bundle."""
    
    # Order matters!
    files = [
        # Foundation
        'css/_breakpoints.css',
        'css/fonts.css',
        'css/core.css',
        'css/_utilities.css',
        'css/_grid.css',
        
        # Components
        'css/components/ff-navbar.css',
        'css/components/ff-nav.css',
        'css/components/ff-breadcrumb.css',
        'css/components/ff-pagination.css',
        'css/components/ff-card.css',
        'css/components/ff-accordion.css',
        'css/components/ff-tabs.css',
        'css/components/ff-modal.css',
        'css/components/ff-alert.css',
        'css/components/ff-toast.css',
        'css/components/ff-popover.css',
        'css/components/ff-tooltip.css',
        'css/components/ff-spinner.css',
        'css/components/ff-table.css',
        'css/components/ff-list-group.css',
        'css/components/ff-avatar.css',
        'css/components/ff-chips.css',
        'css/components/ff-forms.css',
        'css/components/ff-input-group.css',
        'css/components/ff-dropdown.css',
        'css/components/ff-battle-menu.css',
        'css/components/ff-materia.css',
        'css/components/ff-junction.css',
        
        # Themes (Optional - usually users import these separately, but we can bundle base ones)
        # 'css/ff7.css', 
    ]
    
    output_dir = 'dist'
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    output_file = os.path.join(output_dir, 'final-fantasy.css')
    
    print(f"Building {output_file}...")
    
    with open(output_file, 'w', encoding='utf-8') as outfile:
        # Add header
        outfile.write("/* Final Fantasy CSS Library v2.0 - Bundled */\n\n")
        
        for fname in files:
            if os.path.exists(fname):
                print(f"  Adding {fname}")
                with open(fname, 'r', encoding='utf-8') as infile:
                    outfile.write(f"/* --- {os.path.basename(fname)} --- */\n")
                    outfile.write(infile.read())
                    outfile.write("\n\n")
            else:
                print(f"  WARNING: File not found: {fname}")
                
    print("Build complete!")

if __name__ == "__main__":
    build_css()
