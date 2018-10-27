const { expect } = require('chai');
const utils = require('../src/utils');

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
  /*  2nd graph : issues
  /*====================================================================== */

  /* ========================================================================
  /*  3nd graph : coded lines and commits
  /*====================================================================== */

  /* ========================================================================
  /*  4nd graph : repositories
  /*====================================================================== */

  /* ========================================================================
  /*  Tips
  /*====================================================================== */
});
