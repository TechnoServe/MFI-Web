const {validate} = require('../utils');
const {COMPANY_TIERS} = require('../constants');


/**
 * Computes and saves an assessment score (SAT or IEG) for a company and cycle.
 * @param {Object} store - Data access layer with question and answer fetching methods.
 * @returns {Function} Express route handler that handles the request and response.
 */
module.exports.computeScore = (store) => async (req, res) => {
  try {
    const SCORE_TYPES = {
      SAT: 'SAT',
      IEG: 'IEG',
    };

    const constraints = {
      'company-id': {
        type: 'string',
        presence: {allowEmpty: false},
      },
      'cycle-id': {
        type: 'string',
      },
      'assessment-type': {
        type: 'string',
        presence: {allowEmpty: false},
        inclusion: {
          within: SCORE_TYPES,
          message: 'Provide a valid score type.',
        },
      },
    };

    const errors = validate(req.body, constraints);

    if (errors) {
      return res.status(400).json({errors});
    }

    // TODO: Restrict access to this endpoint

    const questions = await store.getQuestions();
    const answerHashes = [];

    for (let i = 0; i < questions.length; i++) {
      const hash = `${questions[i]['category_id']}-${questions[i]['tier_id']}`;
      if (!answerHashes.includes(hash)) answerHashes.push(hash);
    }

    const cycleId = req.body['cycle-id'] ? req.body['cycle-id'] : (await store.getActiveSATCycle()).id;

    let score = 0;
    let ivcScore = 0;

    const company = await store.getCompanyById(req.body['company-id']);
    console.log('Company:', company);
    
    switch (req.body['assessment-type']) {
      case SCORE_TYPES.SAT: {
        // Fetch SAT and IVC answers, compute scores and completion rates
        const answers = await store.getCompanySatScores(req.body['company-id'], cycleId, req.user, !cycleId);

        await store.createSATScores(answers, "SAT", req.body['company-id'], cycleId);
        const ivcAnswers = await store.getCompanyIvcScores(req.body['company-id'], cycleId, req.user, !cycleId);
        await store.createSATScores(ivcAnswers, "IVC", req.body['company-id'], cycleId);
        const sumOfPoints = answers.reduce((sum, answer) => sum + answer.score, 0);
        const ivcSumOfPoints = ivcAnswers.reduce((sum, answer) => sum + answer.score, 0);
        //score = (sumOfPoints / answerHashes.length);
        score = sumOfPoints;
        ivcScore = ivcSumOfPoints;
        break;
      }
      case SCORE_TYPES.IEG: {
        // Fetch and compute IEG score
        const answers = await store.getIEGScores(req.body['company-id'], 'IEG', cycleId, req.user);
        const sumOfPoints = answers.reduce((sum, { value }) => sum + value, 0);
        score = sumOfPoints;
        break;
      }

      // TODO: Add IEG scoring logic which will be similar to SAT
      default:
        // Do nothing, you should never get here.
        break;
    }


    

    // Store computed assessment scores
    await store.setAssessmentScore(company.id, cycleId, req.body['assessment-type'], score);
    if (req.body['assessment-type'] === SCORE_TYPES.SAT) {
      await store.setAssessmentScore(company.id, cycleId, 'IVC', ivcScore);
    }

    return res.json({message: 'Score calculated successfully.'});
  } catch (err) {
    const message = 'Failed to compute score.';
    console.error(err, message);
    res.status(500).json({message});
  }
};


/**
 * Persists assessment scores (IVC, IEG, or SAT) to the database.
 * Validates an array of score entries before saving.
 * @param {Object} store - Data access layer with score creation methods.
 * @returns {Function} Express route handler that handles the request and response.
 */
const persistScores = (store) => async (req, res) => {
  try {
    const SCORE_TYPES = {
      IVC: 'IVC',
      IEG: 'IEG',
      SAT: 'SAT',
    };

    const constraints = {
      company_id: {
        type: 'string',
        presence: {allowEmpty: false},
      },
      category_id: {
        type: 'string',
        presence: {allowEmpty: false},
      },
      cycle_id: {
        type: 'string',
        presence: {allowEmpty: false},
      },
      type: {
        type: 'string',
        presence: {allowEmpty: false},
        inclusion: {
          within: SCORE_TYPES,
          message: 'Provide a valid score type.',
        },
      },
      value: {
        numericality: true,
      },
      weight: {
        numericality: true,
      },
    };

    const itemValidator = (constraints) => (val) => validate(val, constraints);

    let errors = null;

    // Joi validator would have being more useful in this context
    if (!Array.isArray(req.body)) {
      errors = 'Scores must be an array.';
    } else if (!(req.body.length > 0)) {
      errors = 'Scores cannot be empty.';
    } else {
      const validationError = req.body.map(itemValidator(constraints)).filter((err) => err);
      errors = validationError.length > 0 ? validationError : null;
    }

    if (errors) {
      return res.status(400).json({errors});
    }

    const score = await store.createIEGScores(req.body);

    if (score) {
      return res.json({message: 'Scores persisted successfully.'});
    } else {
      return res.status(500).json({message: 'Failed to persist scores.'});
    }
  } catch (err) {
    const message = 'Failed to store score.';
    console.error(err, message);
    res.status(500).json({message});
  }
};


/**
 * Retrieves assessment scores (IVC or IEG) for a given company and cycle.
 * @param {Object} store - Data access layer with score retrieval methods.
 * @returns {Function} Express route handler that handles the request and response.
 */
module.exports.getScores = (store) => async (req, res) => {
  try {
    const SCORE_TYPES = {
      IVC: 'IVC',
      IEG: 'IEG',
    };

    const constraints = {
      'company-id': {
        type: 'string',
        presence: {allowEmpty: false},
      },
      'cycle-id': {
        type: 'string',
      },
      'assessment-type': {
        type: 'string',
        presence: {allowEmpty: false},
        inclusion: {
          within: SCORE_TYPES,
          message: 'Provide a valid score type.',
        },
      },
    };

    const errors = validate(req.query, constraints);

    if (errors) {
      return res.status(400).json({errors});
    }

    const payload = {companyId: req.query['company-id'], cycleId: req.query['cycle-id'], type: req.query['assessment-type']};

    const scores = await store.getAssessmentScores(payload);

    return res.json(scores);
  } catch (err) {
    const message = 'Failed to get scores.';
    console.error(err, message);
    res.status(500).json({message});
  }
};

/** @type {Function} Persists IEG assessment scores. */
module.exports.persistIEGScores = persistScores;

/** @type {Function} Persists IEG assessment scores. */
module.exports.persistIVCScores = persistScores;

/** @type {Function} Persists IEG assessment scores. */
module.exports.persistSATScores = persistScores;

/**
 * Retrieves all assessment scores for all companies.
 * @param {Object} store - Data access layer with score retrieval methods.
 * @returns {Function} Express route handler that handles the request and response.
 */
module.exports.getAllScores = (store) => async (req, res) => {
  try {
    const cycleId = req.query['cycle-id'];
    const type = req.query['type'];

    if (!cycleId) {
      return res.status(400).json({ message: "'cycle-id' is required." });
    }

    const scores = await store.getAllAssessmentScores(cycleId, type);
    return res.json(scores);
  } catch (err) {
    const message = 'Failed to retrieve all scores.';
    console.error(err, message);
    res.status(500).json({ message });
  }
};

/**
 * Retrieves SAT variance per company for a given cycle.
 * @param {Object} store - Data access layer with score retrieval/variance methods.
 * @returns {Function} Express route handler.
 */
module.exports.getSATVariance = (store) => async (req, res) => {
  try {
    const cycleId = req.query['cycle-id'];
    if (!cycleId) {
      return res.status(400).json({ message: "'cycle-id' is required." });
    }
    const varianceData = await store.getSATVarianceByCompany(cycleId);
    return res.json(varianceData);
  } catch (err) {
    const message = 'Failed to retrieve SAT variance.';
    console.error(err, message);
    res.status(500).json({ message });
  }
};

/**
 * Retrieves the 4PG ranking for all companies for a given cycle.
 * @param {Object} store - Data access layer with 4PG ranking retrieval method.
 * @returns {Function} Express route handler.
 */
module.exports.getAll4PGRanking = (store) => async (req, res) => {
  try {
    const cycleId = req.query['cycle-id'];

    if (!cycleId) {
      return res.status(400).json({ message: "'cycle-id' is required." });
    }

    const rankingData = await store.getAll4PGRanking(cycleId);

    return res.json(rankingData);
  } catch (err) {
    const message = 'Failed to retrieve 4PG ranking.';
    console.error(err, message);
    res.status(500).json({ message });
  }
};
