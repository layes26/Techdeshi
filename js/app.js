// Main Application Controller

document.addEventListener('DOMContentLoaded', () => {
    // Initialize engines
    const searchEngine = new SearchEngine(PRODUCTS_DATABASE);
    const filterEngine = new FilterEngine(PRODUCTS_DATABASE);

    // DOM Elements
    const searchInput = document.getElementById('search-input');
    const autocompleteList = document.getElementById('autocomplete-list');
    const productsGrid = document.getElementById('products-grid');
    const resultsCount = document.getElementById('results-count');
    const sortSelect = document.getElementById('sort-select');
    const brandFilters = document.getElementById('brand-filters');
    const priceMinInput = document.getElementById('price-min');
    const priceMaxInput = document.getElementById('price-max');
    const priceRangeLabel = document.getElementById('price-range-label');
    const stockFilter = document.getElementById('stock-filter');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const recommendationsGrid = document.getElementById('recommendations-grid');

    // State
    let currentSearchResults = PRODUCTS_DATABASE;

    // Initialize UI
    init();

    function init() {
        renderBrands();
        renderProducts(PRODUCTS_DATABASE);
        renderRecommendations();
        setupEventListeners();
    }

    // Render Brand Filters
    function renderBrands(products = PRODUCTS_DATABASE) {
        const brands = new Set();
        products.forEach(p => {
            if (p.brand && p.brand !== 'Unknown') {
                brands.add(p.brand);
            } else if (p.name) {
                // Try to extract brand from first word of name as fallback
                const firstWord = p.name.split(' ')[0];
                if (firstWord.length > 2) brands.add(firstWord);
            }
        });

        const sortedBrands = Array.from(brands).sort();

        // Add search box for brands
        let html = `
            <div class="brand-search-container" style="margin-bottom: 10px;">
                <input type="text" id="brand-search-input" placeholder="Search brands..." 
                       style="width: 100%; padding: 8px; border: 1px solid #333; border-radius: 4px; background: #222; color: #fff; font-size: 0.9rem;">
            </div>
            <div id="brands-list">
        `;

        html += sortedBrands.map(brand => `
          <label class="filter-option" data-brand="${brand.toLowerCase()}">
            <input type="checkbox" value="${brand}" class="brand-checkbox">
            ${brand}
          </label>
        `).join('');

        html += `</div>`;
        brandFilters.innerHTML = html;

        // Add listener for brand search
        document.getElementById('brand-search-input').addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const options = document.querySelectorAll('.filter-option');
            options.forEach(opt => {
                const brand = opt.dataset.brand;
                opt.style.display = brand.includes(term) ? 'flex' : 'none';
            });
        });
    }

    // Setup Event Listeners
    function setupEventListeners() {
        // Search Input
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            if (query.trim().length > 0) {
                showAutocomplete(query);
            } else {
                hideAutocomplete();
                // Reset to full list if cleared
                currentSearchResults = PRODUCTS_DATABASE;
                updateResults();
            }
        });

        // Search Enter Key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
                hideAutocomplete();
            }
        });

        // Autocomplete Items
        autocompleteList.addEventListener('click', (e) => {
            const item = e.target.closest('.autocomplete-item');
            if (item) {
                const text = item.dataset.value;
                searchInput.value = text;
                performSearch(text);
                hideAutocomplete();
            }
        });

        // Close autocomplete when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                hideAutocomplete();
            }
        });

        // Sort Change
        sortSelect.addEventListener('change', (e) => {
            const sorted = filterEngine.setSort(e.target.value);
            renderProducts(sorted);
        });

        // Brand Filters
        brandFilters.addEventListener('change', (e) => {
            if (e.target.classList.contains('brand-checkbox')) {
                updateFilters();
            }
        });

        // Price Filter
        priceMinInput.addEventListener('input', updatePriceLabel);
        priceMaxInput.addEventListener('input', updatePriceLabel);
        priceMinInput.addEventListener('change', updateFilters);
        priceMaxInput.addEventListener('change', updateFilters);

        // Stock Filter
        stockFilter.addEventListener('change', (e) => {
            filterEngine.setFilter('inStock', e.target.checked);
            updateResults();
        });

        // Clear Filters
        clearFiltersBtn.addEventListener('click', () => {
            // Reset UI
            document.querySelectorAll('.brand-checkbox').forEach(cb => cb.checked = false);
            priceMinInput.value = 0;
            priceMaxInput.value = 200000;
            updatePriceLabel();
            stockFilter.checked = false;

            // Reset Logic
            filterEngine.clearFilters();
            updateResults();
        });
    }

    // Search Logic
    async function performSearch(query) {
        if (!query) return;

        // Show loading state
        productsGrid.innerHTML = `
            <div class="loading">
                Searching for "${query}" across online shops...<br>
                <span style="font-size: 0.9rem; opacity: 0.7">(Checking Ryans, Star Tech...)</span>
            </div>
        `;

        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();

            // Normalize data for frontend use
            const normalizedData = data.map(product => ({
                ...product,
                sellers: product.sellers.map(seller => ({
                    ...seller,
                    inStock: seller.inStock !== undefined ? seller.inStock :
                        (seller.stock_status && seller.stock_status.toLowerCase().includes('in stock'))
                }))
            }));

            currentSearchResults = normalizedData;

            // Populate the filter engine with the new live data
            filterEngine.originalProducts = data;
            filterEngine.currentProducts = data;

            updateResults();
            renderBrands(normalizedData);

        } catch (error) {
            console.error('Search API Error:', error);
            productsGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⚠️</div>
                    <h3>Something went wrong</h3>
                    <p>Could not fetch live prices. Please make sure the server is running.</p>
                    <p><code>npm start</code> to run backend.</p>
                </div>
            `;
        }
    }

    function showAutocomplete(query) {
        const suggestions = searchEngine.getAutocompleteSuggestions(query);
        if (suggestions.length === 0) {
            hideAutocomplete();
            return;
        }

        autocompleteList.innerHTML = suggestions.map(text => `
      <div class="autocomplete-item" data-value="${text}">
        <span class="autocomplete-item-icon">🔍</span>
        ${text}
      </div>
    `).join('');

        autocompleteList.classList.add('show');
    }

    function hideAutocomplete() {
        autocompleteList.classList.remove('show');
    }

    // Update Filters & Results
    function updateFilters() {
        // Update brands
        const checkboxes = document.querySelectorAll('.brand-checkbox');
        filterEngine.activeFilters.brands.clear();
        checkboxes.forEach(cb => {
            if (cb.checked) filterEngine.activeFilters.brands.add(cb.value);
        });

        // Update Price
        filterEngine.activeFilters.priceMin = parseInt(priceMinInput.value);
        filterEngine.activeFilters.priceMax = parseInt(priceMaxInput.value);

        updateResults();
    }

    function updatePriceLabel() {
        const min = parseInt(priceMinInput.value).toLocaleString();
        const max = parseInt(priceMaxInput.value).toLocaleString();
        priceRangeLabel.textContent = `৳${min} - ৳${max}`;
    }

    function updateResults() {
        // Apply filters to current search results
        const filteredAndSorted = filterEngine.applyFilters(currentSearchResults);
        renderProducts(filteredAndSorted);
    }

    // Rendering
    function renderProducts(products) {
        resultsCount.textContent = `${products.length} Results`;

        if (products.length === 0) {
            productsGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <h3>No products found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      `;
            return;
        }

        productsGrid.innerHTML = products.map(product => {
            // Sort sellers by price
            const sortedSellers = [...product.sellers].sort((a, b) => a.price - b.price);
            const lowestPrice = sortedSellers[0].price;

            return `
        <div class="product-card">
          <div class="product-main">
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.onerror=null; this.src='https://via.placeholder.com/300?text=No+Image';">
            <div class="product-info">
              ${product.category && product.category !== 'Unknown' ? `<span class="product-category">${product.category}</span>` : ''}
              <h3>${product.name}</h3>
              <div class="product-specs">
                ${product.specs ? product.specs.map(spec => `<span class="spec-tag">${spec}</span>`).join('') : ''}
              </div>
            </div>
          </div>
          
          <div class="sellers-section">
            <div class="sellers-grid">
              ${sortedSellers.map((seller, index) => renderSellerOption(seller, index === 0)).join('')}
            </div>
          </div>
        </div>
      `;
        }).join('');
    }

    function renderSellerOption(seller, isBestDeal) {
        // Normalize properties (handle both Mock data and API data)
        const name = seller.seller_name || seller.name || 'Unknown Seller';
        const rating = seller.rating || '4.5'; // Default if missing
        const shipping = seller.shipping || 0;

        // Determine stock status
        let inStock = false;
        if (typeof seller.inStock !== 'undefined') {
            inStock = seller.inStock;
        } else if (seller.stock_status) {
            inStock = seller.stock_status.toLowerCase().includes('in stock');
        }

        const stockClass = inStock ? 'in-stock' : 'out-of-stock';
        const stockText = inStock ? 'In Stock' : 'Out of Stock';

        const containerClass = `seller-option ${isBestDeal ? 'best-deal' : ''} ${!inStock ? 'out-of-stock' : ''}`;

        return `
      <div class="${containerClass}" onclick="window.open('${seller.url}', '_blank')">
        ${isBestDeal ? '<div class="best-deal-badge">Best Deal</div>' : ''}
        <div class="seller-name">
          ${name}
          <span class="seller-rating">★ ${rating}</span>
        </div>
        <div class="seller-price">৳${seller.price.toLocaleString()}</div>
        <div class="seller-details">
          <span>+ ৳${shipping} shipping</span>
          <span class="stock-status ${stockClass}">
            ${stockText}
          </span>
        </div>
      </div>
    `;
    }

    function renderRecommendations() {
        // Get random products for now as "trending"
        const randomProducts = [...PRODUCTS_DATABASE]
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);

        recommendationsGrid.innerHTML = randomProducts.map(product => {
            const minPrice = Math.min(...product.sellers.map(s => s.price));
            return `
        <div class="recommendation-card" onclick="document.getElementById('search-input').value='${product.name}'; document.getElementById('search-input').dispatchEvent(new Event('input')); window.scrollTo({top:0, behavior:'smooth'})">
          <img src="${product.image}" alt="${product.name}">
          <h4>${product.name}</h4>
          <div class="recommendation-price">From ৳${minPrice.toLocaleString()}</div>
        </div>
      `;
        }).join('');
    }
});
