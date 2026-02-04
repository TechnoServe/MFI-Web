import React, {useState, useEffect} from 'react';
import propTypes from 'prop-types';
import {UnorderedList, ListItem, Text, Spinner, Flex} from '@chakra-ui/react';
import {nanoid} from '@reduxjs/toolkit';
import {request} from 'common';
import {useSelector} from 'react-redux';

/**
 * Descriptor component renders the evidence descriptor section of the SAT tool.
 * It fetches previous answers for a given tier and allows the user to select an evidence status.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.tierQuestions - List of questions for the current tier
 * @param {string|number} props.categoryId - ID of the assessment category
 * @param {Object} props.activeTiers - Current active tier object
 * @param {Function} props.setTierOneChoice - Setter for TIER_1 evidence selection
 * @param {Function} props.setTierTwoChoice - Setter for TIER_2 evidence selection
 * @param {Function} props.setTierThreeChoice - Setter for TIER_3 evidence selection
 * @param {string} props.tierOneChoice - Currently selected TIER_1 value
 * @param {string} props.tierTwoChoice - Currently selected TIER_2 value
 * @param {string} props.tierThreeChoice - Currently selected TIER_3 value
 * @returns {JSX.Element} A rendered evidence descriptor section
 */
export const conditions = [
  {value: 'NOT_MET', name: 'Not met'},
  {value: 'PARTLY_MET', name: 'Partly met'},
  {value: 'MOSTLY_MET', name: 'Mostly met'},
  {value: 'FULLY_MET', name: 'Fully met'},
];

const Descriptor = ({
  tierQuestions,
  categoryId,
  activeTiers,
  setTierOneChoice,
  setTierTwoChoice,
  setTierThreeChoice,
  tierOneChoice,
  tierTwoChoice,
  tierThreeChoice}) => {
  const [question, setQuestion] = useState([]);
  const [previousChoice, setPreviousChoice] = useState();
  // const [tierValue, setTierValue] = useState('');
  // const [tierOneChoice, setTierOneChoice] = useState(null);
  // const [tierTwoChoice, setTierTwoChoice] = useState(null);
  // const [tierThreeChoice, setTierThreeChoice] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);

  // Set local state with updated tier questions whenever prop changes
  useEffect(() => {
    setQuestion(tierQuestions);
  }, [tierQuestions]);

  // Fetch previous and current answers from the backend for the active tier
  useEffect(() => {
    setLoading(true);
    const body = {
      'company-id': user?.company?.id,
      'category-ids': [categoryId],
      'showUnapproved': 1
    };
    const getChoices = async () => {
      // Request previous evidence answers submitted by the company for this category
      const {
        data: {responses: previousResponses},
      } = await request(true).post(`/sat/get/previous-answers`, body);

      // Filter previous responses by active tier and store them for display
      const tierPreviousChoice = previousResponses.filter((val) => val.tier === activeTiers.tier_constant);
      tierPreviousChoice[0];
      setPreviousChoice(tierPreviousChoice);

      // Get current answer selections and store them for each tier if applicable
      const {
        data: {responses},
      } = await request(true).post(`/sat/get/answers`, body);
      const tierChoice = responses.filter((val) => val.tier === activeTiers.tier_constant);
      console.log(tierChoice);
      // tierChoice[0] && setChoice(tierChoice[0].value);
      // tierChoice[0] && setChoice(tierChoice[0].value);
      const tierChoiceOne = responses.filter((val) => val.tier === 'TIER_1' && activeTiers.tier_constant === 'TIER_1');
      setTierOneChoice(tierChoiceOne[0]?.value);

      const tierChoiceTwo = responses.filter((val) => val.tier === 'TIER_2' && activeTiers.tier_constant === 'TIER_2');
      setTierTwoChoice(tierChoiceTwo[0]?.value);

      const tierChoiceThree = responses.filter((val) => val.tier === 'TIER_3' && activeTiers.tier_constant === 'TIER_3');
      setTierThreeChoice(tierChoiceThree[0]?.value);


      // setTierValue(tierChoice[0]?.value);
      setLoading(false);
    };
    activeTiers && getChoices();
  }, [activeTiers]);

  // Render evidence descriptor UI with requirements and selectable evidence status
  return (
    <div className="padding-x-10">
      <div className="padding-top-6 padding-bottom-4">
        <div className="text-sub-header">Evidence descriptor</div>
      </div>
      <div className="background-color-white border-1px rounded-large padding-5">
        <Text className="weight-medium" mb="3">
          Requirements
        </Text>
        {loading ? (
          <Flex height="100%" width="100%" mb="10" justifyContent="center" alignItems="center">
            <Spinner />
          </Flex>
        ) : (
          <>
            {question.length > 0 ? (
              <UnorderedList role="list" className="padding-left-0 margin-bottom-5">
                {question.map((val) => {
                  return (
                    <ListItem key={nanoid()} className="text-small padding-bottom-4">
                      {val.value}
                    </ListItem>
                  );
                })}
              </UnorderedList>
            ) : (
              ''
            )}
            <Text className="weight-medium" mb="3">
              Select evidence status
            </Text>
            {/* Render evidence status buttons for each tier based on activeTiers */}
            {activeTiers?.tier_constant === 'TIER_1' &&
              <div className="flex-row">
                {conditions.map((val) => (
                  <div
                    key={nanoid()}
                    onClick={() => setTierOneChoice(val.value)}
                    className="button-secondary button-small margin-right-3 width-1-3 flex-justify-center w-button"
                    style={
                      tierOneChoice === val.value ?
                          {
                            border: '1px solid #00B37A',
                            color: '#00B37A',
                          } :
                          {}
                    }
                  >
                    {val.name}
                  </div>
                ))}
              </div>
            }
            {/* Render evidence status buttons for each tier based on activeTiers */}
            {activeTiers?.tier_constant === 'TIER_2' &&
              <div className="flex-row">
                {conditions.map((val) => (
                  <div
                    key={nanoid()}
                    onClick={() => setTierTwoChoice(val.value)}
                    className="button-secondary button-small margin-right-3 width-1-3 flex-justify-center w-button"
                    style={
                      tierTwoChoice === val.value ?
                          {
                            border: '1px solid #00B37A',
                            color: '#00B37A',
                          } :
                          {}
                    }
                  >
                    {/* {console.log('tierTwoChoice', tierTwoChoice)}
                    {console.log('val.value', val.value)} */}
                    {val.name}
                  </div>
                ))}
              </div>
            }
            {/* Render evidence status buttons for each tier based on activeTiers */}
            {activeTiers?.tier_constant === 'TIER_3' &&
              <div className="flex-row">
                {conditions.map((val) => (
                  <div
                    key={nanoid()}
                    onClick={() => setTierThreeChoice(val.value)}
                    className="button-secondary button-small margin-right-3 width-1-3 flex-justify-center w-button"
                    style={
                      tierThreeChoice === val.value ?
                          {
                            border: '1px solid #00B37A',
                            color: '#00B37A',
                          } :
                          {}
                    }
                  >
                    {/* {console.log('tierThreeChoice', tierThreeChoice)}
                    {console.log('val.value', val.value)} */}
                    {val.name}
                  </div>
                ))}
              </div>
            }

            <div style={{marginTop: '10px'}} className="fafafa rounded-large flex-space-between flex-row-middle padding-3">
              <div className="text-small text-color-body-text">
                Previous answer
              </div>
              <h4 style={{color: '#526CDB', lineHeight: '21px'}} className="flex-row">

                {/* Display previously submitted answer for the current tier */}
                {previousChoice?.map((x) => x.value === 'FULLY_MET'
                  ? 'Fully Met' :
                  x.value === 'NOT_MET'
                    ? 'Not Met' :
                    x.value === 'PARTLY_MET'
                      ? 'Partly Met' :
                      x.value === 'MOSTLY_MET'
                        ? 'Mostly Met' :
                          (x.value === '' || x.value === undefined || x.value === null)
                            ? 'No Selection Available for this Tier' : 'No Evidence'
                )}
              </h4>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

Descriptor.propTypes = {
  categoryId: propTypes.any,
  activeTiers: propTypes.any,
  tierQuestions: propTypes.any,
  parentId: propTypes.any,
  tierOneChoice: propTypes.any,
  setTierOneChoice: propTypes.any,
  tierTwoChoice: propTypes.any,
  setTierTwoChoice: propTypes.any,
  tierThreeChoice: propTypes.any,
  setTierThreeChoice: propTypes.any,
};

export default Descriptor;
