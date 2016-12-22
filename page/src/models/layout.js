import { message } from 'antd';
import { login, listGroup, addGroup, deleteGroup, updateGroup, detailGroup, groupAddDevice, groupDeleteDevice } from '../services/layout';

export default {

  namespace: 'layout',

  state: {
      selected: [],
      logining: false,
      logined: false,
      tabs: [],
      beacons: [],
      cur:''
  },

  subscriptions: {
    setup({ dispatch, history }) {

        dispatch({
          type: 'getTabs'
        });


      if(localStorage.getItem('logined')){
        dispatch({
          type: 'loginSuccess'
        });
      }


    },
  },

  effects: {
    *login({ payload }, { call, put }) {
      yield put({ type: 'showLogining' })
      const { data } = yield call(login, payload)
      if( !data ) {
        message.error('服务器异常！')
        yield put({ type: 'hideLogining' })
        return
      }
      if (data.success) {
        message.success(data.msg)
        localStorage.setItem('logined', true)
        localStorage.setItem('token', data.token)
        yield put({ type: 'hideLogining' })
        yield put({ type: 'loginSuccess' })
      } else {
        message.error(data.msg)
        yield put({ type: 'hideLogining' })
      }
    },
    *logout({ payload }, { call, put }) {
        localStorage.removeItem('logined')
        localStorage.removeItem('token')
        message.success('注销成功！')
        yield put({ type: 'logoutSuccess' })
    },
    *getTabs({ payload }, { call, put }) {
        const { data } = yield call(listGroup);
        yield put({ 
          type: 'getTabsSuccess',
          payload: {
            tabs: data.data.groups
          }
        });
        const te = data.data.groups;
        if (te.length > 0) {
          yield put({ 
            type: 'detailGroup',
            payload: te[0].group_id + ''
          });
        }
    },
    *addGroup({ payload }, { call, put }) {
        const { data } = yield call(addGroup, payload);
        yield put({ 
          type: 'addGroupSuccess',
          payload: {
            new: data.data
          }
        });
        message.info('服务器返回信息：' + data.errmsg);
    },
    *deleteGroup({ payload }, { call, put }) {
        const { data } = yield call(deleteGroup, payload);
        yield put({ 
          type: 'deleteGroupSuccess'
        });
        message.info('服务器返回信息：' + data.errmsg);
    },
    *updateGroup({ payload }, { call, put }) {
        const { data } = yield call(updateGroup, payload.cur, payload.groupNewName);
        yield put({ 
          type: 'updateGroupSuccess',
          payload
        });
        message.info('服务器返回信息：' + data.errmsg);
    },
    *detailGroup({ payload }, { call, put }) {
        const { data } = yield call(detailGroup, payload);
        yield put({ 
          type: 'getBeaconsSuccess',
          payload: {
            beacons: data.data.devices
          }
        });
    },
    *addDevice({ payload }, { call, put }) {
        const { data } = yield call(groupAddDevice, payload.cur, payload.deviceId);
        console.log(data)
        message.info(data.errmsg);
        yield put({ 
          type: 'detailGroup',
          payload: payload.cur
        });
    },
    *deleteDevice({ payload }, { call, put }) {
        const { data } = yield call(groupDeleteDevice, payload.cur, payload.selected);
        yield put({ 
          type: 'deleteDeviceSuccess'
        });
    },
  },

  reducers: {
    showLogining(state) {
      return { ...state, logining: true }
    },
    hideLogining(state) {
      return { ...state, logining: false }
    },
    loginSuccess(state) {
      return {...state, logined: true}
    },
    logoutSuccess(state) {
      return {...state, logined: false}
    },
    getTabsSuccess(state, action) {
      const tabs = action.payload.tabs;
      if (tabs.length > 0) {
        state.cur = tabs[0].group_id + '';
      }
      return {...state, ...action.payload}
    },
    changeCur(state, action) {
      return {...state, ...action.payload}
    },
    addGroupSuccess(state, action) {
      state.cur = action.payload.new.group_id + '';
      state.tabs.push(action.payload.new);
      return {...state}
    },
    deleteGroupSuccess(state, action) {
      const newd = state.tabs.filter((tab) => {
        return tab.group_id !== parseInt(state.cur)
      });
      state.tabs = newd;
      if (state.tabs.length > 0) {
        state.cur = state.tabs[state.tabs.length-1].group_id + '';
      } else {
        state.cur = '';
      }
      return {...state}
    },
    updateGroupSuccess(state, action) {
      state.tabs.forEach((tab) => {
        if(tab.group_id === parseInt(action.payload.cur)){
          tab.group_name = action.payload.groupNewName;
        }
      })
      return {...state}
    },
    getBeaconsSuccess(state, action) {
      const handleBeacons = action.payload.beacons.map((beacon) => {
        beacon.key = beacon.device_id;
        return beacon;
      })
      state.beacons = handleBeacons;
      return { ...state }
    },
    selectSuccess(state, action) {
      state.selected = action.payload;
      return { ...state }
    },
    deleteDeviceSuccess(state, action) {
      let t = state.beacons;
      state.selected.forEach((s) => {
        t = t.filter((beacon) => {
          return parseInt(beacon.device_id) !== s.device_id;
        })
      })
      state.selected = [];
      state.beacons = t;
      return { ...state }
    }
  },

}
