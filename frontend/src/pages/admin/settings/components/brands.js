import React, {useEffect, useState} from 'react';
import {Stack, Text, CloseButton, Flex, useToast, Spinner, Switch} from '@chakra-ui/react';
// import {nanoid} from '@reduxjs/toolkit';
import {request} from 'common';
import PropTypes from 'prop-types';
import Loader from 'components/circular-loader';

/**
 * Brands component manages the creation, updating, and deletion of company brands.
 * It renders existing brands, allows adding new ones, and communicates with the backend
 * to persist changes. Includes UI controls for brand name and food vehicle assignment.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string|number} props.companyId - ID of the company for which brands are managed
 * @returns {JSX.Element} Rendered form and list interface for brand management
 */
const Brands = ({companyId}) => {
  // Local state for storing new brand inputs before submission
  const [inputValue, setInputValue] = useState([
    {
      'name': '',
      'product-type': '',
      'active': true
    },
  ]);
  // Toggle visibility of delete confirmation modal
  const [show, setShow] = useState(false);

  // List of available product types fetched from the backend
  const [productList, setProductList] = useState([]);
  // List of existing brands fetched from the backend
  const [brandList, setBrandList] = useState([
    {
      id: '',
      updated_at: '',
      product_type: '',
      created_at: '',
      company_id: '',
      name: '',
      active: true
    }
  ]);
  // Flag for loading spinner while fetching data
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const toast = useToast();
  const [brandID, setBrandID] = useState([]);


  /**
   * Handles changes to input fields for new brands
   * @param {React.ChangeEvent} evt - The input change event
   */
  const onInputValueChange = (evt) => {
    const newArr = [...inputValue];
    const value = evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value;
    newArr[evt.target.dataset.id][evt.target.name] = value;
    setInputValue(newArr);
  };

  // Adds an additional input row for entering a new brand
  const addmember = () => {
    setInputValue([
      ...inputValue,
      {
        'name': '',
        'product-type': '',
        'active': true
      },
    ]);
  };

  useEffect(() => {
    // Fetch list of product types on component mount
    const fetchProductTypesList = () => {
      return request()
        .get('/product-type-list')
        .then(({data: list}) => {
          setProductList(list);
          return list;
        });
    };
    fetchProductTypesList();
  }, []);
  useEffect(() => {
    // Fetch list of existing brands for the company on component mount
    setLoading(true);
    const fetchBrandList = () => {
      return request(true)
        .get(`admin/brands-admin?company-id=${companyId}`)
        .then((resp) => {
          setBrandList(resp.data.data);
          setLoading(false);
        });
    };
    fetchBrandList();
  }, []);

  /**
   * Removes a new brand input row at specified index
   * @param {number} i - Index of brand input to remove
   */
  const removeMember = (i) => {
    const array = [...inputValue];
    array.splice(i, 1);
    setInputValue([...array]);
  };

  /**
   * Sends request to backend to create and update brands for the company
   * @returns {Promise<void>}
   */
  const addBrands = async () => {
    try {
      const body = {
        'brands-create': inputValue.splice(1)
      };

      // console.log('inputValue', body['brands-create'].map((x) => x.name));
      // if (body['brands-create'].map((x) => x.name) === [0]['']) {
      //   alert('field cannot be empty');
      // }
      const updateBody = {
        'brands-update': brandList.map((x) => {
          return {
            'id': x.id,
            'name': x.name,
            'product-type': x.product_type,
            'active': x.active
          };
        })
      };
      setSpinning(true);
      // Request to Create brand
      await request(true)
        .post(`company/brands?company-id=${companyId}`, body);
      setSpinning(false);
      // Request to Update brand
      await request(true)
        .post(`company/brands?company-id=${companyId}`, updateBody);
      setSpinning(false);

      return toast({
        status: 'success',
        title: 'Success',
        position: 'top-right',
        description: 'Brand(s) Added Successfully',
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
   * Stores ID of brand to be deleted
   * @param {Object} id - Brand object to be deleted
   */
  const getBrandID = (id) => {
    setBrandID(id);
  };


  /**
   * Sends request to delete selected brand
   * @returns {Promise<void>}
   */
  const removeBrands = async () => {
    console.log(brandID);
    try {
      const body = {
        'brands-delete': [brandID.id]
      };
      await request(true)
        .post(`company/brands?company-id=${companyId}`, body);

      return toast({
        status: 'success',
        title: 'Success',
        position: 'top-right',
        description: 'Brand(s) Deleted Successfully',
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

  // Main container for the brand management UI
  return (
    <Stack className="padding-x-10 padding-y-10 w-container">
      <Text className="text-align-left" mb={4} fontSize="20px" fontWeight="700">
        Manage Company Brands
      </Text>
      {/* Display Registered Brands */}
      <Stack mb={10}>
        {
          loading ? (
            <Flex height="100%" width="100%" mb="10" justifyContent="center" alignItems="center">
              <Spinner />
            </Flex>
          ) :
            brandList?.map((x, i) =>
              <Stack key={i}>
                <Flex mb={5}>
                  <Stack mr={2}>
                    <Switch alignSelf="center" colorScheme="green" defaultChecked={x.active} onChange={(e) => {
                      const active = e.target.checked;
                      setBrandList((currentBrand) =>
                        currentBrand.map((cur) =>
                          cur.id === x.id
                            ? {
                                ...cur,
                                active
                              } : cur
                        )
                      );
                    }
                    } />
                  </Stack>
                  <Stack mr={3}>

                    <label htmlFor="name" className="form-label">
                      Brand {i + 1} name
                    </label>
                    <input
                      className="form-input small w-input"
                      onChange={(e) => {
                        const name = e.target.value;
                        setBrandList((currentBrand) =>
                          currentBrand.map((cur) =>
                            cur.id === x.id
                              ? {
                                  ...cur,
                                  name
                                } : cur
                          )
                        );
                      }}
                      value={x.name}
                      name="name"
                      data-id={i}
                    />
                  </Stack>
                  <Stack mr={1}>
                    <label htmlFor="name" className="form-label">
                      Food Vehicle
                    </label>
                    <select
                      name="product-type"
                      className="small w-input"
                      style={{width: 180}}
                      onChange={(e) => {
                        const productType = e.target.value;
                        setBrandList((currentBrand) =>
                          currentBrand.map((cur) =>
                            cur.id === x.id
                              ? {
                                  ...cur,
                                  product_type: productType
                                } : cur
                          )
                        );
                      }}
                    >
                      {productList.map((i) => {
                        return (x.product_type == i.id) ?
                            (
                              <option selected key={i.id} value={i.id} >
                                {i.name}
                              </option>
                            )
                          :
                            (
                              <option key={i.id} value={i.id} >
                                {i.name}
                              </option>
                            );
                      })}

                      {/* {productList.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.name}
                        </option>
                      ))} */}
                    </select>
                  </Stack>
                  <div onClick={() => {
                    getBrandID(x);
                  }}>
                    <CloseButton
                      onClick={() => setShow(!show)}
                      alignSelf="center"
                      marginTop={8}
                      _focus={{outline: 'none'}}
                      size="lg"
                    />
                  </div>
                </Flex>
                <div
                  data-w-id="96da7984-2260-4962-0d48-c3b889abade4"
                  className={`background-color-white border-1px padding-top-4 box-shadow-large rounded-large width-80 remove-dropdown ${show ? '' : 'hide'
                  }`}
                >
                  <h6 className="padding-left-4">Are you sure?</h6>
                  <div className="text-small margin-bottom-4 padding-left-4">
                    This brand will be removed from this project unless you add them
                    again.
                  </div>
                  <div className="flex-row flex-space-between">
                    <div className="padding-y-3 padding-x-4 flex-justify-end background-secondary">
                      <a
                        onClick={() => setShow(!show)}
                        className="button-primary button-small w-button"
                      >
                        Cancel
                      </a>
                    </div>
                    <div className="padding-y-3 padding-x-4 flex-justify-end background-secondary" onClick={() => setShow(!show)}
                    >
                      <a
                        href="#!"
                        className="button-danger button-small w-button"
                        onClick={removeBrands}
                      >
                        Confirm remove
                      </a>
                    </div>
                  </div>
                </div>
              </Stack>
            )}

      </Stack>

      {/* Render dynamically added brand input rows for submission */}
      {
        loading ? (
          ''
        ) :
            <Stack mb={10}>
              {inputValue.map((val, i) => (

                <Stack key={i}>
                  <div style={{display: i === 0 ? 'none' : 'block'}}>
                    <Flex mb={5}>
                      <Stack mr={3}>
                        {/* Input field for brand name or dropdown for food vehicle */}
                        <label htmlFor="name" className="form-label">
                        Brand {parseInt(brandList?.length || 0) + i} name
                        </label>
                        <input
                          className="form-input small w-input"
                          name="name"
                          placeholder=""
                          value={val.name}
                          onChange={onInputValueChange}
                          data-id={i}
                          autoFocus
                          required
                        />
                      </Stack>
                      <Stack mr={1}>
                        {/* Input field for brand name or dropdown for food vehicle */}
                        <label htmlFor="name" className="form-label">
                        Food Vehicle
                        </label>
                        <select
                          data-id={i}
                          name="product-type"
                          className="small w-input"
                          style={{width: 180}}
                          value={val['product-type']}
                          onChange={onInputValueChange}
                          required
                        >
                          <option value="" hidden>
                          Food Vehicle
                          </option>

                          {productList.map((i) => (
                            <option key={i.id} value={i.id} >
                              {i.name}
                            </option>
                          ))}
                        </select>
                      </Stack>
                      <CloseButton
                        alignSelf="center"
                        marginTop={8}
                        onClick={() => removeMember(i)}
                        _focus={{outline: 'none'}}
                        size="lg"
                      />
                    </Flex>
                  </div>

                </Stack>
              ))}
            </Stack>
      }
      {/* Button to add a new input row and submit new/updated brands */}
      <a
        onClick={addmember}
        className="button-secondary width-full text-align-center w-button margin-top-10"
      >
        Add another brand
      </a>
      {/* {console.log('inputValue', inputValue.map((x) => x.name)[1])}
      {console.log('inputValueSelect', inputValue.map((x) => x['product-type']))} */}
      <button
        onClick={addBrands}
        className="button width-full w-button text-align-center margin-top-10"
        disabled={
          inputValue.map((x) => x.name).length === 2 && inputValue.map((x) => x.name)[1] === ''
          ||
          inputValue.map((x) => x['product-type']).length === 2 && inputValue.map((x) => x['product-type'])[1] === ''

          || inputValue.map((x) => x.name).length === 3 && inputValue.map((x) => x.name)[2] === ''
          || inputValue.map((x) => x['product-type']).length === 3 && inputValue.map((x) => x['product-type'])[2] === ''

          || inputValue.map((x) => x.name).length === 4 && inputValue.map((x) => x.name)[3] === ''
          || inputValue.map((x) => x['product-type']).length === 4 && inputValue.map((x) => x['product-type'])[3] === ''

          || inputValue.map((x) => x.name).length === 5 && inputValue.map((x) => x.name)[4] === ''
          || inputValue.map((x) => x['product-type']).length === 5 && inputValue.map((x) => x['product-type'])[4]
          || inputValue.map((x) => x.name).length === 6 && inputValue.map((x) => x.name)[5] === ''
          || inputValue.map((x) => x['product-type']).length === 6 && inputValue.map((x) => x['product-type'])[5]
        }
      >
        {(spinning && <Loader />) || <span>Submit</span>}
      </button>
    </Stack>
  );
};

Brands.propTypes = {
  companyId: PropTypes.any
};


export default Brands;
