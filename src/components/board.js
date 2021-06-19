import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Parse from '../parse';
import TaskList from './taskList';
import FeatherIcon from 'feather-icons-react';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      bname: '',
      error: false,
      showArchive: false
    };
  }
  componentDidMount() {
    this.GETALLBOARDS();
  }
  CREATEBOARD = async () => {
    if (this.state.bname.length > 2) {
      const myNewObject = new Parse.Object('board');
      myNewObject.set('projectId', this.props.pid);
      myNewObject.set('boardName', this.state.bname);
      myNewObject.set('archive', false);
      try {
        const result = await myNewObject.save();
        this.GETALLBOARDS();
      } catch (error) {
        this.setState({ error: error.message });
      }
    } else {
      const temp = () => {
        return (
          <p className="response error">
            {' '}
            Board name should be more than 3 characters.
          </p>
        );
      };
      this.setState({
        error: temp()
      });
    }
  };
  GETALLBOARDS = async () => {
    const board = Parse.Object.extend('board');
    const query = new Parse.Query(board);
    query.equalTo('projectId', this.props.pid);
    try {
      const results = await query.find();
      this.CREATELIST(results);
    } catch (error) {
      console.error('Error while fetching project', error);
    }
  };
  CREATELIST = results => {
    this.setState({ data: [] });
    for (const object of results) {
      // Access the Parse Object attributes using the .GET method
      const boardId = object.id;
      const projectId = object.get('projectId');
      const boardName = object.get('boardName');
      const archive = object.get('archive');

      this.setState(prev => {
        prev.data = [
          ...this.state.data,
          {
            boardId: boardId,
            userId: this.props.uid,
            boardName: boardName,
            projectId: this.props.pid,
            archive: archive
          }
        ];
      });
    }
  };
  render() {
    return (
      <React.Fragment>
        <Link to="/home">
          <FeatherIcon icon="arrow-left" />
        </Link>
        <div className="header">
          <h3 className="htitle">
            Project : <span className="projectName">{this.props.project} </span>
          </h3>{' '}
          <div className="addproject">
            <div>
              <input
                type="text"
                name="newProject"
                id="newProject"
                placeholder="Add a new board"
                onChange={e =>
                  this.setState({ bname: e.target.value, error: null })
                }
              />
              <button className="primary" onClick={this.CREATEBOARD}>
                Create{' '}
              </button>
            </div>
            {this.state.error}
          </div>
        </div>
        <h5> Boards </h5>
        <div className="scrollContainer">
          <div className="boardContainer">
            {this.state.data.length > 0
              ? this.state.data.map((item, i) => {
                  if (!item.archive) {
                    return (
                      <TaskList
                        key={i}
                        board={item.boardName}
                        boardId={item.boardId}
                      />
                    );
                  }
                })
              : ''}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
