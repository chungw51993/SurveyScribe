import React from 'react';
import { GridTile } from 'material-ui/GridList';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';

const SurveySingle = ({ id, title }) => (
  <Link to="{id}/edit">
    <GridTile
      key={id}
      title={title.toUpperCase()}
      actionIcon={
        <div className="actionButtons">
          <FlatButton
            label="Edit"
            containerElement={<Link to={`survey/${id}/edit`} />}
            linkButton
          />
          <FlatButton
            label="Results"
            containerElement={<Link to={`survey/${id}/results`} />}
            linkButton
          />
          <FlatButton
            label="Share"
            containerElement={<Link to={`survey/${id}/share`} />}
            linkButton
          />
        </div>
      }
      className="gridtile"
      titleBackground="rgba(0,0,255,0.3)"
    />
  </Link>
);

SurveySingle.propTypes = {
  id: React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.string
  ]).isRequired,
  title: React.PropTypes.string.isRequired
};

export default SurveySingle;
