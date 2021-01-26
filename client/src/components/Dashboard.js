import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchSurvey } from '../actions'
class Dashboard extends React.Component {
  componentDidMount(){
    this.props.fetchSurvey();
  }
  updateSurveyList = () => {
    return this.props.surveys.map(survey => {
      return (
        <div className="card blue-grey darken-1" key={survey._id}>
          <div className="card-content">
            <span className="card-title">{survey.title}</span>
            <p>
              {survey.body}
            </p>
            <p className="right">
              Sent On: {new Date(survey.dateSent).toLocaleDateString()}
            </p>
          </div>
          <div className="card-action">
            <a>Yes : {survey.yes}</a>
            <a>No : {survey.no}</a>
          </div>
        </div>
      );
    })    
  }
  render(){
    return (
      <div>
        Dashboard <br/>
        {this.updateSurveyList()}
        <div className="fixed-action-btn">
          <Link to="/surveys/new" className="btn-floating btn-large red">
            <i className="material-icons">add</i>
          </Link>
        </div>
      </div>
    );
  }
};

const mapStateToProp = state => {
  return {
    surveys: state.surveys
  }
}

export default connect(mapStateToProp,{fetchSurvey})(Dashboard);
