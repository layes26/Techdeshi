// Filter and Sort Logic

class FilterEngine {
    constructor(products) {
        this.originalProducts = products;
        this.currentProducts = products;
        this.activeFilters = {
            priceMin: 0,
            priceMax: 200000,
            brands: new Set(),
            inStock: false,
            minRating: 0,
            category: null
        };
        this.sortOption = 'price-low'; // default sort
    }

    // Update filter values
    setFilter(key, value) {
        if (key === 'brands') {
            const { brand, checked } = value;
            if (checked) {
                this.activeFilters.brands.add(brand);
            } else {
                this.activeFilters.brands.delete(brand);
            }
        } else {
            this.activeFilters[key] = value;
        }

        return this.applyFilters();
    }

    // Clear all filters
    clearFilters() {
        this.activeFilters = {
            priceMin: 0,
            priceMax: 200000,
            brands: new Set(),
            inStock: false,
            minRating: 0,
            category: null
        };
        return this.applyFilters();
    }

    // Set sort option
    setSort(option) {
        this.sortOption = option;
        return this.sortProducts(this.currentProducts);
    }

    // Apply all active filters
    applyFilters(productsToFilter = this.originalProducts) {
        this.currentProducts = productsToFilter.filter(product => {
            // 1. Price Range Check
            // Get the lowest price for this product
            const lowestPrice = Math.min(...product.sellers.map(s => s.price));
            if (lowestPrice < this.activeFilters.priceMin || lowestPrice > this.activeFilters.priceMax) {
                return false;
            }

            // 2. Brand Check
            if (this.activeFilters.brands.size > 0 && !this.activeFilters.brands.has(product.brand)) {
                return false;
            }

            // 3. Category Check
            if (this.activeFilters.category && product.category !== this.activeFilters.category) {
                return false;
            }

            // 4. In Stock Check (at least one seller must have it)
            if (this.activeFilters.inStock) {
                const hasStock = product.sellers.some(s => s.inStock);
                if (!hasStock) return false;
            }

            // 5. Rating Check (average seller rating or best seller rating)
            if (this.activeFilters.minRating > 0) {
                const bestRating = Math.max(...product.sellers.map(s => s.rating));
                if (bestRating < this.activeFilters.minRating) return false;
            }

            return true;
        });

        return this.sortProducts(this.currentProducts);
    }

    // Sort products
    sortProducts(products) {
        const sorted = [...products];

        switch (this.sortOption) {
            case 'price-low':
                sorted.sort((a, b) => {
                    const priceA = Math.min(...a.sellers.map(s => s.price));
                    const priceB = Math.min(...b.sellers.map(s => s.price));
                    return priceA - priceB;
                });
                break;

            case 'price-high':
                sorted.sort((a, b) => {
                    const priceA = Math.min(...a.sellers.map(s => s.price));
                    const priceB = Math.min(...b.sellers.map(s => s.price));
                    return priceB - priceA;
                });
                break;

            case 'rating':
                sorted.sort((a, b) => {
                    const ratingA = Math.max(...a.sellers.map(s => s.rating));
                    const ratingB = Math.max(...b.sellers.map(s => s.rating));
                    return ratingB - ratingA;
                });
                break;

            case 'availability':
                sorted.sort((a, b) => {
                    const stockA = a.sellers.filter(s => s.inStock).length;
                    const stockB = b.sellers.filter(s => s.inStock).length;
                    return stockB - stockA; // Most options first
                });
                break;
        }

        return sorted;
    }
}
