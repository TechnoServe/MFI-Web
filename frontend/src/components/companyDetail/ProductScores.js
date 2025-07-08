import React, {useState} from 'react';
import propTypes from 'prop-types';
import 'styles/webflow.css';
import 'styles/mfi-tns.webflow.css';
import 'styles/normalize.css';
import {useDisclosure} from '@chakra-ui/react';
import {nanoid} from '@reduxjs/toolkit';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
} from '@chakra-ui/react';
import ProductModalHeader from 'components/productTestingScores/testingScoreModal';

/**
 * Displays fortification status labels for each brand and allows viewing detailed product test results in a modal.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.fortifyAndProductTest - Object containing brand-level product test data.
 * @param {string} props.cycle - The active assessment cycle ID.
 * @returns {JSX.Element} React component displaying fortification scores with a modal trigger.
 */
const ProductScoreCard = ({fortifyAndProductTest, cycle}) => {
  // Chakra UI modal state management hooks
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [brandID, setBrandID] = useState();

  return (
    <div className="flex flex-row-middle flex-align-baseline width-full tablet-flex-column">
      <div className="flex-child-grow tablet-width-full" >
        <div className="width-full">

          {/* Loop through each brand and display their name and fortification status */}
          {fortifyAndProductTest?.brands.map((comply) =>
            <div key={comply.id} className="flex-justify-end margin-bottom-4 items-center tablet-width-full portrait-flex-justify-start">
              <div className="text-small margin-right-4 flex-child-grow portrait-width-full portrait-margin-right-0">
                {comply.name}
              </div>
              <div className="margin-right-4 flex flex-column">
                <div className="padding-x-3 padding-y-2 mb-2 rounded-large background-color-blue-lighter text-center" style={{width: 144}}>
                  <div className="text-small text-color-blue weight-medium">

                    {/* Determine fortification status based on compliance percentages */}
                    {comply?.productTests[0]?.results?.map((x) => x.percentage_compliance).every((el) => el > 99) ? 'Fully Fortified'
                      : comply?.productTests[0]?.results?.map((x) => x.percentage_compliance).some((el) => el >= 80) ? 'Adequately Fortified'
                        : comply?.productTests[0]?.results?.map((x) => x.percentage_compliance).some((el) => el >= 51) ? 'Partly Fortified'
                          : comply?.productTests[0]?.results?.map((x) => x.percentage_compliance).some((el) => el >= 31) ? 'Inadequately Fortified'
                            : comply?.productTests[0]?.results?.map((x) => x.percentage_compliance).every((el) => el <= 30) ? 'Not Fortified'
                              :
                              ''}
                    {/* {console.log('comply', comply?.productTests[0]?.results?.map((x) => x.percentage_compliance))} */}

                  </div>
                </div>
              </div>
              {/* Open modal and set selected brand for detailed product test view */}
              <div onClick={onOpen} className="flex justify-end">
                <button className="button-secondary button-small margin-right-3 w-button" onClick={() => {
                  setBrandID(comply);
                }}>
                  Details</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <div className="background-color-white border-1px box-shadow-large rounded-large w-full h-screen mt-4 overflow-scroll">
            {/* Render product test details in modal using selected brand and product data */}
            <ProductModalHeader key={nanoid()} productTest={fortifyAndProductTest} product="Dangote Flour"
              uniqueBrands={brandID}
              cycle={cycle}
            />
            <ModalCloseButton style={{position: 'absolute', right: '0', background: '#fff', borderRadius: '50%', left: '100%'}} className="box-shadow-large" />
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

ProductScoreCard.propTypes = {
  effect: propTypes.any,
  status: propTypes.any,
  product: propTypes.any,
  fortifyAndProductTest: propTypes.any,
  cycle: propTypes.any
};

export default ProductScoreCard;
