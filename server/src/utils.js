// Kind of group by for the languages of all repositories
function getReposLanguagesStats(reposLanguages = []) {
  const stats = {};
  const countLanguages = (o) => {
    Object.keys(o).forEach((key) => {
      const value = o[key];
      const current = stats[key] || 0;
      stats[key] = current + value;
    });
  };
  reposLanguages.forEach(countLanguages);
  return stats;
}

// Sort an array of repositories by date (oldest first) and get the first one
function getOldestRepository(repos = []) {
  repos.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  return repos[0].created_at;
}

// Sort an array of commits by date (oldest first) and get the first one
function getOldestCommit(repos = []) {
  repos.sort((a, b) => new Date(a.commit.author.date) - new Date(b.commit.author.date));
  return repos[0].commit.author.date;
}

module.exports = {
  getReposLanguagesStats, getOldestRepository, getOldestCommit,
};
