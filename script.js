const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const toast = (message) => {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => el.classList.remove('show'), 3000);
};

$('#year').textContent = new Date().getFullYear();

let currentFilter = 'All';
function filterProducts() {
  const query = ($('#searchInput').value || '').trim().toLowerCase();
  const cards = $$('.product-card');
  let visible = 0;
  cards.forEach(card => {
    const category = card.dataset.category || '';
    const text = card.innerText.toLowerCase();
    const matchesFilter = currentFilter === 'All' || category === currentFilter;
    const matchesQuery = !query || text.includes(query) || category.toLowerCase().includes(query);
    const show = matchesFilter && matchesQuery;
    card.hidden = !show;
    if (show) visible++;
  });
  const existing = $('#noProducts');
  if (existing) existing.remove();
  if (!visible) {
    const empty = document.createElement('div');
    empty.id = 'noProducts';
    empty.className = 'empty-state';
    empty.textContent = 'No sample products match that search yet. Try another topic or category.';
    $('#productGrid').appendChild(empty);
  }
}
$('#searchForm').addEventListener('submit', event => {
  event.preventDefault();
  currentFilter = 'All';
  $$('.pill').forEach(pill => pill.classList.toggle('active', pill.dataset.filter === 'All'));
  filterProducts();
  $('#products').scrollIntoView({behavior:'smooth'});
});
$('#searchInput').addEventListener('input', filterProducts);

$$('.pill').forEach(pill => pill.addEventListener('click', () => {
  currentFilter = pill.dataset.filter;
  $$('.pill').forEach(item => item.classList.toggle('active', item === pill));
  filterProducts();
}));
$('#sortSelect').addEventListener('change', event => {
  const grid = $('#productGrid');
  const cards = $$('.product-card', grid);
  if (event.target.value === 'name') cards.sort((a,b) => a.dataset.name.localeCompare(b.dataset.name));
  else cards.sort((a,b) => ['Wellness Goal Guide','Active Living Plan','Sleep Routine Guide','Skin Care Essentials'].indexOf(a.dataset.name) - ['Wellness Goal Guide','Active Living Plan','Sleep Routine Guide','Skin Care Essentials'].indexOf(b.dataset.name));
  cards.forEach(card => grid.appendChild(card));
  filterProducts();
});
$$('.category-card').forEach(card => card.addEventListener('click', () => {
  currentFilter = card.dataset.category;
  $$('.pill').forEach(pill => pill.classList.toggle('active', pill.dataset.filter === currentFilter));
  filterProducts();
  $('#products').scrollIntoView({behavior:'smooth'});
}));
$$('.goal-list button').forEach(button => button.addEventListener('click', () => {
  $$('.goal-list button').forEach(item => item.classList.toggle('selected', item === button));
  toast(`Selected goal: ${button.dataset.goal}. Explore the related category below.`);
  const match = $$('.category-card').find(card => card.dataset.category === button.dataset.goal || card.innerText.toLowerCase().includes(button.dataset.goal.toLowerCase()));
  if (match) {
    currentFilter = match.dataset.category;
    $$('.pill').forEach(pill => pill.classList.toggle('active', pill.dataset.filter === currentFilter));
    filterProducts();
  }
}));
$$('.affiliate-link').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  toast('Demo link only. Add your approved ClickBank affiliate URL before publishing.');
}));
$('#newsletterForm').addEventListener('submit', event => {
  event.preventDefault();
  const email = $('input[type="email"]', event.currentTarget).value.trim();
  if (!email) return;
  $('#newsletterMessage').textContent = 'Demo only: no email has been stored or sent.';
  event.currentTarget.reset();
});
