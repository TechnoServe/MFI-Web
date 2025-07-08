import React, {useEffect, useState} from 'react';
import {nanoid} from '@reduxjs/toolkit';
import propTypes from 'prop-types';
import {request} from 'common';
import {
  Input,
  Stack,
  Text,
  ListItem,
  UnorderedList,
  useToast,
  Flex,
  Spinner,
  Button,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
dayjs.extend(calendar);
import {getCurrentCompany} from '../../../utills/helpers';

/**
 * Comments component displays and allows users to post comments related to a specific category.
 * It fetches comments on mount and provides a form for submitting and deleting comments.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string|number} props.categoryId - ID of the assessment category for which comments are shown
 * @returns {JSX.Element} Rendered comment section UI
 */
const Comments = ({categoryId}) => {
  const toast = useToast();
  // State to hold the list of comments
  const [comments, setCom] = useState(null);
  // Spinner state for comment loading
  const [loading, setLoading] = useState();
  // Button loading state for comment submission
  const [btnLoad, setBtnLoading] = useState(false);
  // Content of the comment input field
  const [content, setContent] = useState('');
  const cycleID = 'vJqDawZlrKNHsMIW9G2s';
  const currentCompany = getCurrentCompany();
  const {id: companyId} = currentCompany;

  /**
   * Fetches the list of comments for the specified category from the backend.
   *
   * @param {boolean} type - Whether to show loading spinner during fetch
   * @returns {Promise<void>}
   */
  const getComment = async (type) => {
    type && setLoading(true);
    try {
      const {data: res} = await request(true).get(`/comments/list/category/${categoryId}?company_id=${companyId}&cycle_id=${cycleID}`);
      setCom(res);
      type && setLoading(false);
    } catch (error) {
      type && setLoading(false);
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

  // Fetch comments when the category ID changes
  useEffect(() => {
    getComment(1);
  }, [categoryId]);

  /**
   * Submits a new comment to the backend and refreshes the comment list.
   *
   * @returns {Promise<void>}
   */
  const postComment = async () => {
    setBtnLoading(true);
    try {
      const body = {
        content,
        category_id: categoryId,
        cycle: cycleID,
        company_id: companyId
      };
      await request(true).post(`/comments`, body);
      setContent('');
      getComment();
      setBtnLoading(false);
    } catch (error) {
      setBtnLoading(false);
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
   * Deletes a comment by ID and refreshes the comment list.
   *
   * @param {string|number} id - ID of the comment to delete
   * @returns {Promise<void>}
   */
  const deleteComment = async (id) => {
    try {
      await request(true).delete(`/comments/${id}`);
      getComment();
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

  return (
    <div className="padding-x-10 padding-bottom-6 padding-top-6">
      <div className="padding-5 rounded-large background-secondary-2">
        <div>
          <div className="flex-row-middle flex-space-between margin-bottom-5">
            <h6 className="margin-bottom-0 weight-medium">Comments</h6>
          </div>
        </div>
        <div>
          {/* <div className="flex-justify-center margin-y-5">
            <div data-hover="" data-delay="0" className="w-dropdown">
              <div className="rounded-full padding-y-1 padding-left-3 background-secondary-2 w-dropdown-toggle">
                <div className="text-color-body-text w-icon-dropdown-toggle"></div>
                <div className="text-small text-color-body-text">Yesterday</div>
              </div>
              <nav className="background-color-white rounded-large box-shadow-large w-dropdown-list">
                <a href="#" className="dropdown-link w-dropdown-link">
                  Today
                </a>
                <a href="#" className="dropdown-link w-dropdown-link">
                  Last 3 days
                </a>
                <a href="#" className="dropdown-link w-dropdown-link">
                  Last week
                </a>
              </nav>
            </div>
          </div> */}
        </div>
        {loading ? (
          <Flex
            height="100%"
            width="100%"
            mb="10"
            justifyContent="center"
            alignItems="center
           "
          >
            <Spinner />
          </Flex>
        ) : comments && comments.length > 0 ? (
          // Loop through comments and render each one
          comments.map(({content, created_at: createdAt, user_id: userId, user, id}) => (
            <div key={nanoid()}>
              <div className="flex-row border-bottom-1px" style={{marginTop: 5, paddingTop: 5}}>
                <img
                  src={`https://ui-avatars.com/api/?background=random&name=${user?.full_name}`}
                  loading="lazy"
                  alt=""
                  className="width-9 height-9 rounded-full margin-right-4"
                />
                <div>
                  <div className="flex-row-middle">
                    <div>
                      <div className="flex-row-middle">
                        <div className="text-base medium margin-right-2">
                          {user?.full_name || 'N/A'}
                        </div>
                        <div className="text-tiny text-align-left uppercase text-color-body-text">
                          {dayjs(createdAt).calendar(null, {
                            sameDay: 'h:mm A', // The same day ( Today at 2:30 AM )
                            nextDay: '[tomorrow at] h:mm A', // The next day ( Tomorrow at 2:30 AM )
                            nextWeek: 'dddd [at] h:mm A', // The next week ( Sunday at 2:30 AM )
                            lastDay: '[yesterday at] h:mm A', // The day before ( Yesterday at 2:30 AM )
                            lastWeek: '[last] dddd [at] h:mm A', // Last week ( Last Monday at 2:30 AM )
                            sameElse: 'DD/MM/YYYY', // Everything else ( 17/10/2011 )
                          })}
                        </div>
                        {userId === user?.id ? (
                          <Stack
                            _hover={{cursor: 'pointer'}}
                            onClick={() => deleteComment(id)}
                            ml="3"
                          >
                            <div className="text-small text-danger">Delete</div>
                          </Stack>
                        ) : (
                          ''
                        )}
                      </div>
                      <div className="text-small text-color-body-text">
                        {userId === user?.id ? user?.user_type?.value : 'N/A'}
                      </div>
                    </div>
                  </div>

                  <p className="text-small margin-top-3 margin-bottom-5">
                    {/* <span className="text-span">@Benjamin Godswill</span>  */}
                    {content}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <Stack mb="10">
            <Text color="rgba(28, 29, 38, 0.6)">
              Use this section to communicate and collaborate with your team members
            </Text>
            <UnorderedList px="10" color="rgba(28, 29, 38, 0.6)">
              <ListItem>Share files with the team</ListItem>
              <ListItem>Tag anyone with the @</ListItem>
            </UnorderedList>
          </Stack>
        )}
        {/* Comment input field */}
        <div className="form-input small flex-row-middle flex-space-between">
          <Input
            border="none"
            height="2rem"
            value={content}
            _focus={{outline: 'none', border: 'none'}}
            onChange={(e) => setContent(e.target.value)}
            className="text-small text-color-body-text"
            placeholder="Leave a reply..."
          />
          {/* <img src={paperClip} loading="lazy" width="20" alt="" /> */}
        </div>
        {/* Submit button to send comment */}
        <Button
          _focus={{outline: 'none'}}
          isDisabled={content.length < 3}
          isLoading={btnLoad}
          onClick={postComment}
          bg="#00B27A"
          color="white"
          p="2"
          alignSelf="center"
        >
          Send
        </Button>
      </div>
    </div>
  );
};

Comments.propTypes = {
  categoryId: propTypes.any,
  parentId: propTypes.any,
};

export default Comments;
