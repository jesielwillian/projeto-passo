/** PASSO — select customizado acessível, incluindo selects inseridos dinamicamente. */
(() => {
  'use strict';
  let generatedId = 0;
  const isAdmin = () => location.pathname.includes('/admin') || document.body.classList.contains('admin-page') || !!document.querySelector('.app');

  function enhance(select) {
    if (!(select instanceof HTMLSelectElement) || select.dataset.customized === 'true') return;
    select.dataset.customized = 'true';
    const wrapper = document.createElement('div');
    wrapper.className = `custom-select${isAdmin() ? ' admin-custom-select' : ''}`;
    const id = select.id || `passo-select-${++generatedId}`;
    select.id = id;
    select.classList.add('custom-select-native');
    select.tabIndex = -1;
    select.setAttribute('aria-hidden', 'true');
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'custom-select-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', `${id}-menu`);
    const value = document.createElement('span');
    value.className = 'select-value';
    const chevron = document.createElement('i');
    chevron.className = 'fa-solid fa-chevron-down select-chevron';
    chevron.setAttribute('aria-hidden', 'true');
    trigger.append(value, chevron);

    const menu = document.createElement('div');
    menu.className = 'custom-select-menu';
    menu.id = `${id}-menu`;
    menu.setAttribute('role', 'listbox');
    let items = [];

    function close(returnFocus = false) {
      wrapper.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      if (returnFocus) trigger.focus();
    }
    function sync() {
      value.textContent = select.options[select.selectedIndex]?.textContent || select.getAttribute('placeholder') || 'Selecione uma opção';
      items.forEach((item, i) => {
        item.setAttribute('aria-selected', String(i === select.selectedIndex));
        item.tabIndex = i === select.selectedIndex ? 0 : -1;
      });
    }
    function renderOptions() {
      menu.replaceChildren();
      items = [...select.options].map((option, i) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'custom-select-option';
        item.setAttribute('role', 'option');
        item.textContent = option.textContent;
        item.disabled = option.disabled || select.disabled;
        item.addEventListener('click', () => {
          if (select.selectedIndex !== i) {
            select.selectedIndex = i;
            select.dispatchEvent(new Event('input', { bubbles: true }));
            select.dispatchEvent(new Event('change', { bubbles: true }));
          }
          sync(); close(true);
        });
        menu.appendChild(item);
        return item;
      });
      sync();
    }
    function open() {
      document.querySelectorAll('.admin-custom-select.open, .custom-select.open').forEach(el => {
        if (el !== wrapper) {
          el.classList.remove('open');
          el.querySelector('.custom-select-trigger')?.setAttribute('aria-expanded', 'false');
        }
      });
      wrapper.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
      const active = items[select.selectedIndex] || items.find(item => !item.disabled);
      active?.focus();
    }
    trigger.addEventListener('click', () => wrapper.classList.contains('open') ? close() : open());
    trigger.addEventListener('keydown', event => {
      if (['ArrowDown', 'Enter', ' '].includes(event.key)) { event.preventDefault(); open(); }
      if (event.key === 'ArrowUp') { event.preventDefault(); open(); items.at(-1)?.focus(); }
    });
    menu.addEventListener('keydown', event => {
      const current = items.indexOf(document.activeElement);
      if (event.key === 'Escape') { event.preventDefault(); close(true); }
      else if (event.key === 'ArrowDown') { event.preventDefault(); items[Math.min(current + 1, items.length - 1)]?.focus(); }
      else if (event.key === 'ArrowUp') { event.preventDefault(); items[Math.max(current - 1, 0)]?.focus(); }
      else if (event.key === 'Home') { event.preventDefault(); items[0]?.focus(); }
      else if (event.key === 'End') { event.preventDefault(); items.at(-1)?.focus(); }
      else if (event.key === 'Tab') close();
    });
    select.addEventListener('change', sync);
    select.form?.addEventListener('reset', () => requestAnimationFrame(sync));
    new MutationObserver(renderOptions).observe(select, { childList: true, subtree: true, characterData: true });
    wrapper.append(trigger, menu);
    renderOptions();
  }

  function scan(root = document) {
    if (root instanceof HTMLSelectElement) enhance(root);
    root.querySelectorAll?.('select').forEach(enhance);
  }
  scan();
  new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE) scan(node);
  }))).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('click', event => {
    document.querySelectorAll('.custom-select.open').forEach(wrapper => {
      if (!wrapper.contains(event.target)) {
        wrapper.classList.remove('open');
        wrapper.querySelector('.custom-select-trigger')?.setAttribute('aria-expanded', 'false');
      }
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') document.querySelectorAll('.custom-select.open').forEach(wrapper => {
      wrapper.classList.remove('open');
      wrapper.querySelector('.custom-select-trigger')?.setAttribute('aria-expanded', 'false');
    });
  });
})();
