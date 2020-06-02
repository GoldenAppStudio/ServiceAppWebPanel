import React from "react";
import { Column, Row } from "simple-flexbox";
import { StyleSheet, css } from "aphrodite/no-important";
import MiniCardComponent from "./MiniCardComponent";
import TodayTrendsComponent from "./TodayTrendsComponent";
import firebase from "../../Firebase";

const database = firebase.database();
const ref = database.ref("service_list");
const db = firebase.firestore();

const styles = StyleSheet.create({
  cardsContainer: {
    marginRight: -30,
    marginTop: -30,
  },
  cardRow: {
    marginTop: 30,
    "@media (max-width: 768px)": {
      marginTop: 0,
    },
  },
  miniCardContainer: {
    flexGrow: 1,
    marginRight: 30,
    "@media (max-width: 768px)": {
      marginTop: 30,
      maxWidth: "none",
    },
  },
  todayTrends: {
    marginTop: 30,
  },
  lastRow: {
    marginTop: 30,
  },
  unresolvedTickets: {
    marginRight: 30,
    "@media (max-width: 1024px)": {
      marginRight: 0,
    },
  },
  tasks: {
    marginTop: 0,
    "@media (max-width: 1024px)": {
      marginTop: 30,
    },
  },
});

var totalCountOfService;
var totalCountOfAds;
var countOfServiceProviderRequests;
var totalCountOfServiceProviders;

class ContentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.interval = setInterval(
      () => this.setState({ time: Date.now() }),
      1000
    );
  }

  updateInput = (event) => {
    this.setState({ serviceName: event.target.value });
  };

  async get_ads_count() {
    var ref = database.ref("ShowAd");
    await ref.once("value", (snapshot) => {
      totalCountOfAds = snapshot.numChildren();
    });
  }

  async get_service_count() {
    await ref.once("value", (snapshot) => {
      totalCountOfService = snapshot.numChildren();
    });
  }

  async get_service_provider_requests_count() {
    await db
      .collection("Users")
      .get()
      .then((snap) => {
        countOfServiceProviderRequests = snap.size;
      });
  }

  async get_service_providers_count() {
    var ref = database.ref("service_providers");
    await ref.once("value", (snapshot) => {
      totalCountOfServiceProviders = snapshot.numChildren();
    });
  }

  componentDidMount() {
    this.get_service_count();
    this.get_ads_count();
    this.get_service_provider_requests_count();
    this.get_service_providers_count();
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
              value={
                totalCountOfServiceProviders > 0 ? (
                  totalCountOfServiceProviders
                ) : (
                  <div>---</div>
                )
              }
            />
          </Row>
        </Row>
        <div className={css(styles.todayTrends)}>
          <TodayTrendsComponent />
        </div>
        <Row
          children={""}
          horizontal="space-between"
          className={css(styles.lastRow)}
          breakpoints={{ 1024: "column" }}
        ></Row>
      </Column>
    );
  }
}

export default ContentComponent;
