import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
} from '@chakra-ui/react';

/**
 * Settings Component
 * Displays configuration tables for MFI platform including company metadata and reference keys.
 *
 * @returns {JSX.Element} Settings page with tables
 */

const Settings = () => {
  const keys = [
    {acronym: 'PMS', description: 'People Management Systems'},
    {acronym: 'PCII', description: 'Production, Continuous Improvement & Innovation'},
    {acronym: 'PIM', description: 'Procurement & Input Management'},
    {acronym: 'PE', description: 'Public Engagement'},
    {acronym: 'GLC', description: 'Governance & Leadership Culture'},
    {acronym: 'IEG', description: 'Independent Expert Group'},
    {acronym: 'SAT', description: 'Self Assessment Tool - Unverified'},
    {acronym: '(V)', description: 'Verified*'},
    {acronym: '(U)', description: 'Unverified'},
  ];

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>Keys / Legends</Heading>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Acronym</Th>
            <Th>Description</Th>
          </Tr>
        </Thead>
        <Tbody>
          {keys.map((item, idx) => (
            <Tr key={idx}>
              <Td>{item.acronym}</Td>
              <Td>{item.description}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Heading size="md" mt={10} mb={4}>MICRONUTRIENT STANDARDS KEY</Heading>
      <Table variant="simple" size="sm" mb={4}>
        <Thead>
          <Tr>
            <Th>Food Product</Th>
            <Th>Micronutrient</Th>
            <Th>Expected Values @ 100% compliance</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td rowSpan={3}>Flour</Td>
            <Td>Vitamin A</Td>
            <Td>6,666iu/kg</Td>
          </Tr>
          <Tr>
            <Td>Vitamin B3</Td>
            <Td>45iu/kg</Td>
          </Tr>
          <Tr>
            <Td>Iron</Td>
            <Td>40iu/kg</Td>
          </Tr>
          <Tr>
            <Td>Sugar</Td>
            <Td>Vitamin A</Td>
            <Td>25,000iu/kg</Td>
          </Tr>
          <Tr>
            <Td>Edible Oils</Td>
            <Td>Vitamin A</Td>
            <Td>20,000iu/kg</Td>
          </Tr>
          <Tr>
            <Td>Salt</Td>
            <Td>Iodine</Td>
            <Td></Td>
          </Tr>
        </Tbody>
      </Table>

      <Heading size="md" mt={10} mb={4}>Fortification Banding & Narrative Scores</Heading>
      <Table variant="simple" size="sm" mb={4}>
        <Thead>
          <Tr>
            <Th>Bandings</Th>
            <Th>Weighted Scores</Th>
            <Th>Narrative Score</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>100% and above</Td>
            <Td>20%</Td>
            <Td>Fully Fortified</Td>
          </Tr>
          <Tr>
            <Td>80% - 99%</Td>
            <Td></Td>
            <Td>Adequately Fortified</Td>
          </Tr>
          <Tr>
            <Td>51% - 79%</Td>
            <Td>10% - 19.9%</Td>
            <Td>Partly Fortified</Td>
          </Tr>
          <Tr>
            <Td>31%- 50%</Td>
            <Td>5% - 9.9%</Td>
            <Td>Inadequately Fortified</Td>
          </Tr>
          <Tr>
            <Td>Below 31%</Td>
            <Td>0% - 4.9%</Td>
            <Td>Not Fortified</Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};

export default Settings;
