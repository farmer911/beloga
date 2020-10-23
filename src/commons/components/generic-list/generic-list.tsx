import React from 'react';
import styles from './generic-list.module.scss';
import { confirmAlert } from 'react-confirm-alert';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ReportProfileMenu from '../../components/report-profile-menu/report-profile-menu';

interface GenericListPropTypes {
  data: any[];
  title: string;
  mode?: 'readonly' | 'editable';
  ListItemComponent: any;
  hasIcon?: boolean;
  listItemProps?: any;
  onIconClick?: any;
  onIconClick2?: any;
  itemClassName?: string;
  iconClass?: string;
  titleUpperCase?: boolean;
  LoadingComponent?: any;
  isLoading?: boolean;
  WrapperComponent?: any;
  componentModal?: string;
  isShowTitle?: boolean;
  toggleModal?: any;
  classComponent?: string;
  iconTitle?: string;
  messageNoResults?: string;

  viewVideo?: any;
  isShowUploadButton?: boolean;
  isShowButtonVideo?: boolean;
  onPressUploadVideo?: any;
  isExperience?: string;
  isEducation?: string;
  isCert?: any;
  handleArrang?: any;
  arrangeDataFunc?: any;
  isEditListModalOpen?: boolean;
  isResumeVideo?: boolean;
  isPublicPage?: boolean;
  isMyPublicProfile?: boolean;
  toggleReportModal?: Function;
}
const reorder = (list: any, startIndex: any, endIndex: any) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const GenericList = (props: GenericListPropTypes) => {
  const {
    viewVideo,
    isShowUploadButton,
    isShowButtonVideo,
    onPressUploadVideo,
    arrangeDataFunc,
    data,
    title,
    isEditListModalOpen,
    mode = 'editable',
    componentModal = '',
    ListItemComponent,
    listItemProps,
    hasIcon = true,
    onIconClick = () => {},
    onIconClick2 = () => {},
    itemClassName,
    iconClass = 'far fa-edit',
    titleUpperCase = true,
    isShowTitle = true,
    toggleModal = () => {},
    LoadingComponent = <div>...loading</div>,
    WrapperComponent = (props: any) => {
      return <div>{props.children}</div>;
    },
    classComponent = '',
    iconTitle = '',
    messageNoResults = '',
    isLoading = false,
    isEducation,
    isCert,
    isExperience,
    handleArrang,
    isPublicPage,
    isResumeVideo,
    isMyPublicProfile,
    toggleReportModal
  } = props;
  let state = props.data;
  const renderIcon = () => {
    return componentModal == '' ? (
      <a
        className={`edit-on-list styles['icon-a'] icon-edit`}
        onClick={mode === 'editable' ? onIconClick : onIconClick2}
      />
    ) : (
      <a className="btn-modal-add" onClick={mode === 'editable' ? onIconClick : onIconClick2}>
        + Add
      </a>
    );
  };
  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    const skills = reorder(state, result.source.index, result.destination.index);
    state = skills;
    try {
      arrangeDataFunc(skills);
      // (handleArrang(skills));
    } catch (err) {
      //console.log(err.message);
    }
    return state;
  };

  const renderItems = () => {
    // console.log('iss', isEducation, isExperience);
    // console.log('uuuu', componentModal)

    if (isEducation || isExperience || isCert) {
      return data && data.length ? (
        isEditListModalOpen ? (
          data.map((item, index) => (
            <Draggable key={item.id} draggableId={item.id} index={index}>
              {(provided: any, snapshot: any) => (
                <div
                  // key={index}
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                >
                  <div
                    key={index}
                    className={`${styles['item-wrapper']} ${itemClassName}`}
                    style={{ backgroundColor: '#fff' }}
                  >
                    <ListItemComponent data={item} {...listItemProps} mode={mode} />
                  </div>
                </div>
              )}
            </Draggable>
          ))
        ) : (
          data.map((item, index) => (
            <div key={index} className={`${styles['item-wrapper']} ${itemClassName}`}>
              <ListItemComponent data={item} {...listItemProps} mode={mode} />
            </div>
          ))
        )
      ) : (
        <div className={`${componentModal}`}>
          <div className="col-12 col-md-12">
            {messageNoResults ? (
              <p className="component-no-results">{messageNoResults}</p>
            ) : (
              <p className="component-no-results">No {title.toLowerCase()}.</p>
            )}
          </div>
        </div>
      );
    }
    return data && data.length ? (
      data.map((item, index) => (
        <div key={index} className={`${styles['item-wrapper']} ${itemClassName}`}>
          <ListItemComponent data={item} {...listItemProps} mode={mode} />
        </div>
      ))
    ) : (
      <div className={`${componentModal}`}>
        <div className="col-12 col-md-12">
          {messageNoResults ? (
            <p className="component-no-results">{messageNoResults}</p>
          ) : (
            <p className="component-no-results">No {title.toLowerCase()}.</p>
          )}
        </div>
      </div>
    );
  };
  const onClickQuestionEdu = () => {
    confirmAlert({
      customUI: (data: any) => {
        const { onClose } = data;
        return (
          <div className="custom-ui-question">
            <a className="custom-close-confirm" onClick={onClose}>
              <img src="/images/icons/close-modal.png" />
            </a>
            <p className="confirm-message">Add another 30 second video about your Education </p>
            <div className="confirm-button">
              <a onClick={onClose} className="confirm-ok-button">
                Ok
              </a>
            </div>
          </div>
        );
      }
    });
  };
  const onClickQuestionEx = () => {
    confirmAlert({
      customUI: (data: any) => {
        const { onClose } = data;
        return (
          <div className="custom-ui-question">
            <a className="custom-close-confirm" onClick={onClose}>
              <img src="/images/icons/close-modal.png" />
            </a>
            <p className="confirm-message">Add another 30 second video about your Experience </p>
            <div className="confirm-button">
              <a onClick={onClose} className="confirm-ok-button">
                Ok
              </a>
            </div>
          </div>
        );
      }
    });
  };

  const checkPublicProfile = (): boolean => {
    if (
      typeof isResumeVideo !== 'undefined' &&
      typeof isPublicPage !== 'undefined' &&
      typeof isMyPublicProfile !== 'undefined' &&
      !isMyPublicProfile
    ) {
      return true;
    }

    return false;
  };

  const render = () => {
    return (
      <div className={`block-component ${classComponent}`}>
        <div className="block-component-inner">
          <div
            className={`${
              styles[componentModal]
            } block-component-title d-flex justify-content-between align-items-center`}
          >
            <h5 className={`${titleUpperCase ? `text-uppercase` : ''}`}>
              {iconTitle ? <i className={iconTitle} /> : null}
              {isShowTitle ? <span>{title}</span> : ''}
              {componentModal == '' && isShowButtonVideo ? (
                <React.Fragment>
                  <span className="separate-title first-separate">|</span>
                  <a className="view-video-button" onClick={() => viewVideo(title)}>
                    View video
                  </a>
                </React.Fragment>
              ) : null}
            </h5>
            {/* report page */}
            <div className="wrap-action-right">
              {/* {checkPublicProfile() && (
                <div
                  style={{ border: 'none', cursor: 'pointer' }}
                  onClick={() => {
                    if (typeof toggleReportModal === 'undefined') {
                      return;
                    }
                    toggleReportModal();
                  }}
                >
                  <i className="fas fa-ellipsis-h" />
                </div>
              )} */}
              {checkPublicProfile() && (
                <ReportProfileMenu
                  toggleReportModal={() => {
                    if (typeof toggleReportModal === 'undefined') {
                      return;
                    }
                    toggleReportModal();
                  }}
                />
              )}

              {componentModal == '' && isShowUploadButton ? (
                <div className="upload-help-key">
                  {isEducation && (
                    <i
                      className="fa fa-question-circle"
                      onClick={() => {
                        onClickQuestionEdu();
                      }}
                      style={{ color: '#39a0e8', margin: 'auto', paddingRight: 10, fontSize: 18 }}
                    />
                  )}
                  {isExperience && (
                    <i
                      className="fa fa-question-circle"
                      onClick={() => {
                        onClickQuestionEx();
                      }}
                      style={{ color: '#39a0e8', margin: 'auto', paddingRight: 10, fontSize: 18 }}
                    />
                  )}

                  <a
                    className="upload-video-button"
                    onClick={() => {
                      toggleModal();
                      onPressUploadVideo();
                    }}
                  >
                    Upload video
                  </a>
                </div>
              ) : null}
              {hasIcon ? renderIcon() : null}
            </div>
          </div>
          {isEducation || isExperience || isCert ? (
            <div className={`content-list row dragdrop-profile ${componentModal}`}>
              {isLoading ? (
                LoadingComponent
              ) : isEditListModalOpen ? (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppablerr">
                    {(provided: any, snapshot: any) => <div ref={provided.innerRef}>{renderItems()}</div>}
                  </Droppable>
                </DragDropContext>
              ) : (
                renderItems()
              )
              // renderItems()
              }
            </div>
          ) : (
            <div className={`content-list row ${componentModal}`}>
              {isLoading
                ? LoadingComponent
                : //   <DragDropContext onDragEnd={onDragEnd}>
                  //   <Droppable droppableId="droppablerr">
                  //     {(provided: any, snapshot: any) => <div ref={provided.innerRef}>{renderItems()}</div>}
                  //   </Droppable>
                  // </DragDropContext>
                  renderItems()}
            </div>
          )}
        </div>
      </div>
    );
  };
  const grid = 8;
  const getItemStyle = (isDragging: any, draggableStyle: any) => {
    // let left = (document.querySelector(".left-content.belooga-container") as any).offsetLeft;
    return {
      // some basic styles to make the items look a bit nicer
      userSelect: 'none',
      ...draggableStyle,
      left: isDragging ? 30 : 30,
      // left: isDragging ? (window.innerWidth * 0.11) : (window.innerWidth * 0.11),
      // transition: 'transform 0.000000001s ',
      // transition: 'transform 0.000000000001s cubic-bezier(.2,.3,.1,.3), opacity 0.33s cubic-bezier(.2,.3,.1,.3)',
      cursor: 'all-scroll'
    };
  };
  return render();
};
