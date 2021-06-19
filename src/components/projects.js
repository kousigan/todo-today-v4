import React from 'react';
import Parse from '../parse';
import { Link, Redirect } from 'react-router-dom';

export default class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      pname: '',
      error: null,
      message: 'Looking for projects...'
    };
  }
  componentDidMount() {
    this.GETALLPROJECTS();
  }
  CREATEPROJECT = async () => {
    if (this.state.pname.length > 2) {
      const myNewObject = new Parse.Object('project');
      myNewObject.set('userId', this.props.uid);
      myNewObject.set('projectName', this.state.pname);
      myNewObject.set('archive', false);
      try {
        const result = await myNewObject.save();
        this.GETALLPROJECTS();
      } catch (error) {
        this.setState({ error: error.message });
      }
    } else {
      const temp = () => {
        return (
          <p className="response error">
            {' '}
            Project name should be more than 3 characters.
          </p>
        );
      };
      this.setState({
        error: temp()
      });
    }
  };
  GETALLPROJECTS = async () => {
    const project = Parse.Object.extend('project');
    const query = new Parse.Query(project);
    query.equalTo('userId', this.props.uid);
    try {
      const results = await query.find();
      this.CREATELIST(results);
    } catch (error) {
      console.error('Error while fetching project', error);
    }
  };
  CREATELIST = results => {
    if (results.length >= 0) {
      this.setState({
        message: 'There are no projects found. Kindly create one to proceed.'
      });
    }
    this.setState({ data: [] });
    for (const object of results) {
      // Access the Parse Object attributes using the .GET method
      const projectId = object.id;
      const userId = object.get('userId');
      const projectName = object.get('projectName');
      this.setState(prev => {
        prev.data = [
          ...this.state.data,
          { projectId: projectId, userId: userId, projectName: projectName }
        ];
      });
    }
    this.setState({ bname: '' });
  };
  render() {
    return (
      <React.Fragment>
        {' '}
        <div className="addproject">
          <h3> Add project </h3>
          <div>
            <input
              type="text"
              name="newProject"
              id="newProject"
              onChange={e =>
                this.setState({ pname: e.target.value, error: null })
              }
            />
            <button className="primary" onClick={this.CREATEPROJECT}>
              Create{' '}
            </button>
            {this.state.error}
          </div>
        </div>
        <div>
          <h4> Project List</h4>
          <ol className="projectList">
            {this.state.data.length > 0 ? (
              this.state.data.map((item, i) => {
                return (
                  <li className="projectListItem" key={i}>
                    <Link to={`/home/${item.projectName}/${item.projectId}`}>
                      {item.projectName}
                    </Link>
                  </li>
                );
              })
            ) : (
              <p className="message info">{this.state.message}</p>
            )}
          </ol>
        </div>
      </React.Fragment>
    );
  }
}
