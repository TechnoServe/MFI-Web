import React, {useEffect, useState} from 'react';
import {Stack, Text, CloseButton, Flex, useToast, Spinner} from '@chakra-ui/react';
// import {nanoid} from '@reduxjs/toolkit';
import {request} from 'common';
import {useAuth} from 'hooks/user-auth';
import Loader from 'components/circular-loader';

/**
 * Brands component allows users to manage company brands, including listing,
 * creating, updating, and deleting brand entries with their associated product types.
 *
 * @component
 * @returns {JSX.Element} Form and list interface for managing brands
 */
const Brands = () => {
  const {user} = useAuth();
  const [inputValue, setInputValue] = useState([
    {
      'name': '',
      'product-type': '',
    },
  ]);
  const [show, setShow] = useState(false);

  const [productList, setProductList] = useState([]);
  const [brandList, setBrandList] = useState([
    {
      id: '',
      updated_at: '',
      product_type: '',
      created_at: '',
      company_id: '',
      name: ''
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const toast = useToast();
  const [brandID, setBrandID] = useState([]);


  /**
   * Handles changes in the input fields for new brands.
   * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement>} evt - Change event from the input/select
   */
  const onInputValueChange = (evt) => {
    const newArr = [...inputValue];
    const value = evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value;
    newArr[evt.target.dataset.id][evt.target.name] = value;
    setInputValue(newArr);
  };

  // Adds a new brand form entry for user input
  const addmember = () => {
    setInputValue([
      ...inputValue,
      {
        'name': '',
        'product-type': '',
      },
    ]);
  };

  // Fetch available product types for dropdown selection
  useEffect(() => {
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
  // Fetch brands already registered to the company
  useEffect(() => {
    setLoading(true);
    const fetchBrandList = () => {
      return request(true)
        .get(`company/brands?company-id=${user.company.id}`)
        .then((resp) => {
          setBrandList(resp.data.data);
          setLoading(false);
        });
    };
    fetchBrandList();
  }, []);

  /**
   * Removes a brand form entry from the new input list
   * @param {number} i - Index of the entry to remove
   */
  const removeMember = (i) => {
    const array = [...inputValue];
    array.splice(i, 1);
    setInputValue([...array]);
  };

  /**
   * Sends requests to create new brands and update existing brands for the company.
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
            'product-type': x.product_type
          };
        })
      };
      setSpinning(true);
      // Request to Create brand
      await request(true)
        .post(`company/brands?company-id=${user.company.id}`, body);
      setSpinning(false);
      // Request to Update brand
      await request(true)
        .post(`company/brands?company-id=${user.company.id}`, updateBody);
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
   * Sets the selected brand to be removed
   * @param {Object} id - The brand object selected for deletion
   */
  const getBrandID = (id) => {
    setBrandID(id);
  };


  /**
   * Deletes a brand using the stored brand ID
   * @returns {Promise<void>}
   */
  const removeBrands = async () => {
    try {
      const body = {
        'brands-delete': [brandID.id]
      };
      await request(true)
        .post(`company/brands?company-id=${user.company.id}`, body);

      // if (req.status === 200) {
      //   const fetchBrandList = () => {
      //     return request(true)
      //       .get(`company/brands?company-id=${user.company.id}`)
      //       .then((resp) => {
      //         setBrandList(resp.data);
      //         setLoading(false);
      //       });
      //   };
      //   // fetchBrandList();
      // }
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

  // Show spinner or render existing brand list with editable fields
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
                    >
                      <option >
                        {x.product_type === '7solPkqUcOabROFd5Lgt' ? 'Sugar'
                          : x.product_type === 'AH6CGJnP5KxdmXRnV1Ez' ? 'Edible Oil'
                            : x.product_type === 'XjGrnod6DDbJFVxtZDkD' ? 'Flour' : ''
                        }
                      </option>
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

      {/* Adding New Brands */}
      {/* Render input forms for adding new brands */}
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
      <a
        onClick={addmember}
        className="button-secondary width-full text-align-center w-button margin-top-10"
      >
        Add another brand
      </a>
      {/* {console.log('inputValue', inputValue.map((x) => x.name)[1])}
      {console.log('inputValueSelect', inputValue.map((x) => x['product-type']))} */}
      {/* Submit all valid new and edited brand entries */}
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

export default Brands;
