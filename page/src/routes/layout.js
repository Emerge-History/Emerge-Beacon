import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';

import styles from './layout.less';
import Login from '../components/layout/login';
import Tab from '../components/layout/tab';

const Layout = ({ location, dispatch, layout, children }) => {

  const { logined, logining, tabs, cur, beacons, selected } = layout;

  const loginProps = {
    logining,
    onLogin({ account, password }) {
      dispatch({
        type: 'layout/login',
        payload: {
          account,
        password}
      })
    }
  }

  const tabProps = {
    tabs,
    beacons,
    cur,
    selected,
    onSelect(deviceIdentifiers) {
      dispatch({
        type: 'layout/selectSuccess',
        payload: deviceIdentifiers
      });
    },
    changeCur(id){
      dispatch({
        type: 'layout/changeCur',
        payload: {
          cur: id
        }
      });
      dispatch({
        type: 'layout/detailGroup',
        payload: id
      });
    },
    onLogout() {
      dispatch({
        type: 'layout/logout'
      })
    },
    addGroup(groupName) {
     dispatch({
        type: 'layout/addGroup',
        payload: groupName
      })
    },
    deleteGroup() {
     dispatch({
        type: 'layout/deleteGroup',
        payload: cur
      })
    },
    updateGroup(groupNewName) {
     dispatch({
        type: 'layout/updateGroup',
        payload: {cur, groupNewName}
      })
    },
    addDevice(deviceId) {
     dispatch({
        type: 'layout/addDevice',
        payload: {cur, deviceId}
      })
    },
    deleteDevice() {
     dispatch({
        type: 'layout/deleteDevice',
        payload: {cur, selected}
      })
    },
  }


  if (!logined) {
    return <Login {...loginProps} />
  } 
  return <Tab {...tabProps} />


}

Layout.propTypes = {
};


const mapStateToProps = ({ layout }) => ({ layout });

export default connect(mapStateToProps)(Layout);


