document.addEventListener("DOMContentLoaded", () => {
  const toast = document.getElementById("toast");
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  }

  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  if (searchForm) {
    searchForm.addEventListener("submit", event => {
      event.preventDefault();
      const term = (searchInput?.value || "").trim().toLowerCase();
      if (!term) { showToast("Type a product, category or guide to search."); return; }
      const cards = [...document.querySelectorAll(".product-card")];
      if (!cards.length) { location.href = "category.html?search=" + encodeURIComponent(term); return; }
      let visible = 0;
      cards.forEach(card => {
        const match = card.innerText.toLowerCase().includes(term);
        card.hidden = !match;
        if (match) visible++;
      });
      showToast(visible ? `${visible} matching item(s) found.` : "No matching products on this page. Try another keyword.");
    });
  }

  const filters = [...document.querySelectorAll("[data-filter]")];
  const productGrid = document.getElementById("productGrid");
  const sortSelect = document.getElementById("sortSelect");
  let activeFilter = "All";
  function updateProducts() {
    if (!productGrid) return;
    const cards = [...productGrid.querySelectorAll(".product-card")];
    cards.forEach(card => {
      const category = card.dataset.category || "";
      const matchFilter = activeFilter === "All" || category === activeFilter;
      card.hidden = !matchFilter;
    });
    if (sortSelect?.value === "name") {
      cards.sort((a,b) => (a.dataset.name || "").localeCompare(b.dataset.name || ""));
      cards.forEach(card => productGrid.appendChild(card));
    }
  }
  filters.forEach(button => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter || "All";
    filters.forEach(b => b.classList.toggle("active", b === button));
    updateProducts();
  }));
  if (sortSelect) sortSelect.addEventListener("change", updateProducts);

  const categoryTitle = document.getElementById("categoryTitle");
  if (categoryTitle) {
    const params = new URLSearchParams(location.search);
    const category = params.get("category") || "Weight Management";
    const categoryNames = {
      "Weight Management": ["Weight Management", "Discover helpful guides, useful tools and product information to support your weight-management goals.", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=80"],
      "Fitness": ["Exercise & Fitness", "Explore fitness products, movement guides and practical training resources.", "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80"],
      "Sleep & Wellness": ["Sleep & Wellness", "Explore sleep education, calming routines and wellness resources.", "https://images.unsplash.com/photo-1511295742362-92c96b8f8a34?auto=format&fit=crop&w=900&q=80"],
      "Meditation": ["Meditation & Stress", "Explore mindfulness practices and stress-management resources.", "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80"],
      "Beauty & Skincare": ["Beauty & Skincare", "Learn about skincare routines, product labels and informed product choices.", "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80"],
      "Nutrition": ["Nutrition & Healthy Eating", "Explore food education, healthy habits and practical nutrition guides.", "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80"],
      "Supplements": ["Supplements & Vitamins", "Learn how to review supplement labels, ingredients and seller information.", "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=80"],
      "Healthy Living": ["Healthy Living for All Ages", "Explore everyday habits and wellness information for different life stages.", "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=80"]
    };
    const data = categoryNames[category] || [category, "Discover helpful guides, useful tools and product information.", categoryNames["Weight Management"][2]];
    categoryTitle.textContent = data[0];
    document.title = "WellLife | " + data[0];
    const desc = document.getElementById("categoryDesc");
    const img = document.getElementById("categoryHeroImg");
    if (desc) desc.textContent = data[1];
    if (img) { img.src = data[2]; img.alt = data[0]; }
    activeFilter = category === "Weight Management" ? "Weight Management" : category;
    updateProducts();
    const checks = [...document.querySelectorAll(".filters input[type=checkbox]")];
    checks.forEach(input => {
      input.checked = input.value === activeFilter;
      input.addEventListener("change", () => {
        activeFilter = input.checked ? input.value : "All";
        checks.forEach(other => { if (other !== input) other.checked = false; });
        updateProducts();
      });
    });
  }

  const detailTitle = document.getElementById("detailTitle");
  if (detailTitle) {
    const id = new URLSearchParams(location.search).get("id") || "leanbiome";
    const products = {
      leanbiome: ["LeanBiome Wellness Example", "Weight Management", "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=900&q=80"],
      "weight-guide": ["Natural Weight Support Guide", "Weight Management", "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=80"],
      wellness: ["Daily Wellness Essentials", "Supplements", "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=900&q=80"],
      active: ["Active Living Plan", "Fitness", "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80"],
      sleep: ["Sleep Routine Guide", "Sleep & Wellness", "https://images.unsplash.com/photo-1511295742362-92c96b8f8a34?auto=format&fit=crop&w=900&q=80"],
      skincare: ["Skin Care Essentials", "Beauty & Skincare", "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80"]
    };
    const item = products[id] || products.leanbiome;
    detailTitle.textContent = item[0];
    document.title = "WellLife | " + item[0];
    const crumb = document.getElementById("crumbName");
    const category = document.getElementById("detailCategory");
    const image = document.getElementById("detailImage");
    if (crumb) crumb.textContent = item[0];
    if (category) category.textContent = item[1];
    if (image) { image.src = item[2]; image.alt = item[0] + " sample image"; }
  }

  const newsletter = document.getElementById("newsletterForm");
  if (newsletter) newsletter.addEventListener("submit", event => {
    event.preventDefault();
    const message = document.getElementById("newsletterMessage");
    if (message) message.textContent = "Demo only: email signup is not connected yet.";
  });

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});