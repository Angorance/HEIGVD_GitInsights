const messages = require('./tipsMessages');

// Get the media of an array of numbers
function getMedian(numbers = []) {
  let median = 0;
  const nbrNum = numbers.length;

  // Sort the array of numbers
  numbers.sort((a, b) => a > b);

  if (nbrNum % 2 === 0) {
    // average of both middle numbers
    median = (numbers[nbrNum / 2 - 1] + numbers[nbrNum / 2]) / 2;
  } else {
    // number of the middle
    median = numbers[(nbrNum - 1) / 2];
  }

  return median;
}

// Get tip 1
function getTipsNumberOfCharactersPerCommit(commits = []) {
  // Get the length of all commits
  const charactersPerCommit = commits.reduce((acc, elem) => acc.concat(elem.length), []);

  // Get the length median
  const median = getMedian(charactersPerCommit);

  // Get the tip
  const tip = {};
  tip.title = 'Commit message length';
  tip.score = median;
  tip.criteria = 'commit message length\'s median';

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

module.exports = {
  getTipsNumberOfCharactersPerCommit,
};
