

import React from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from '@chakra-ui/react';

/**
 * ProductTestingScores Component
 * Displays product testing data for Wheat Flour (Iron, Vit. A & Vit. B3).
 *
 * @returns {JSX.Element}
 */
const ProductTestingScores = () => {
  const wheatFlourData = [
    {
      company: 'Golden Mills Ltd',
      brand: 'NutriFlour',
      samples: 4,
      date: '2025-07-20',
      vitA: 0.85,
      vitACompliance: '100%',
      mfiScore1: 30,
      vitB3: 31.2,
      vitB3Compliance: '100%',
      mfiScore2: 30,
      iron: 21.5,
      ironCompliance: '100%',
      mfiScore3: 30,
      overallMFI: 30,
      descriptor: 'Fully Fortified'
    },
    {
      company: 'NutriFoods Inc',
      brand: 'HealthyBake',
      samples: 3,
      date: '2025-07-18',
      vitA: 0.42,
      vitACompliance: '84%',
      mfiScore1: 25,
      vitB3: 25.0,
      vitB3Compliance: '83%',
      mfiScore2: 25,
      iron: 19.0,
      ironCompliance: '95%',
      mfiScore3: 25,
      overallMFI: 25,
      descriptor: 'Adequately Fortified'
    },
    {
      company: 'GrainValue Ltd',
      brand: 'GoldenCrust',
      samples: 5,
      date: '2025-07-19',
      vitA: 0.67,
      vitACompliance: '96%',
      mfiScore1: 30,
      vitB3: 29.5,
      vitB3Compliance: '98%',
      mfiScore2: 30,
      iron: 20.8,
      ironCompliance: '100%',
      mfiScore3: 30,
      overallMFI: 30,
      descriptor: 'Fully Fortified'
    },
    {
      company: 'Harvest Mills',
      brand: 'FlourRich',
      samples: 3,
      date: '2025-07-17',
      vitA: 0.33,
      vitACompliance: '66%',
      mfiScore1: 15,
      vitB3: 20.0,
      vitB3Compliance: '67%',
      mfiScore2: 15,
      iron: 15.2,
      ironCompliance: '76%',
      mfiScore3: 15,
      overallMFI: 15,
      descriptor: 'Partly Fortified'
    },
    {
      company: 'AgriFoods Nigeria',
      brand: 'VitaBake',
      samples: 2,
      date: '2025-07-16',
      vitA: 0.90,
      vitACompliance: '106%',
      mfiScore1: 25,
      vitB3: 34.1,
      vitB3Compliance: '100%',
      mfiScore2: 30,
      iron: 22.5,
      ironCompliance: '100%',
      mfiScore3: 30,
      overallMFI: 28.3,
      descriptor: 'Fully Fortified'
    },
    {
      company: 'FlourCo Ltd',
      brand: 'BakeWell',
      samples: 4,
      date: '2025-07-15',
      vitA: 0.28,
      vitACompliance: '56%',
      mfiScore1: 10,
      vitB3: 18.0,
      vitB3Compliance: '60%',
      mfiScore2: 10,
      iron: 14.2,
      ironCompliance: '71%',
      mfiScore3: 10,
      overallMFI: 10,
      descriptor: 'Not Fortified'
    },
    {
      company: 'Sunrise Foods',
      brand: 'MaidaLite',
      samples: 3,
      date: '2025-07-14',
      vitA: 0.50,
      vitACompliance: '100%',
      mfiScore1: 30,
      vitB3: 28.7,
      vitB3Compliance: '96%',
      mfiScore2: 30,
      iron: 20.1,
      ironCompliance: '100%',
      mfiScore3: 30,
      overallMFI: 30,
      descriptor: 'Fully Fortified'
    }
  ];

  return (
    <Box p={4}>
      <Heading size="lg" mb={2}>Product Testing</Heading>
      <Heading size="md" mb={4}>Wheat Flour (Iron, Vit. A & Vit. B3)</Heading>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Company</Th>
            <Th>Brand</Th>
            <Th>No of Samples</Th>
            <Th>Sample Date</Th>
            <Th>Vit. A Results</Th>
            <Th>% Compliance</Th>
            <Th>MFI Score 1</Th>
            <Th>Vit.B3 Results</Th>
            <Th>% Compliance</Th>
            <Th>MFI Score 2</Th>
            <Th>Iron Results</Th>
            <Th>% Compliance</Th>
            <Th>MFI Score 3</Th>
            <Th>Overall MFI Result (Average)</Th>
            <Th>Descriptor</Th>
          </Tr>
        </Thead>
        <Tbody>
          {wheatFlourData.map((item, index) => (
            <Tr key={index}>
              <Td>{item.company}</Td>
              <Td>{item.brand}</Td>
              <Td>{item.samples}</Td>
              <Td>{item.date}</Td>
              <Td>{item.vitA}</Td>
              <Td>{item.vitACompliance}</Td>
              <Td>{item.mfiScore1}</Td>
              <Td>{item.vitB3}</Td>
              <Td>{item.vitB3Compliance}</Td>
              <Td>{item.mfiScore2}</Td>
              <Td>{item.iron}</Td>
              <Td>{item.ironCompliance}</Td>
              <Td>{item.mfiScore3}</Td>
              <Td>{item.overallMFI}</Td>
              <Td>{item.descriptor}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ProductTestingScores;
