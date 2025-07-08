import React, {useState, useEffect} from 'react';
import propTypes from 'prop-types';
import {UnorderedList, ListItem, Text, Spinner, Flex} from '@chakra-ui/react';
import {nanoid} from '@reduxjs/toolkit';
import {request} from 'common';
import {getCurrentCompany} from 'utills/helpers';
// import {useSelector} from 'react-redux';

export const conditions = [
  {value: 'NOT_MET', name: 'Not met'},
  {value: 'PARTLY_MET', name: 'Partly met'},
  {value: 'MOSTLY_MET', name: 'Mostly met'},
  {value: 'FULLY_MET', name: 'Fully met'},
];

const Descriptor = ({
  cycle,
  tierQuestions,
  categoryId,
  activeTiers,
  setTierOneChoice,
  setTierTwoChoice,
  setTierThreeChoice,
  setIVCTierOneChoice,
  setIVCTierTwoChoice,
  setIVCTierThreeChoice,
  tierOneChoice,
  tierTwoChoice,
  tierThreeChoice,
  ivcTierOneChoice,
  ivcTierTwoChoice,
  ivcTierThreeChoice
}) => {
  console.log(tierOneChoice);
  console.log(tierTwoChoice);
  console.log(tierThreeChoice);
  const [question, setQuestion] = useState([]);
  // const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [companyChoice, setCompanyChoice] = useState();
  const [ivcChoice, setIVCChoice] = useState();
  useEffect(() => {
    setQuestion(tierQuestions);
  }, [tierQuestions]);

  useEffect(async() => {
    setLoading(true);
    const currentCompany = getCurrentCompany();
    const {id: companyId} = currentCompany;
    // const {data: res} = await request(true).get(
    //   `/company/active-cycle`
    // );
    const body = {
      'company-id': companyId,
      'category-ids': [categoryId],
      'cycle-ids': cycle,
      'showUnapproved': 1
    };
    const getChoices = async () => {
      const {
        data: {responses},
      } = await request(true).post(`/sat/get/answers`, body);

      const {
        data: {responses: ivcResponses},
      } = await request(true).post(`/sat/get/ivc/answers`, body);

      console.log('IVCR ', ivcResponses);

      const tierChoiceOne = ivcResponses.filter((val) => val.tier === 'TIER_1' && activeTiers.tier_constant === 'TIER_1');
      setTierOneChoice(tierChoiceOne[0]?.value);

      const tierChoiceTwo = ivcResponses.filter((val) => val.tier === 'TIER_2' && activeTiers.tier_constant === 'TIER_2');
      setTierTwoChoice(tierChoiceTwo[0]?.value);

      const tierChoiceThree = ivcResponses.filter((val) => val.tier === 'TIER_3' && activeTiers.tier_constant === 'TIER_3');
      setTierThreeChoice(tierChoiceThree[0]?.value);

      const ivcTierChoiceOne = ivcResponses.filter((val) => val.tier === 'TIER_1' && activeTiers.tier_constant === 'TIER_1');
      setIVCTierOneChoice(ivcTierChoiceOne[0]?.value);

      const ivcTierChoiceTwo = ivcResponses.filter((val) => val.tier === 'TIER_2' && activeTiers.tier_constant === 'TIER_2');
      setIVCTierTwoChoice(ivcTierChoiceTwo[0]?.value);

      const ivcTierChoiceThree = ivcResponses.filter((val) => val.tier === 'TIER_3' && activeTiers.tier_constant === 'TIER_3');
      setIVCTierThreeChoice(ivcTierChoiceThree[0]?.value);


      const tierChoice = responses.filter((val) => val.tier === activeTiers.tier_constant);
      const ivcTierChoice = ivcResponses.filter((val) => val.tier === activeTiers.tier_constant);
      ivcTierChoice[0];
      tierChoice[0];
      // console.log('tierChoice.value', tierChoice?.map((val) => val.value));
      setLoading(false);
      setCompanyChoice(tierChoice);
      setIVCChoice(ivcTierChoice);

      console.log(ivcChoice);
    };
    activeTiers && getChoices();
  }, [activeTiers]);

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
            {activeTiers?.tier_constant === 'TIER_1' &&
              <div className="flex-row">
                {conditions.map((val) => (
                  <div
                    key={nanoid()}
                    onClick={() => {
                      setTierOneChoice(val.value); setIVCTierOneChoice(val.value);
                    }}
                    className="button-secondary button-small margin-right-3 width-1-3 flex-justify-center w-button"
                    style={
                      ivcTierOneChoice === val.value ?
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
            {activeTiers?.tier_constant === 'TIER_2' &&
              <div className="flex-row">
                {conditions.map((val) => (
                  <div
                    key={nanoid()}
                    onClick={() => {
                      setTierTwoChoice(val.value); setIVCTierTwoChoice(val.value);
                    }}
                    className="button-secondary button-small margin-right-3 width-1-3 flex-justify-center w-button"
                    style={
                      ivcTierTwoChoice === val.value ?
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
            {activeTiers?.tier_constant === 'TIER_3' &&
              <div className="flex-row">
                {conditions.map((val) => (
                  <div
                    key={nanoid()}
                    onClick={() => {
                      setTierThreeChoice(val.value); setIVCTierThreeChoice(val.value);
                    }}
                    className="button-secondary button-small margin-right-3 width-1-3 flex-justify-center w-button"
                    style={
                      ivcTierThreeChoice === val.value ?
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


            <div style={{marginTop: '10px'}} className="fafafa rounded-large flex-space-between flex-row-middle padding-3">
              <div className="text-small text-color-body-text">
                Company&apos;s answer
              </div>
              <h4 style={{color: '#526CDB', lineHeight: '21px'}} className="flex-row">

                {companyChoice?.map((x) => x.value === 'FULLY_MET'
                  ? 'Fully Met' :
                  x.value === 'NOT_MET'
                    ? 'Not Met' :
                    x.value === 'PARTLY_MET'
                      ? 'Partly Met' :
                      x.value === 'MOSTLY_MET'
                        ? 'Mostly Met' :
                        x.value === []
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
  cycle: propTypes.any,
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
  ivcTierOneChoice: propTypes.any,
  setIVCTierOneChoice: propTypes.any,
  ivcTierTwoChoice: propTypes.any,
  setIVCTierTwoChoice: propTypes.any,
  ivcTierThreeChoice: propTypes.any,
  setIVCTierThreeChoice: propTypes.any,
};

export default Descriptor;
