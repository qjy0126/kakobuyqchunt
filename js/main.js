(() => {
  if (!window.KQS) return;

  if (typeof KQS.mountLayout === "function") {
    KQS.mountLayout("home");
  }

  const grid = document.querySelector("#category-grid");
  const detail = document.querySelector("#category-detail-list");
  const searchForm = document.querySelector("[data-search-form]");
  const searchInput = document.querySelector("#product-search");
  const latestGrid = document.querySelector("[data-latest-grid]");
  const latestMeta = document.querySelector("[data-latest-meta]");

  async function mountLatestFinds() {
    if (!latestGrid || typeof KQS.loadCategories !== "function") return;

    const featureCats = [
      { slug: "shoes", mosaic: 6 },
      { slug: "t-shirts", mosaic: 4 },
      { slug: "hoodies", mosaic: 4 },
      { slug: "jackets", mosaic: 6 },
    ];

    try {
      const lists = await Promise.all(featureCats.map((c) => KQS.loadCategory(c.slug)));
      const cards = featureCats
        .map((cfg, i) => {
          const items = (lists[i] || []).slice(0, Math.max(cfg.mosaic, 4));
          if (!items.length) return "";
          const cat = KQS.findCategory(cfg.slug);
          const label = (cat && cat.label) || cfg.slug;
          const thumbs = items
            .slice(0, cfg.mosaic)
            .map(
              (p) =>
                `<img src="${KQS.productImg(p.image, p.local)}" alt="" loading="lazy" decoding="async" />`
            )
            .join("");
          const cols = cfg.mosaic >= 6 ? "cols-3" : "cols-2";
          return `
        <a class="find-card" href="${KQS.catHref(cfg.slug)}">
          <span class="find-badge">POPULAR</span>
          <div class="find-mosaic ${cols}">${thumbs}</div>
          <div class="find-meta">
            <strong>${KQS.escapeHtml(label)}</strong>
            <span>${items.length}+ picks</span>
          </div>
        </a>`;
        })
        .join("");

      // One featured product per category for variety under the mosaics
      const singles = lists
        .map((list) => (list && list[0]) || null)
        .filter(Boolean)
        .map(
          (p) => `
        <a class="find-card find-card-single" href="${KQS.productHref(p.id, p.category)}">
          <span class="find-badge">POPULAR</span>
          <div class="find-single-media">
            <img src="${KQS.productImg(p.image, p.local)}" alt="${KQS.escapeHtml(p.title)}" loading="lazy" decoding="async" />
          </div>
          <div class="find-meta">
            <strong>${KQS.escapeHtml(p.title)}</strong>
            <span>${KQS.money(p.price)}</span>
          </div>
        </a>`
        )
        .join("");

      latestGrid.innerHTML = cards + singles;
      if (latestMeta) {
        latestMeta.textContent = "Showing 8 of 10,000+ curated items.";
      }
    } catch (err) {
      latestGrid.innerHTML = `<p class="latest-error">Could not load latest finds. <a href="${KQS.href("shop/finds/")}">Browse all products</a></p>`;
      if (latestMeta) latestMeta.textContent = "";
    }
  }

  mountLatestFinds();

  if (grid) {
    grid.innerHTML = KQS.categories
      .map((c) => {
        const href = KQS.catHref(c.slug);
        const cls = c.all ? "cat-tile is-all" : "cat-tile";
        return `
      <a class="${cls}" href="${href}">
        <img src="${KQS.asset(c.image)}" alt="${c.label}" loading="lazy" decoding="async" width="320" height="320" />
        <span>${c.label}</span>
      </a>`;
      })
      .join("");
  }

  if (detail) {
    detail.className = "cat-detail";
    detail.innerHTML = KQS.categories
      .filter((c) => !c.all)
      .map(
        (c) => `
      <article id="${c.slug}">
        <h3>${c.label}</h3>
        <p>${KQS.blurbs[c.slug] || "Browse curated Kakobuy QC Hunt finds in this category."}</p>
        <p><a class="text-link" href="${KQS.catHref(c.slug)}">Explore ${c.label} →</a></p>
      </article>`
      )
      .join("");
  }

  document.querySelectorAll("[data-keyword]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const q = btn.getAttribute("data-keyword") || "";
      if (typeof KQS.goSearch === "function") {
        KQS.goSearch(q);
        return;
      }
      location.href = KQS.href("shop/finds/") + "?q=" + encodeURIComponent(q);
    });
  });

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const q = searchInput.value.trim();
      if (typeof KQS.goSearch === "function") {
        KQS.goSearch(q);
        return;
      }
      location.href = q
        ? KQS.href("shop/finds/") + "?q=" + encodeURIComponent(q)
        : KQS.href("shop/finds/");
    });
  }
})();

