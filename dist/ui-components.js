/* Stable inspect-element labels for the shared QRK component system. */
(() => {
  const registry = [
    ['.button,.ui-button,.primary-button,.secondary-button,.customer-button,.text-button,.text-action', 'Button'],
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
    ['.table-join-request', 'Table join request'], ['.settings-group,.qrk-settings-list', 'Settings list'],
    ['.settings-row', 'Settings row'], ['.theme-preset', 'Theme preset'],
    ['.qrk-sheet', 'Material sheet'], ['.qrk-choice-popover', 'Choice popover'],
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
    if (element.classList.contains('primary-button') && !found.includes('primary')) found.push('primary');
    if (element.classList.contains('secondary-button') && !found.includes('outline')) found.push('outline');
    if ((element.classList.contains('text-button') || element.classList.contains('text-action')) && !found.includes('text')) found.push('text');
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

/* Shared accessible material-sheet controller. Product routes own draft data;
   this controller owns presentation, dismissal, focus containment and restore. */
(() => {
  const focusable = (root) => [...root.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(element => !element.hidden && element.getClientRects().length);
  const create = ({sheet, backdrop, onDismiss = () => {}}) => {
    let trigger = null;
    let timer = null;
    const open = ({source = document.activeElement} = {}) => {
      clearTimeout(timer);
      if (sheet.hidden) trigger = source instanceof HTMLElement ? source : null;
      sheet.hidden = false;
      backdrop.hidden = false;
      requestAnimationFrame(() => {
        sheet.classList.add('open');
        backdrop.classList.add('open');
        (focusable(sheet)[0] || sheet).focus({preventScroll:true});
      });
    };
    const close = ({commit = false, restoreFocus = true} = {}) => {
      sheet.classList.remove('open');
      backdrop.classList.remove('open');
      onDismiss({commit});
      timer = setTimeout(() => {
        sheet.hidden = true;
        backdrop.hidden = true;
        if (restoreFocus) trigger?.focus({preventScroll:true});
      }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 340);
    };
    sheet.addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); close(); return; }
      if (event.key !== 'Tab') return;
      const items = focusable(sheet);
      if (!items.length) { event.preventDefault(); return; }
      const first = items[0], last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !sheet.hidden) { event.preventDefault(); close(); }
    }, true);
    backdrop.addEventListener('click', () => close());
    return {open, close, get isOpen(){return !sheet.hidden}};
  };
  window.QrkSheet = {create};
})();

/* Shared material choice popover. Native selects retain form values while the
   visible control owns the accessible, theme-consistent interaction. */
(() => {
  let active = null;
  const labelFor = select => select.getAttribute('aria-label') || select.closest('label')?.childNodes[0]?.textContent?.trim() || 'option';
  const sync = (scope = document) => scope.querySelectorAll('select[data-qrk-choice]').forEach(select => {
    const trigger = select.nextElementSibling;
    if (trigger?.matches('[data-qrk-choice-trigger]')) trigger.querySelector('span').textContent = select.options[select.selectedIndex]?.text || 'Choose';
  });
  const close = ({restoreFocus = true} = {}) => {
    if (!active) return;
    const {layer, trigger} = active;
    clearTimeout(active.scrollTimer);
    layer.remove(); active = null;
    if (restoreFocus) trigger.focus({preventScroll:true});
  };
  const open = (select, trigger) => {
    close({restoreFocus:false});
    const rect = trigger.getBoundingClientRect(), width = Math.min(360, Math.max(256, innerWidth * .72), innerWidth - 32), left = Math.max(16, Math.min(rect.right - width, innerWidth - width - 16)), estimated = Math.min(innerHeight * .48, select.options.length * 48 + 20), below = rect.bottom + 8, top = below + estimated <= innerHeight - 16 ? below : Math.max(16, rect.top - estimated - 8), layer = document.createElement('div');
    layer.className = 'qrk-choice-layer';
    layer.innerHTML = `<button class="qrk-choice-backdrop" type="button" aria-label="Close ${labelFor(select)} choices"></button><div class="qrk-choice-positioner" style="--choice-left:${left}px;--choice-top:${top}px"><div class="qrk-choice-popover" role="listbox" aria-label="Choose ${labelFor(select)}">${[...select.options].map(option => `<button type="button" role="option" aria-selected="${option.value === select.value}" data-qrk-choice-option="${option.index}"><i>${option.value === select.value ? '✓' : ''}</i><span>${option.text}</span></button>`).join('')}</div></div>`;
    document.body.append(layer); active = {layer, select, trigger};
    layer.querySelector('.qrk-choice-backdrop').onclick = () => close();
    layer.querySelectorAll('[data-qrk-choice-option]').forEach(button => button.onclick = () => {
      select.selectedIndex = Number(button.dataset.qrkChoiceOption);
      select.dispatchEvent(new Event('change', {bubbles:true})); sync(select.parentElement || document); close();
    });
    layer.addEventListener('keydown', event => {
      const choices = [...layer.querySelectorAll('[data-qrk-choice-option]')], at = choices.indexOf(document.activeElement);
      if (event.key === 'Escape') { event.preventDefault(); close(); }
      else if (event.key === 'ArrowDown') { event.preventDefault(); choices[(at + 1 + choices.length) % choices.length]?.focus(); }
      else if (event.key === 'ArrowUp') { event.preventDefault(); choices[(at - 1 + choices.length) % choices.length]?.focus(); }
    });
    requestAnimationFrame(() => { layer.classList.add('open'); (layer.querySelector('[aria-selected="true"]') || layer.querySelector('[data-qrk-choice-option]'))?.focus(); });
  };
  const enhance = (scope = document) => scope.querySelectorAll('select:not([data-qrk-choice])').forEach(select => {
    select.dataset.qrkChoice = ''; select.classList.add('qrk-native-select'); select.tabIndex = -1; select.setAttribute('aria-hidden', 'true');
    const trigger = document.createElement('button');
    trigger.type = 'button'; trigger.className = 'qrk-choice-trigger'; trigger.dataset.qrkChoiceTrigger = ''; trigger.setAttribute('aria-haspopup', 'listbox'); trigger.setAttribute('aria-label', `Choose ${labelFor(select)}`); trigger.innerHTML = '<span></span><i aria-hidden="true">⌄</i>';
    trigger.onclick = event => { event.preventDefault(); event.stopPropagation(); open(select, trigger); };
    trigger.onkeydown = event => { if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); open(select, trigger); } };
    select.insertAdjacentElement('afterend', trigger);
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && active) { event.preventDefault(); event.stopImmediatePropagation(); close(); } }, true);
  window.QrkChoice = {enhance, sync, close};
})();
