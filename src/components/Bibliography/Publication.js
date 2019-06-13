import React, { Component, Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import { Button } from 'ot-ui';
import SimplePublication from './SimplePublication';
import Abstract from './Abstract';
import { getPublicationAbstract, getSimilarPublications } from './Api';

const styles = theme => ({
  detailPanel: {
    background: '#F6F5F5',
    marginTop: '10px',
    padding: '20px',
  },
});

/**
 * This renders a full publication block in the bibliography details.
 * Props and corresponding field in LINK response:
 *  - pmId: hits[].hits._source.pub_id
 *  - title: hits[].hits._source.title
 *  - authors: hits[].hits._source.authors
 *  - journal: {
 *      title: hits[].hits._source.journal.title,
 *      date: hits[].hits._source.pub_date,
 *      ref: hits[].hits._source.journal_reference,
 *    }
 */
class Publication extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      showAbstract: false,
      showSimilar: false,
      abstract: '',
      similar: null,
    };
  }

  // Fetches abstract data as needed and return component
  buildAbstract = () => {
    if (!this.state.abstract) {
      this.getAbstract();
      return null;
    }
    return (
      <div className={this.props.classes.detailPanel}>
        <Abstract abstract={this.state.abstract} />
      </div>
    );
  };

  // Fetches similar papers data as needed and return components
  buildSimilar = () => {
    if (!this.state.similar) {
      this.getSimilar();
      return null;
    }
    return (
      <div className={this.props.classes.detailPanel}>
        <Typography variant="subtitle2" gutterBottom>
          Similar articles
        </Typography>
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="stretch"
          spacing={16}
        >
          {this.state.similar.map((hit, i) => (
            <Grid item xs={12} key={i}>
              <SimplePublication
                variant="small"
                pmId={hit._source.pub_id}
                title={hit._source.title}
                authors={hit._source.authors || []}
                journal={{
                  title: hit._source.journal.title,
                  date: hit._source.pub_date,
                  ref: hit._source.journal_reference,
                }}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  };

  // Get the abstract data from API
  getAbstract = () => {
    getPublicationAbstract(this.props.pmId).then(
      resp => {
        this.setState({
          abstract: resp.abstract,
        });
      },
      error => {
        this.setState({
          abstract: '',
          hasError: true,
        });
      }
    );
  };

  // Get the abstract data from API
  getSimilar = () => {
    getSimilarPublications(this.props.pmId).then(
      resp => {
        this.setState({
          similar: resp.hits.hits,
        });
      },
      error => {
        this.setState({
          similar: null,
          hasError: true,
        });
      }
    );
  };

  render = () => {
    const { pmId, title, authors, journal, classes } = this.props;
    const { showAbstract, showSimilar, abstract } = this.state;

    return (
      <Fragment>
        {/* Publication basic details */}
        <SimplePublication
          pmId={pmId}
          title={title}
          authors={authors}
          journal={journal}
        />

        {/* Show more details */}
        <div>
          <div>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                this.setState({ showAbstract: !showAbstract });
              }}
            >
              {showAbstract ? '- Hide abstract' : '+ Show abstract'}
            </Button>{' '}
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                this.setState({ showSimilar: !showSimilar });
              }}
            >
              {showSimilar ? '- Hide similar' : '+ Show similar'}
            </Button>
          </div>

          {/* Abstract details */}
          {showAbstract ? this.buildAbstract() : null}

          {/* Similar papers details */}
          {showSimilar ? this.buildSimilar() : null}
        </div>
      </Fragment>
    );
  };
}

export default withStyles(styles)(Publication);