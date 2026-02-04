import React, {useState} from 'react';
import DatePicker from 'react-datepicker';
import propTypes from 'prop-types';
import Loader from 'components/circular-loader';
import 'styles/webflow.css';
import 'styles/mfi-tns.webflow.css';
import 'styles/normalize.css';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Container,
  Flex,
  Spacer,
  Text,
  Badge,
  Divider,
  Box,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useToast
} from '@chakra-ui/react';
// import productData from 'Dummie/productData';
// import ProductTestingScores from 'assets/images/Product-Testing-Scores-Graph.svg';
import ChevronLeft from 'assets/images/Chevron-Left.svg';
import {request} from 'common';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import {nanoid} from '@reduxjs/toolkit';


/**
 * Displays the product testing scores for a selected brand and allows adding new test results.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.productTest - Object containing product test data across brands.
 * @param {Object} props.uniqueBrands - Object for the specific brand whose tests are being viewed.
 * @param {string} props.cycle - Current cycle ID for the assessment.
 * @returns {JSX.Element} React component with UI for viewing and adding product test scores.
 */
const ProductModalHeader = ({productTest, uniqueBrands, cycle}) => {
  console.log('productTest', productTest);
  console.log('produuniqueBrandsctTest', uniqueBrands);
  const {isOpen, onOpen, onClose} = useDisclosure();
  const {isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose} = useDisclosure();
  // State to store the selected sample production date
  const [startDate, setStartDate] = useState(new Date());
  // State to store the selected sample expiry date
  const [expiryDate, setExpiryDate] = useState(new Date());
  // State to store the sample collector's name
  const [sampleCollectorName, setSampleCollectorName] = useState('');
  // State to store the sample collector's location
  const [sampleCollectorLocation, setSampleCollectorLocation] = useState('');
  // State to store the sample batch number
  const [sampleBatchNumber, setSampleBatchNumber] = useState('');
  // State to store the sample size (SKU)
  const [sampleSize, setSampleSize] = useState('');
  // State to store the unique code for the sample
  const [uniqueCode, setUniqueCode] = useState('');
  // State to track loading status for async actions
  const [loading, setLoading] = useState(false);
  // State to store the currently selected product for viewing
  const [selectedProduct, setSelectedProduct] = useState(null);
  // State to toggle the delete confirmation dialog
  const [show, setShow] = useState(false);

  // State to store Edible Oil micronutrient values
  const [edibleOil, setEdibleOil] = useState(
    [
      {
        product_micro_nutrient_id: '7mSmpeSgAiNWtiHsFYA4',
        value: '0'
      }
    ]
  );
  // State to store Sugar micronutrient values
  const [sugar, setSugar] = useState(
    [
      {
        product_micro_nutrient_id: 'BdOZO7wsVByewd76PH9u',
        value: '0'
      }
    ]
  );
  // State to store Flour micronutrient values
  const [flour, setFlour] = useState(
    [
      {
        product_micro_nutrient_id: 'NFxS5G55y8bSEb9EAXiY',
        value: '0'
      },
      {
        product_micro_nutrient_id: 'GEoUqeEWidzICSKdL8RL',
        value: '0'
      },
      {
        product_micro_nutrient_id: 'BNICV0pZlpH2ZOzxJyAh',
        value: '0'
      },
    ]
  );


  // const [newEdibleOil, setNewEdibleOil] = useState();
  // const [newSugar, setNewSugar] = useState();
  // const [newFlour, setNewFlour] = useState();

  const toast = useToast();

  // const brands = productTest?.brands?.map((brand) => brand.productTests);
  // const fortify = brands[0][0] === undefined ? '' : brands[0][0];
  // const complyStatus = fortify.results?.map((x) => x.percentage_compliance);

  /**
   * Handles change events for Sugar micronutrient values
   * @param {Object} evt - Event object from the input
   */
  const onInputChangeSugar = (evt) => {
    const newArr = [...sugar];
    const value = evt.target.value;
    newArr[evt.target.dataset.id][evt.target.name] = value;
    setSugar(newArr);
    // setNewSugar(newArr.map((x) => x.value));
    // setNewEdibleOil('0');
    // setNewFlour('0');
  };

  /**
   * Handles change events for Edible Oil micronutrient values
   * @param {Object} evt - Event object from the input
   */
  const onInputChangeEdibleOil = (evt) => {
    const newArr = [...edibleOil];
    const value = evt.target.value;
    newArr[evt.target.dataset.id][evt.target.name] = value;
    setEdibleOil(newArr);
    // setNewEdibleOil(newArr.map((x) => x.value));
    // setNewSugar('0');
    // setNewFlour('0');
  };

  /**
   * Handles change events for Flour micronutrient values
   * @param {Object} evt - Event object from the input
   */
  const onInputChangeFlour = (evt) => {
    const newArr = [...flour];
    const value = evt.target.value;
    newArr[evt.target.dataset.id][evt.target.name] = value;
    setFlour(newArr);
    // setNewFlour(newArr.map((x) => x.value));
    // setNewSugar('0');
    // setNewEdibleOil('0');
  };

  /**
   * Submits a new product test score for the selected brand.
   * Builds request body and sends POST request to API.
   *
   * @returns {Promise<void>}
   */
  const setProductTestingScore = async () => {
    setLoading(true);
    try {
      const companyId = productTest?.brands.map((x) => x.company_id);
      // const cycleId = productTest?.brands.map((x) => x.productTests.map((x) => x.results.map((x) => x.cycle_id)));
      // const microNutrientId = productTest?.brands.map((x) => x.productTests.map((x) => x.results.map((x) => x.microNutrient.id)));

      const body = {
        unique_code: uniqueCode,
        sample_batch_number: sampleBatchNumber,
        brand_id: uniqueBrands.id,
        sample_collector_names: sampleCollectorName,
        sample_production_date: startDate,
        sample_size: sampleSize,
        cycle_id: cycle,
        scores: (uniqueBrands.productType.name === 'Edible Oil') ? edibleOil : (uniqueBrands.productType.name === 'Flour') ? flour : (uniqueBrands.productType.name === 'Sugar') ? sugar : '',
        company_id: companyId[0],
        sample_collection_location: sampleCollectorLocation,
        sample_product_expiry_date: expiryDate
      };

      await request(true).post(`companies/${companyId[0]}/products-tests`, body);
      setLoading(false);
      setTimeout(() => {
        location.reload();
      }, 1000);
      return toast({
        status: 'success',
        title: 'Success',
        position: 'top-right',
        description: 'Product Test Added Successfully',
        duration: 10000,
        isClosable: true,
      });
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
   * Deletes a product test result by micronutrient ID.
   *
   * @param {string} id - ID of the product test.
   * @param {string} microid - ID of the micronutrient.
   * @returns {Promise<void>}
   */
  const deleteMicronutrientScore = async (id, microid) => {
    try {
      await request(true).delete(`admin/micronutrient/${id}/${microid}`);
      setTimeout(() => {
        location.reload();
      }, 1000);
      return toast({
        status: 'success',
        title: 'Success',
        position: 'top-right',
        description: 'Product Test Deleted Successfully',
        duration: 10000,
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


  // Main component rendering structure including score history and modal forms
  return (
    <div className="text-medium m-4"><h1 className="my-4">Product Testing Details <span className="text-color-body-text">- Scores</span></h1>

      <div className="w-layout-grid grid">
        <div className="flex-row-middle flex-align-start">
          <div className="background-color-white border-1px box-shadow-large rounded-large w-full">
            <div className="flex-row-middle flex-space-between padding-5">
              <div>
                <h6 className="margin-bottom-0 weight-medium margin-bottom-1">Product Testing Scores</h6>
                <div className="text-small text-color-body-texpt">{uniqueBrands.name}</div>
              </div>
              <div>
                <Button className="button-secondary button-small margin-right-3 w-button focus:outline-none" onClick={onOpen}>Add Score</Button>
              </div>
            </div>
            <div data-duration-in="300" data-duration-out="100" className="w-tabs">
              <div>
                <Tabs className="w-tabs">
                  <TabList className="padding-x-10 border-bottom-1px flex-row-middle background-color-white sticky-top-0 flex-space-around w-tab-menu">
                    <Tab className="tab-link w-inline-block w-tab-link focus:outline-none">
                      <div className="text-small">Scores</div>
                    </Tab>
                  </TabList>

                  <TabPanels className="w-tab-content">
                    <TabPanel>

                      {uniqueBrands.productTests.map((brand) => (
                        <>
                          <Container bgColor="#FAFAFA" height="10rem" p="1rem" my=".75rem">

                            <Flex alignItems="center">
                              <Text fontFamily="DM Sans" fontSize="1rem" fontWeight="500" color="#1E1F24">

                                {moment(brand?.results[0]?.created_at).format('MMMM Do YYYY')}
                              </Text>
                              <Spacer />


                              <Badge borderRadius=".25rem" className="padding-x-3 padding-y-2 rounded-large"
                                bgColor={brand?.fortification?.message === 'Fully Fortified' ? 'rgba(82, 108, 219, 0.1)' :
                                  brand?.fortification?.message === 'Adequately Fortified' ? 'rgba(82, 108, 219, 0.1)' : 'rgba(44, 42, 100, 0.03)'} >
                                <Flex alignItems="center">
                                  <Text className="text-small text-color-body-text weight-medium" textTransform="capitalize">

                                    {
                                      brand?.results.map((x) => x.percentage_compliance).every((el) => el >= 99) ? 'Fully Fortified' : brand?.results.map((x) => x.percentage_compliance).every((el) => el >= 80) ? 'Adequately Fortified' :
                                        brand?.results.map((x) => x.percentage_compliance).some((el) => el >= 51) ? 'Partly Fortified' : brand?.results.map((x) => x.percentage_compliance).some((el) => el >= 31) ? 'Inadequately Fortified' :
                                          brand?.results.map((x) => x.percentage_compliance).some((el) => el <= 30) ? 'Not Fortified' : ''}

                                  </Text>
                                </Flex>
                              </Badge>
                              <div onClick={() => {
                                setSelectedProduct(brand);
                              }} className="flex justify-end" style={{marginLeft: '5px'}}>
                                <Button className="button-secondary button-small margin-right-3 w-button focus:outline-none" onClick={onViewOpen}>History</Button>
                              </div>
                              <div className="flex justify-end" style={{marginLeft: '2px'}}>
                                <Button onClick={() => setShow(!show)} className="button-secondary button-small margin-right-3 w-button focus:outline-none red">X</Button>
                              </div>

                            </Flex>
                            <Divider my="0.75rem" />
                            <Flex>
                              {brand?.results?.map((nutrient) => (
                                <Box key={nanoid()} style={{marginRight: '25px'}}>
                                  <>
                                    <Text
                                      fontFamily="DM Sans"
                                      fontSize=".875rem"
                                      mb=".35rem"
                                      fontWeight="500"
                                      color="rgba(28, 29, 38, 0.6)" className="text-small"

                                    >
                                      {nutrient?.microNutrient?.name}
                                    </Text>

                                    <Text fontFamily="DM Sans" className="text-medium text-color-blue">
                                      {nutrient?.value}
                                    </Text>
                                  </>
                                </Box>
                              ))}
                              <Spacer />
                            </Flex>
                            <div
                              style={{top: '0', left: '0'}}
                              data-w-id="96da7984-2260-4962-0d48-c3b889abade4"
                              className={`background-color-white border-1px padding-top-4 box-shadow-large rounded-large width-80 remove-dropdown ${show ? '' : 'hide'
                              }`}
                            >
                              <h6 className="padding-left-4">Are you sure?</h6>
                              <div className="text-small margin-bottom-4 padding-left-4">This data cannot be recovered</div>
                              <div className="flex-row flex-space-between">
                                <div className="padding-y-3 padding-x-4 flex-justify-end background-secondary">
                                  <a
                                    onClick={() => setShow(!show)}
                                    className="button-primary button-small w-button"
                                  >
                                    Cancel
                                  </a>
                                </div>
                                <div className="padding-y-3 padding-x-4 flex-justify-end background-secondary">
                                  {loading ? (
                                    <Loader />
                                  ) : (
                                    <a
                                      onClick={(event) => {
                                        event.preventDefault();
                                        deleteMicronutrientScore(brand.id, brand.results[0].id);
                                      }}
                                      href="#!"
                                      className="button-danger button-small w-button"
                                    >
                                      Confirm remove
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Container>

                        </>
                      ))}
                    </TabPanel>

                  </TabPanels>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for viewing existing product test details */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <div className="background-color-white border-1px box-shadow-large rounded-large width-128 h-screen overflow-scroll">
            <ModalHeader>
              <Container>
                <Flex>
                  <Button className="background-secondary-2 padding-y-2 padding-x-3 rounded-large" onClick={onViewClose}>
                    <img src={ChevronLeft} width="16" alt="chevron left" className="margin-right-1" />
                    <p className="text-small"> Back </p>
                  </Button>
                  {/* <Spacer /> */}
                  <Text className="margin-top-2" fontFamily="DM Sans" fontSize="1rem" color="#030303">
                    <h6 className="margin-bottom-0 weight-medium margin-bottom-1 ml-20">View Scores</h6>
                  </Text>
                </Flex>
                <Box my="1rem">
                  <FormControl id="collector">
                    <FormLabel color="#1e1f24" fontSize="0.875rem" fontFamily="DM Sans">Sample Collector Name(s) </FormLabel>
                    <Input
                      type="text"
                      border="1px solid rgba(29, 28, 54, 0.1)"
                      borderRadius="6px"
                      fontSize="14px"
                      height="3.25rem"
                      className="form-input w-input"
                      disabled
                      value={selectedProduct?.sample_collector_names}
                    />
                  </FormControl>

                  <FormControl id="location" my="0.5rem">
                    <FormLabel
                      color="#1e1f24"
                      fontSize="0.875rem"
                      fontFamily="DM Sans">Sample Collector Location(s) </FormLabel>
                    <Input
                      type="text"
                      border="1px solid rgba(29, 28, 54, 0.1)"
                      borderRadius="6px"
                      fontSize="14px"
                      height="3.25rem"
                      className="form-input w-input"
                      disabled
                      value={selectedProduct?.sample_collection_location}
                    />
                  </FormControl>

                  <div className="w-layout-grid grid-4">
                    <div>
                      <label htmlFor="email-4" className="form-label">Sample Batch Number(s)</label>
                      <input
                        type="text"
                        className="form-input w-input"
                        maxLength="256"
                        name="email-3"
                        data-name="Email 3"
                        placeholder=""
                        id="email-3"
                        required=""
                        disabled
                        value={selectedProduct?.sample_batch_number}
                      />
                    </div>
                    <div>
                      <label htmlFor="email-4" className="form-label">Sample Size (SKU)</label>
                      <input
                        type="text"
                        className="form-input w-input"
                        maxLength="256"
                        name="email-3"
                        data-name="Email 3"
                        placeholder=""
                        id="email-3"
                        required=""
                        disabled
                        value={selectedProduct?.sample_size}
                      />
                    </div>
                  </div>

                  <div className="w-layout-grid grid-4">
                    <div><label htmlFor="email-4" className="form-label">Sample Production Date(s)
                    </label>
                    <DatePicker
                      selected={startDate}
                      disabled
                      className="form-input date-picker w-input"
                      value={moment(selectedProduct?.sample_production_date).format('MM/DD/YYYY')}
                    />
                    </div>

                    <div>
                      <label htmlFor="email-4" className="form-label">Sample Product Expiry Date(s)</label>
                      <DatePicker
                        selected={expiryDate}
                        disabled
                        className="form-input date-picker w-input"
                        value={moment(selectedProduct?.sample_product_expiry_date).format('MM/DD/YYYY')}
                      />
                    </div>
                  </div>

                  <FormControl id="location" my="0.5rem">
                    <FormLabel color="#1e1f24" fontSize="0.875rem" fontFamily="DM Sans">Unique Code </FormLabel>
                    <Input
                      type="text"
                      border="1px solid rgba(29, 28, 54, 0.1)"
                      borderRadius="6px"
                      fontSize="14px"
                      height="3.25rem"
                      className="form-input w-input"
                      disabled
                      value={selectedProduct?.unique_code}
                    />
                  </FormControl>
                </Box>


              </Container>
              <div className="padding-y-3 padding-x-4 flex-justify-end background-secondary rounded-large bottom sticky-bottom-0 border-top-1px">
                <a onClick={onViewClose} href="#" className="button-secondary button-small margin-right-3 w-button">Cancel</a>

              </div>
            </ModalHeader>

            <ModalCloseButton style={{position: 'absolute', right: '0', background: '#fff', borderRadius: '50%', left: '100%'}} className="box-shadow-large" />
          </div>
        </ModalContent>
      </Modal>
      {/* Modal for adding new product test scores */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <div className="background-color-white border-1px box-shadow-large rounded-large width-128 h-screen overflow-scroll">
            <ModalHeader>
              <Container>
                <Flex>
                  <Button className="background-secondary-2 padding-y-2 padding-x-3 rounded-large" onClick={onClose}>
                    <img src={ChevronLeft} width="16" alt="chevron left" className="margin-right-1" />
                    <p className="text-small"> Back </p>
                  </Button>
                  {/* <Spacer /> */}
                  <Text className="margin-top-2" fontFamily="DM Sans" fontSize="1rem" color="#030303">
                    <h6 className="margin-bottom-0 weight-medium margin-bottom-1 ml-20">Add Scores</h6>
                  </Text>
                </Flex>
                <Box my="1rem">
                  <FormControl id="collector">
                    <FormLabel color="#1e1f24" fontSize="0.875rem" fontFamily="DM Sans">Sample Collector Name(s) </FormLabel>
                    <Input
                      type="text"
                      border="1px solid rgba(29, 28, 54, 0.1)"
                      borderRadius="6px"
                      fontSize="14px"
                      height="3.25rem"
                      className="form-input w-input"
                      onChange={(e) => setSampleCollectorName(e.target.value)}
                    />
                  </FormControl>

                  <FormControl id="location" my="0.5rem">
                    <FormLabel
                      color="#1e1f24"
                      fontSize="0.875rem"
                      fontFamily="DM Sans">Sample Collector Location(s) </FormLabel>
                    <Input
                      type="text"
                      border="1px solid rgba(29, 28, 54, 0.1)"
                      borderRadius="6px"
                      fontSize="14px"
                      height="3.25rem"
                      className="form-input w-input"
                      onChange={(e) => setSampleCollectorLocation(e.target.value)}
                    />
                  </FormControl>

                  <div className="w-layout-grid grid-4">
                    <div>
                      <label htmlFor="email-4" className="form-label">Sample Batch Number(s)</label>
                      <input
                        type="text"
                        className="form-input w-input"
                        maxLength="256"
                        name="email-3"
                        data-name="Email 3"
                        placeholder=""
                        id="email-3"
                        required=""
                        onChange={(e) => setSampleBatchNumber(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="email-4" className="form-label">Sample Size (SKU)</label>
                      <input
                        type="text"
                        className="form-input w-input"
                        maxLength="256"
                        name="email-3"
                        data-name="Email 3"
                        placeholder=""
                        id="email-3"
                        required=""
                        onChange={(e) => setSampleSize(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="w-layout-grid grid-4">
                    <div><label htmlFor="email-4" className="form-label">Sample Production Date(s)
                    </label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      className="form-input date-picker w-input"
                    />
                    </div>

                    <div>
                      <label htmlFor="email-4" className="form-label">Sample Product Expiry Date(s)</label>
                      <DatePicker
                        selected={expiryDate}
                        onChange={(date) => setExpiryDate(date)}
                        className="form-input date-picker w-input"
                      />
                    </div>
                  </div>

                  <FormControl id="location" my="0.5rem">
                    <FormLabel color="#1e1f24" fontSize="0.875rem" fontFamily="DM Sans">Unique Code </FormLabel>
                    <Input
                      type="text"
                      border="1px solid rgba(29, 28, 54, 0.1)"
                      borderRadius="6px"
                      fontSize="14px"
                      height="3.25rem"
                      className="form-input w-input"
                      onChange={(e) => setUniqueCode(e.target.value)}
                    />
                  </FormControl>


                  {uniqueBrands.productType.name === 'Edible Oil' &&
                    <Box>
                      <div className="padding-bottom-6 border-bottom-1px"><label htmlFor="email-4" className="form-label">Edible Oil MicroNutrients</label>
                        <div className="w-layout-grid grid-4-columns padding-4 rounded-large background-secondary">
                          {edibleOil?.map((item, i) => (

                            <div style={{width: '70px'}} key={i}>
                              <label htmlFor="value" className="form-label small">Vitamin A</label>


                              <input
                                style={{width: '90px'}}
                                type="text"
                                className="form-input margin-bottom-0 w-input"
                                name="value"
                                placeholder=""
                                required=""
                                data-id={i}
                                value={item.value === 0 ? '' : item.value}
                                onChange={onInputChangeEdibleOil}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </Box>
                  }


                  {uniqueBrands.productType.name === 'Sugar' &&
                    <Box>
                      <div className="padding-bottom-6 border-bottom-1px"><label htmlFor="email-4" className="form-label">Sugar MicroNutrients</label>
                        <div className="w-layout-grid grid-4-columns padding-4 rounded-large background-secondary">
                          {sugar?.map((item, i) => (
                            <div style={{width: '70px'}} key={i}>
                              <label htmlFor="value" className="form-label small">Vitamin A</label>
                              <input
                                style={{width: '90px'}}
                                type="text"
                                className="form-input margin-bottom-0 w-input"
                                name="value"
                                placeholder=""
                                required=""
                                data-id={i}
                                value={item.value === 0 ? '' : item.value}
                                onChange={onInputChangeSugar}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </Box>
                  }


                  {uniqueBrands.productType.name === 'Flour' &&
                    <Box>
                      <div className="padding-bottom-6 border-bottom-1px"><label htmlFor="email-4" className="form-label">Flour MicroNutrients</label>
                        <div className="w-layout-grid grid-4-columns padding-4 rounded-large background-secondary">
                          {flour?.map((item, i) => (
                            <div style={{width: '70px'}} key={i}>
                              <label htmlFor="value" className="form-label small">
                                {i === 0
                                  ? 'Vitamin A' : i === 1
                                    ? 'Vitamin B3' : i === 2
                                      ? 'Iron' : ''}
                              </label>
                              <input
                                style={{width: '90px'}}
                                type="text"
                                className="form-input margin-bottom-0 w-input"
                                name="value"
                                placeholder=""
                                required=""
                                data-id={i}
                                value={item.value === 0 ? '' : item.value}
                                onChange={onInputChangeFlour}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </Box>
                  }
                </Box>


              </Container>
              <div className="padding-y-3 padding-x-4 flex-justify-end background-secondary rounded-large bottom sticky-bottom-0 border-top-1px">
                <a onClick={onClose} href="#" className="button-secondary button-small margin-right-3 w-button">Cancel</a>
                <button onClick={setProductTestingScore} className="button button-small w-button">Save</button>
              </div>
            </ModalHeader>

            <ModalCloseButton style={{position: 'absolute', right: '0', background: '#fff', borderRadius: '50%', left: '100%'}} className="box-shadow-large" />
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

ProductModalHeader.propTypes = {

  productTest: propTypes.any,
  uniqueBrands: propTypes.any,
  cycle: propTypes.any
};

export default ProductModalHeader;
