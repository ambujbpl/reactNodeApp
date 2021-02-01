import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchRecipients, deleteRecipient } from './../../actions';
class RecipientsList extends Component {
  componentDidMount() {
    this.props.fetchRecipients();
  }
  deleteRecipientItem = (id) => {
    this.props.deleteRecipient(id,this.props.history);
  }
  updateEmailList = (email) => {
    return email.split(',').map((e,i) => {
      return <li key={i}>{e}</li>  
    });
    
  }
  updateRecipientList = () => {
    if(this.props.recipients.length > 0){
      return this.props.recipients.map(recipient => {
        return (
          <div className="card blue-grey darken-1" key={recipient._id}>
            <div className="card-content">
              <span className="card-title">{recipient.recipientName}</span>
              <ol>{this.updateEmailList(recipient.emailList)}</ol>
              <p className="right">
                Created At: {new Date(recipient.createdDate).toLocaleDateString()}
              </p>
            </div>
            <div className="card-action">
              <a>Edit : </a>
              <button className="btn red button-small"onClick={()=> this.deleteRecipientItem(recipient._id)}>Delete</button>
            </div>
          </div>
        );
      })
    }
  }
  render(){
    return(
      <div>
        <center><h4>All Recipient Related List</h4></center>
        {this.updateRecipientList()}
        <div className="fixed-action-btn">
          <Link to="/recipients/new" className="btn-floating btn-large red">
            <i className="material-icons">add</i>
          </Link>
        </div>
      </div>  
    )
  }
}
const mapSateToProops = state => {
  return {
    recipients: state.recipients
  }
}
export default connect(mapSateToProops,{fetchRecipients,deleteRecipient})(RecipientsList);