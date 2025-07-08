import React, {useEffect, useState} from 'react';
// import leftAvatar from 'assets/images/LeftAvatar.svg';
// import paperClip from 'assets/images/paperclip.svg';
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


/**
 * Comments component allows users to view, post, and delete comments related to a specific
 * assessment category. Comments are associated with a company and an assessment cycle.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string|number} props.categoryId - ID of the selected category
 * @param {string|number} props.companyId - ID of the current company
 * @param {Object} props.cycle - Current assessment cycle object
 * @returns {JSX.Element} Comment interface including existing messages and input field
 */
const Comments = ({categoryId, companyId, cycle}) => {
  const toast = useToast();
  const [comments, setCom] = useState(null);
  const [loading, setLoading] = useState();
  const [btnLoad, setBtnLoading] = useState(false);
  const [content, setContent] = useState('');

  /**
   * Fetches comments for the given category, company, and cycle.
   * Optionally triggers loading spinner if type is truthy.
   *
   * @param {boolean} type - Whether to show loading spinner
   * @returns {Promise<void>}
   */
  const getComment = async (type) => {
    type && setLoading(true);
    try {
      const {data: res} = await request(true).get(`/comments/list/category/${categoryId}?company_id=${companyId}&cycle_id=${cycle.id}`);
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

  // Re-fetch comments when categoryId changes
  useEffect(() => {
    getComment(1);
  }, [categoryId]);

  /**
   * Sends a new comment to the backend and refreshes the comment list.
   *
   * @returns {Promise<void>}
   */
  const postComment = async () => {
    setBtnLoading(true);
    try {
      const body = {
        cycle: cycle.id,
        content,
        category_id: categoryId,
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
   * Deletes a specific comment by ID and refreshes the comment list.
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

  // Render the comments UI with a list of existing comments and an input box
  return (
    <div className="padding-x-10 padding-bottom-6 padding-top-6">
      <div className="padding-5 rounded-large background-secondary-2">
        <div>
          <div className="flex-row-middle flex-space-between margin-bottom-5">
            <h6 className="margin-bottom-0 weight-medium">Comments</h6>
          </div>
        </div>
        <div>
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
              Use this field for:
              <br />
              a. Capturing comments and context relating to the attached evidence, such as to
              highlight a specific section.
              <br />
              b. Explaining the context of your selected response where there is no documentation to
              attach as evidence.
              <br />
              c. Collaborations between members of the company team responsible for MFI inputs;
              document sharing or tagging individuals (@name of individual) for further action.
            </Text>
            <UnorderedList px="10" color="rgba(28, 29, 38, 0.6)">
              <ListItem>Share files with your team</ListItem>
              <ListItem>Tag anyone with @</ListItem>
            </UnorderedList>
          </Stack>
        )}
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
  companyId: propTypes.any,
  cycle: propTypes.any
};

export default Comments;
