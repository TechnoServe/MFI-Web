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
  Tooltip,
} from '@chakra-ui/react';

/**
 * Sample data representing IEG scores for companies.
 * @typedef {Object} IEGScore
 * @property {number} sn - Serial number
 * @property {string} company - Name of the company
 * @property {string} sector - Sector the company belongs to
 * @property {number} personnel - Personnel score (23%)
 * @property {number} production - Production score (20%)
 * @property {number} procurement - Procurement & Suppliers score (15%)
 * @property {number} engagement - Public Engagement score (17%)
 * @property {number} governance - Governance score (25%)
 * @property {number} totalScore - Total IEG score (100%)
 * @property {number} weightedScore - Weighted IEG score contributing 20%
 */

/** @type {IEGScore[]} */
const data = [
  {
    sn: 1,
    company: 'FortiMills Ltd',
    sector: 'Flour',
    personnel: 80,
    production: 75,
    procurement: 70,
    engagement: 78,
    governance: 82,
    totalScore: 78.6,
    weightedScore: 15.72,
  },
  {
    sn: 2,
    company: 'AgroHarvest Co',
    sector: 'Maize',
    personnel: 72,
    production: 69,
    procurement: 68,
    engagement: 70,
    governance: 75,
    totalScore: 71.17,
    weightedScore: 14.23,
  },
  {
    sn: 3,
    company: 'Golden Grains Inc',
    sector: 'Flour',
    personnel: 85,
    production: 80,
    procurement: 78,
    engagement: 82,
    governance: 88,
    totalScore: 83.15,
    weightedScore: 16.63,
  },
  {
    sn: 4,
    company: 'Harvest Foods Ltd',
    sector: 'Maize',
    personnel: 68,
    production: 70,
    procurement: 64,
    engagement: 67,
    governance: 72,
    totalScore: 68.83,
    weightedScore: 13.77,
  },
  {
    sn: 5,
    company: 'Sunrise Agro',
    sector: 'Flour',
    personnel: 77,
    production: 74,
    procurement: 71,
    engagement: 76,
    governance: 79,
    totalScore: 75.55,
    weightedScore: 15.11,
  },
  {
    sn: 6,
    company: 'FreshMills Nigeria',
    sector: 'Flour',
    personnel: 69,
    production: 67,
    procurement: 60,
    engagement: 65,
    governance: 70,
    totalScore: 66.96,
    weightedScore: 13.39,
  },
  {
    sn: 7,
    company: 'MaizeTech Industries',
    sector: 'Maize',
    personnel: 82,
    production: 77,
    procurement: 73,
    engagement: 80,
    governance: 85,
    totalScore: 80.42,
    weightedScore: 16.08,
  },
  {
    sn: 8,
    company: 'GlobalGrain Corp',
    sector: 'Maize',
    personnel: 75,
    production: 72,
    procurement: 68,
    engagement: 74,
    governance: 78,
    totalScore: 73.91,
    weightedScore: 14.78,
  },
];

/**
 * Renders a table displaying Independent Expert Group (IEG) scores
 * for participating companies, including component scores, total, and weighted scores.
 *
 * @component
 * @returns {JSX.Element} The rendered IEG scores table.
 */
const IEGScores = () => {
  return (
    <Box p={4}>
      <Heading size="md" mb={4}>IEG Scores</Heading>
      <Table variant="striped" size="sm">
        <Thead>
          <Tr>
            <Th>S/N</Th>
            <Th>Company Name</Th>
            <Th>Sector</Th>
            <Th>
              <Tooltip label="Personnel (Weighting = 23%)" aria-label="Personnel">
                Personnel
              </Tooltip>
            </Th>
            <Th>
              <Tooltip label="Production (Weighting = 20%)" aria-label="Production">
                Production
              </Tooltip>
            </Th>
            <Th>
              <Tooltip label="Procurement & Suppliers (Weighting = 15%)" aria-label="Procurement & Suppliers">
                Procurement & Suppliers
              </Tooltip>
            </Th>
            <Th>
              <Tooltip label="Public Engagement (Weighting = 17%)" aria-label="Public Engagement">
                Public Engagement
              </Tooltip>
            </Th>
            <Th>
              <Tooltip label="Governance (Weighting = 25%)" aria-label="Governance">
                Governance
              </Tooltip>
            </Th>
            <Th>
              <Tooltip label="Total IEG Score (Weighting = 100%)" aria-label="Total IEG Score">
                Total IEG Score
              </Tooltip>
            </Th>
            <Th>
              <Tooltip label="Weighted Score (20%)" aria-label="Weighted Score">
                Weighted Score (20%)
              </Tooltip>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row) => (
            <Tr key={row.sn}>
              <Td>{row.sn}</Td>
              <Td>{row.company}</Td>
              <Td>{row.sector}</Td>
              <Td>{row.personnel}</Td>
              <Td>{row.production}</Td>
              <Td>{row.procurement}</Td>
              <Td>{row.engagement}</Td>
              <Td>{row.governance}</Td>
              <Td>{row.totalScore}</Td>
              <Td>{row.weightedScore}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default IEGScores;
