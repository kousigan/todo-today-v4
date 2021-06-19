import React, { useState, useEffect } from 'react';
import Parse from '../parse';
import FeatherIcon from 'feather-icons-react';

export default function Task(data) {
  const [listItem, setListItem] = useState(data.item.taskName);
  const [edit, setEdit] = useState(false);
  const [val, setVal] = useState('');
  const [status, setStatus] = useState(data.status);
  const [showUpdate, setShowUpdate] = useState(null);
  const [condition, setCondition] = useState(data);

  function changeEdit() {
    edit == true ? setEdit(false) : setEdit(true);
  }
  async function updateTask(event) {
    setVal(event.target.value);
    if (event.key === 'Enter') {
      const query = new Parse.Query('task');
      try {
        const object = await query.get(data.id);
        object.set('taskName', val);
        try {
          const response = await object.save();
          // setListItem(val);
          data.setVal(val, data.id);
          setEdit(false);
        } catch (error) {
          console.error('Error while updating task', error);
        }
      } catch (error) {
        console.error('Error while retrieving object task', error);
      }
    }
    if (event.key === 'Escape') {
      setEdit(false);
    }
  }
  async function updateStatus() {
    const query = new Parse.Query('task');
    setShowUpdate('updating...');
    try {
      const object = await query.get(data.id);
      object.set('status', !data.item.status);
      try {
        const response = await object.save();
        // setStatus(!status);
        setShowUpdate(null);
        data.setStatus(!data.item.status, data.id);
      } catch (error) {
        console.error('Error while updating task', error);
      }
    } catch (error) {
      console.error('Error while retrieving object task', error);
    }
  }
  async function deleteTask() {
    const query = new Parse.Query('task');
    try {
      // here you put the objectId that you want to delete
      const object = await query.get(data.id);
      setShowUpdate('deleting task...');

      try {
        const response = await object.destroy();
        setTimeout(() => {
          setShowUpdate('');
          data.removeTask(data.id);
        });
      } catch (error) {
        console.error('Error while deleting ParseObject', error);
      }
    } catch (error) {
      console.error('Error while retrieving ParseObject', error);
    }
  }
  const d = new Date();
  if (
    condition
    // data.status == false ||
    // (data.status == true &&
    //   d.getDate() == data.createdAt.getDate() &&
    //   d.getMonth() == data.createdAt.getMonth() &&
    //   d.getFullYear() == data.createdAt.getFullYear())
  ) {
    return (
      <li>
        <p className="taskItem" data-status={data.item.status}>
          <span onClick={updateStatus}> {data.item.taskName}</span>
          <span className="editLink" onClick={changeEdit}>
            <FeatherIcon icon="edit" />
          </span>
          <span className="editLink" onClick={deleteTask}>
            <FeatherIcon icon="trash" />
          </span>
          <br />
          {showUpdate ? showUpdate : ''}
          {edit ? (
            <input
              type="text"
              onKeyUp={updateTask}
              defaultValue={data.task}
              autoFocus
            />
          ) : (
            ''
          )}
        </p>
        <span className="createdAt">
          <PendingCheck date={data.createdAt} />
        </span>
      </li>
    );
  } else {
    return '';
  }
}

function statusCheck() {}

function PendingCheck(data) {
  const d = new Date();

  if (
    d.getDate() == data.date.getDate() &&
    d.getMonth() == data.date.getMonth() &&
    d.getFullYear() == data.date.getFullYear()
  ) {
    return <i className="today">TODAY</i>;
  } else {
    return (
      <i className="previous">
        {data.date.getDate()}-{data.date.getMonth() + 1}-
        {data.date.getFullYear()}
      </i>
    );
  }
}
