import request from '../utils/request';
import qs from 'qs';

export async function login (params) {
  return request('/api/login', {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(params)
  });
}

export async function listGroup () {
  return request('/api/groupList');
}

export async function addGroup (groupName) {
  return request('/api/groupAdd', {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        groupName: groupName
    })
  });
}

export async function deleteGroup (groupId) {
  return request('/api/groupDelete', {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        groupId: groupId
    })
  });
}

export async function updateGroup (groupId, groupNewName) {
  return request('/api/groupUpdate', {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        groupId: groupId,
        groupNewName: groupNewName
    })
  });
}

export async function detailGroup (groupId) {
  return request('/api/groupDetail', {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        groupId: groupId
    })
  });
}

export async function groupAddDevice (groupId, deviceId) {
  return request('/api/groupAddDevice', {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        groupId: groupId,
        deviceId: deviceId
    })
  });
}

export async function groupDeleteDevice (groupId, deviceIdentifiers) {
  return request('/api/groupDeleteDevice', {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        groupId: groupId,
        deviceIdentifiers: deviceIdentifiers
    })
  });
}

