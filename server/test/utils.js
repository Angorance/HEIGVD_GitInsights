const { expect } = require('chai');
const utils = require('../src/utils');
const tips = require('../src/tips');

describe('Github utils', () => {
  /* ========================================================================
  /*  Timeline
  /*====================================================================== */

  // Get user's first date
  it('should retrieve the oldest date', () => {
    const dates = [
      '2018-02-19T08:46:01Z',
      '2016-02-24T08:46:01Z',
      '2017-05-03T08:46:01Z',
      '2016-10-09T08:46:01Z',
    ];

    const expected = '2016-02-24T08:46:01Z';

    expect(utils.getOldestDate(dates)).to.eql(expected);
  });

  // Get user's first repository creation date
  it('should retrieve the date of the oldest repository', () => {
    const dates = [
      { created_at: '2018-02-19T08:46:01Z' },
      { created_at: '2016-02-24T08:46:01Z' },
      { created_at: '2017-05-03T08:46:01Z' },
      { created_at: '2016-10-09T08:46:01Z' },
    ];

    const expected = '2016-02-24T08:46:01Z';

    expect(utils.getOldestRepository(dates)).to.eql(expected);
  });

  // Get user's first commit date
  it('should retrieve the date of the oldest commit', () => {
    const dates = [
      { commit: { author: { date: '2018-02-19T08:46:01Z' } } },
      { commit: { author: { date: '2016-02-24T08:46:01Z' } } },
      { commit: { author: { date: '2017-05-03T08:46:01Z' } } },
      { commit: { author: { date: '2016-10-09T08:46:01Z' } } },
    ];

    const expected = '2016-02-24T08:46:01Z';

    expect(utils.getOldestCommit(dates)).to.eql(expected);
  });

  /* ========================================================================
  /*  1st graph : languages
  /*====================================================================== */

  // Get the number of coded lines by language for all repositories
  it('should calculate languages stats', () => {
    const languages = [
      { CSS: 1, Javascript: 2, MakeFile: 4 },
      {},
      { CSS: 2 },
      { Javascript: 1 },
    ];

    const expected = {
      CSS: 3,
      Javascript: 3,
      MakeFile: 4,
    };

    expect(utils.getReposLanguagesStats(languages)).to.eql(expected);
  });

  /* ========================================================================
  /*  3nd graph : coded lines and commits
  /*====================================================================== */

  // Sort user's commits by date (latest first)
  it('should retrieve the commits sorted by date (latest first)', () => {
    const dates = [
      { commit: { author: { date: '2018-02-19T08:46:01Z' } } },
      { commit: { author: { date: '2016-02-24T08:46:01Z' } } },
      { commit: { author: { date: '2017-05-03T08:46:01Z' } } },
      { commit: { author: { date: '2016-10-09T08:46:01Z' } } },
    ];

    const expected = [
      { commit: { author: { date: '2016-02-24T08:46:01Z' } } },
      { commit: { author: { date: '2016-10-09T08:46:01Z' } } },
      { commit: { author: { date: '2017-05-03T08:46:01Z' } } },
      { commit: { author: { date: '2018-02-19T08:46:01Z' } } },
    ];

    expect(utils.sortCommitsByDateLatestFirst(dates)).to.eql(expected);
  });

  // Sort user's commits by date (newest first)
  it('should retrieve the commits sorted by date (newest first)', () => {
    const dates = [
      { commit: { author: { date: '2018-02-19T08:46:01Z' } } },
      { commit: { author: { date: '2016-02-24T08:46:01Z' } } },
      { commit: { author: { date: '2017-05-03T08:46:01Z' } } },
      { commit: { author: { date: '2016-10-09T08:46:01Z' } } },
    ];

    const expected = [
      { commit: { author: { date: '2018-02-19T08:46:01Z' } } },
      { commit: { author: { date: '2017-05-03T08:46:01Z' } } },
      { commit: { author: { date: '2016-10-09T08:46:01Z' } } },
      { commit: { author: { date: '2016-02-24T08:46:01Z' } } },
    ];

    expect(utils.sortCommitsByDateNewestFirst(dates)).to.eql(expected);
  });

  it('should retrieve the two last commits', () => {
    const dates = [
      { commit: { author: { date: '2018-02-19T08:46:01Z' } } },
      { commit: { author: { date: '2016-02-24T08:46:01Z' } } },
      { commit: { author: { date: '2017-05-03T08:46:01Z' } } },
      { commit: { author: { date: '2016-10-09T08:46:01Z' } } },
    ];

    const expected = [
      { commit: { author: { date: '2018-02-19T08:46:01Z' } } },
      { commit: { author: { date: '2017-05-03T08:46:01Z' } } },
    ];

    expect(utils.getLastCommits(dates, 2)).to.eql(expected);
  });

  /* ========================================================================
  /*  Tips
  /*====================================================================== */

  // Get median of an array of even length
  it('should retrieve the median of an array of numbers (even length)', () => {
    const numbers = [1, 8, 1, 1, 6, 7, 5, 2, 2, 3];
    const expected = 2.5;

    expect(tips.getMedian(numbers)).to.eql(expected);
  });

  // Get median of an array of odd length
  it('should retrieve the median of an array of numbers (odd length)', () => {
    const numbers = [1, 8, 1, 1, 6, 9, 7, 5, 2, 2, 3];
    const expected = 3;

    expect(tips.getMedian(numbers)).to.eql(expected);
  });

  // Get the number of languages to reach 75% of the coded lines
  it('should retrieve the number of languages to reach 75% of the coded lines (#1)', () => {
    const languages = {
      Java: 260,
      Go: 250,
      Python: 249,
      Julia: 140,
      Javascript: 101,
    };
    const expected = 3;

    expect(tips.getNumberOfLanguagesToReach75Percent(languages)).to.eql(expected);
  });

  // Get the number of languages to reach 75% of the coded lines
  it('should retrieve the number of languages to reach 75% of the coded lines (#2)', () => {
    const languages = {
      Java: 260,
    };
    const expected = 1;

    expect(tips.getNumberOfLanguagesToReach75Percent(languages)).to.eql(expected);
  });

  // Get the number of languages to reach 75% of the coded lines
  it('should retrieve the number of languages to reach 75% of the coded lines (#3)', () => {
    const languages = {
      Java: 1199284,
      Dockerfile: 1050,
      CSS: 267635,
      'C++': 1098768,
      C: 33995,
      CMake: 1982,
      JavaScript: 534006,
      PHP: 83311,
      Shell: 8185,
      HTML: 3447,
      TypeScript: 19272,
      Makefile: 26979,
      QMake: 10009,
      PLpgSQL: 1946,
    };

    const expected = 3;

    expect(tips.getNumberOfLanguagesToReach75Percent(languages)).to.eql(expected);
  });

  // Get the time between the opening and closure of an issue
  it('should retrieve the time between the opening and closure of an issue', () => {
    const issues = [
      { created_at: '2018-02-19T08:46:01Z', closed_at: '2018-02-24T08:46:01Z' },
      { created_at: '2016-02-24T08:46:01Z', closed_at: '2016-02-24T09:46:01Z' },
      { created_at: '2017-05-03T08:46:01Z', closed_at: '2017-05-23T08:46:01Z' },
      { created_at: '2016-10-09T08:46:01Z', closed_at: '2016-10-18T08:46:01Z' },
    ];

    const expected = 7;

    expect(tips.getTipsTimeBetweenOpeningAndClosureIssue(issues).score).to.eql(expected);
  });
});
