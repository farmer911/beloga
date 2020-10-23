import React, { Component } from 'react';
import { TagInputSkill } from '../../tag-input-skill/tag-input-skill';
import styles from './skill-form.module.scss';
import { FormError } from '../../form-error/form-error';
import { confirmAlert } from 'react-confirm-alert';

interface SkillFormPropTypes {
  form: any;
  isModalOpen: boolean;
  onSubmit: any;
  isLoading: boolean;
  title: string;
  submitBtnTitle: string;
  handleSubmitAction?: any;
  handleClose?: any;
}
interface SkillFormStateTypes {
  skills?: any;
  addSkill?:any;
  requireMessage?: string;
  canSubmit?:boolean;
}

class SkillForm extends Component<SkillFormPropTypes, SkillFormStateTypes> {
  constructor(props: any) {
    super(props);
    this.state = { skills: [],addSkill:[], requireMessage: '' };
  }
  skills = {
    name: 'skills',
    options: [
      {
        initialValue: []
      }
    ]
  };
  tagInputSkill: any
  
  componentDidUpdate(nextprops: any) {
    const { form } = this.props;
    const { getFieldProps } = form;
    const fieldProps = { ...getFieldProps(this.skills.name) };
    const currentSkills = fieldProps.value;
    if (currentSkills && currentSkills.length && this.state.skills.length === 0) {
      this.setState({ skills: currentSkills });
    }
    if(this.state.skills.length >0 && this.state.addSkill.length==0){
      const newSkill = JSON.parse(JSON.stringify(this.state.skills));
      this.setState({addSkill:newSkill});
    }
  }

  addSkills = (Skills: any = {}) => {
    this.setState({ skills: Skills, requireMessage: '' });
  };
  removeSkills = (skills :any) => {
    let { addSkill } = this.state;
    // addSkill.splice(index, 1);
    this.setState({ skills :skills });
  };
  onUpdateSkills = (data: any) => {
    const {
      form: { setFieldsValue }
    } = this.props;
    // update
    this.setState({ skills: data });
    setFieldsValue({ skills: data });
  };

  titleCase = (str: string) => {
    let splitStr = str.split(' ');
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  };

  convertArrData = (data: any) => {
    for(let i = 0; i < data.length; i++){
      data[i].name = this.titleCase(data[i].name);
    }
    return data;
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    const { form, onSubmit, isLoading, handleSubmitAction } = this.props;
    const { skills,addSkill } = this.state;
    if (this.state.requireMessage !== '') {
      this.setState({ requireMessage: '' });
    }
    form.validateFields((error: any, value: any) => {
      let canSubmit = true
      skills.forEach((element: any) => {
        if (element['name'] === '' || element['level'] === 0){
          canSubmit = false
          return false;
        }
      });

      if (canSubmit){
        const newValue = { skills: this.convertArrData(skills) };
        !isLoading && handleSubmitAction(newValue);
      }else{
        this.showRequiredMessage()
      }

    });
  };
  handleClose = () => {
    const { handleClose } = this.props;
    const {skills, addSkill} = this.state;
    if(skills !== addSkill){
      this.setState({skills:addSkill}); 
    }
    this.tagInputSkill();
    handleClose();
  };

  showRequiredMessage = () => {
    this.setState({ requireMessage: 'Skill name is required and Please choose level.' });
  };

  renderErrorSection = (name: string) => {
    const { getFieldError } = this.props.form;
    const errors = getFieldError(name);
    return errors
      ? errors.map((err: any, index: any) => {
          return <FormError key={index} text={err} />;
        })
      : null;
  };
  onClickQuestion = () => {
    confirmAlert({
      customUI: (data: any) => {
        const { onClose } = data;
        return (
          <div className="custom-ui-question">
            <a className="custom-close-confirm" onClick={onClose}>
              <img src="/images/icons/close-modal.png" />
            </a>
            <div>
              <p className="confirm-message">Add new Skill:</p>
              <div>
                <p>- Software/Tool Skills (ie: Microsoft Suite)</p>
              </div>
              <div>
                <p>- People Skills (ie: Communication)</p>
              </div>
              <div>
                <p>- Academic/Work Skills (ie: Sales)</p>
              </div>
              <div>
                <p>- Any other relevant skills to your background</p>
              </div>
            </div>
            <div>
              <br/>
              <p className="confirm-message">Level of Skill:</p>
              <div>
                <p>1 - Basic</p>
              </div>
              <div>
                <p>2 - Novice</p>
              </div>
              <div>
                <p>3 - Intermediate</p>
              </div>
              <div>
                <p>4 - Advanced</p>
              </div>
              <div>
                <p>5 - Expert</p>
              </div>
            </div>
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
  render() {
    const { title, form, isModalOpen, handleSubmitAction, handleClose } = this.props;
    const { getFieldProps } = form;
    const errorSection = this.renderErrorSection(this.skills.name);
    return (
      <React.Fragment>
        <form
          className={styles['form']}
          onSubmit={(e: any) => {
            e.preventDefault();
          }}
          // onSubmit={handleSubmitAction}
        >
          <div className="container">
            <div style={{ marginBottom: 10, display: 'flex', justifyContent:'space-between'}}>
            <div style={{display:'flex', marginTop: 13}}>
              <h5 className={styles['about-title']} style={{ display: 'inline-block' }}>
                PROFESSIONAL SKILLS
              </h5>
              <span>
                <i
                  className="fa fa-question-circle"
                  onClick={this.onClickQuestion}
                  style={{ color: '#39a0e8', marginLeft: 10, fontSize: 18, cursor: 'pointer' }}
                />
              </span>
              </div>
              <div style={{display:'flex', paddingTop:5}}>
                <span className={styles['check-button']}>
                  <i className="fa fa-check-circle" onClick={this.handleSubmit}/>
                  <span className={styles['tooltiptext']}>Save</span>
                </span>
                <span className={styles['cancle-button']}>
                  <i className="fa fa-times-circle" onClick={this.handleClose} />
                  <span className={styles['tooltiptext']}>Cancel</span>
                </span>
              </div>
            </div>
            <div className="row">
              {/* skill tag-input */}
              <div className="col-12 text-left" style={{ paddingLeft: 0, paddingRight: 0 }}>
                <TagInputSkill
                  placeHolder="Enter skill"
                  resetskill={(skill:any)=>{
                    this.tagInputSkill= skill
                  }}
                  // {...getFieldProps(this.Skillss.name, this.Skillss.options)}
                  addSkills={this.addSkills}
                  showRequiredMessage={this.showRequiredMessage}
                  removeSkills={this.removeSkills}
                  onUpdateSkills={this.onUpdateSkills}
                  isModalOpen={isModalOpen}
                  {...getFieldProps(this.skills.name)}
                />
                {this.state.requireMessage ? (
                  <div className="error-group-modal">
                    <FormError text={this.state.requireMessage} />
                  </div>
                ) : null}

                {errorSection ? (
                  <div className="error-group-modal">{this.renderErrorSection(this.skills.name)}</div>
                ) : null}
              </div>
            </div>
            {/* <div className={`col-12 col-md-12 d-flex justify-content-center ${styles['save-button']}`}>
              <a className="btn-save-form" href="#" onClick={this.handleSubmit}>
                Save
              </a>
            </div> */}
          </div>
        </form>
      </React.Fragment>
    );
  }
}

export default SkillForm;
