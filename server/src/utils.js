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

// Sort an array of commits by date (newest first)
function sortCommitsByDateNewestFirst(repos = []) {
  return repos.sort((a, b) => new Date(b.commit.author.date) - new Date(a.commit.author.date));
}

// Sort an array of commits by date (latest first)
function sortCommitsByDateLatestFirst(repos = []) {
  return repos.sort((a, b) => new Date(a.commit.author.date) - new Date(b.commit.author.date));
}

// Get x latest commits
function getLastCommits(repos = [], number) {
  return sortCommitsByDateNewestFirst(repos).slice(0, number);
}

// Sort an array of dates (oldest first) and get the first one
function getOldestDate(dates = []) {
  dates.sort((a, b) => new Date(a) - new Date(b));
  return dates[0];
}

// Sort an array of repositories by date (oldest first) and get the first one
function getOldestRepository(repos = []) {
  repos.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  return repos[0].created_at;
}

// Sort an array of commits by date (oldest first) and get the first one
function getOldestCommit(repos = []) {
  return sortCommitsByDateLatestFirst(repos)[0].commit.author.date;
}

module.exports = {
  getReposLanguagesStats,
  getOldestDate,
  getOldestRepository,
  getOldestCommit,
  sortCommitsByDateLatestFirst,
  sortCommitsByDateNewestFirst,
  getLastCommits,
};
