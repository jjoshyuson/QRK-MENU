/* Stable inspect-element labels for the shared QRK component system. */
(() => {
  const registry = [
    ['.button,.primary-button,.secondary-button,.text-button', 'Button'],
    ['.icon-button,.mobile-icon-control', 'Icon control'],
    ['.switch,.switch-control,.mobile-stock-button', 'Switch'],
    ['.workspace-views,.order-tabs,.theme-mode-switch,.order-stage-tabs', 'Tabs'],
    ['.badge,.section-chip,.order-state,.demo-pill', 'Badge'],
    ['.sidebar', 'Business sidebar'], ['.platform-sidebar', 'QRK Admin sidebar'],
    ['.topbar', 'Workspace top bar'], ['.mobile-owner-bar,.mobile-studio-toolbar', 'Mobile toolbar'],
    ['.status-strip', 'Status strip'], ['.service-note,.demo-banner', 'Notice banner'],
    ['.credential-card', 'Credential card'], ['.toast,.platform-toast', 'Toast'],
    ['.metric-card', 'Metric card'], ['.dashboard-card', 'Dashboard card'],
    ['.quick-actions', 'Quick actions'], ['.activity-log', 'Activity log'],
    ['.item-row', 'Menu item row'], ['.mobile-dish', 'Owner dish card'],
    ['.mobile-table-row', 'Availability row'], ['.category-bar,.categories', 'Category navigation'],
    ['.staff-row', 'Staff row'], ['.permission-checks', 'Permission group'],
    ['.order-queue-card,.service-order-card', 'Order queue card'],
    ['.verification-card', 'Verification card'], ['.history-order,.history-order-card', 'Order history row'],
    ['.table-card', 'Table operations card'], ['.table-choice', 'Customer table choice'],
    ['.table-join-request', 'Table join request'], ['.settings-group', 'Settings list'],
    ['.settings-row', 'Settings row'], ['.theme-preset', 'Theme preset'],
    ['.restaurant', 'Restaurant identity'], ['.dish', 'Customer dish card'],
    ['.active-order', 'Active order notice'], ['.desktop-order-card', 'Desktop order summary'],
    ['.cart-bar', 'Floating cart'], ['.open-tab-control', 'Open tab control'],
    ['.option-group', 'Option group'], ['.cart-item', 'Cart item'],
    ['.fulfillment', 'Fulfillment choice group'], ['.payment-card', 'Payment choice'],
    ['.confirmation-content', 'Order confirmation'], ['.tab-round', 'Open tab round'],
    ['.platform-client-row', 'Client portal row'], ['.platform-account-row', 'Client Admin row'],
    ['.preset-card', 'Service preset'], ['.journey-preview', 'Journey preview'],
    ['dialog', 'Dialog'], ['.form-error,.error-message', 'Form error'],
    ['.empty,.empty-state,.cart-empty,.desktop-order-empty,.order-empty,.stage-empty', 'Empty state'],
  ];

  const variantFor = (element) => {
    const states = ['primary','outline','subtle','danger','active','selected','available','pending','occupied','warning','success','disabled','sold-out','hidden','priority'];
    const found = states.filter((state) => element.classList.contains(state));
    if (element.matches(':disabled') && !found.includes('disabled')) found.push('disabled');
    return found.join(' ') || 'default';
  };

  const label = (root = document) => {
    for (const [selector, name] of registry) {
      const elements = [];
      if (root.nodeType === 1 && root.matches(selector)) elements.push(root);
      root.querySelectorAll?.(selector).forEach((element) => elements.push(element));
      for (const element of elements) {
        if (!element.dataset.component) element.dataset.component = name;
        element.dataset.variant = variantFor(element);
        element.dataset.componentSource = '/ui-components.css';
      }
    }
  };

  const start = () => {
    label();
    new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === 'attributes') label(record.target);
        record.addedNodes.forEach((node) => {
          if (node.nodeType === 1) label(node);
        });
      }
    }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'disabled'] });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
