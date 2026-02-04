import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {request} from 'common';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Heading,
  Tooltip,
} from '@chakra-ui/react';

/**
 * SATScores Component
 *
 * This component renders the SAT Scores dashboard with three tabbed views:
 * 1. Company Self-Reported SA Scores - displays SAT scores submitted by companies.
 * 2. IVC Validated SA Scores - displays validation-adjusted SAT results.
 * 3. Validated SAT Ranking - ranks companies based on validated unweighted SAT scores.
 *
 * Each tab contains a Chakra UI table with tooltips for additional context on column headers.
 * The scores reflect weightings for SAT dimensions and their contribution to MFI performance indices.
 *
 * @returns {JSX.Element} The SATScores tabbed dashboard panel.
 */

/**
 * SATScores component displays SAT score dashboards in three tabbed views.
 *
 * @returns {JSX.Element}
 */
const SATScores = ({cycle}) => {
  const [satData, setSatData] = useState({
    selfReported: [],
    validated: [],
    ranking: []
  });

  useEffect(() => {
    const fetchSATScores = async () => {
      try {
        const response = await request(true).get('/admin/all-assessment-scores', {
          params: {'cycle-id': cycle?.id}
        });
        setSatData(response.data);
      } catch (error) {
        console.error('Failed to fetch SAT scores:', error);
      }
    };

    fetchSATScores();
  }, [cycle]);

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>SAT Scores</Heading>
      <Tabs variant="enclosed">
        <TabList>
          <Tab>COMPANY SELF-REPORTED SA. SCORES</Tab>
          <Tab>IVC VALIDATED SA. SCORES</Tab>
          <Tab>Validated SAT Ranking</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>S/N</Th>
                  <Th>
                    <Tooltip label="Company Name" hasArrow>
                      Company Name
                    </Tooltip>
                  </Th>
                  <Th>
                    <Tooltip label="Self-Assessment Type" hasArrow>
                      SA Type
                    </Tooltip>
                  </Th>
                  <Th>
                    <Tooltip label="Sector" hasArrow>
                      Sector
                    </Tooltip>
                  </Th>
                  <Th>
                    <Tooltip label="Personnel (Wt. = 23%)" hasArrow>
                      Personnel
                    </Tooltip>
                  </Th>
                  <Th>
                    <Tooltip label="Production (Wt. = 20%)" hasArrow>
                      Production
                    </Tooltip>
                  </Th>
                  <Th>
                    <Tooltip label="Procurement & Suppliers (Wt. = 15%)" hasArrow>
                      Procurement & Suppliers
                    </Tooltip>
                  </Th>
                  <Th>
                    <Tooltip label="Public Engagement (Wt. = 17%)" hasArrow>
                      Public Engagement
                    </Tooltip>
                  </Th>
                  <Th>
                    <Tooltip label="Governance (Wt. = 25%)" hasArrow>
                      Governance
                    </Tooltip>
                  </Th>
                  <Th>
                    <Tooltip label="Total SAT Score (Wt. = 100%)" hasArrow>
                      Total SAT
                    </Tooltip>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {satData.selfReported.map((item, index) => (
                  <Tr key={index}>
                    <Td>{index + 1}</Td>
                    <Td>{item.companyName}</Td>
                    <Td>{item.saType}</Td>
                    <Td>{item.sector}</Td>
                    <Td>{item.personnel}</Td>
                    <Td>{item.production}</Td>
                    <Td>{item.procurementSuppliers}</Td>
                    <Td>{item.publicEngagement}</Td>
                    <Td>{item.governance}</Td>
                    <Td>{item.totalSAT}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TabPanel>
          <TabPanel>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>S/N</Th>
                  <Th>
                    <Tooltip label="Company Name" hasArrow>Company Name</Tooltip>
                  </Th>
                  <Th>
                    <Tooltip label="Self-Assessment Type" hasArrow>SA Type</Tooltip>
                  </Th>
                  <Th>
                    <Tooltip label="Validation Status" hasArrow>Validation Status</Tooltip>
                  </Th>
                  <Th>
                    <Tooltip label="Sector" hasArrow>Sector</Tooltip>
                  </Th>
                  <Th>
                    <Tooltip label="Personnel (Wt. = 23%)" hasArrow>Personnel</Tooltip>
                  </Th>
                  <Th>
                    <Tooltip label="Production (Wt. = 20%)" hasArrow>Production</Tooltip>
                  </Th>
                  <Th>
                    <Tooltip label="Procurement & Suppliers (Wt. = 15%)" hasArrow>Procurement & Suppliers</Tooltip>
                  </Th>
                  <Th>
                    <Tooltip label="Public Engagement (Wt. = 17%)" hasArrow>Public Engagement</Tooltip>
                  </Th>
                  <Th>
                    <Tooltip label="Governance (Wt. = 25%)" hasArrow>Governance</Tooltip>
                  </Th>
                  <Th>
                    <Tooltip label="Total SAT Score - FULL SA = 100% Max. - Abridged = 66% Max" hasArrow>Total SAT</Tooltip>
                  </Th>
                  <Th>
                    <Tooltip label="FINAL MFI UNWeighted score  - Validated = 100% - Unvalidated = 50%" hasArrow>Unweighted MFI</Tooltip>
                  </Th>
                  <Th>
                    <Tooltip label="FINAL MFI Weighted score  Validated = 60% - Unvalidated = 30%" hasArrow>Weighted MFI</Tooltip>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {satData.validated.map((item, index) => (
                  <Tr key={index}>
                    <Td>{index + 1}</Td>
                    <Td>{item.companyName}</Td>
                    <Td>{item.saType}</Td>
                    <Td>{item.validationStatus}</Td>
                    <Td>{item.sector}</Td>
                    <Td>{item.personnel}</Td>
                    <Td>{item.production}</Td>
                    <Td>{item.procurementSuppliers}</Td>
                    <Td>{item.publicEngagement}</Td>
                    <Td>{item.governance}</Td>
                    <Td>{item.totalSAT}</Td>
                    <Td>{item.unweightedMFI}</Td>
                    <Td>{item.weightedMFI}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TabPanel>
          <TabPanel>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>
                    <Tooltip label="Validated SAT Ranking" hasArrow>
                      Validated SAT Ranking
                    </Tooltip>
                  </Th>
                  <Th>
                    <Tooltip label="Company Name" hasArrow>
                      Company Name
                    </Tooltip>
                  </Th>
                  <Th>
                    <Tooltip label="Sector" hasArrow>
                      Sector
                    </Tooltip>
                  </Th>
                  <Th>
                    <Tooltip label="Validated MFI UNWeighted score" hasArrow>
                      Validated MFI UNWeighted score
                    </Tooltip>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {/* {satData.ranking.map((item, index) => (
                  <Tr key={index}>
                    <Td>{index + 1}</Td>
                    <Td>{item.companyName}</Td>
                    <Td>{item.sector}</Td>
                    <Td>{item.unweightedMFI}</Td>
                  </Tr>
                ))} */}
              </Tbody>
            </Table>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};


SATScores.propTypes = {
  cycle: PropTypes.string.isRequired,
};

export default SATScores;
