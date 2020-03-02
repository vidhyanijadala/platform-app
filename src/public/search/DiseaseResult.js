import React from 'react';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'ot-ui';
import DiseaseIcon from '../../icons/DiseaseIcon';

const styles = theme => ({
  container: {
    marginBottom: '20px',
  },
  icon: {
    color: theme.palette.primary.main,
    verticalAlign: 'bottom',
  },
  matches: {
    marginTop: '9px',
  },
});

const DiseaseResult = ({ classes, data, highlights }) => {
  return (
    <div className={classes.container}>
      <Link to={`/disease/${data.id}`}>
        <DiseaseIcon className={classes.icon} /> {data.name}
      </Link>
      <Typography>{data.description}</Typography>
      <div className={classes.matches}>
        <Typography inline variant="subtitle2">
          Matches:
        </Typography>{' '}
        <Typography
          inline
          className="highlights"
          dangerouslySetInnerHTML={{ __html: highlights.join(', ') }}
        />
      </div>
    </div>
  );
};

export default withStyles(styles)(DiseaseResult);