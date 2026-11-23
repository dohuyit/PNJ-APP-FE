// ----------------------------------------------------------------------

export function layoutSectionVars(theme) {
  return {
    // Dùng appBar thay vì drawer+1 để Drawer/Dialog backdrop (zIndex.drawer=1200,
     // zIndex.modal=1300) phủ được sidebar — trước đây sidebar 1201 nổi trên backdrop.
    '--layout-nav-zIndex': theme.zIndex.appBar,
    '--layout-nav-mobile-width': '288px',
    '--layout-header-blur': '8px',
    '--layout-header-zIndex': theme.zIndex.appBar + 1,
    '--layout-header-mobile-height': '64px',
    '--layout-header-desktop-height': '72px',
  };
}
