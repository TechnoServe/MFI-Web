import React from 'react';
import PageLayout from './Layout';
import {Container, Text, Box, Divider, Stack} from '@chakra-ui/react';
import {IconContext} from 'react-icons';
import {FiStar} from 'react-icons/fi';
import dummieData from 'Dummie/data.js';
import CompanyNameCard from 'components/companyDetail/companyNameDetail';
import ProductScoreCard from 'components/companyDetail/ProductScores';
import IndustryExpertScores from 'components/companyDetail/IndustryExpertScores';
import 'styles/webflow.css';
import 'styles/mfi-tns.webflow.css';
import 'styles/normalize.css';

/**
 * Companies component displays a list of company cards with self-assessment,
 * validated scores, expert scores, and product testing results.
 *
 * @component
 * @returns {JSX.Element} A company index table layout with multiple score components
 */
const Companies = () => {
  return (
    // Wrap content in a shared page layout that includes a header
    <PageLayout>
      <Container
        maxW="container.xl"
        border="1px solid gray.200"
        className="background-color-4"
        p="1.5rem"
        height="100vh"
        fontFamily="DM Sans"
      >
        {/* Display the total number of companies from dummy data */}
        <Text
          fontFamily="DM Sans"
          fontWeight="500"
          fontSize="0.875rem"
          fontStyle="normal"
          color="#1C1D26"
          my="1.5rem"
        >
          Showing {dummieData.length} Companies
        </Text>
        <Stack className="table border-1px rounded-large mb-16" bg="">
          {/* Table header layout for all company-related metrics */}
          <div className="table-header padding-x-5 padding-y-4 all-caps text-xs letters-looser border-bottom-1px">
            <div className="flex-child-grow width-64">Company Name</div>
            <div className="flex-child-grow width-40 margin-right-2">Self Assessment</div>
            <div className="flex-child-grow width-40 margin-right-2">Validated Score</div>
            <div className="flex-child-grow width-40 margin-right-4">
              Industry Expert Group Scores
            </div>
            <div className="flex-child-grow">Product Testing Scores</div>
            <div className="width-10"></div>
          </div>
          {dummieData?.map((item) => (
            <>
              {/* Render a table row for each company entry */}
              <div className="table-body background-color-white rounded-large">
                <Box
                  className="flex-row-middle flex-align-baseline width-full tablet-flex-column p-6"
                  bg={item?.star ? '#EEF1FC' : '#FFFFFF'}
                >
                  {/* Display Company Name */}
                  <div className="flex-child-grow width-64 tablet-margin-bottom-2">
                    <CompanyNameCard companyDetail={item?.company_detail} />
                  </div>
                  {/* Display Self Assessment */}
                  <div className="flex-child-grow width-40 margin-right-2 flex-align-center tablet-width-full tablet-margin-bottom-2">
                    <span className="table-responsive-header all-caps text-xs letters-looser">
                      Self assessment{' '}
                    </span>{' '}
                    {item?.self_assessment_scores}
                  </div>
                  {/* Display Validated Score */}
                  <div className="flex-child-grow width-40 margin-right-2 flex-align-center tablet-width-full">
                    <span className="table-responsive-header all-caps text-xs letters-looser">
                      Validated Score
                    </span>
                    {item?.validating_consultant_scores}
                  </div>
                  {/* Display Industry Expert Group Scores */}
                  <IndustryExpertScores score={item?.industry_expert_group_scores} />
                  {/* Display Product Testing Scores */}
                  <ProductScoreCard
                    product={item?.product_testing_score?.product}
                    status={item?.product_testing_score?.status}
                    effect="Details"
                  />
                  {/* Display star icon if the company is marked as starred */}
                  <div className="width-10 tablet-absolute-top-right tablet-margin-4">
                    {' '}
                    <IconContext.Provider
                      value={{
                        color: item?.star ? '#00B27A' : '#9696A6',
                        className: 'global-class-name',
                        style: {fill: item?.star ? '#526CDB' : '#FFFFFF'},
                      }}
                    >
                      <div>
                        <FiStar />
                      </div>
                    </IconContext.Provider>
                  </div>
                </Box>
              </div>
              {/* Divider between company rows */}
              <Divider bg="#000000" border="1px" borderColor="#FAFAFA" />
            </>
          ))}
        </Stack>
      </Container>
    </PageLayout>
  );
};

export default Companies;
