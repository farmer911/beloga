import React, { Component } from 'react';
import styles from './tag-input-language.module.scss';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// const getSuggestionValue = (suggestion: any) => suggestion.name;

// // Use your imagination to render suggestions.
// const renderSuggestion = (suggestion: any) => (
//   <div className={`${styles['input-wrapper']} d-flex flex-row align-items-center`}>
//     <div className={styles['icon-interest']}>
//       <img className="no-margin-bottom" height={30} src={suggestion.image_url} />
//     </div>
//     <div className={styles['input']}>{suggestion.name}</div>
//   </div>
// );

interface LanguageListItemPropTypes {
  data: any;
}
const reorder = (list: any, startIndex: any, endIndex: any) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
export class TagInputLanguage extends Component<any, any> {
  static defaultProps = {
    value: []
  };
  left: any = null;
  constructor(props: any) {
    super(props);
    this.state = {
      inputValue: '',
      suggestions: [],
      isSelect: 0,
      languages: [],
      isEdit: true,
      selected: null
    };
    this.onDragEnd = this.onDragEnd.bind(this);
    this.props.resetlang(this.resetState);
  }

  componentDidMount() {
    try {
      if(document.querySelector('.left-content.belooga-container')) {
        this.left = (document.querySelector('.left-content.belooga-container') as any).offsetLeft;
      }
    } catch (error) {
      //console.log(error);
    }
  }

  onDragEnd(result: any) {
    // dropped outside the list
    const { onUpdateLanguage } = this.props;
    if (!result.destination) {
      return;
    }

    const languages = reorder(this.state.languages, result.source.index, result.destination.index);
    onUpdateLanguage(languages);
    // this.setState({
    //   languages
    // });
  }
  componentWillReceiveProps(nextprops: any) {
    const { isModalOpen } = nextprops;
    // console.log(this.props)
    if (nextprops.value && this.props.value !== nextprops.value) {
      this.setState({ languages: nextprops.value });
    }

    if (!isModalOpen && isModalOpen !== this.props.isModalOpen) {
      // onClose
      this.setState({
        selected: null,
        isEdit: false
      });
    }
  }
  getfocus = () => {
    const _focus = document.getElementById('text-input-detail-lg');
    if (_focus) {
      // _focus.blur();
      setTimeout(function() {
        _focus.focus();
      }, 100);
    }
  };
  onChangeSelect = (event: any) => {
    this.setState({ isSelect: event.target.value });
  };
  onChangeText = (event: any) => {
    this.setState({ inputValue: event.target.value });
  };

  renderInputComponent = () => {
    const { placeHolder } = this.props;
    return (
      <div className={styles['input-container']}>
        <div className={styles['text-input']}>
          <input
            placeholder={placeHolder}
            onChange={this.onChangeText}
            value={this.state.inputValue}
          />
        </div>
        <div className={styles['select-input']}>
          <select
            value={this.state.isSelect}
            onChange={this.onChangeSelect}
            style={{ height: 33, borderRadius: '5px', backgroundColor: '#ffffff', padding: 'inherit', paddingLeft: 10 }}
          >
            <option value="0">Level</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div className={styles['button-input']}>
          <button onClick={this.addLanguage} className="btn-modal-add-default" style={{ height: 33, marginTop: 1 }}>
            +
          </button>
        </div>
      </div>
    );
  };

  addLanguage = () => {
    const { inputValue, isSelect, languages } = this.state;
    const { addLanguage, showRequiredMessage } = this.props;
    if (inputValue === '' || isSelect === 0) {
      showRequiredMessage();
      return;
    }
    const language = {
      name: inputValue,
      level: parseInt(isSelect)
    };
    if (inputValue !== '' && isSelect !== 0) {
      const _lang = [...languages];
      _lang.push(language);
      addLanguage(_lang);
      this.setState({ inputValue: '', isSelect: 0, languages: _lang });
    }
    this.getfocus();
    return;
  };
  resetState = () => {
    this.setState({
      inputValue: '',
      suggestions: [],
      isSelect: 0,
      languages: [...this.props.value],
      isEdit: true,
      selected: null
    });
  };
  renderDataLanguage = () => {
    const { languages, isEdit } = this.state;
    if (languages.length > 0) {
      return languages.map((v: any, index: number) => (
        <Draggable key={index} draggableId={index.toString()} index={index}>
          {(provided: any, snapshot: any) => (
            <div
              className={styles['input-container']}
              // key={index}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={getItemStyle(snapshot.isDragging, provided.draggableProps.style, this.left)}
            >
              <div className={styles['text-input']}>
                {/* {isEdit && index == selected ? ( */}
                <input onChange={this.onChangeTextSelect.bind(this, index)} autoFocus value={v.name} className="====" />
                {/* ) : (
                  <input value={v.name} readOnly />
                )} */}
              </div>
              <div className={styles['select-input']}>
                {/* {isEdit && index == selected ? ( */}
                <select
                  value={v.level}
                  onChange={this.onChangeSelected.bind(this, index)}
                  style={{
                    height: 33,
                    borderRadius: '5px',
                    backgroundColor: '#ffffff',
                    padding: 'inherit',
                    paddingLeft: 10
                  }}
                >
                  <option value="0">Level</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                {/* ) : (
                  <input value={v.level} readOnly />
                )} */}
              </div>
              <div className={styles['button-input']}>
                {/* {isEdit && selected == index ? (
                  <i
                    className="fa fa-check-circle"
                    style={{ margin: '10px 5px 10px 10px', color: '#50cec0', fontSize: 25 }}
                    onClick={this.editLanguage.bind(this, index)}
                  />
                ) : (
                  <img
                    src="/images/iconPopup/group.svg"
                    style={{ margin: 10, marginRight: 5, marginLeft: 10, cursor: 'pointer' }}
                    onClick={this.editLanguage.bind(this, index)}
                  />
                )} */}
                {/* <img
                  src="/images/iconPopup/group-2.svg"
                  style={{ margin: 1, marginLeft: 5, marginRight: 0, cursor: 'pointer' }}
                  onClick={this.submit.bind(this, index)}
                /> */}
                <i
                  className="fa fa-times"
                  onClick={this.submit.bind(this, index)}
                  style={{ marginTop: 8, cursor: 'pointer', fontSize: 18, color: 'red' }}
                />
              </div>
            </div>
          )}
        </Draggable>
      ));
    }
  };

  onChangeTextSelect = (index: number, event: any) => {
    const { selected, languages } = this.state;
    const { onUpdateLanguage } = this.props;
    languages[index].name = event.target.value;
    this.setState({ languages });
    onUpdateLanguage(languages);
  };
  onChangeSelected = (index: number, event: any) => {
    const { selected, languages } = this.state;
    const { showRequiredMessage } = this.props;
    if (parseInt(event.target.value) === 0) {
      showRequiredMessage();
      return;
    }
    languages[index].level = parseInt(event.target.value);
    this.setState({ languages });
    const { onUpdateLanguage } = this.props;
    onUpdateLanguage(languages);
  };
  submit = (index: any) => {
    const _seft = this;
    try {
      confirmAlert({
        customUI: (data: any) => {
          const { onClose } = data;
          return (
            <div className="custom-ui-confirm">
              <a className="custom-close-confirm" onClick={onClose}>
                <img src="/images/icons/close-modal.png" />
              </a>
              <p className="confirm-message">Are you sure you want to delete this language?</p>
              <div className="confirm-button">
                <a onClick={_seft.removeLanguage.bind(_seft, index, onClose)} className="confirm-ok-button">
                  OK
                </a>
                <a onClick={onClose} className="confirm-cancel-button">
                  Cancel
                </a>
              </div>
            </div>
          );
        }
      });
    } catch (e) {
      //console.log(e.message);
    }
  };
  removeLanguage = (index: number, callback: any) => {
    const { removeLanguage } = this.props;
    const { languages } = this.state;
    const _langua = [...languages];
    _langua.splice(index, 1);
    removeLanguage(_langua);
    this.setState({ languages: _langua });
    callback();
  };
  editLanguage = (index: number) => {
    const { selected } = this.state;
    if (selected == index) {
      this.setState({ isEdit: false, selected: null });
    } else {
      this.setState({ isEdit: true, selected: index });
    }
  };
  render() {
    return (
      <React.Fragment>
        <div className="drag-input">
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided: any, snapshot: any) => <div ref={provided.innerRef}>{this.renderDataLanguage()}</div>}
            </Droppable>
          </DragDropContext>
        </div>
        {this.renderInputComponent()}
      </React.Fragment>
    );
  }
}
const grid = 8;
const getItemStyle = (isDragging: any, draggableStyle: any, left: any) => {
  
  return {
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    ...draggableStyle,
    left: isDragging ? left : 0,
    // left: isDragging ? (window.innerWidth * 0.11) : (window.innerWidth * 0.11),
    // transition: 'transform 0.33s cubic-bezier(.2,.3,.1,.3), opacity 0.33s cubic-bezier(.2,.3,.1,.3)',
    cursor: 'all-scroll'
  };
};
