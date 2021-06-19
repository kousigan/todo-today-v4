import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Project from './projects';
import Board from './board';

export default function Wrapper(data) {
  let { project, id } = useParams();
  return (
    <div className="wrapper">
      {!id ? (
        <Project uid={data.uid} />
      ) : (
        <Board uid={data.uid} project={project} pid={id} />
      )}
    </div>
  );
}
