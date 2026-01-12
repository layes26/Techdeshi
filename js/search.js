// Smart search engine with fuzzy matching and autocomplete

class SearchEngine {
    constructor(database) {
        this.database = database;
        this.searchHistory = [];
    }

    // Levenshtein distance for fuzzy matching
    levenshteinDistance(str1, str2) {
        const len1 = str1.length;
        const len2 = str2.length;
        const matrix = [];

        for (let i = 0; i <= len1; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= len2; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + cost
                );
            }
        }

        return matrix[len1][len2];
    }

    // Calculate similarity score (0-1, higher is better)
    calculateSimilarity(query, text) {
        const queryLower = query.toLowerCase();
        const textLower = text.toLowerCase();

        // Exact match
        if (textLower === queryLower) return 1.0;

        // Contains exact query
        if (textLower.includes(queryLower)) return 0.9;

        // Check individual words
        const queryWords = queryLower.split(/\s+/);
        const textWords = textLower.split(/\s+/);

        let matchCount = 0;
        queryWords.forEach(qWord => {
            textWords.forEach(tWord => {
                if (tWord.includes(qWord) || qWord.includes(tWord)) {
                    matchCount++;
                } else {
                    // Fuzzy match
                    const distance = this.levenshteinDistance(qWord, tWord);
                    const maxLen = Math.max(qWord.length, tWord.length);
                    const similarity = 1 - distance / maxLen;
                    if (similarity > 0.7) {
                        matchCount += similarity;
                    }
                }
            });
        });

        return matchCount / queryWords.length;
    }

    // Search products
    search(query) {
        if (!query || query.trim() === '') {
            return this.database;
        }

        const results = this.database.map(product => {
            // Calculate scores for different fields
            const nameScore = this.calculateSimilarity(query, product.name) * 3;
            const brandScore = this.calculateSimilarity(query, product.brand) * 2;
            const categoryScore = this.calculateSimilarity(query, product.category) * 1.5;

            // Check specs
            let specsScore = 0;
            product.specs.forEach(spec => {
                specsScore += this.calculateSimilarity(query, spec);
            });

            const totalScore = nameScore + brandScore + categoryScore + specsScore;

            return {
                product,
                score: totalScore
            };
        })
            .filter(item => item.score > 0.3) // Only return reasonably matching items
            .sort((a, b) => b.score - a.score)
            .map(item => item.product);

        // Add to search history
        if (query.trim() && results.length > 0) {
            this.addToHistory(query);
        }

        return results;
    }

    // Get autocomplete suggestions
    getAutocompleteSuggestions(query) {
        if (!query || query.trim() === '') {
            return POPULAR_SEARCHES.slice(0, 5);
        }

        const suggestions = new Set();

        // Search products and extract relevant suggestions
        const searchResults = this.search(query);

        searchResults.slice(0, 5).forEach(product => {
            // Add product name
            suggestions.add(product.name);

            // Add brand + category combination
            suggestions.add(`${product.brand} ${product.category}`);
        });

        // Add matching popular searches
        POPULAR_SEARCHES.forEach(search => {
            if (this.calculateSimilarity(query, search) > 0.3) {
                suggestions.add(search);
            }
        });

        // Convert to array and limit
        return Array.from(suggestions).slice(0, 8);
    }

    // Add to search history
    addToHistory(query) {
        const normalized = query.trim().toLowerCase();

        // Remove if already exists
        this.searchHistory = this.searchHistory.filter(item => item !== normalized);

        // Add to beginning
        this.searchHistory.unshift(normalized);

        // Keep only last 10
        if (this.searchHistory.length > 10) {
            this.searchHistory = this.searchHistory.slice(0, 10);
        }
    }

    // Get search history
    getSearchHistory() {
        return this.searchHistory;
    }

    // Clear search history
    clearHistory() {
        this.searchHistory = [];
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SearchEngine;
}
