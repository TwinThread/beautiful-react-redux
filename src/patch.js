import * as reduxES from 'react-redux';
import {connect} from './index';

let patched = false;

try {
  reduxES.connect = connect;
  patched = true;
} catch (e) {}

if (!patched) {
  console.error('beautiful-react-redux: could not patch redux, please use {connect} from "beautiful-react-redux" instead of "react-redux"');
}