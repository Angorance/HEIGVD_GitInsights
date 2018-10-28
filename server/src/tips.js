const messages = require('./tipsMessages');

/**
 * Get the median of an array of numbers
 * @param {*} numbers
 */
function getMedian(numbers = []) {
  let median = 0;
  const nbrNum = numbers.length;

  // Sort the array of numbers
  numbers.sort((a, b) => a - b);

  if (nbrNum % 2 === 0) {
    // average of both middle numbers
    median = (numbers[nbrNum / 2 - 1] + numbers[nbrNum / 2]) / 2;
  } else {
    // number of the middle
    median = numbers[(nbrNum - 1) / 2];
  }

  return median;
}

/**
 * the number of languages of the user to reach 75% of the coded lines.
 * @param {*} languages
 */
function getNumberOfLanguagesToReach75Percent(languages = {}) {
  // Get an array from the JSON object
  const array = [];

  for (let i in languages)
    array.push(languages[i]);

  // Sort the array decreasing
  array.sort((a, b) => b - a);

  // Get the 75% of number of coded lines
  const nbrLines = array.reduce((acc, elem) => acc + elem, 0);
  const nbrLinesFor75Percent = nbrLines * 0.75;

  // Count the number of languages to reach the 75%
  let numberOfLanguages = 0;
  let countLines = 0;

  do {
    countLines += array[numberOfLanguages];
    ++numberOfLanguages;
  } while (countLines < nbrLinesFor75Percent);

  return numberOfLanguages;
}

/* --------------------------------------------------------------------------------- */

/**
 * Get tip for the length of the latest hundred commits messages.
 * @param {*} commits hundred commits to analyse.
 */
function getTipsNumberOfCharactersPerCommit(commits = []) {
  // Get the length of all commits
  const charactersPerCommit = commits.reduce((acc, elem) => acc.concat(elem.length), []);

  // Get the length median
  const median = getMedian(charactersPerCommit);

  // Get the tip
  const tip = {};
  tip.title = 'Number of characters per commit message';
  tip.score = median;
  tip.criteria = 'The score is the median of the latest hundred commits messages length.';

  if (median >= 95) {
    tip.tip = messages.tipMessageCommitLength95;
    tip.quality = 3;
  } else if (median >= 70 && median < 95) {
    tip.tip = messages.tipMessageCommitLength70;
    tip.quality = 2;
  } else if (median >= 50 && median < 70) {
    tip.tip = messages.tipMessageCommitLength50;
    tip.quality = 1;
  } else if (median >= 25 && median < 50) {
    tip.tip = messages.tipMessageCommitLength25;
    tip.quality = 2;
  } else {
    tip.tip = messages.tipMessageCommitLength0;
    tip.quality = 3;
  }

  return tip;
}

/**
 * Get tip for the number of modifications (additions/deletions) of the latest hundred commits messages.
 * @param {*} commits hundred commits to analyse.
 */
function getTipsNumberOfModificationsPerCommit(commits = []) {
  // Get the number of modifications (additions/deletions) of all commits
  const modificationsPerCommit = commits;

  // Get the length median
  const median = getMedian(modificationsPerCommit);

  // Get the tip
  const tip = {};
  tip.title = 'Number of modifications (additions/deletions) per commit';
  tip.score = median;
  tip.criteria = 'The score is the median of the latest hundred commits modifications.';

  if (median >= 40) {
    tip.tip = messages.tipModifiedLinesCommit40;
    tip.quality = 3;
  } else if (median >= 25 && median < 40) {
    tip.tip = messages.tipModifiedLinesCommit25;
    tip.quality = 2;
  } else if (median >= 15 && median < 25) {
    tip.tip = messages.tipModifiedLinesCommit15;
    tip.quality = 1;
  } else if (median >= 10 && median < 15) {
    tip.tip = messages.tipModifiedLinesCommit10;
    tip.quality = 2;
  } else {
    tip.tip = messages.tipModifiedLinesCommit0;
    tip.quality = 3;
  }

  return tip;
}

/**
 * Get tip for the number of languages of the user to reach 75% of the coded lines.
 * @param {*} languages languages to analyse.
 */
function getTipsNumberOfLanguagesToReach75PercentsOfCodedLines(languages = {}) {
  // Get the number of modifications (additions/deletions) of all commits
  const numberOfLanguages = getNumberOfLanguagesToReach75Percent(languages);

  // Get the tip
  const tip = {};
  tip.title = 'Number of languages to reach 75% of the coded lines';
  tip.score = numberOfLanguages;
  tip.criteria = 'To find that value, the array of languages is sorted descending';

  if (numberOfLanguages >= 8) {
    tip.tip = messages.tipLanguage8;
    tip.quality = 3;
  } else if (numberOfLanguages >= 5 && numberOfLanguages < 8) {
    tip.tip = messages.tipLanguage5;
    tip.quality = 2;
  } else if (numberOfLanguages >= 3 && numberOfLanguages < 5) {
    tip.tip = messages.tipLanguage3;
    tip.quality = 1;
  } else if (numberOfLanguages === 2) {
    tip.tip = messages.tipLanguage2;
    tip.quality = 2;
  } else {
    tip.tip = messages.tipLanguage0;
    tip.quality = 3;
  }

  return tip;
}

module.exports = {
  getTipsNumberOfCharactersPerCommit,
  getTipsNumberOfModificationsPerCommit,
  getTipsNumberOfLanguagesToReach75PercentsOfCodedLines,
  getMedian,
  getNumberOfLanguagesToReach75Percent,
};
