import React from 'react';
import { RangeSlider, Label, Checkbox, IBreadcrumbProps } from '@blueprintjs/core';
import TaskList from '../components/tasks/taskList';

import TopBar from '../components/topbar';
import TitleBar from '../components/titlebar';
import dataFetch from '../utils/dataFetch';
import SEO from "../components/Seo";

const query = `
query getSubStreams($slug:String!)
{
  stream(slug:$slug)
  {
    name
    description
    streamSet
    {
      name
      slug
    }
  }
}`;

class Tasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setParams: false,
      subStreams: null,
      title: '',
      pointRange: [0, 10],
    };
  }

  componentDidMount() {
    const { search } = window.location;
    const params = new URLSearchParams(search);
    this.setState({
      stream: params.get('stream'),
      minPoints: params.get('minPoints') || 0,
      maxPoints: params.get('maxPoints') || 10,
      minDifficulty: params.get('minDifficulty') || 1,
      maxDifficulty: params.get('maxDifficulty') || 4,
      setParams: true,
    });
  }

  componentDidUpdate() {
    if (this.state.setParams && this.state.subStreams == null) {
      this.getSubStreams();
    }
  }

  getSubStreams = async () => {
    const variables = { slug: this.state.stream };
    const response = await dataFetch({ query, variables });
    if (!Object.prototype.hasOwnProperty.call(response, 'errors')) {
      this.setState({
        title: response.data.stream.name,
        description: response.data.stream.description,
        subStreams: response.data.stream.streamSet,
      });
    } else {
      console.log('error');
    }
  };

  setRange = values => {
    this.setState({
      pointRange: values,
    });
    {
      this.getSubStreams();
    }
  };

  render() {
    const breadcrumbs: IBreadcrumbProps[] = [
      { href: '/', icon: 'home', text: 'Home' },
      { href: '/tasks', icon: 'home', text: 'Tasks' },
    ];

    return (
      <React.Fragment>
        <SEO title="Tasks"/>
        <TopBar />
        <div className="page-container">
          <TitleBar
            title={`${this.state.title} Tasks`}
            description={this.state.description}
            breadcrumbs={breadcrumbs}
          />
          <div className="container">
            <div className="row">
              <div className="col-md-3 order-md-3">
                <h3>Filters</h3>
                <Label>Points Range</Label>
                <RangeSlider
                  min={0}
                  max={10}
                  onChange={this.setRange}
                  value={this.state.pointRange}
                />
                <Label>Difficulty </Label>
                <Checkbox label="Easy" />
                <Checkbox label="Medium" />
                <Checkbox label="Tough" />
                <Checkbox label="Hard" />
              </div>
              <div className="col-md-9 order-md-1">
                {this.state.setParams ? (
                  <TaskList
                    stream={this.state.stream}
                    minPoints={this.state.minPoints}
                    maxPoints={this.state.maxPoints}
                    minDifficulty={this.state.minDifficulty}
                    maxDifficulty={this.state.maxDifficulty}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Tasks;
