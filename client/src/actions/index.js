import axios from 'axios';
import { FETCH_USER, FETCH_SURVEYS, FETCH_RECIPIENTS } from './types';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToken = token => async dispatch => {
  const res = await axios.post('/api/stripe', token);

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const submitSurvey = (values, history) => async dispatch => {
  const res = await axios.post('/api/surveys', values);

  history.push('/surveys');
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchSurvey = () => async dispatch => {
  const res = await axios.get('/api/surveys');

  dispatch({ type: FETCH_SURVEYS, payload: res.data });
};

export const deleteSurvey = (id) => async dispatch => {
  const res = await axios.post(`/api/deleteSurvey`, {id});
  // history.push('/recipients');
  const res1 = await axios.get('/api/surveys');
  dispatch({ type: FETCH_SURVEYS, payload: res1.data });
}

export const fetchRecipients = () => async dispatch => {
  const res = await axios.get('/api/recipientList');

  dispatch({ type: FETCH_RECIPIENTS, payload: res.data });
};

export const deleteRecipient = (id,history) => async dispatch => {
  const res = await axios.post(`/api/deleteRecipient`, {id});
  history.push('/recipients');
  const res1 = await axios.get('/api/recipientList');
  dispatch({ type: FETCH_RECIPIENTS, payload: res1.data });
};