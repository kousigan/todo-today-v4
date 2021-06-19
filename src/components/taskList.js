import React, { useState } from 'react';
import Parse from '../parse';
import Task from './task';
import FeatherIcon from 'feather-icons-react';

export default class TaskList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      sortedData: [],
      tname: '',
      showStatus: 1,
      error: false
    };
  }
  componentDidMount() {
    this.GETALLTASKS();
  }
  Test = () => {
    console.log('parent state');
  };
  GETALLTASKS = async () => {
    const task = Parse.Object.extend('task');
    const query = new Parse.Query(task);
    query.equalTo('boardId', this.props.boardId);
    try {
      const results = await query.find();
      this.CREATELIST(results);
    } catch (error) {
      console.error('Error while fetching task', error);
    }
  };
  CREATELIST = results => {
    this.setState({ data: [] });
    const d = new Date();
    for (const object of results) {
      // Access the Parse Object attributes using the .GET method
      const taskId = object.id;
      const taskName = object.get('taskName');
      const status = object.get('status');
      const archive = object.get('archive');
      const boardId = object.get('boardId');
      const createdAt = object.get('createdAt');

      this.setState({
        data: [
          ...this.state.data,
          {
            taskName: taskName,
            taskId: taskId,
            status: status,
            boardId: boardId,
            createdAt: createdAt
          }
        ].reverse()
      });
    }
    this.SETNEWARRAY();
  };
  CREATENEWTASK = async event => {
    this.setState({ tname: event.target.value, error: null });
    if (event.key === 'Enter') {
      if (this.state.tname.length > 2) {
        const myNewObject = new Parse.Object('task');
        myNewObject.set('taskName', this.state.tname);
        myNewObject.set('status', false);
        myNewObject.set('archive', false);
        myNewObject.set('boardId', this.props.boardId);
        try {
          const result = await myNewObject.save();
          // Access the Parse Object attributes using the .GET method
          this.GETALLTASKS();
          this.setState({ tname: '' });
        } catch (error) {
          this.setState({ error: error.message });
        }
      } else {
        const temp = () => {
          return (
            <p className="response error">
              {' '}
              Task should be more than 3 characters.
            </p>
          );
        };
        this.setState({
          error: temp()
        });
      }
    }
  };
  SETNEWARRAY = () => {
    switch (this.state.showStatus) {
      case 0:
        return this.GETALL();
      case 1:
        return this.GETPENDING();
      case 2:
        return this.GETCOMPLETED();
      default:
        return this.GETALL();
    }
  };
  GETCOMPLETED = () => {
    this.setState({ showStatus: 2 });
    this.setState({
      sortedData: [...this.state.data.filter(item => item.status === true)]
    });
  };
  GETPENDING = () => {
    this.setState({ showStatus: 1 });
    this.setState({
      sortedData: [...this.state.data.filter(item => item.status === false)]
    });
  };
  GETALL = () => {
    this.setState({ showStatus: 0 });
    this.setState({
      sortedData: [...this.state.data]
    });
  };
  SETITEMVALUE = (item_, id_) => {
    this.state.data.find(item => this.FINDITEM(item, id_)).taskName = item_;
    // this.setState({ sortedData: [...this.state.data] });
    this.SETNEWARRAY();
  };
  SETITEMSTATUS = (status_, id_) => {
    this.state.data.find(item => this.FINDITEM(item, id_)).status = status_;
    // this.setState({ sortedData: [...this.state.data] });
    this.SETNEWARRAY();
  };
  REMOVEITEM = id => {
    var temp = this.state.data;
    temp.splice(temp.findIndex(item => item.taskId == id), 1);
    this.setState({ data: temp });
    this.SETNEWARRAY();
  };
  FINDITEM = (item, id) => {
    if (item.taskId == id) {
      return item;
    }
  };

  render() {
    const d = new Date();
    return (
      <div className="board">
        <h5>
          {this.props.board} <br />
          <select>
            <option onClick={this.GETALL}>All </option>
            <option selected onClick={this.GETPENDING}>
              Pending
            </option>
            <option onClick={this.GETCOMPLETED}>Completed</option>
          </select>{' '}
          <span className="taskCount">{this.state.sortedData.length}</span>{' '}
        </h5>
        <div className="taskForm">
          <input
            type="text"
            name="newtask"
            id="newtask"
            placeholder="Add task"
            onKeyUp={this.CREATENEWTASK}
          />
        </div>
        {this.state.error}

        <ol>
          {this.state.sortedData.length > 0
            ? this.state.sortedData.map((item, i) => {
                return (
                  <Task
                    key={i}
                    runtask={this.Test}
                    task={item.taskName}
                    id={item.taskId}
                    status={item.status}
                    createdAt={item.createdAt}
                    item={item}
                    setVal={this.SETITEMVALUE}
                    setStatus={this.SETITEMSTATUS}
                    removeTask={this.REMOVEITEM}
                  />
                );
              })
            : ''}
        </ol>
      </div>
    );
  }
}
