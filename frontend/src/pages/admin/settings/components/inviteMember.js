import React, {useState} from 'react';
import {nanoid} from '@reduxjs/toolkit';
import {request} from 'common';
import Loader from 'components/circular-loader';
import {useToast} from '@chakra-ui/react';
import {useAuth} from 'hooks/user-auth';
import {Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay} from '@chakra-ui/modal';
import {useDisclosure} from '@chakra-ui/hooks';
import {Box, Text} from '@chakra-ui/layout';
import {IoMdAdd} from 'react-icons/Io';

/**
 * InviteMember component provides a modal form for inviting new team members by email and role.
 * Allows dynamic addition of users and sends invitation data to the backend API.
 *
 * @component
 * @returns {JSX.Element} Invite member modal with dynamic form input and submission logic.
 */
const InviteMember = () => {
  // Control the visibility of the modal dialog
  const {isOpen, onOpen, onClose} = useDisclosure();

  const toast = useToast();
  const {user} = useAuth();
  // const [role, setRole] = useState(user.admin_user.role.id);

  // console.log('role', role);
  // Store an array of invitee input fields (email and role_id)
  const [inputValue, setInputValue] = useState([
    {
      email: '',
      role_id: 'zgDkefjf2EOLxVhH2Hc8'
      ,
    },
  ]);
  const [loading, setLoading] = useState(false);

  /**
   * Updates input values for each invitee based on user typing.
   *
   * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement>} evt - The input change event
   */
  const onInputValueChange = (evt) => {
    const newArr = [...inputValue];
    const value = evt.target.value;
    newArr[evt.target.dataset.id][evt.target.name] = value;
    setInputValue(newArr);
  };

  // Append a new empty invitee input group to the list
  const addMember = () => {
    setInputValue([
      ...inputValue,
      {
        email: '',
        role_id: '',
      },
    ]);
  };


  /**
   * Submits the list of invitees to the backend API for sending invites.
   *
   * @param {React.FormEvent} e - The form submission event
   * @returns {Promise<void>} Shows success or error toast after submission
   */
  const sendInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // const body = {invitationEmailsList: inputValue};
      await request(true).post('/admin/invite', inputValue);
      setLoading(false);
      return toast({
        status: 'success',
        title: 'Invite sent',
        position: 'top-right',
        description: 'Works',
        duration: 6000,
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

  return (

    <>
      {/* Trigger to open the invite modal */}
      <a
        data-w-id="a79b7997-519c-1332-bf20-d87feb8c2e16"
        className="button-secondary button-small w-button"
        onClick={onOpen}
      >
        Invite
      </a>
      {/* Chakra UI modal containing the invite form */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <div className="background-color-white border-1px box-shadow-large rounded-large width-128">
            {/* <IndustryModalHeader title="Input IEG Scores" /> */}
            <ModalBody >
              <Box fontFamily="DM Sans" >
                <div className="padding-bottom-6 border-bottom-1px w-form">
                  <form>
                    <Text className="text-align-left margin-top-5" fontSize="16px" fontWeight="700">
                      Invite your team members
                    </Text>
                    <div>

                      {inputValue.map((val, i) => (
                        // Render each email and role input pair for a team member
                        <div key={nanoid()} className="w-layout-grid  rounded-large  margin-top-5">
                          <div>
                            <label htmlFor="name" className="form-label">Email</label>
                            <input
                              type="email"
                              className="form-input margin-bottom-0 w-input"
                              name="email"
                              placeholder=""
                              value={val.email}
                              onChange={onInputValueChange}
                              data-id={i}
                              autoFocus
                            />
                          </div>

                          <div>
                            <label htmlFor="cars" className="form-label">Role</label>
                            {/* Render appropriate role options based on the logged-in user's role */}
                            {user.admin_user.role.value === 'nuclear_admin' &&
                              <select className="form-input margin-bottom-0 w-input" value={val.role_id} data-id={i} name="role_id" id="role_id" onChange={onInputValueChange}>
                                <option value="zgDkefjf2EOLxVhH2Hc8">Basic Admin</option>
                                <option value="F4UNfg4iRCZRKJGZpbvv">Super Admin</option>
                                <option value="l9SHXn44ldl0reoeRqlQ">IVC Admin</option>
                              </select>
                            }
                            {/* Render appropriate role options based on the logged-in user's role */}
                            {user.admin_user.role.value === 'super_admin' &&
                              <select className="form-input margin-bottom-0 w-input" name="role_id" id="role_id" onChange={onInputValueChange}>
                                <option value="zgDkefjf2EOLxVhH2Hc8">Basic Admin</option>
                                <option value="F4UNfg4iRCZRKJGZpbvv">Super Admin</option>
                                <option value="l9SHXn44ldl0reoeRqlQ">IVC Admin</option>
                              </select>
                            }
                            {/* Render appropriate role options based on the logged-in user's role */}
                            {user.admin_user.role.value === 'basic_admin' &&
                              <select className="form-input margin-bottom-0 w-input" name="role_id" id="role_id" onChange={onInputValueChange}>
                                <option value="zgDkefjf2EOLxVhH2Hc8">Basic Admin</option>
                                <option value="l9SHXn44ldl0reoeRqlQ">IVC Admin</option>
                              </select>
                            }
                            {/* Render appropriate role options based on the logged-in user's role */}
                            {user.admin_user.role.value === 'ivc' &&
                              <select className="form-input margin-bottom-0 w-input" name="role_id" id="role_id" onChange={onInputValueChange}>
                                <option value="l9SHXn44ldl0reoeRqlQ">IVC Admin</option>
                              </select>
                            }
                          </div>
                        </div>

                      ))}


                    </div>
                  </form>
                  {/* Button to add another invitee input row */}
                  <button onClick={addMember} style={{display: 'flex', paddingLeft: '0'}} className="button-text active margin-top-4 rounded-large w-button">
                    <IoMdAdd />
                    Add member
                  </button>
                </div>
              </Box>
            </ModalBody>
            <ModalFooter className="padding-y-3 padding-x-4 flex-justify-end background-secondary border-top-1px rounded-large bottom sticky-bottom-0">
              <div>
                <a href="#" className="button-secondary button-small margin-right-3 w-button">Cancel</a>
                {/* Button to submit the invite form */}
                <button onClick={sendInvite} className="button button-small w-button">
                  {(loading && <Loader />) || <span>Send invite</span>}
                </button>
              </div>
            </ModalFooter>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default InviteMember;
