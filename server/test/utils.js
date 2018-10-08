const { expect } = require('chai');
const utils = require('../src/utils');

describe('Github utils', () => {
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
});