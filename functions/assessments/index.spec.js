const {computeScore} = require('./index');

describe('Test assessment scores calculation', () => {
  it('Generate accurate results', async () => {
    // Data
    const companyId = 'some-very-random-company-id';
    const assessmentType = 'SAT';
    const activeCycle = {id: 'cycle-id'};

    const company = {
      id: companyId,
      tier: 'TIER_3',
    };

    const satQuestions = [
      {
        id: 'some-random-id',
        category_id: 'category-1',
        sort_order: 1,
        tier_id: 'TIER_1',
        value: 'Question details',
      },
      {
        id: 'some-random-id',
        category_id: 'category-1',
        sort_order: 1,
        tier_id: 'TIER_2',
        value: 'Question details',
      },
      {
        id: 'some-random-id',
        category_id: 'category-2',
        sort_order: 1,
        tier_id: 'TIER_2',
        value: 'Question details',
      },
      {
        id: 'some-random-id',
        category_id: 'category-3',
        sort_order: 1,
        tier_id: 'TIER_3',
        value: 'Question details',
      },
      {
        id: 'some-random-id',
        category_id: 'category-3',
        sort_order: 1,
        tier_id: 'TIER_3',
        value: 'Question details',
      },
    ];

    const satAnswers = [
      {
        id: 'some-random-id',
        company_id: companyId,
        catogory_id: 'category-1',
        cycle_id: 'cycle-1',
        points: 5,
        submitted_by: 'anyone',
        value: 'MOSTLY_MET',
        tier: 'TIER_1',
      },
      {
        id: 'some-random-id',
        company_id: companyId,
        catogory_id: 'category-2',
        cycle_id: 'cycle-1',
        points: 7,
        submitted_by: 'anyone',
        value: 'MOSTLY_MET',
        tier: 'TIER_3',
      },
    ];

    // Mock request
    const req = {
      'body': {
        'company-id': companyId,
        'assessment-type': assessmentType,
      },
    };

    // Mock store
    const store = {};
    store.getQuestions = jest.fn().mockImplementationOnce(() => satQuestions);
    store.getActiveSATCycle = jest.fn().mockImplementationOnce(() => activeCycle);
    store.getSatAnswers = jest.fn().mockImplementationOnce(() => satAnswers);
    store.getCompanyById = jest.fn().mockImplementationOnce(() => company);
    store.setAssessmentScore = jest.fn();

    // Mock response
    const res = {};
    res.json = jest.fn(() => res);
    res.status = jest.fn(() => res);

    await computeScore(store)(req, res);

    expect(store.setAssessmentScore).toBeCalledWith(companyId, 'cycle-id', assessmentType, 3);
    expect(res.json).toBeCalledTimes(1);
    expect(res.status).not.toHaveBeenCalledWith(500);
  });
});
