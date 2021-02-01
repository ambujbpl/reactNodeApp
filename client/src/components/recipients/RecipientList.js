import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchRecipients, deleteRecipient } from './../../actions';
class RecipientsList extends Component {
  componentDidMount() {
    this.props.fetchRecipients();
  }
  deleteRecipientItem = (id) => {
    console.log('delete id : ',id);
    this.props.deleteRecipient(id,this.props.history);
  }
  updateRecipientList = () => {
    if(this.props.recipients.length > 0){
      console.log(this.props.recipients);
      return this.props.recipients.map(recipient => {
        return (
          <div className="card blue-grey darken-1" key={recipient._id}>
            <div className="card-content">
              <span className="card-title">{recipient.recipientName}</span>
              <p>
                {recipient.emailList}
              </p>
              <p className="right">
                Created At: {new Date(recipient.createdDate).toLocaleDateString()}
              </p>
            </div>
            <div className="card-action">
              <a>Edit : </a>
              <button onClick={()=> this.deleteRecipientItem(recipient._id)}>Delete</button>
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