import React, {useState, useEffect} from 'react';
import {Container, Text, Box, Divider, useToast, Flex, Spinner, Button, Select, Spacer} from '@chakra-ui/react';
import InputField from '../../../components/customInput';
// import CustomSelect from '../../../components/customSelect';
import {CSVLink} from 'react-csv';

import ProductScoreCard from 'components/companyDetail/ProductScores';
import IndustryExpertScores from 'components/companyDetail/IndustryExpertScores';
import IvcAssessment from '../self-assessment/index';
import 'styles/webflow.css';
import 'styles/mfi-tns.webflow.css';
import 'styles/normalize.css';
import {request} from 'common';
import {FiStar} from 'react-icons/fi';
import {IconContext} from 'react-icons/lib';
import RemoveIndustry from 'components/companyDetail/RemoveIndustry';
import IndustryPermissionRequest from 'components/companyDetail/IndustryPermissionRequest';
import {nanoid} from '@reduxjs/toolkit';
import {useAuth} from 'hooks/user-auth';
import {usePagination} from 'components/useDashboardPagination';

const Companies = () => {
  const [input, setInput] = useState('');
  const [companies, setCompanies] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortCompanies, setSortCompanies] = useState('');
  const [selected, setSelected] = useState(null);
  const toast = useToast();
  // const filterArray = ['Country', 'Product Vehicle', 'Tier'];
  const {PaginationButtons, allIndustryScores} = usePagination(companies);
  const {user} = useAuth();
  useEffect(() => {
    const getCompanies = async () => {
      setLoading(true);
      try {
        const res = await request(true).get('admin/index?page-size=50');
        setCompanies(res.data);
        setData(res.data);
        setSortCompanies(res.data);
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
    getCompanies();
  }, []);


  useEffect(() => {
    setCompanies([]);
    data.filter((val) => {
      if (val.company_name.toLowerCase().includes(input.toLowerCase())) {
        setCompanies((companies) => [...companies, val]);
      }
    });
  }, [input]);


  const sortIt = (sortBy) => (a, b) => {
    if (a[sortBy] > b[sortBy]) {
      return 1;
    } else if (a[sortBy] < b[sortBy]) {
      return -1;
    }
    return 0;
  };

  const sortDesc = (sortBy) => (a, b) => {
    if (a[sortBy] < b[sortBy]) {
      return 1;
    } else if (a[sortBy] > b[sortBy]) {
      return -1;
    }
    return 0;
  };


  const sortCompany = (e) => {
    const index = e.nativeEvent.target.selectedIndex;
    if (e.target.value === 'created_at' || e.target.value === 'company_name') {
      const sorted = [...sortCompanies].sort(sortIt(e.target.value));
      setCompanies(sorted);
    }

    if (e.target.value === 'company_name' && e.nativeEvent.target[index].text === 'A-Z, Bottom - Top') {
      const sorted = [...sortCompanies].sort(sortDesc(e.target.value));
      setCompanies(sorted);
    }
    ;
  };

  const headers = [
    {label: 'Company Name', key: 'company_name'},
    {label: 'Self Assessment Tool(%)', key: 'self_assessment_tool'},
    {label: 'SAT Personnel(%)', key: 'sat_personnel'},
    {label: 'SAT Production(%)', key: 'sat_production'},
    {label: 'SAT Procurement and Suppliers(%)', key: 'sat_procurement_supply'},
    {label: 'SAT Public Engagement(%)', key: 'sat_public_engagement'},
    {label: 'SAT Governance(%)', key: 'sat_governance'},
    {label: 'Validated Scores(%)', key: 'validated_scores'},
    {label: 'IVC Personnel(%)', key: 'ivc_personnel'},
    {label: 'IVC Production(%)', key: 'ivc_production'},
    {label: 'IVC Procurement and Suppliers(%)', key: 'ivc_procurement_supply'},
    {label: 'IVC Public Engagement(%)', key: 'ivc_public_engagement'},
    {label: 'IVC Governance(%)', key: 'ivc_governance'},
    {label: 'Industry Expert Group(%)', key: 'industry_expert_group'},
    {label: 'IEG Personnel(%)', key: 'ieg_personnel'},
    {label: 'IEG Production(%)', key: 'ieg_production'},
    {label: 'IEG Procurement and Suppliers(%)', key: 'ieg_procurement_supply'},
    {label: 'IEG Public Engagement', key: 'ieg_public_engagement'},
    {label: 'IEG Governance', key: 'ieg_governance'},
    {label: 'Brand Name', key: 'brand_name'},

  ];

  const dataCSV = companies?.map((item) => (
    {
      company_name: item?.company_name,
      // SAT
      self_assessment_tool: item?.satScores?.reduce((accum, item) => accum + item.score, 0).toFixed(),
      sat_personnel: item?.satScores?.find((o) => o?.name === 'Personnel')?.score.toFixed(),
      sat_production: item?.satScores?.find((o) => o?.name === 'Production')?.score.toFixed(),
      sat_procurement_supply: item?.satScores?.find((o) => o?.name === 'Procurement & Suppliers')?.score.toFixed(),
      sat_public_engagement: item?.satScores?.find((o) => o?.name === 'Public Engagement')?.score.toFixed(),
      sat_governance: item?.satScores?.find((o) => o?.name === 'Governance')?.score.toFixed(),
      // IVC
      validated_scores: item?.ivcScores.reduce((accum, item) => accum + item.value, 0).toFixed(),
      ivc_personnel: item?.ivcScores?.find((o) => o?.category?.name === 'Personnel')?.value.toFixed(),
      ivc_production: item?.ivcScores?.find((o) => o?.category?.name === 'Production')?.value.toFixed(),
      ivc_procurement_supply: item?.ivcScores?.find((o) => o?.category?.name === 'Procurement & Suppliers')?.value.toFixed(),
      ivc_public_engagement: item?.ivcScores?.find((o) => o?.category?.name === 'Public Engagement')?.value.toFixed(),
      ivc_governance: item?.ivcScores?.find((o) => o?.category?.name === 'Governance')?.value.toFixed(),
      // IEG
      industry_expert_group: (item?.iegScores?.reduce((accum, item) => accum + item?.value, 0) / 2).toFixed(),
      ieg_personnel: item?.iegScores?.find((o) => o?.category?.name === 'Personnel')?.value.toFixed(),
      ieg_production: item?.iegScores?.find((o) => o?.category?.name === 'Production')?.value.toFixed(),
      ieg_procurement_supply: item?.iegScores?.find((o) => o?.category?.name === 'Procurement & Suppliers')?.value.toFixed(),
      ieg_public_engagement: item?.iegScores?.find((o) => o?.category?.name === 'Public Engagement')?.value.toFixed(),
      ieg_governance: item?.iegScores?.find((o) => o?.category?.name === 'Governance')?.value.toFixed(),
      // Brand Name
      brand_name: item?.brands?.map((x) => x?.name)
    }
  ));


  return (
    <div>
      {
        (selected == 'IVCAssessment') ?
            <IvcAssessment companyDetailsIVC={allIndustryScores?.map((company) => company)} /> :
            <>
              <Box bg="#fff" fontFamily="DM Sans">
                <Container maxW="container.xl" border="1px" borderColor="gray.200">
                  <Flex
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                    p="1rem"
                  >
                    <Text fontSize="1.25rem" fontWeight="700" lineHeight="1.6275rem">
                    Companies Index
                    </Text>
                    <CSVLink
                      data={dataCSV}
                      headers={headers}
                      target="_blank"
                    >
                      <Button
                        colorScheme="teal"
                        loadingText="Downloading"
                        w="8.3125rem"
                        marginRight="0.5rem"
                        bg="#00B27A"
                        fontSize="13px"
                        color="#ffffff"
                      >
                      Download CSV
                      </Button>
                    </CSVLink>
                  </Flex>
                </Container>
                <Divider borderWidth="1px" />

                <Container maxW="container.xl" border="1px" borderColor="gray.200">
                  <Flex
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                    p="1rem"
                    width="100%"
                  >
                    <InputField
                      placeholder="Search"
                      name="search"
                      onChange={(e) => setInput(e.target.value)}
                      bg="rgba(44,42,100,0.03)"
                      variant="filled"
                      width="31.25rem"
                    />

                    <Flex direction="row" justify="space-between" width="16rem">
                      {/* <CustomSelect filter={sorted} placeholder="Sort" onChange={sortCompany} /> */}
                      <Select size='md' style={{marginTop: '9px', marginLeft: '5px'}} placeholder="Sort" onChange={sortCompany}>
                        <option value="created_at">Date added</option>
                        <option value="company_name">A-Z, Top - Bottom</option>
                        <option value="company_name">A-Z, Bottom - Top</option>
                      </Select>
                      <Spacer />
                      {/* <CustomSelect
                        filter={filterArray}
                        placeholder="Filter"
                      /> */}
                    </Flex>
                  </Flex>
                </Container>
              </Box>
              {/* Header Ends  */}

              <Container
                maxW="container.xl"
                border="1px solid gray.200"
                className="background-color-4"
                p="2.5rem"
                height="100vh"
                fontFamily="DM Sans"
              >
                <Text
                  fontFamily="DM Sans"
                  fontWeight="500"
                  fontSize="0.875rem"
                  fontStyle="normal"
                  color="#1C1D26"
                  my="1.5rem"
                >
                Showing {allIndustryScores?.length} Companies
                </Text>
                <div className="table border-1px rounded-large mb-16">
                  <div className="table-header padding-x-5 padding-y-4 all-caps text-xs letters-looser border-bottom-1px">
                    <div className="flex-child-grow width-64">Company Name</div>
                    <div className="flex-child-grow width-40 margin-right-2">Self Assessment</div>
                    <div className="flex-child-grow width-40 margin-right-2">Validated Score</div>
                    <div className="flex-child-grow width-40 margin-right-2">Industry Expert Group Scores</div>
                    <div className="flex-child-grow">Product Testing Scores</div>
                    <div className="width-10"></div>
                  </div>
                  {loading ? (
                    <Flex height="100%" width="100%" mb="10" justifyContent="center" alignItems="center">
                      <Spinner />
                    </Flex>
                  ) :

                    allIndustryScores?.map((company) => (
                      <>
                        <div className="table-body background-color-white rounded-large">
                          <Box className="flex-row-middle flex-align-baseline width-full tablet-flex-column p-6">
                            <div className="flex-child-grow width-64 tablet-margin-bottom-2">
                              <div className="flex-row-middle flex-align-baseline width-full tablet-flex-column">
                                <div className="flex-child-grow width-64 tablet-margin-bottom-2">
                                  <div className="weight-medium text-color-1 uppercase">{company?.company_name}</div>
                                  <div className="flex-row">
                                    <div className="text-xs margin-right-2">{company?.brands?.map((brand) => <p key={brand.id}>{brand.name}</p>)}</div>
                                    <div className="text-xs font-normal margin-right-2"> {company?.tier}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex-child-grow width-40 margin-right-2 flex-align-center tablet-width-full tablet-margin-bottom-2">
                              <span className="table-responsive-header all-caps text-xs letters-looser">Self assessment </span>
                              {company?.satScores.reduce((accum, item) => accum + item.score, 0).toFixed()}%

                              {user.admin_user.role.value === 'nuclear_admin' || user.admin_user.role.value === 'super_admin' ?
                                  <IndustryPermissionRequest permissionRequest={company} />
                                : ''
                              }
                            </div>
                            <div className="flex-child-grow width-40 margin-right-2 flex-align-center tablet-width-full">
                              <span className="table-responsive-header all-caps text-xs letters-looser">Validated Score</span>
                              {/* {company?.scores?.map(((IVCScore) => IVCScore.score_type === 'IVC' ? `${IVCScore.value}%` : ''))} */}
                              {/* {company?.ivcScores.reduce((accum, item) => accum + item.score, 0).toFixed()}% */}
                              {company.tier === 'TIER_3' ? company?.ivcScores.reduce((accum, item) => accum + item.score, 0).toFixed() :

                                company.tier === 'TIER_1' ? company?.ivcScores.reduce((accum, item) => accum + item.score / 100 * 66, 0).toFixed() : 'No Tier'
                              }%
                              <div onClick={() => {
                                setSelected('IVCAssessment', localStorage.setItem('company', JSON.stringify(company)));
                              }} style={{marginLeft: '7px'}} className="button-secondary button-small margin-right-3 w-button" >
                              Edit
                              </div>
                            </div>

                            <div className="flex-child-grow width-40 margin-right-2 flex-align-center tablet-width-full">

                              <span className="table-responsive-header all-caps text-xs letters-looser">Industry Expert Group Scores</span>
                              <IndustryExpertScores key={nanoid()} company={company} score={company.iegScores} />
                            </div>

                            <ProductScoreCard key={nanoid()} fortifyAndProductTest={company} effect='Details' />
                            <div className="width-10 tablet-absolute-top-right tablet-margin-4">
                              {' '}
                              <IconContext.Provider
                                value={{
                                  color: companies?.star ? '#00B27A' : '#9696A6',
                                  className: 'global-class-name',
                                  style: {fill: companies?.star ? '#526CDB' : '#FFFFFF'},
                                }}
                              >
                                <div>
                                  <FiStar />
                                </div>
                              </IconContext.Provider>
                            </div>
                            <div className="width-10 tablet-absolute-top-right tablet-margin-4">
                              {' '}
                              <IconContext.Provider
                                value={{
                                  color: companies?.star ? '#00B27A' : '#9696A6',
                                  className: 'global-class-name',
                                  style: {fill: companies?.star ? '#526CDB' : '#FFFFFF'}
                                }}
                              >
                                {user.admin_user.role.value === 'nuclear_admin' ?
                                    <div>
                                      <RemoveIndustry company={company} />
                                    </div>
                                  : ''
                                }
                              </IconContext.Provider>
                            </div>

                          </Box>
                        </div>
                        <Divider bg="#000000" border="1px" borderColor="#FAFAFA" />

                      </>
                    ))}

                </div>
                <PaginationButtons />
              </Container>
            </>
      }
    </div >

  );
};


export default Companies;
