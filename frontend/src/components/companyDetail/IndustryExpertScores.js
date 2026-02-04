import React, {useState} from 'react';
import propTypes from 'prop-types';
import {useDisclosure, Box} from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  useToast,
  Flex,
  Spinner
} from '@chakra-ui/react';
import 'styles/webflow.css';
import 'styles/mfi-tns.webflow.css';
import 'styles/normalize.css';
import IndustryModalHeader from './IndustryModalHeader';

import {request} from 'common';

/**
 * Component that displays and manages Industry Expert Group (IEG) scores for a company during a specific cycle.
 * Allows admins to view historical scores or input new ones via modals.
 *
 * @param {Object} props - Component props.
 * @param {Array} props.score - Array of historical score objects.
 * @param {Object} props.company - The company object, including ID and brand metadata.
 * @param {string} props.cycle - ID of the current assessment cycle.
 * @returns {JSX.Element} The rendered scoring interface with view and edit modals.
 */
const IndustryExpertScores = ({score, company, cycle}) => {
  // Extract the company ID from the passed-in company object
  const companyId = company.id;// company?.brands.map((x) => x.company_id);
  const {isOpen, onOpen, onClose} = useDisclosure();
  const {isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose} = useDisclosure();
  const [, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [weightedScore, setWeightedScore] = useState(0);
  // Initialize local score state with category IDs and weights
  const [scores, setScores] = useState([
    {
      company_id: companyId,
      category_id: 'cLAomX2miF601colFBvC',
      cycle_id: cycle,
      type: 'IEG',
      value: 0,
      weight: 23
    },
    {
      company_id: companyId,
      category_id: 'Q9fYFc9CfTb9GIuJ1U0j',
      cycle_id: cycle,
      type: 'IEG',
      value: 0,
      weight: 20
    },
    {
      company_id: companyId,
      category_id: '1nct2tfnXhO3JDtJ27qn',
      cycle_id: cycle,
      type: 'IEG',
      value: 0,
      weight: 15
    },
    {
      company_id: companyId,
      category_id: 'DDjEmOJlIbpkwOXgW5hq',
      cycle_id: cycle,
      type: 'IEG',
      value: 0,
      weight: 17
    },
    {
      company_id: companyId,
      category_id: '3dUyBma0JsHXcRPdwNyi',
      cycle_id: cycle,
      type: 'IEG',
      value: 0,
      weight: 25
    }
  ]);


  /**
   * Handles real-time updates to score input fields.
   * @param {Object} evt - Change event triggered from input field.
   */
  const onInputValueChange = (evt) => {
    const newArr = [...scores];
    const value = Number(evt.target.value);
    newArr[evt.target.dataset.id][evt.target.name] = value;
    setScores(newArr);
  };

  const toast = useToast();

  /**
   * Fetches scoring categories from the backend and sets loading state.
   * @returns {Promise<void>}
   */
  const getCategories = async () => {
    setLoading(true);
    try {
      const res = await request(true).get(`/questions/categories/modal`);
      // const scores = await request(true).get(`/admin/assessment-scores?company-id=${company.id}&cycle-id=${cycleId}`);
      // setScores(scores.data);
      setCategories(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return toast({
        status: 'error',
        title: 'Error',
        position: 'top-right',
        description: 'Something went wrong',
        duration: 6000,
        isClosable: true,
      });
    }
  };

  /**
   * Submits updated IEG scores to the backend.
   * @param {Object} e - Form submission event.
   * @returns {Promise<void>}
   */
  const setIEGScores = async (e) => {
    e.preventDefault();
    try {
      const toSend = [];
      for (let i = 0; i < scores.length; i++) {
        const tr = {
          company_id: scores[i].company_id,
          category_id: scores[i].category_id,
          cycle_id: cycle,
          type: 'IEG',
          value: scores[i].value,
          weight: scores[i].weight
        };
        toSend.push(tr);
      }
      await request(true).post(`assessments/ieg`, toSend);
      // setScores(res.data);
      return toast({
        status: 'success',
        title: 'Success',
        position: 'top-right',
        description: '',
        duration: 6000,
        isClosable: true,
      });
    } catch (error) {
      return toast({
        status: 'error',
        title: 'Error',
        position: 'top-right',
        description: 'Something went wrong',
        duration: 6000,
        isClosable: true,
      });
    }
  };

  /**
   * Filters out duplicate items in an array of score objects based on a category key.
   * @param {Array} score - Array of score objects.
   * @param {string} key - The nested key inside category to deduplicate by.
   * @returns {Array} A deduplicated array of score objects.
   */
  const unique = function getUniqueListBy(score, key) {
    return [...new Map(score?.map((item) => [item.category[key], item])).values()];
  };

  const arr1 = unique(score, 'description');

  return (
    <Box fontFamily="DM Sans">
      <div className="flex flex-row-middle flex-align-baseline width-full tablet-flex-column">
        <div className="flex-child-grow tablet-width-full" >
          <div className="width-full">

            <div className="flex-justify-end margin-bottom-4 items-center tablet-width-full portrait-flex-justify-start">
              {/* Display the total aggregated IEG score */}
              <div className="text-small margin-right-4 flex-child-grow portrait-width-full portrait-margin-right-0">
                {((arr1.reduce((accum, item) => accum + item.score, 0))).toFixed(2)}%</div>
              {/* Trigger to fetch categories and open input modal */}
              <div onClick={getCategories} className="flex justify-end">
                <button className="button-secondary button-small margin-right-3 w-button" onClick={onOpen}> Edit </button>
              </div>
            </div>

            <div className="flex-justify-end margin-bottom-4 items-center tablet-width-full portrait-flex-justify-start">

              {/* Trigger to open history modal showing past IEG scores */}
              <div className="flex justify-end">
                <button className="button-secondary button-small margin-right-3 w-button" onClick={onViewOpen}> View History </button>
              </div>
            </div>
          </div>
        </div>
        <Modal isOpen={isViewOpen} onClose={onViewClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <div className="background-color-white border-1px box-shadow-large rounded-large width-128 h-screen overflow-scroll">
              <IndustryModalHeader title="IEG Scores History" />
              {loading ? (
                <Flex height="100%" width="100%" mb="10" justifyContent="center" alignItems="center">
                  <Spinner />
                </Flex>
              ) : score?.map((item, i) => (
                // Render score form for each category in the modal
                <div key={item.id}>
                  <ModalBody >
                    <Box fontFamily="DM Sans" >
                      <div className="padding-bottom-6 border-bottom-1px w-form">
                        <form>
                          <div className="text-base weight-medium margin-bottom-2">
                            {item.category.name}
                          </div>
                          <p className="text-small text-color-body-text">
                            {item.category.name}
                          </p>
                          <div>
                            <div className="w-layout-grid grid-3-columns padding-4 rounded-large background-secondary margin-top-5">
                              <div>
                                <label htmlFor="email-4" className="form-label small">Weighting(%)</label>
                                <input
                                  type="text"
                                  className="form-input margin-bottom-0 w-input"
                                  disabled
                                  maxLength="256"
                                  placeholder="20%"
                                  value={`${item.weight}%`}
                                />
                              </div>
                              <div>
                                <label htmlFor="email-4" className="form-label small">Scores</label>
                                <input
                                  type="number"
                                  className="form-input margin-bottom-0 w-input"
                                  maxLength="256"
                                  placeholder=""
                                  required=""
                                  name="value"
                                  value={item.value === 0 ? '' : item.value}
                                  data-id={i}
                                  disabled
                                  autoFocus
                                />
                              </div>
                              <div>
                                <label htmlFor="email-4" className="form-label small">Weighted</label>
                                <input
                                  type="text"
                                  className="form-input margin-bottom-0 w-input"
                                  disabled
                                  placeholder="20%"
                                  required=""
                                  value={`${item.value*(item.weight/100)}%`}
                                />
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </Box>
                  </ModalBody>
                </div>
              ))}
              <ModalFooter className="padding-y-3 padding-x-4 flex-justify-end background-secondary border-top-1px rounded-large bottom sticky-bottom-0">
                <div >
                  <a href="#" className="button-secondary button-small margin-right-3 w-button">Close</a>
                </div>
              </ModalFooter>
            </div>
          </ModalContent>
        </Modal>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <div className="background-color-white border-1px box-shadow-large rounded-large width-128 h-screen overflow-scroll">
              <IndustryModalHeader title="Input IEG Scores" />
              {loading ? (
                <Flex height="100%" width="100%" mb="10" justifyContent="center" alignItems="center">
                  <Spinner />
                </Flex>
              ) : scores?.map((item, i) => (
                // Render score form for each category in the modal
                <div key={item.id}>
                  <ModalBody >
                    <Box fontFamily="DM Sans" >
                      <div className="padding-bottom-6 border-bottom-1px w-form">
                        <form>
                          <div className="text-base weight-medium margin-bottom-2">
                            {i === 0 ? 'Personnel'
                              : i === 1 ? 'Production'
                                : i === 2 ? 'Procurement & Suppliers'
                                  : i === 3 ? 'Public Engagement'
                                    : i === 4 ? 'Governance' : ''
                            }
                          </div>
                          <p className="text-small text-color-body-text">
                            {i === 0 ? 'Personnel'
                              : i === 1 ? 'Production'
                                : i === 2 ? 'Procurement & Suppliers'
                                  : i === 3 ? 'Public Engagement'
                                    : i === 4 ? 'Governance' : ''
                            }
                          </p>
                          <div>
                            <div className="w-layout-grid grid-3-columns padding-4 rounded-large background-secondary margin-top-5">
                              <div>
                                <label htmlFor="email-4" className="form-label small">Weighting(%)</label>
                                <input
                                  type="text"
                                  className="form-input margin-bottom-0 w-input"
                                  disabled
                                  maxLength="256"
                                  placeholder="20%"
                                  value={`${item.weight}%`}
                                />
                              </div>
                              <div>
                                <label htmlFor="email-4" className="form-label small">Scores</label>
                                <input
                                  type="number"
                                  className="form-input margin-bottom-0 w-input"
                                  maxLength="256"
                                  placeholder=""
                                  required=""
                                  name="value"
                                  value={item.value === 0 ? '' : item.value}
                                  data-id={i}
                                  onChange={onInputValueChange}
                                  autoFocus
                                />
                              </div>
                              <div>
                                <label htmlFor="email-4" className="form-label small">Weighted</label>
                                <input
                                  type="text"
                                  className="form-input margin-bottom-0 w-input"
                                  disabled
                                  placeholder="20%"
                                  required=""
                                  value={`${item.value*(item.weight/100)}%`}
                                />
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </Box>
                  </ModalBody>
                </div>
              ))}
              <ModalFooter className="padding-y-3 padding-x-4 flex-justify-end background-secondary border-top-1px rounded-large bottom sticky-bottom-0">
                <div>
                  <a href="#" className="button-secondary button-small margin-right-3 w-button">Cancel</a>
                  <button disabled={loading === true} onClick={setIEGScores} className="button button-small w-button">Save</button>
                </div>
              </ModalFooter>
            </div>
          </ModalContent>
        </Modal>
      </div>
    </Box>
  );
};

IndustryExpertScores.propTypes = {
  score: propTypes.any,
  company: propTypes.any,
  cycle: propTypes.any,
};

export default IndustryExpertScores;
