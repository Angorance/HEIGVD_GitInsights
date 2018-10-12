function getReposLanguagesStats(reposLanguages = []) {
    const stats = {};
    const countLanguages = o => {
        Object.keys(o).forEach(key => {
            const value = o[key];
            const current = stats[key] || 0;
            stats[key] = current + value;
        });
    };
    reposLanguages.forEach(countLanguages);
    return stats;
}

module.exports = {
    getReposLanguagesStats,
};