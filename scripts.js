'use strict';

document.documentElement.classList.add('js');

(() => {
  const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const money = cents => currency.format(cents / 100);
  const prices = { brownie: 2200, cookie: 1500, palmier: 1800, macaron: 2500 };
  const products = Object.fromEntries([...document.querySelectorAll('.product-card')].map(card => {
    const id = card.querySelector('[data-add]').dataset.add;
    const image = card.querySelector('img');
    return [id, {
      id, price: prices[id],
      name: card.querySelector('h3').textContent,
      description: card.querySelector('.product-info > p').textContent,
      kicker: card.querySelector('.product-kicker').textContent,
      image: image.getAttribute('src'), alt: image.alt,
    }];
  }));

  const storageKey = 'docura-demo-caixinha-v1';
  let cart = {};
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    for (const id of Object.keys(products)) {
      if (Number.isInteger(saved?.[id]) && saved[id] > 0 && saved[id] <= 99) cart[id] = saved[id];
    }
  } catch { /* A caixinha continua funcionando quando o armazenamento não está disponível. */ }

  const cartDialog = document.getElementById('cart-dialog');
  const productDialog = document.getElementById('product-dialog');
  const checkoutDialog = document.getElementById('checkout-dialog');
  const successDialog = document.getElementById('success-dialog');
  const cartItems = document.getElementById('cart-items');
  const cartFooter = document.getElementById('cart-footer');
  const orderForm = document.getElementById('order-form');
  const toast = document.getElementById('toast');
  let toastTimer;

  const escape = text => String(text).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const entries = () => Object.entries(cart).filter(([id, quantity]) => products[id] && quantity > 0);
  const count = () => entries().reduce((sum, [, quantity]) => sum + quantity, 0);
  const total = () => entries().reduce((sum, [id, quantity]) => sum + products[id].price * quantity, 0);
  const syncBodyLock = () => document.body.classList.toggle('modal-open', !!document.querySelector('dialog[open]'));

  function saveCart() {
    try { localStorage.setItem(storageKey, JSON.stringify(cart)); } catch { /* Memória da página permanece disponível. */ }
  }

  function notify(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('visible');
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 3200);
  }

  function openDialog(dialog) {
    document.querySelectorAll('dialog[open]').forEach(open => open.close());
    dialog.showModal();
    syncBodyLock();
  }

  function summaryLines() {
    return entries().map(([id, quantity]) => `<div class="summary-line"><span>${quantity} × ${escape(products[id].name)}</span><span>${money(products[id].price * quantity)}</span></div>`).join('') + `<div class="summary-line total"><span>Total simulado</span><span>${money(total())}</span></div>`;
  }

  function renderCart() {
    const quantity = count();
    document.querySelectorAll('.cart-count').forEach(badge => badge.textContent = quantity);
    document.querySelectorAll('[data-open-cart]').forEach(button => button.setAttribute('aria-label', `Abrir minha caixinha, ${quantity} ${quantity === 1 ? 'doce' : 'doces'}`));
    document.getElementById('cart-total').textContent = money(total());
    cartFooter.hidden = quantity === 0;
    if (!quantity) {
      cartItems.innerHTML = `<div class="cart-empty">${icon('bag')}<h3>Ainda cabe muito carinho.</h3><p>Sua caixinha está esperando pelos seus doces favoritos.</p><button class="button button-primary" type="button" data-browse-doces>Explorar o cardápio ${icon('arrow')}</button></div>`;
      return;
    }
    cartItems.innerHTML = entries().map(([id, amount]) => {
      const product = products[id];
      return `<article class="cart-item"><img src="${product.image}" alt="${escape(product.alt)}" width="77" height="100"><div><h3>${escape(product.name)}</h3><p class="cart-item-price">${money(product.price)} cada · ${money(product.price * amount)}</p><div class="cart-item-actions"><div class="quantity"><button type="button" data-quantity="${id}" data-change="-1" aria-label="Diminuir quantidade de ${escape(product.name)}">−</button><span aria-label="Quantidade de ${escape(product.name)}">${amount}</span><button type="button" data-quantity="${id}" data-change="1" aria-label="Aumentar quantidade de ${escape(product.name)}" ${amount >= 99 ? 'disabled' : ''}>+</button></div><button class="remove-item" type="button" data-remove="${id}" aria-label="Remover ${escape(product.name)} da caixinha">Remover</button></div></div></article>`;
    }).join('');
  }

  function addProduct(id) {
    if (!products[id]) return;
    if ((cart[id] || 0) >= 99) {
      notify('Você já tem 99 unidades deste doce na caixinha.');
      return;
    }
    cart[id] = (cart[id] || 0) + 1;
    saveCart();
    renderCart();
    if (productDialog.open) {
      productDialog.close();
      renderCart();
      openDialog(cartDialog);
    } else {
      notify(`${products[id].name} adicionado à sua caixinha.`);
    }
  }

  function showProduct(id) {
    const product = products[id];
    if (!product) return;
    document.getElementById('detail-content').innerHTML = `<div class="detail-layout"><img src="${product.image}" alt="${escape(product.alt)}"><div class="detail-copy"><p class="eyebrow">${escape(product.kicker)}</p><h2 id="detail-name">${escape(product.name)}</h2><p>${escape(product.description)}</p><span class="price">${money(product.price)} <small>/ unidade</small></span><button class="button button-primary" type="button" data-add="${id}">Adicionar à caixinha ${icon('bag')}</button><p class="allergen-note">Foto ilustrativa. Em uma compra real, confirme ingredientes, alergênicos e tamanho da porção com o fornecedor.</p></div></div>`;
    openDialog(productDialog);
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.hasAttribute('data-add')) addProduct(button.dataset.add);
    if (button.hasAttribute('data-details')) showProduct(button.dataset.details);
    if (button.hasAttribute('data-open-cart')) { renderCart(); openDialog(cartDialog); }
    if (button.hasAttribute('data-close-dialog')) button.closest('dialog')?.close();
    if (button.hasAttribute('data-browse-doces')) {
      cartDialog.close();
      document.getElementById('doces').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
    if (button.hasAttribute('data-quantity')) {
      const id = button.dataset.quantity;
      if (!products[id]) return;
      const currentAmount = cart[id] || 0;
      const change = Number(button.dataset.change);
      cart[id] = Math.max(0, Math.min(99, currentAmount + change));
      if (!cart[id]) delete cart[id];
      saveCart();
      renderCart();
      const next = cartItems.querySelector(`[data-quantity="${id}"][data-change="${change}"]`);
      (next || cartItems.querySelector('button') || document.getElementById('cart-title')).focus();
    }
    if (button.hasAttribute('data-remove')) {
      delete cart[button.dataset.remove];
      saveCart(); renderCart();
      cartItems.querySelector('button')?.focus();
    }
  });

  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('close', syncBodyLock);
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
  });

  const filters = [...document.querySelectorAll('[data-filter]')];
  filters.forEach(filter => filter.addEventListener('click', () => {
    filters.forEach(button => {
      const selected = button === filter;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', selected);
    });
    let visible = 0;
    document.querySelectorAll('.product-card').forEach(card => {
      const matches = filter.dataset.filter === 'todos' || card.dataset.category === filter.dataset.filter;
      card.hidden = !matches;
      if (matches) visible++;
    });
    document.getElementById('catalog-count').textContent = `${visible} ${visible === 1 ? 'delícia para descobrir' : 'delícias para descobrir'}`;
  }));

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');
  function closeMenu() {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    nav.classList.remove('is-open');
  }
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    menuButton.setAttribute('aria-label', expanded ? 'Abrir menu' : 'Fechar menu');
    nav.classList.toggle('is-open', !expanded);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });

  function today() {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  const dateInput = document.getElementById('order-date');
  dateInput.min = today();
  document.getElementById('checkout-button').addEventListener('click', () => {
    if (!count()) return;
    dateInput.min = today();
    document.getElementById('checkout-summary').innerHTML = summaryLines();
    openDialog(checkoutDialog);
  });
  document.getElementById('back-to-cart').addEventListener('click', () => openDialog(cartDialog));

  orderForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!count() || !orderForm.reportValidity()) return;
    const data = new FormData(orderForm);
    const name = String(data.get('name')).trim();
    if (name.length < 2) {
      document.getElementById('customer-name').setCustomValidity('Escreva um nome com pelo menos duas letras.');
      orderForm.reportValidity();
      return;
    }
    const [year, month, day] = String(data.get('date')).split('-').map(Number);
    const date = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(year, month - 1, day));
    document.getElementById('success-greeting').textContent = `${name}, sua seleção ficou uma delícia! Aqui está o resumo da sua experiência.`;
    const note = String(data.get('note') || '').trim();
    document.getElementById('success-summary').innerHTML = `<p class="receipt-detail"><strong>Data escolhida:</strong> ${escape(date)}<br><strong>Ocasião:</strong> ${escape(data.get('occasion'))}</p>${summaryLines()}${note ? `<p class="receipt-detail"><strong>Seu recadinho:</strong> ${escape(note)}</p>` : ''}`;
    openDialog(successDialog);
    cart = {};
    saveCart(); renderCart();
    orderForm.reset();
  });
  document.getElementById('customer-name').addEventListener('input', event => event.target.setCustomValidity(''));

  document.getElementById('year').textContent = new Date().getFullYear();
  renderCart();

  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(observed => {
      observed.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.essence-grid, .moment, .contact-banner').forEach(element => observer.observe(element));
  }
})();
