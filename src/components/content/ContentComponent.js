import React from "react";
import { Column, Row } from "simple-flexbox";
import { StyleSheet, css } from "aphrodite/no-important";
import MiniCardComponent from "./MiniCardComponent";
import TodayTrendsComponent from "./TodayTrendsComponent";
import UnresolvedTicketsComponent from "./UnresolvedTicketsComponent";
import TasksComponent from "./TasksComponent";
import firebase from "../../Firebase";

const database = firebase.database();
const ref = database.ref("ServiceList");
const db = firebase.firestore();

const styles = StyleSheet.create({
  cardsContainer: {
    marginRight: -30,
    marginTop: -30
  },
  cardRow: {
    marginTop: 30,
    "@media (max-width: 768px)": {
      marginTop: 0
    }
  },
  miniCardContainer: {
    flexGrow: 1,
    marginRight: 30,
    "@media (max-width: 768px)": {
      marginTop: 30,
      maxWidth: "none"
    }
  },
  todayTrends: {
    marginTop: 30
  },
  lastRow: {
    marginTop: 30
  },
  unresolvedTickets: {
    marginRight: 30,
    "@media (max-width: 1024px)": {
      marginRight: 0
    }
  },
  tasks: {
    marginTop: 0,
    "@media (max-width: 1024px)": {
      marginTop: 30
    }
  }
});

var totalCountOfService;
var totalCountOfAds;
var countOfServiceProviderRequests;

class ContentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.interval = setInterval(
      () => this.setState({ time: Date.now() }),
      1000
    );
  }

  updateInput = event => {
    this.setState({ serviceName: event.target.value });
  };

  async get_ads_count() {
    var ref = database.ref("ShowAd");
    await ref.once("value", snapshot => {
      totalCountOfAds = snapshot.numChildren();
    });
  }

  async get_service_count() {
    await ref.once("value", snapshot => {
      totalCountOfService = snapshot.numChildren();
    });
  }

  async get_service_provider_requests_count() {
    await db
      .collection("Users")
      .get()
      .then(snap => {
        countOfServiceProviderRequests = snap.size;
      });

    console.log(countOfServiceProviderRequests + "count");
  }

  componentDidMount() {
    this.get_service_count();
    this.get_ads_count();
    this.get_service_provider_requests_count();
  }

  render() {
    return (
      <Column>
        <Row
          className={css(styles.cardsContainer)}
          wrap
          flexGrow={1}
          horizontal="space-between"
          breakpoints={{ 768: "column" }}
        >
          <Row
            className={css(styles.cardRow)}
            wrap
            flexGrow={1}
            horizontal="space-between"
            breakpoints={{ 384: "column" }}
          >
            <MiniCardComponent
              className={css(styles.miniCardContainer)}
              title="Services"
              value={
                totalCountOfService > 0 ? totalCountOfService : <div>---</div>
              }
            />
            <MiniCardComponent
              className={css(styles.miniCardContainer)}
              title="Ads Served"
              value={totalCountOfAds > 0 ? totalCountOfAds : <div>---</div>}
            />
          </Row>
          <Row
            className={css(styles.cardRow)}
            wrap
            flexGrow={1}
            horizontal="space-between"
            breakpoints={{ 384: "column" }}
          >
            <MiniCardComponent
              className={css(styles.miniCardContainer)}
              title="Service Provider Requests"
              value={
                countOfServiceProviderRequests > 0 ? (
                  countOfServiceProviderRequests
                ) : (
                  <div>---</div>
                )
              }
            />
            <MiniCardComponent
              className={css(styles.miniCardContainer)}
              title="Service Providers"
              value={<div>---</div>}
            />
          </Row>
        </Row>
        <div className={css(styles.todayTrends)}>
          <TodayTrendsComponent />
        </div>
        <Row
          horizontal="space-between"
          className={css(styles.lastRow)}
          breakpoints={{ 1024: "column" }}
        >
          <UnresolvedTicketsComponent
            containerStyles={styles.unresolvedTickets}
          />
          <TasksComponent containerStyles={styles.tasks} />
        </Row>
      </Column>
    );
  }
}

export default ContentComponent;
